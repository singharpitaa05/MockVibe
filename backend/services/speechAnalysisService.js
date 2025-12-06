// SPEECH ANALYSIS

// Analyze speech patterns from transcribed text
const analyzeSpeech = (transcript, durationSeconds) => {
  const text = transcript.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Calculate speaking rate (words per minute)
  const speakingRate = durationSeconds > 0 
    ? Math.round((wordCount / durationSeconds) * 60) 
    : 0;

  // Filler words detection
  const fillerWords = [
    'um', 'uh', 'umm', 'uhh', 'like', 'you know', 'basically', 
    'actually', 'literally', 'sort of', 'kind of', 'i mean'
  ];
  
  let fillerCount = 0;
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      fillerCount += matches.length;
    }
  });

  // Determine speaking speed category
  let speedCategory = 'Normal';
  if (speakingRate < 100) {
    speedCategory = 'Slow';
  } else if (speakingRate > 160) {
    speedCategory = 'Fast';
  }

  // Calculate clarity score (inverse of filler word frequency)
  const fillerFrequency = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;
  const clarityScore = Math.max(0, Math.min(100, 100 - (fillerFrequency * 10)));

  // Detect pauses (multiple consecutive spaces or punctuation patterns)
  const pausePattern = /[.!?]\s+/g;
  const pauses = (text.match(pausePattern) || []).length;

  // Sentence complexity
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 
    ? Math.round(wordCount / sentences.length) 
    : 0;

  return {
    fillerWords: fillerCount,
    speakingSpeed: speedCategory,
    speakingRate, // words per minute
    clarity: Math.round(clarityScore),
    pauses,
    wordCount,
    sentenceCount: sentences.length,
    avgWordsPerSentence,
    duration: durationSeconds,
  };
};

// Analyze tone and confidence from text patterns
const analyzeTone = (transcript) => {
  const text = transcript.toLowerCase();
  
  // Confidence indicators
  const uncertainWords = ['maybe', 'perhaps', 'possibly', 'might', 'could be', 'i think', 'i guess'];
  const confidentWords = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously', 'without doubt'];
  
  let uncertainCount = 0;
  let confidentCount = 0;
  
  uncertainWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) uncertainCount += matches.length;
  });
  
  confidentWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) confidentCount += matches.length;
  });

  // Calculate confidence score
  const confidenceScore = Math.min(100, Math.max(0, 50 + (confidentCount * 10) - (uncertainCount * 5)));

  // Detect question marks (uncertainty)
  const questionMarks = (text.match(/\?/g) || []).length;

  return {
    confidenceScore: Math.round(confidenceScore),
    uncertainPhrases: uncertainCount,
    confidentPhrases: confidentCount,
    questionsAsked: questionMarks,
  };
};

// Generate speech analysis feedback
const generateSpeechFeedback = (analysis) => {
  const feedback = [];
  const suggestions = [];

  // Speaking speed feedback
  if (analysis.speakingSpeed === 'Slow') {
    feedback.push('Your speaking pace is quite slow');
    suggestions.push('Try to speak a bit faster to maintain engagement');
  } else if (analysis.speakingSpeed === 'Fast') {
    feedback.push('You speak quite quickly');
    suggestions.push('Consider slowing down slightly for better clarity');
  } else {
    feedback.push('Your speaking pace is good');
  }

  // Filler words feedback
  if (analysis.fillerWords > 5) {
    feedback.push(`You used ${analysis.fillerWords} filler words`);
    suggestions.push('Practice reducing filler words like "um", "uh", and "like"');
  } else if (analysis.fillerWords <= 2) {
    feedback.push('Excellent control of filler words');
  }

  // Clarity feedback
  if (analysis.clarity < 70) {
    suggestions.push('Work on speaking more clearly and directly');
  } else if (analysis.clarity >= 85) {
    feedback.push('Your speech clarity is excellent');
  }

  return {
    strengths: feedback.filter(f => !f.includes('quite') && !f.includes('used')),
    improvements: suggestions,
  };
};

export {
    analyzeSpeech,
    analyzeTone,
    generateSpeechFeedback
};

