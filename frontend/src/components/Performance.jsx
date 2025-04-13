import React from "react";
import CircularProgressBar from "./CircularProgressBar";
import { motion } from "framer-motion";

export default function Performance() {
  let scores = {
    vocabulary: 5,
    content: 7,
    confidence: 7,
    clarity: 6,
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated Heading */}
      <motion.h2
        className="text-4xl text-center font-extrabold text-gradient mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Your Performance Breakdown
      </motion.h2>
      <motion.h3
        className="text-center text-lg font-semibold mb-6 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        See how you performed in key areas
      </motion.h3>

      {/* Animated Circular Progress Bars */}
      <div className="flex flex-row gap-16 w-full justify-center">
        {/* Vocabulary Score */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CircularProgressBar
            percentage={scores.vocabulary * 10}
            label="Vocabulary"
            color="linear-gradient(90deg, #ff7eb3, #ff758c)"
          />
        </motion.div>

        {/* Content Score */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CircularProgressBar
            percentage={scores.content * 10}
            label="Content"
            color="linear-gradient(90deg, #42e695, #3bb2b8)"
          />
        </motion.div>

        {/* Confidence Score */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <CircularProgressBar
            percentage={scores.confidence * 10}
            label="Confidence"
            color="linear-gradient(90deg, #f093fb, #f5576c)"
          />
        </motion.div>

        {/* Clarity Score */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <CircularProgressBar
            percentage={scores.clarity * 10}
            label="Clarity"
            color="linear-gradient(90deg, #5ee7df, #b490ca)"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}