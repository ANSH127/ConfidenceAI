import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import Webcam from "react-webcam";
import { GoogleGenAI } from "@google/genai";

const key=import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: key,
});
let chat;



export default function DashboardPage() {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hey, I am your AI Interview Coach, here to help you practice and improve your interview skills. I will analyze your responses, facial expressions, and body language to give you real-time feedback.Type 'Start' to begin your mock interview!",
    },
  ]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMicClick = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        setMessages([...messages, { text: transcript, role: "user" }]);
      }
      resetTranscript();
      clearTimeout(timeoutId);

      const modelresponse = await fetch(transcript);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: modelresponse, role: "model" },
      ]);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      startInactivityTimer();
    }
  };

  const startInactivityTimer = () => {
    clearTimeout(timeoutId); // Clear any existing timer
    const id = setTimeout(async () => {
      if (listening) {
        SpeechRecognition.stopListening();
        if (transcript.trim()) {
          setMessages([...messages, { text: transcript, role: "user" }]);
        }
        resetTranscript();
        const modelresponse = await fetch(transcript);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: modelresponse, role: "model" },
        ]);
        
      }
    }, 3000); // 3 seconds of inactivity
    setTimeoutId(id);
  };

  const fetch = async (message) => {
    let result = await chat.sendMessage({
      message: message,
    });
    handleSpeak(result.text);

    return result.text;
  };

  const handleSpeak = async(message) => {
    console.log(message);
    
    const speech = new SpeechSynthesisUtterance(message);
    console.log(speech);
    
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.voice = speechSynthesis.getVoices()[191];
    

     await window.speechSynthesis.speak(speech);
  };


  useEffect(() => {
    if (listening) {
      startInactivityTimer();
    }
    // Cleanup timeout when component unmounts or listening stops
    return () => clearTimeout(timeoutId);
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    setError(
      "Your browser does not support speech recognition. Please use Google Chrome or Microsoft Edge."
    );
    return null;
  }

  useEffect(() => {
    const initializeChat = async () => {
      chat = ai.chats.create({
        model: "gemini-1.5-flash",
        history: [
          {
            role: "user",
            parts: [
              {
                text: "YYou are an AI Interview Coach that helps users improve their interview skills by analyzing their speech, facial expressions, eye contact, and body language. Your goal is to provide real-time constructive feedback and suggest improvements in a friendly and professional manner.Your Key Responsibilities:  - Evaluate speech clarity and tone by identifying confidence, hesitation, or unclear responses.  - Analyze facial expressions to detect emotions such as happy, neutral, or nervous.  - Monitor eye contact to determine if the user maintains focus or looks away frequently.  - Track head movements and posture to identify nervous gestures or distractions.  - Provide personalized feedback with actionable suggestions for improvement.  Response Guidelines:  - Be supportive and constructive while avoiding negative criticism.  - Use clear and actionable tips. Example: Try to smile more to appear confident.  - Keep feedback concise but detailed without unnecessary explanations.  - Adapt feedback based on real-time data. If a user looks away too often, suggest maintaining eye contact to convey confidence.  Example Interaction:  User: Tell me about yourself.  AI: Great start. Your introduction is clear, but try to slow down slightly for better clarity. Also, smiling occasionally will make you appear more approachable.  Your task is to guide the user through a structured and interactive interview session, analyzing their non-verbal cues and responses to enhance their communication skills.. NOTE-ANSWER FEEFBACK IN 4 LINES",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: "Hey, I am your AI Interview Coach, here to help you practice and improve your interview skills. I will analyze your responses, facial expressions, and body language to give you real-time feedback.Type 'Start' to begin your mock interview!",
              },
            ],
          },
        ],
      });
    };
    initializeChat();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white">
        <ul className="p-4">
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Profile
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Settings
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 bg-gray-100 flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-xs ${
                message.role === "model"
                  ? "bg-gray-200 text-gray-800 self-start"
                  : "bg-blue-500 text-white self-end"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center p-4 bg-white">
          {/* Show the transcript above the mic */}
          <div className="mb-4 p-2 bg-gray-200 w-full text-center rounded">
            {transcript}
          </div>
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-4 rounded-full ${
              listening ? "bg-red-500" : "bg-gray-500"
            }`}
          >
            <MicIcon className="text-white" />
          </button>
        </div>
      </div>
      <div className="w-64 bg-gray-200 text-white">
        {error && <div className="p-4 bg-red-500 text-white">{error}</div>}
        <Webcam
          onUserMediaError={() =>
            setError(
              "Camera access denied! Please allow access to the camera to use this feature."
            )
          }
        />
      </div>
    </div>
  );
}
