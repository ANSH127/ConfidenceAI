import React, { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useParams } from "react-router-dom";
import axios from "axios";
import { initializeChat, fetchModelResponse } from "../config/AI";
import Loadar from "./Loadar";
import { motion } from "framer-motion";

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [iscompleted, setIsCompleted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedQuestionStyle, setSelectedQuestionStyle] = useState("");

  // Ref for the chat container
  const chatContainerRef = useRef(null);

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

        if (modelresponse.includes("Interview Completed")) {
          setIsCompleted(true);
        }

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

      const obj = {
        selected_domain: chatData?.selected_domain,
        selected_experience: chatData?.selected_experience,
        selected_questionStyle: chatData?.selected_questionStyle,
      };

      await initializeChat(chatData.messages, obj);
      setMessages(chatData.messages);
      setIsCompleted(chatData.isCompleted);
      setSelectedDomain(chatData.selected_domain);
      setSelectedExperience(chatData.selected_experience);
      setSelectedQuestionStyle(chatData.selected_questionStyle);
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
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const handleSpeak = async (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.voice = speechSynthesis.getVoices()[191];
    await window.speechSynthesis.speak(speech);
  };

  // Scroll to the bottom of the chat container with smooth animation
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  useEffect(() => {
    fetchChat();
  }, [id]);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages are updated
  }, [messages]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loadar />
          </div>
        ) : (
          <>
            <div className="flex bg-red-300 p-4 rounded-md mb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-sm text-black font-semibold"
              >
                Domain: {selectedDomain} | Experience: {selectedExperience} |
                Question Style: {selectedQuestionStyle}
              </motion.div>
            </div>

            <div
              ref={chatContainerRef} // Attach the ref to the chat container
              className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-2 rounded-lg max-w-xs ${
                    message.role === "user"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  <pre
                    className="whitespace-pre-wrap break-words "
                   
                  >{message.message}</pre>
                </div>
              ))}
            </div>
          </>
        )}
        {iscompleted ? (
          <div className="flex justify-center items-center bg-green-500 text-white p-2 rounded-md">
            Interview Completed
          </div>
        ) : (
          <div className="flex flex-col pb-2 items-center bg-gray-100 rounded-md">
            <div className="mb-2 p-2 w-full text-center">{transcript}</div>
            <button
              type="button"
              className={`p-3 rounded-full ${
                listening ? "bg-red-500" : "bg-gray-500"
              }`}
              onClick={handleMicClick}
            >
              <MicIcon className="text-white" />
            </button>
            <div className="text-gray-500 text-xs mt-2">
              {listening ? "Listening..." : "Click to Speak"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
