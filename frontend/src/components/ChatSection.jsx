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
import { useNavigate } from "react-router-dom";
import Webcam from "./WebCam";
import CodeEditor from "./CodeEditor";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';



export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [iscompleted, setIsCompleted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedQuestionStyle, setSelectedQuestionStyle] = useState("");
  const [scores, setScores] = useState({
    vocabulary: 0,
    content: 0,
    confidence: 0,
    clarity: 0,
  });
  const [showeditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  

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

        if (modelresponse.includes("Interview Completed") || modelresponse.includes("Interview completed")) {
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

      if (chatData.isCompleted) {
        setScores({
          vocabulary: chatData.score.vocubulary,
          content: chatData.score.content,
          confidence: chatData.score.confidence,
          clarity: chatData.score.clarity,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired, please login again");
        navigate("/login");
        return;
      }

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

 const handleSubmitCode = async () => {
  if (editorRef.current) {
    let code = editorRef.current.getValue();
    setShowEditor(false); // Hide the editor after submission
    await addMessage(code, "user");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", message: code },
    ]);
    const modelresponse = await fetchModelResponse(code);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "model", message: modelresponse },
    ]);
    await handleSpeak(modelresponse);
    await addMessage(modelresponse, "model");
    if (modelresponse.includes("Interview Completed") || modelresponse.includes("Interview completed")) {
      setIsCompleted(true);
    }
    scrollToBottom(); // Scroll to the bottom after sending the code

    
  } else {
    alert("Editor is not ready yet!");
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
      <div className=" h-screen grid grid-cols-12">
        {loading ? (
          <div className="flex justify-center items-center h-full col-span-12">
            <Loadar />
          </div>
        ) : (
          <>
            <div
              className={`
            ${iscompleted ? "col-span-12" : "col-span-9"}
               overflow-y-auto`}
            >
              {showeditor ? (
                <>
                <FormControlLabel control={<Switch  defaultChecked={showeditor}
                onChange={() => setShowEditor(!showeditor)}
                 />} label="Code Editor" />
                <CodeEditor editorRef={editorRef} />
                <button 
                className="bg-blue-500 text-white p-2 rounded-md mt-4"
                onClick={handleSubmitCode}
                >
                  Submit Code
                </button>

                </>
              ) : (
                <div>
                <FormControlLabel control={<Switch   defaultChecked={showeditor}
                onChange={() => setShowEditor(!showeditor)}
                />} label="Code Editor" />

                  <div className="flex bg-red-300 p-4 rounded-md mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-sm text-black font-semibold"
                    >
                      Domain: {selectedDomain} | Experience:{" "}
                      {selectedExperience} | Question Style:{" "}
                      {selectedQuestionStyle}
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
                        <pre className="whitespace-pre-wrap break-words ">
                          {message.message}
                        </pre>
                      </div>
                    ))}
                  </div>
                  {iscompleted ? (
                    <div className="flex flex-col items-center bg-green-400 text-white p-4 rounded-md">
                      <h2 className="text-lg font-bold">Interview Completed</h2>
                      <div className="bg-white text-black p-4 rounded-md mt-4 w-full max-w-md shadow-md">
                        <h3 className="text-center text-lg font-semibold mb-4">
                          Your Scores
                        </h3>
                        <div className="flex flex-row gap-4 justify-between">
                          {/* Vocabulary Score */}
                          <div className="flex flex-col items-center w-1/4">
                            <p className="text-sm font-semibold mb-2">
                              Vocabulary
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${scores.vocabulary * 10}%` }}
                              ></div>
                            </div>
                            <p className="text-center text-xs mt-1">
                              {scores.vocabulary * 10}%
                            </p>
                          </div>

                          {/* Content Score */}
                          <div className="flex flex-col items-center w-1/4">
                            <p className="text-sm font-semibold mb-2">
                              Content
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${scores.content * 10}%` }}
                              ></div>
                            </div>
                            <p className="text-center text-xs mt-1">
                              {scores.content * 10}%
                            </p>
                          </div>

                          {/* Confidence Score */}
                          <div className="flex flex-col items-center w-1/4">
                            <p className="text-sm font-semibold mb-2">
                              Confidence
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${scores.confidence * 10}%` }}
                              ></div>
                            </div>
                            <p className="text-center text-xs mt-1">
                              {scores.confidence * 10}%
                            </p>
                          </div>

                          {/* Clarity Score */}
                          <div className="flex flex-col items-center w-1/4">
                            <p className="text-sm font-semibold mb-2">
                              Clarity
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${scores.clarity * 10}%` }}
                              ></div>
                            </div>
                            <p className="text-center text-xs mt-1">
                              {scores.clarity * 10}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col pb-2 items-center bg-gray-100 rounded-md">
                      <div className="mb-2 p-2 w-full text-center">
                        {transcript}
                      </div>
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
              )}
            </div>
            {!iscompleted && (
              <div className="col-span-3 p-4">
                <Webcam />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
