const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateSummary(conversation) {

    const prompt = `
You are a CRM assistant.

Below is a conversation between a real estate sales executive and a customer.

Extract these details.

Return ONLY valid JSON.

{
"name":"",
"phone":"",
"email":"",
"location":"",
"budget":"",
"propertyType":"",
"purpose":"",
"timeline":"",
"interestLevel":"",
"summary":""
}

Conversation:

${conversation
    .map(msg => `${msg.role}: ${msg.text}`)
    .join("\n")}
`;

    const response = await ai.models.generateContent({

        model: "gemini-3.5-flash",

        contents: prompt,

        config: {
            temperature: 0
        }

    });

    let text = response.text.trim();

    // Remove markdown if Gemini wraps JSON in ```json
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

}

module.exports = {
    generateSummary
};