import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

export function Register() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);

  const capture = async () => {
    if (!webcamRef.current) {
      setMessage("Camera is not accessible.");
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Failed to capture image. Ensure camera access is allowed.");
      return;
    }
    try {
      const response = await axios.post("https://4a4c-120-56-187-5.ngrok-free.app/api/register", {
        username,
        faceImage: imageSrc,
      });
      setMessage(response.data.message || "Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Error occurred during registration.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br />
      <Webcam
        audio={false}
        height={300}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        videoConstraints={videoConstraints}
        onUserMediaError={(err) => {
          console.error("Camera error:", err);
          setMessage("Error accessing the camera. Check permissions.");
        }}
      />

      <br />
      <button
        onClick={capture}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        Register
      </button>
      <p>{message}</p>
    </div>
  );
}

export function Identify() {
  const [identifiedUser, setIdentifiedUser] = useState("");
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);

  const capture = async () => {
    if (!webcamRef.current) {
      setMessage("Camera is not accessible.");
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Failed to capture image. Ensure camera access is allowed.");
      return;
    }
    try {
      const response = await axios.post("https://4a4c-120-56-187-5.ngrok-free.app/api/identify", {
        faceImage: imageSrc,
      });
      setIdentifiedUser(response.data.username);
      setMessage("Identification Successful");
    } catch (error) {
      console.error("Identification error:", error);
      setMessage("Error occurred during identification.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Identify</h2>
      <Webcam
        audio={false}
        height={300}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        videoConstraints={videoConstraints}
      />
      <br />
      <button
        onClick={capture}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        Identify
      </button>
      <p>{message}</p>
      {identifiedUser && <h3>User: {identifiedUser}</h3>}
    </div>
  );
}
