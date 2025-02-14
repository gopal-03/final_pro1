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
  const [mailId, setMailId] = useState("");
  const [mobNo, setMobNo] = useState("");
  const [dept, setDept] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
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

    if(password !== rePassword){
      setMessage("Password Dosen't Matching please verify password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        username,
        mailId,
        mobNo,
        dept,
        password,
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
        placeholder="Enter Name asPer CollegeID"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>

      <input
        type="text"
        placeholder="Enter MailId"
        value={mailId}
        onChange={(e) => setMailId(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>



      <input
        type="text"
        placeholder="Enter MobileNumber"
        value={mobNo}
        onChange={(e) => setMobNo(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>

      <input
        type="text"
        placeholder="Enter Department"
        value={dept}
        onChange={(e) => setDept(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>

      <input
        type="text"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>

      <input
        type="text"
        placeholder="Re-Enter Password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
      />
      <br/>

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
      const response = await axios.post("http://localhost:8080/api/identify", {
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
