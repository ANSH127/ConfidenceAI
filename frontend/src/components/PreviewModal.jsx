import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "55%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function PreviewModal({ open, handleClose }) {
  const [domain, setDomain] = useState("Software Development");
  const [experience, setExperience] = useState("Beginner");
  const [questionStyle, setQuestionStyle] = useState("Behavioral");
  const navigate = useNavigate();

  const handleSubmit = async() => {
    // console.log(domain, experience, questionStyle);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/create",
        {
          selected_domain: domain,
          selected_experience: experience,
          selected_questionStyle: questionStyle,
        },
        { withCredentials: true }
      );
      // console.log(response.data);
      // Handle successful response here, e.g., navigate to the chat page
      navigate(`/c/${response.data.chatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col gap-6">
            {/* Modal Title */}
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Interview Setup
            </h2>

            {/* Domain Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="Domain"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Domain
              </label>
              <select
                id="Domain"
                name="Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Software Development">Software Development</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="DevOps">DevOps</option>
                <option value="Cloud">Cloud</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Game Development">Game Development</option>
              </select>
            </div>

            {/* Experience Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="Experience"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Experience
              </label>
              <select
                id="Experience"
                name="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                
              </select>
            </div>

            {/* Question Style Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="Question"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Question Style
              </label>
              <select
                id="Question"
                name="Question"
                value={questionStyle}
                onChange={(e) => setQuestionStyle(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Behavioral">Behavioral</option>
                <option value="Technical">Technical</option>
                <option value="Mixed">Mixed</option>
                <option value="Code Test">Code Test</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              className="bg-blue-500 text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition duration-300"
              onClick={handleSubmit}
            >
              Start Interview
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}