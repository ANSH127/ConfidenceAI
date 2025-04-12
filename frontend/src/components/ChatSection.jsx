import React, { useEffect } from "react";
import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleMicClick = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        setMessages([...messages, { text: transcript, role: "user" }]);
      }
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const { id } = useParams();
  const fetchChat = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/${id}`, {
        withCredentials: true,
      });
      const chatData = response.data;
      setMessages(chatData.messages);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };
  useEffect(() => {
    fetchChat();
  }, [id]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        <h1>{id}</h1>
        <div className="flex-1 overflow-y-auto p-4 flex  flex-col space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-2 rounded-lg max-w-xs ${
                message.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {message.message}
            </div>
          ))}
        </div>
        <div className=" flex flex-col pb-2 items-center bg-gray-100 rounded-md">
          <div className="mb-2 p-2  w-full text-center">{transcript}</div>
          <button
            type="button"
            className={`p-3 rounded-full ${
              listening ? "bg-red-500" : "bg-gray-500"
            }`}
            onClick={handleMicClick}
          >
            <MicIcon className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
