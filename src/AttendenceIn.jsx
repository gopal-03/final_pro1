import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function AttendenceIn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState('');
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

  // Send the captured image to the backend for recognition
  const handleRecognize = async () => {
    if (!capturedImage) {
      setResult("Please capture an image first.");
      return;
    }
    const formData = new FormData();
    const file = new File([capturedImage], "capture.png", { type: 'image/png' });
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/recognize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setResult(err.response ? err.response.data : "Error occurred during recognition");
    }
  };

  return (
    <div>
      <h2>Recognize Face via Camera</h2>
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
      <button onClick={handleRecognize}>Recognize</button>
      {result && <p>{result}</p>}
    </div>
  );
}

export default AttendenceIn;
