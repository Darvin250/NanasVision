import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function CaptureScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBackendReady, setIsBackendReady] = useState(false);

  // Function to start the camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prioritize rear camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Could not access the camera. Please check permissions.');
    }
  }, []);

  // Start camera on component mount
  useEffect(() => { 
    // 1. Check if the backend is ready
    const checkBackendStatus = async () => {
      try {
        // Use the base IP address from your environment variables
        const baseApiUrl = import.meta.env.VITE_LAPTOP_IP_ADDRESS.replace('/predict', '');
        const response = await fetch(`${baseApiUrl}/health`);
        if (response.ok) {
          setIsBackendReady(true);
        } else {
          throw new Error('Backend not responding correctly.');
        }
      } catch (err) {
        console.error("Backend health check failed:", err);
        setError('Cannot connect to the server. Please ensure the backend is running.');
        setIsBackendReady(false);
      }
    };

    checkBackendStatus();
    startCamera();

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera, stream]);

  const handlePrediction = async (imageBlob, imageDataUrl) => {
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', imageBlob, 'capture.jpg');

    try {
      // IMPORTANT: Replace with your backend's IP address
      const API_URL = import.meta.env.VITE_LAPTOP_IP_ADDRESS; // Example: 'http://192.168.1.5:8000/predict'
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Prediction failed');
      }

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      // Navigate to result screen with data
      navigate('/farmer/result', { state: { prediction: result, image: imageDataUrl } });

    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    canvas.toBlob((blob) => {
      if (blob) {
        handlePrediction(blob, imageDataUrl);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        handlePrediction(file, imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', color: 'white' }}>
      {/* Hidden elements for functionality */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {/* Camera Viewfinder */}
      <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />

      {/* Header with Flash Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', zIndex: 10 }}>
        <div style={{ color: '#ffffff', fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate(-1)}>✕</div>
        <div style={{ color: '#ffffff', fontSize: '24px', cursor: 'pointer' }}>⚡</div>
      </div>

      {/* Overlay UI */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        {/* Minimalist White Framing Guide */}
        <div style={{ width: '250px', height: '300px', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '12px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderTopLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #fff', borderRight: '4px solid #fff', borderTopRightRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #fff', borderLeft: '4px solid #fff', borderBottomLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #fff', borderRight: '4px solid #fff', borderBottomRightRadius: '12px' }}></div>
        </div>
        {/* Loading or Error Message */}
        {isLoading && <div style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '8px' }}>Processing...</div>}
        {error && <div style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'rgba(211, 47, 47, 0.8)', borderRadius: '8px', maxWidth: '80%', textAlign: 'center' }}>{error}</div>}
      </div>

      {/* Bottom Shutter Area */}
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '60px', zIndex: 10 }}>
        {/* Gallery Button */}
        <button onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>🖼️</button>

        {/* Circular Shutter Button */}
        <button 
          onClick={handleCapture} 
          disabled={isLoading || !isBackendReady}
          style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid #ffffff', backgroundColor: (isLoading || !isBackendReady) ? '#888' : 'rgba(255,255,255,0.3)', cursor: (isLoading || !isBackendReady) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ width: '54px', height: '54px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>
        </button>

        {/* Placeholder for other controls */}
        <div style={{ width: '48px' }}></div>
      </div>
      <BottomNav />
    </div>
  );
}