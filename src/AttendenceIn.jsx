import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function AttendenceIn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [result, setResult] = useState('');
  const [captureMode, setCaptureMode] = useState('image'); // "image" or "video"
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [recording, setRecording] = useState(false);

  // Start the camera stream on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera", err);
      });
  }, []);

  // Capture a still image
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setCapturedMedia(blob);
      }, 'image/png');
    }
  };

  // Record a short video clip (e.g., 3 seconds)
  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    if (!stream) return;
    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(stream, options);
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setCapturedMedia(blob);
      setRecording(false);
    };
    mediaRecorder.start();
    setRecording(true);
    // Automatically stop recording after 3 seconds
    setTimeout(() => {
      mediaRecorder.stop();
    }, 3000);
    mediaRecorderRef.current = mediaRecorder;
  };

  // Handle recognition by sending captured media to backend
  const handleRecognize = async () => {
    if (!capturedMedia) {
      setResult("Please capture an image or record a video first.");
      return;
    }
    const formData = new FormData();
    // If video, the file name and MIME type will trigger the optical flow path in backend.
    const fileName = captureMode === 'video' ? "capture.webm" : "capture.png";
    const fileType = captureMode === 'video' ? "video/webm" : "image/png";
    const file = new File([capturedMedia], fileName, { type: fileType });
    formData.append('file', file);
    // Pass additional parameters if needed.
    formData.append('routerIP', "1.1.1.2");
    formData.append('wifiSignalStrength', "-52Dm");

    try {
      const res = await axios.post('https://74c6-120-60-34-101.ngrok-free.app/api/recognize', formData, {
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
        <button onClick={() => setCaptureMode('video')}>Record Video</button>
      </div>
      <div>
        <video ref={videoRef} autoPlay style={{ width: "400px" }}></video>
      </div>
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        {capturedMedia && captureMode === 'video' && (
          <video 
            src={URL.createObjectURL(capturedMedia)} 
            controls 
            style={{ width: "200px", marginTop: "10px" }}
          ></video>
        )}
      </div>
      <div>
        
      <button onClick={startRecording} disabled={recording}>
        {recording ? "Recording..." : "Record Video"}
      </button>
        
      </div>
      <button onClick={handleRecognize}>Recognize</button>
      {result && <p>{result}</p>}
    </div>
  );
}

export default AttendenceIn;
