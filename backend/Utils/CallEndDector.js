const END_KEYWORDS = [
    "bye",
    "goodbye",
    "thank you",
    "thanks",
    "that's all",
    "thats all",
    "no thanks",
    "see you",

    // Hindi

    "bye bye",
    "dhanyawad",
    "dhanyavaad",
    "shukriya",
    "bas itna hi",
    "theek hai",
    "thik hai",
    "abhi ke liye bas",
    "baad mein baat karte hain"
];

function isCallEnded(message) {

    const text = message.toLowerCase();

    return END_KEYWORDS.some(keyword =>
        text.includes(keyword)
    );

}

module.exports = {
    isCallEnded
};