import React from "react";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";
import AIBot from "../assets/images/Ai_bot.webp";

export default function DashboardPage() {
  return (
    <div>
      <PersistentDrawerLeft>
        <div>
          <div className="justify-center items-center flex flex-col">
            <img
              src={AIBot}
              alt="AI Bot"
              className="w-1/2 h-auto rounded-lg "
            />
          </div>
          <div className="flex justify-center items-center mt-4 flex-col">
            <h1 className="text-2xl font-bold">
              "Practice Interviews. Get AI Feedback. Improve Instantly."
            </h1>

            <p className="text-gray-600 mt-2">
              "An AI-powered mock interview platform that gives you smart,
              personalized feedback on your responses."
            </p>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300">
              Start Mock Interview
            </button>
          </div>
        </div>
      </PersistentDrawerLeft>
    </div>
  );
}
