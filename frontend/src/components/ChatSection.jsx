import React, { useEffect } from "react";
import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useParams } from "react-router-dom";
import axios from "axios";
import { initializeChat, fetchModelResponse } from "../config/AI";

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleMicClick = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        await addMessage(transcript, "user");
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", message: transcript },
        ]);

        const modelresponse = await fetchModelResponse(transcript);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "model", message: modelresponse },
        ]);
        await handleSpeak(modelresponse);
        await addMessage(modelresponse, "model");
      }
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const { id } = useParams();
  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/chat/${id}`, {
        withCredentials: true,
      });
      const chatData = response.data;
      await initializeChat(chatData.messages);
      setMessages(chatData.messages);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
    }
  };
  const addMessage = async (message, role) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/chat/${id}/message`,
        {
          message: {
            role,
            message: message,
          },
        },
        { withCredentials: true }
      );
      const updatedChat = response.data;
      // console.log("Updated chat data:", updatedChat);

      // setMessages(updatedChat.messages);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
  const handleSpeak = async (message) => {
    // console.log(message);

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
    fetchChat();
    
  }, [id]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
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
        )}
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
