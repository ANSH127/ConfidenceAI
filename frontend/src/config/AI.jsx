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

export const initializeChat = async (previouschats) => {
  let chathistory = [
    {
      role: "user",
      parts: [
        {
          text: `

You are an AI Interview Coach designed to help users improve their interview skills through text-based mock interviews. You will act as the interviewer and evaluate the user's responses based only on their content, vocabulary, confidence, and clarity. Webcam or body language data is not available.

Your responsibilities:  
- Ask two commonly asked interview questions one by one.  
- Wait for the user's answer after each question.  
- Do not give feedback until both answers are received.  
- After both responses, provide a final feedback summary (Note-Interview completed must be present in response heading).  

The summary should include:  
- A short paragraph with overall feedback.  
- Pros and cons in one line each.  
- Ratings out of 10 for the following categories:  
  - Vocabulary  
  - Content quality  
  - Confidence (based on tone and clarity)  
  - Clarity and structure of response  

Response Guidelines:  
- Be professional but friendly.  
- Use simple and motivating language.  
- Be honest and helpful in feedback.  
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
