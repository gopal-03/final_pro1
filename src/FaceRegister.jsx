import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function FaceRegister() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [username, setUserName] = useState('');
  const [name, setName] = useState('');
  const [mobNo, setMobNo] = useState(0);
  const [dept, setDept] = useState('');
  const [college, setCollege] = useState('');
  const [collegeUsername, setCollegeUserName] = useState('');
  const [age, setAge] = useState(0);
  const [rePassword, setRePassword] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  // Start the camera stream on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera", err);
      });
  }, []);

  // Capture an image from the video feed
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
      }, 'image/png');
    }
  };

  // Send the captured image along with user details to the backend
  const handleRegister = async () => {
    if (!name || !capturedImage) {
      setMessage("Please enter your name and capture an image.");
      return;
    }
    if(password !== rePassword){
      setMessage("Password mismatch, please verify your password");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('mobNo', mobNo); 
    formData.append('dept', dept);
    formData.append('college', college);
    formData.append('collegeUsername',collegeUsername);
    formData.append('age', age);
    formData.append('password', password);
    const file = new File([capturedImage], "capture.png", { type: 'image/png' });
    formData.append('file', file);

    try {
      const res = await axios.post('http://192.168.1.7:8080/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response ? err.response.data : "Error occurred during registration");
    }
  };

  return (
    <div>
      <h2>Register Face via Camera</h2>
      <input 
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input 
        type="text"
        placeholder="Enter your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input 
        type="number"
        placeholder="Enter your Mobile No"
        value={mobNo}
        onChange={(e) => setMobNo(e.target.value)}
      />
      <input 
        type="text"
        placeholder="Enter your Department"
        value={dept}
        onChange={(e) => setDept(e.target.value)}
      />
      <input 
        type="text"
        placeholder="Enter your College Username"
        value={collegeUsername}
        onChange={(e) => setCollegeUserName(e.target.value)}
      />
      <input 
        type="text"
        placeholder="Enter your College Name"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      />
      <input 
        type="number"
        placeholder="Enter your Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Enter your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Re-Enter your Password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />
      <div>
        <video ref={videoRef} autoPlay style={{ width: "400px" }}></video>
        <button onClick={captureImage}>Capture Image</button>
      </div>
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        {capturedImage && (
          <img 
            src={URL.createObjectURL(capturedImage)} 
            alt="Captured" 
            style={{ width: "200px", marginTop: "10px" }} 
          />
        )}
      </div>
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FaceRegister;