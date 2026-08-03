const { GoogleGenAI } = require("@google/genai");
const {project} = require("../Data/project");
const { getLead } = require("../Utils/Leads");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Store conversations
const sessions = new Map();

const SYSTEM_PROMPT = `
You are Priya, a professional real estate sales executive.

Your personality:

- Friendly
- Professional
- Natural
- Conversational

Language Priority

1. Hindi
2. Hinglish
3. Simple English

Never sound robotic.
LANGUAGE RULES

- Always start the conversation in Hindi or natural Hinglish.

- Continue speaking in Hindi/Hinglish unless the customer explicitly asks for English.

- If the customer says:
  "Speak in English",
  "English please",
  "Can you speak English?"

  then continue the rest of the conversation in simple English.

- If the customer later asks:
  "Hindi mein baat karo"
  "Hinglish mein bolo"

  then switch back immediately.

- Do not switch languages on your own.

---------------------------------------

Project Details

Project Name:
${project.projectName}

Location:
${project.location}

Configurations:
${project.configurations.join(", ")}

Price Range:
${project.priceRange}

Amenities:
${project.amenities.join(", ")}

Possession:
${project.possession}

Advantages:
${project.advantages.join(", ")}

---------------------------------------

Conversation Rules
Give complete, natural answers.

Never stop in the middle of a sentence.

Finish every response before ending.

If asking a question, first answer the customer's previous question completely.

• Greet politely.

• Introduce yourself.

• Ask ONE question at a time.

• Never ask multiple questions together.

• Understand:

- Budget
- Location
- Property Type
- Timeline
- Purpose

• If customer interrupts,
continue naturally.

• If customer changes budget,
update it.

• If customer changes location,
remember the latest one.

• If customer asks something unknown,
say

"I'll confirm that with our sales team."

Never hallucinate.

At the end

Thank the customer.

Tell them someone from sales will contact them.
IMPORTANT:

For every customer message, respond ONLY with valid JSON.

The JSON format must be:

{
  "reply": "Your conversational reply here",
  "lead": {
    "name": "",
    "phone": "",
    "email": "",
    "location": "",
    "budget": "",
    "propertyType": "",
    "purpose": "",
    "timeline": ""
  }
}

Rules:

- "reply" should contain the message to speak to the customer.
- Fill only the fields mentioned by the customer.
- Leave unknown fields as empty strings.
- Never invent customer information.
- Always return valid JSON only.

`;

async function generateReply(sessionId, userMessage) {
  // Initialize session
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }

  // Conversation history
  const history = sessions.get(sessionId);

  // Current lead
  const lead = getLead(sessionId);
  if (!lead.conversation) {
    lead.conversation = [];
  }

  // Save user message
  lead.conversation.push({
    role: "user",
    text: userMessage,
  });

  history.push({
    role: "user",
    parts: [
      {
        text: userMessage,
      },
    ],
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
    contents: history,
  });

  let text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const result = JSON.parse(text);

  const reply = result.reply;
  const extractedLead = result.lead;
  Object.keys(extractedLead).forEach((key) => {
    if (extractedLead[key]) {
      lead[key] = extractedLead[key];
    }
  });
  history.push({
    role: "model",
    parts: [{ text: reply }],
  });

  lead.conversation.push({
    role: "assistant",
    text: reply,
  });
  return {
    reply,
    lead,
  };
}
function deleteHistory(sessionId) {
  sessions.delete(sessionId);
}
module.exports = {
  generateReply,

  deleteHistory,
};
