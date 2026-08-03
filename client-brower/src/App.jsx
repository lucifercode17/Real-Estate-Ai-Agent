import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import API from "./services/api";

import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste 👋 Main Priya bol rahi hoon.\nSkyline Residency mein aapka swagat hai.\nMain aaj aapki property search mein kaise madad kar sakti hoon?"
    }
  ]);
  const [lead, setLead] = useState({
    name: "",
    budget: "",
    location: "",
    propertyType: "",
    purpose: "",
    timeline: ""
  });
  const fetchLead = async () => {
    try {
      const res = await API.get(`/api/lead/${sessionId}`);

      setLead(res.data.lead);

    } catch (err) {
      console.log(err);
    }
  };

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(uuid());
  const chatEndRef = useRef(null);


  const sendMessage = async (voiceMessage = null) => {

    const userMessage =
      typeof voiceMessage === "string"
        ? voiceMessage
        : input;

    if (!userMessage.trim())
      return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await API.post("api/ai", {
        sessionId,
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.reply,
        },
      ]);
      speakText(res.data.reply);
      setLead((prev) => ({
        ...prev,
        ...res.data.lead
      }));
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, server is unavailable.",
        },
      ]);
    }

    setLoading(false);
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = useRef(null);

  useEffect(() => {

    if (!SpeechRecognition) return;

    recognition.current = new SpeechRecognition();

    recognition.current.continuous = false;

    recognition.current.interimResults = false;

    recognition.current.lang = "hi-IN";

    recognition.current.onresult = (event) => {

      const transcript = event.results[0][0].transcript;

      sendMessage(transcript);

    };

  }, []);
  const startListening = () => {
    window.speechSynthesis.cancel();

    if (recognition.current) {
      recognition.current.start();
    }
  };
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    const hindiVoice = voices.find(
      (voice) => voice.lang === "hi-IN"
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;


    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);
  useEffect(() => {
    speakText(
      "Namaste. Main Priya bol rahi hoon. Skyline Residency mein aapka swagat hai. Main aaj aapki property search mein kaise madad kar sakti hoon?"
    );
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-6">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT SIDE */}

        <div className="flex-1 flex flex-col">

          {/* Navbar */}

          <div className="bg-blue-600 text-white p-5">

            <h1 className="text-2xl font-bold">
              Skyline Residency AI Calling Agent
            </h1>

            <p className="text-blue-100">
              AI Real Estate Assistant
            </p>

          </div>

          {/* Chat */}

          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">

            {messages.map((msg, index) =>

              msg.sender === "ai" ? (

                <div
                  key={index}
                  className="flex gap-3"
                >

                  <BsRobot
                    size={36}
                    className="text-blue-600 mt-1"
                  />

                  <div className="bg-white shadow rounded-2xl p-4 max-w-lg whitespace-pre-line">

                    {msg.text}

                  </div>

                </div>

              ) : (

                <div
                  key={index}
                  className="flex justify-end"
                >

                  <div className="bg-blue-600 text-white rounded-2xl p-4 max-w-lg">

                    {msg.text}

                  </div>

                </div>

              )

            )}

            {loading && (

              <div className="flex gap-3">

                <BsRobot
                  size={36}
                  className="text-blue-600"
                />

                <div className="bg-white shadow rounded-2xl p-4">

                  Priya is typing...

                </div>

              </div>

            )}
            <div ref={chatEndRef}></div>

          </div>

          {/* Input */}

          <div className="border-t bg-white p-5 flex gap-3">

            <button
              onClick={startListening}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
            >
              <FaMicrophone />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  sendMessage();

                }

              }}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-5 outline-none"
            />

            <button
              onClick={() => sendMessage()}
              className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-full p-4"
            >

              <FaPaperPlane />

            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-80 bg-slate-900 text-white p-6">

          <h2 className="text-2xl font-bold">

            Current Lead

          </h2>

          <div className="mt-8 space-y-6">

            <LeadField
              title="Customer"
              value={lead.name || "Waiting..."}
            />

            <LeadField
              title="Budget"
              value={lead.budget || "Waiting..."}
            />

            <LeadField
              title="Location"
              value={lead.location || "Waiting..."}
            />

            <LeadField
              title="Property"
              value={lead.propertyType || "Waiting..."}
            />

            <LeadField
              title="Purpose"
              value={lead.purpose || "Waiting..."}
            />

            <LeadField
              title="Timeline"
              value={lead.timeline || "Waiting..."}
            />

          </div>

        </div>

      </div>
    </div>
  );
}

function LeadField({ title, value }) {
  return (
    <div>

      <p className="text-gray-400 text-sm">

        {title}

      </p>

      <h3 className="font-semibold text-lg">

        {value}

      </h3>

    </div>
  );
}


export default App;