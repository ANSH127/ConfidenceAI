import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import Webcam from "react-webcam";

export default function DashboardPage() {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { text: "Hello!", sender: "bot" },
    { text: "How are you?", sender: "bot" },
    { text: "I'm fine, thank you!", sender: "user" },
  ]);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        setMessages([...messages, { text: transcript, sender: "user" }]);
      }
      resetTranscript();
      clearTimeout(timeoutId);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      startInactivityTimer();
    }
  };

  const startInactivityTimer = () => {
    clearTimeout(timeoutId); // Clear any existing timer
    const id = setTimeout(() => {
      if (listening) {
        SpeechRecognition.stopListening();
        if (transcript.trim()) {
          setMessages([...messages, { text: transcript, sender: "user" }]);
        }
        resetTranscript();
      }
    }, 5000); // 5 seconds of inactivity
    setTimeoutId(id);
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
                message.sender === "bot"
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