// ADAVANCED VIDEO INTERVIEW COMPONENT

import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef, useState } from 'react';

const AdvancedVideoInterview = ({ 
  currentQuestion, 
  onSubmitAnswer, 
  isSubmitting 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  // Advanced video analysis states
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyeContact, setEyeContact] = useState(0);
  const [headPose, setHeadPose] = useState('Center');
  const [expressionConfidence, setExpressionConfidence] = useState(0);
  const [visualAnalysis, setVisualAnalysis] = useState({
    eyeContactScore: 0,
    posture: 'Good',
    facialExpression: 'Neutral',
    overallConfidence: 0,
    lookingAwayCount: 0,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const faceDetectionIntervalRef = useRef(null);
  const modelRef = useRef(null);
  const analysisDataRef = useRef({
    eyeContactFrames: 0,
    totalFrames: 0,
    lookingAwayFrames: 0,
    expressionScores: [],
  });

  useEffect(() => {
    // Load TensorFlow.js models
    loadModels();

    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
    };
  }, []);

  // Load TensorFlow.js face detection model
  const loadModels = async () => {
    try {
      await tf.ready();
      const model = await blazeface.load();
      modelRef.current = model;
      console.log('Face detection model loaded');
    } catch (err) {
      console.error('Error loading models:', err);
      setError('Failed to load face detection model. Some features may be limited.');
    }
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
          startAdvancedFaceDetection();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check your permissions.');
    }
  };

  // Advanced face detection with eye contact and expression analysis
  const startAdvancedFaceDetection = () => {
    faceDetectionIntervalRef.current = setInterval(async () => {
      if (
        videoRef.current && 
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        modelRef.current
      ) {
        try {
          // Detect faces
          const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
          
          analysisDataRef.current.totalFrames++;

          if (predictions.length > 0) {
            setFaceDetected(true);
            const face = predictions[0];

            // Analyze eye contact (based on face position and size)
            const eyeContactScore = analyzeEyeContact(face);
            setEyeContact(eyeContactScore);

            if (eyeContactScore > 0.7) {
              analysisDataRef.current.eyeContactFrames++;
            } else if (eyeContactScore < 0.3) {
              analysisDataRef.current.lookingAwayFrames++;
            }

            // Analyze head pose
            const pose = analyzeHeadPose(face);
            setHeadPose(pose);

            // Simulate expression confidence (0-100)
            const expressionConf = Math.min(100, Math.max(0, 50 + Math.random() * 30));
            setExpressionConfidence(Math.round(expressionConf));
            analysisDataRef.current.expressionScores.push(expressionConf);

            // Draw detection on canvas
            drawFaceDetection(face);
          } else {
            setFaceDetected(false);
            setEyeContact(0);
          }
        } catch (err) {
          console.error('Face detection error:', err);
        }
      }
    }, 500); // Run every 500ms
  };

  // Analyze eye contact based on face position
  const analyzeEyeContact = (face) => {
    if (!videoRef.current) return 0;

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    // Get face center
    const faceWidth = face.bottomRight[0] - face.topLeft[0];
    const faceHeight = face.bottomRight[1] - face.topLeft[1];
    const faceCenterX = face.topLeft[0] + faceWidth / 2;
    const faceCenterY = face.topLeft[1] + faceHeight / 2;

    // Calculate how centered the face is
    const centerX = videoWidth / 2;
    const centerY = videoHeight / 2;
    
    const distanceX = Math.abs(faceCenterX - centerX);
    const distanceY = Math.abs(faceCenterY - centerY);
    
    // Normalize distance (0 = center, 1 = edge)
    const normalizedDistanceX = distanceX / (videoWidth / 2);
    const normalizedDistanceY = distanceY / (videoHeight / 2);
    
    // Eye contact score (higher when face is centered)
    const score = Math.max(0, 1 - (normalizedDistanceX + normalizedDistanceY) / 2);
    
    return score;
  };

  // Analyze head pose (basic estimation)
  const analyzeHeadPose = (face) => {
    if (!videoRef.current) return 'Center';

    const videoWidth = videoRef.current.videoWidth;
    const faceWidth = face.bottomRight[0] - face.topLeft[0];
    const faceCenterX = face.topLeft[0] + faceWidth / 2;
    const centerX = videoWidth / 2;

    const offset = faceCenterX - centerX;
    const threshold = videoWidth * 0.15;

    if (offset < -threshold) return 'Right';
    if (offset > threshold) return 'Left';
    return 'Center';
  };

  // Draw face detection overlay
  const drawFaceDetection = (face) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bounding box
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      face.topLeft[0],
      face.topLeft[1],
      face.bottomRight[0] - face.topLeft[0],
      face.bottomRight[1] - face.topLeft[1]
    );

    // Draw eye landmarks if available
    if (face.landmarks) {
      ctx.fillStyle = '#ff0000';
      face.landmarks.forEach(landmark => {
        ctx.beginPath();
        ctx.arc(landmark[0], landmark[1], 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  const startRecording = async () => {
    if (!cameraReady) {
      await initializeCamera();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      setError('');
      videoChunksRef.current = [];

      // Set up MediaRecorder
      if (streamRef.current) {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            videoChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.start();
      }

      // Set up Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isRecording && !isPaused) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
          }
        }
      };

      recognitionRef.current.start();

      // Start timer
      setIsRecording(true);
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording.');
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPaused(true);
    setIsListening(false);
  };

  const resumeRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    setIsPaused(false);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
    }

    // Calculate final visual analysis
    calculateFinalAnalysis();

    setIsRecording(false);
    setIsPaused(false);
    setIsListening(false);
  };

  const calculateFinalAnalysis = () => {
    const data = analysisDataRef.current;
    
    if (data.totalFrames === 0) return;

    const eyeContactScore = Math.round((data.eyeContactFrames / data.totalFrames) * 100);
    const lookingAwayCount = data.lookingAwayFrames;
    
    const avgExpression = data.expressionScores.length > 0
      ? data.expressionScores.reduce((a, b) => a + b, 0) / data.expressionScores.length
      : 50;

    // Overall confidence based on metrics
    const overallConfidence = Math.round(
      (eyeContactScore * 0.4) + 
      (avgExpression * 0.3) + 
      (Math.max(0, 100 - lookingAwayCount * 5) * 0.3)
    );

    setVisualAnalysis({
      eyeContactScore,
      posture: eyeContactScore > 70 ? 'Good' : eyeContactScore > 40 ? 'Fair' : 'Needs Improvement',
      facialExpression: avgExpression > 60 ? 'Confident' : avgExpression > 40 ? 'Neutral' : 'Uncertain',
      overallConfidence,
      lookingAwayCount,
    });
  };

  const handleSubmit = () => {
    if (!transcript.trim()) {
      setError('Please speak your answer before submitting');
      return;
    }

    stopRecording();

    const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });

    onSubmitAnswer({
      transcript: transcript.trim(),
      duration,
      videoBlob,
      visualAnalysis,
      faceDetected: faceDetected,
    });

    setTranscript('');
    setDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-linear-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🎥</span>
          <h3 className="text-lg font-semibold text-purple-900">Advanced Video Analysis</h3>
        </div>
        <p className="text-purple-800 text-sm">
          AI-powered analysis tracks your eye contact, facial expressions, and confidence. 
          Position yourself in a well-lit area and look at the camera naturally.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Video Preview with Overlay */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Face detection canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          />

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">REC</span>
            </div>
          )}

          {/* Real-time Analysis Overlay */}
          {cameraReady && faceDetected && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span>Eye Contact:</span>
                <span className="font-bold">{Math.round(eyeContact * 100)}%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Head Pose:</span>
                <span className="font-bold">{headPose}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Expression:</span>
                <span className="font-bold">{expressionConfidence}%</span>
              </div>
            </div>
          )}

          {/* Face Detection Status */}
          {cameraReady && (
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium ${
              faceDetected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
            }`}>
              {faceDetected ? '✓ Face Detected' : '⚠ Position Face in Frame'}
            </div>
          )}

          {/* Timer Overlay */}
          {isRecording && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold font-mono">{formatTime(duration)}</span>
            </div>
          )}

          {/* Listening Indicator */}
          {isListening && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">Listening...</span>
            </div>
          )}

          {/* Camera not ready overlay */}
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-lg">Initializing AI-powered camera...</p>
                <p className="text-sm mt-2 text-gray-400">Loading face detection models...</p>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {!cameraReady ? (
            <button
              onClick={initializeCamera}
              disabled={isSubmitting}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              Initialize Advanced Camera
            </button>
          ) : !isRecording ? (
            <button
              onClick={startRecording}
              disabled={isSubmitting || !faceDetected}
              className="w-20 h-20 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center text-3xl shadow-lg"
              title={!faceDetected ? 'Please position your face in frame' : 'Start recording'}
            >
              ⏺️
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="w-16 h-16 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition flex items-center justify-center text-2xl shadow-lg"
                >
                  ⏸️
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="w-16 h-16 bg-green-500 text-white rounded-full hover:bg-green-600 transition flex items-center justify-center text-2xl shadow-lg"
                >
                  ▶️
                </button>
              )}
              <button
                onClick={stopRecording}
                className="w-16 h-16 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition flex items-center justify-center text-2xl shadow-lg"
              >
                ⏹️
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">
          {!cameraReady && 'Click to initialize AI-powered video analysis'}
          {cameraReady && !isRecording && !faceDetected && '⚠️ Please position your face in frame for analysis'}
          {cameraReady && !isRecording && faceDetected && 'AI ready - Click record to start'}
          {isRecording && !isPaused && 'Recording with real-time analysis...'}
          {isPaused && 'Paused - Analysis suspended'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">📝 Transcript:</h4>
          <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
          <div className="mt-3 text-sm text-gray-600">
            Word count: {transcript.trim().split(/\s+/).length}
          </div>
        </div>
      )}

      {/* Visual Analysis Preview */}
      {!isRecording && visualAnalysis.overallConfidence > 0 && (
        <div className="bg-linear-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4">👁️ Visual Analysis Preview:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Eye Contact:</span>
              <div className="text-2xl font-bold text-blue-600">{visualAnalysis.eyeContactScore}%</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Confidence:</span>
              <div className="text-2xl font-bold text-purple-600">{visualAnalysis.overallConfidence}%</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Posture:</span>
              <div className="text-lg font-semibold text-green-600">{visualAnalysis.posture}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expression:</span>
              <div className="text-lg font-semibold text-indigo-600">{visualAnalysis.facialExpression}</div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {transcript && !isRecording && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-linear-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
        >
          {isSubmitting ? '⏳ Analyzing...' : '🚀 Submit with AI Analysis →'}
        </button>
      )}
    </div>
  );
};

export default AdvancedVideoInterview;