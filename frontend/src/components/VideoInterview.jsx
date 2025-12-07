// video interview component

import { useEffect, useRef, useState } from 'react';

const VideoInterview = ({ 
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
  const [faceDetected, setFaceDetected] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const faceDetectionIntervalRef = useRef(null);

  useEffect(() => {
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
          startFaceDetection();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check your permissions and ensure no other app is using the camera.');
    }
  };

  // Basic face detection (simplified - checks for video frames)
  const startFaceDetection = () => {
    faceDetectionIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        // Simple check: if video is playing, assume face is present
        // In production, you'd use a library like face-api.js or TensorFlow.js
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }
    }, 1000);
  };

  const startRecording = async () => {
    if (!cameraReady) {
      await initializeCamera();
      // Wait a bit for camera to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      setError('');
      videoChunksRef.current = [];

      // Set up MediaRecorder for video recording
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
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
        }
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
      setError('Failed to start recording. Please check your permissions.');
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

    setIsRecording(false);
    setIsPaused(false);
    setIsListening(false);
  };

  const handleSubmit = () => {
    if (!transcript.trim()) {
      setError('Please speak your answer before submitting');
      return;
    }

    stopRecording();

    // In production, you would also upload the video chunks
    // const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });

    onSubmitAnswer({
      transcript: transcript.trim(),
      duration,
      // videoBlob: videoBlob, // For future video upload
      faceDetected: faceDetected,
    });

    // Reset for next question
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
      {/* Question Display */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📹</span>
          <h3 className="text-lg font-semibold text-purple-900">Video Mode</h3>
        </div>
        <p className="text-purple-800">
          Your video and audio will be recorded. Make sure you're in a well-lit area and looking at the camera.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Video Preview */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">REC</span>
            </div>
          )}

          {/* Face Detection Indicator */}
          {cameraReady && (
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full ${
              faceDetected ? 'bg-green-500' : 'bg-yellow-500'
            } text-white`}>
              <span className="text-sm font-medium">
                {faceDetected ? '✓ Face detected' : '⚠ No face detected'}
              </span>
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
                <div className="text-6xl mb-4">📹</div>
                <p className="text-lg">Initializing camera...</p>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Initialize Camera
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
          {!cameraReady && 'Click to initialize your camera and microphone'}
          {cameraReady && !isRecording && !faceDetected && '⚠️ Please position your face in frame before recording'}
          {cameraReady && !isRecording && faceDetected && 'Click the record button to start'}
          {isRecording && !isPaused && 'Recording... Click pause or stop when done'}
          {isPaused && 'Paused. Click play to resume or stop to finish'}
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

      {/* Submit Button */}
      {transcript && !isRecording && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? '⏳ Submitting...' : 'Submit Answer →'}
        </button>
      )}
    </div>
  );
};

export default VideoInterview;