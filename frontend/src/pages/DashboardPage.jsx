import React from "react";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import AIBot from "../assets/images/Ai_bot.webp";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div>
      <PersistentDrawerLeft>
        <div className="flex flex-col items-center justify-center h-screen ">
          {/* Animated Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="justify-center items-center flex flex-col"
          >
            <img
              src={AIBot}
              alt="AI Bot"
              className="w-1/2 h-auto rounded-lg  hover: transition-shadow duration-500"
            />
          </motion.div>

          {/* Animated Heading */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center items-center mt-4 flex-col"
          >
            <h1 className="text-4xl font-extrabold text-center text-blue-800">
              "Practice Interviews. Get AI Feedback. Improve Instantly."
            </h1>
          </motion.div>

          {/* Animated Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-gray-700 mt-4 text-center text-lg px-4"
          >
            "An AI-powered mock interview platform that gives you smart,
            personalized feedback on your responses."
          </motion.p>

          {/* Animated Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.8)",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-6 bg-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
          >
            Start Mock Interview
          </motion.button>

          {/* Additional Animated Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Ready to take your interview skills to the next level? Let’s get
              started!
            </p>
          </motion.div>
        </div>
      </PersistentDrawerLeft>
    </div>
  );
}