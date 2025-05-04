import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";


export default function Webcam() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [boxColor, setBoxColor] = useState("red"); // Box color state
  const [isCheating, setIsCheating] = useState(false); // Cheating state
  const [isFaceDetected, setIsFaceDetected] = useState(false); // Face detection state
  

  // Initialize the webcam and canvas
  const setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }

    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        width: 350,
        height: 300,
        frameRate: { ideal: 30 },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });

      videoRef.current.play();

      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      // Set video and canvas dimensions
      videoRef.current.width = videoWidth;
      videoRef.current.height = videoHeight;

      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const ctx = canvasRef.current.getContext("2d");
        // Flip the canvas horizontally to mirror the video feed
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
      }
    }
  };

  // Load the face landmarks detection model
  useEffect(() => {
    const loadModel = async () => {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: "tfjs",
        maxFaces: 1,
      };
      const loadedDetector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );
      setDetector(loadedDetector);
    };

    tf.ready().then(loadModel);
  }, []);

  // Start the webcam
  useEffect(() => {
    setupCamera().catch((error) => {
      console.error("Error setting up camera:", error);
    });
  }, []);

  // Detect face landmarks and draw bounding box
  useEffect(() => {
    const detectFaces = async () => {
      if (!detector || !videoRef.current || videoRef.current.readyState !== 4) {
        return;
      }

      const predictions = await detector.estimateFaces(videoRef.current);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the video feed
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );

      // If no face is detected, for a 5 second interval,marks as cheating
      if (predictions.length === 0) {
        setIsCheating((prev) => {
          if (prev) {
            return true;
          } else {
            setTimeout(() => {
              setIsCheating(false);
            }, 5000);
            return true;
          }
        });

        return;
      }

      setIsFaceDetected(true);

      // Draw bounding box
      predictions.forEach((prediction) => {
        const keypoints = prediction.keypoints;

        // Calculate bounding box from keypoints
        const xValues = keypoints.map((point) => point.x);
        const yValues = keypoints.map((point) => point.y);
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);

        const width = xMax - xMin;
        const height = yMax - yMin;

        // Check if the face is centered
        const videoCenterX = videoRef.current.videoWidth / 2;
        const videoCenterY = videoRef.current.videoHeight / 2;
        const faceCenterX = xMin + width / 2;
        const faceCenterY = yMin + height / 2;

        const distanceX = Math.abs(videoCenterX - faceCenterX);
        const distanceY = Math.abs(videoCenterY - faceCenterY);

        // If the face is within a certain threshold of the center, show green box
        if (distanceX < 50 && distanceY < 50) {
          setBoxColor("green");
        } else {

          // If the face is not centered, mark as cheating
          setIsCheating((prev) => {
            if (prev) {
              return true;
            } else {
              setTimeout(() => {
                setIsCheating(false);
              }, 5000);
              return true;
            }
          });


          setBoxColor("red");
        }

        // Draw the bounding box
        ctx.beginPath();
        ctx.rect(xMin, yMin, width, height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = boxColor;
        ctx.stroke();
      });
    };

    const interval = setInterval(detectFaces, 100); // Run detection every 100ms
    return () => clearInterval(interval);
  }, [detector, boxColor]);

  

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Webcam Video */}
        <video
          ref={videoRef}
          className="rounded-md shadow-lg"
          style={{ width: "350px", height: "300px" }}
        ></video>

        {/* Canvas for Drawing */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: "350px", height: "300px" }}
        ></canvas>
       
        <h1>
          {!isFaceDetected? "No face detected! Please look at the camera.":
          isCheating? "Cheating Detected! Please look at the camera.":
          "Looking Good!"

          }
        </h1>
      </div>
    </div>
  );
}
