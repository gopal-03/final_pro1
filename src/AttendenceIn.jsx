import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function AttendenceIn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  // Get local IP address using WebRTC
  const getLocalIP = () => {
    return new Promise((resolve, reject) => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      // Create a bogus data channel
      pc.createDataChannel('');
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(err => reject(err));
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const candidate = ice.candidate.candidate;
          const regex = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/;
          const match = candidate.match(regex);
          if (match) {
            resolve(match[1]);
            pc.onicecandidate = null;
          }
        }
      };
      // Timeout if no candidate is found
      setTimeout(() => {
        reject('Could not get IP address');
      }, 1000);
    });
  };

  // Get network info from the browser (if available)
  const getNetworkInfo = () => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 'unknown',
        rtt: connection.rtt || 'unknown'
      };
    }
    return { effectiveType: 'unknown', downlink: 'unknown', rtt: 'unknown' };
  };

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

  // Send the captured image to the backend for recognition,
  // including the local IP address and network information.
  const handleRecognize = async () => {
    if (!capturedImage) {
      setResult("Please capture an image first.");
      return;
    }

    let localIP = '';
    try {
      localIP = await getLocalIP();
    } catch (e) {
      localIP = 'Not available';
    }
    const networkInfo = getNetworkInfo();

    const formData = new FormData();
    // Create a File object from the blob
    const file = new File([capturedImage], "capture.png", { type: 'image/png' });
    formData.append('file', file);
    formData.append('ip', localIP);
    formData.append('networkInfo', JSON.stringify(networkInfo));

    try {
      const res = await axios.post(
        'https://ff56-120-60-211-151.ngrok-free.app/api/recognize',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
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
