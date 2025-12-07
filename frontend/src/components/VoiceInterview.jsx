// VOICE INTERVIEW COMPONENT

import { useEffect, useRef, useState } from 'react';

const VoiceInterview = ({ 
  currentQuestion, 
  onSubmitAnswer, 
  isSubmitting 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Initialize audio level monitoring
  const initializeAudioMonitoring = async (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (err) {
      console.error('Error initializing audio monitoring:', err);
    }
  };

  const startRecording = async () => {
    try {
      setError('');
      audioChunksRef.current = [];

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio level monitoring
      initializeAudioMonitoring(stream);

      // Set up MediaRecorder for audio recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();

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
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => {
          const updated = prev + finalTranscript;
          return updated;
        });
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setError('No speech detected. Please speak clearly into your microphone.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isRecording && !isPaused) {
          // Restart if still recording
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
      setError('Failed to access microphone. Please check your permissions.');
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
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setIsPaused(false);
    setIsListening(false);
    setAudioLevel(0);
  };

  const handleSubmit = () => {
    if (!transcript.trim()) {
      setError('Please speak your answer before submitting');
      return;
    }

    stopRecording();
    onSubmitAnswer({
      transcript: transcript.trim(),
      duration,
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
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🎤</span>
          <h3 className="text-lg font-semibold text-blue-900">Voice Mode</h3>
        </div>
        <p className="text-blue-800">
          Click the microphone button below to start recording your answer. 
          Your speech will be transcribed in real-time.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Audio Level Indicator */}
        {isRecording && (
          <div className="mb-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                {isListening ? 'Listening...' : 'Not listening'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg- linear-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-150"
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Audio level</p>
          </div>
        )}

        {/* Timer */}
        <div className="text-5xl font-bold text-gray-900 mb-6">
          {formatTime(duration)}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isSubmitting}
              className="w-20 h-20 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center text-3xl shadow-lg"
            >
              🎤
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

        {/* Instructions */}
        <p className="text-sm text-gray-600">
          {!isRecording && 'Click the microphone to start recording'}
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

export default VoiceInterview;