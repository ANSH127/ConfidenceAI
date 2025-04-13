import React from "react";
import { motion } from "framer-motion";

const CircularProgressBar = ({ percentage, label }) => {
  const circleRadius = 50; // Radius of the circle
  const circleCircumference = 2 * Math.PI * circleRadius; // Circumference of the circle

  return (
    <div className="flex flex-col items-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r={circleRadius}
          fill="transparent"
          stroke="#e5e7eb" // Light gray background
          strokeWidth="10"
        />
        {/* Animated Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r={circleRadius}
          fill="transparent"
          stroke="#3b82f6" // Blue color for progress
          strokeWidth="10"
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference}
          animate={{
            strokeDashoffset:
              circleCircumference - (percentage / 100) * circleCircumference,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Percentage and Label */}
      <p className="text-lg font-bold mt-2">{percentage}%</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

export default CircularProgressBar;