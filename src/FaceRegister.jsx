import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function FaceRegister() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState('');
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
      // Convert the canvas image to a Blob
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
      }, 'image/png');
    }
  };

  // Send the captured image along with the name to the backend
  const handleRegister = async () => {
    if (!name || !capturedImage) {
      setMessage("Please enter a name and capture an image.");
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    // Convert Blob to File for compatibility with backend's MultipartFile handling
    const file = new File([capturedImage], "capture.png", { type: 'image/png' });
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/register', formData, {
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
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <video ref={videoRef} autoPlay style={{ width: "400px" }}></video>
        <button onClick={captureImage}>Capture Image</button>
      </div>
      <div>
        {/* Hidden canvas used for capturing the image */}
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
