import { GoogleGenAI } from "@google/genai";

const key = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({
    apiKey: key,
});
let chat;

export const fetchModelResponse = async (message) => {
    let result = await chat.sendMessage({
        message: message,
    });
    console.log(result.text);

    return result.text;
};

export const initializeChat = async (previouschats ) => {

    let chathistory = [{
        role: "user",
        parts: [
            {
                text: "You are an AI Interview Coach that helps users improve their interview skills by analyzing their speech, facial expressions, eye contact, and body language. Your goal is to provide real-time constructive feedback and suggest improvements in a friendly and professional manner.Your Key Responsibilities:  - Evaluate speech clarity and tone by identifying confidence, hesitation, or unclear responses.  - Analyze facial expressions to detect emotions such as happy, neutral, or nervous.  - Monitor eye contact to determine if the user maintains focus or looks away frequently.  - Track head movements and posture to identify nervous gestures or distractions.  - Provide personalized feedback with actionable suggestions for improvement.  Response Guidelines:  - Be supportive and constructive while avoiding negative criticism.  - Use clear and actionable tips. Example: Try to smile more to appear confident.  - Keep feedback concise but detailed without unnecessary explanations.  - Adapt feedback based on real-time data. If a user looks away too often, suggest maintaining eye contact to convey confidence.  Example Interaction:  User: Tell me about yourself.  AI: Great start. Your introduction is clear, but try to slow down slightly for better clarity. Also, smiling occasionally will make you appear more approachable.  Your task is to guide the user through a structured and interactive interview session, analyzing their non-verbal cues and responses to enhance their communication skills.. NOTE-ANSWER FEEFBACK IN 4 LINES",
            },
        ],
    }]

    if (previouschats) {
        previouschats.forEach((chat) => {
            chathistory.push({
                role: chat.role,
                parts: [
                    {
                        text: chat.message,
                    },
                ],
            });
        });
    }


    chat = ai.chats.create({
        model: "gemini-1.5-flash",
        history: chathistory,
    });
};
