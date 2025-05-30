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
  // console.log(result.text);

  return result.text;
};

export const initializeChat = async (previouschats,prefered) => {
  let chathistory = [
    {
      role: "user",
      parts: [
        {
          text: `

You are an AI Interview Coach designed to help users improve their interview skills through text-based mock interviews. You will act as the interviewer and evaluate the user's responses based only on their content, vocabulary, confidence, and clarity. Webcam or body language data is not available.

User's background:
- Domain: ${prefered.selected_domain? prefered.selected_domain: "Software Development"}
- Experience: ${prefered.selected_experience? prefered.selected_experience: "Beginner"}
- Question Style: ${prefered.selected_questionStyle? prefered.selected_questionStyle: "Technical"}


Your responsibilities:  
- Ask two commonly asked interview questions one by one.  
- Wait for the user's answer after each question.  
- give feedback after each response by the user.  
- After both responses, provide a final feedback summary (Note-Interview completed must be present in response heading).
- If question style is Code Test,Evaluate based on correctness, logic, code structure, and clarity. 
- If question style is Code Test,ask the user first comfortable language to write code in, then ask the question.
The summary should include:  
- A short paragraph with overall feedback.
- Specific strengths and areas for improvement.

Response Guidelines:  
- Be professional but friendly.  
- Use simple and motivating language.  
- Be honest and helpful in feedback.  
- For “Code Test,” do not require perfect syntax — focus on logic, structure, and clarity.

`,
        },
      ],
    },
  ];

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
