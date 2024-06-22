import React, { useState, useEffect, useRef } from 'react';
import './WordRecorder.css';

const WordRecorder = ({ sentence }) => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
    } else {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Speech recognition result:', speechResult);
        setTranscript(speechResult);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
    }
  }, []);

  const startRecording = () => {
    setRecording(true);
    setTranscript('');
    setFeedback('');

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        recognitionRef.current.start();
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && recognitionRef.current) {
      mediaRecorderRef.current.stop();
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    const formattedSentence = sentence.toLowerCase().trim().replace('?', '');
    const spokenWords = transcript.split(' ').map(word => word.trim());
    const displayedWords = formattedSentence.split(' ').map(word => word.trim());

    console.log('Displayed words:', displayedWords);
    console.log('Spoken words:', spokenWords);

    if (spokenWords.join(' ') === displayedWords.join(' ')) {
      setFeedback('You have spoken the sentence correctly');
    } else {
      setFeedback('Your pronunciation is incorrect. Please try again.');
    }
  };

  const handleRetry = () => {
    setTranscript('');
    setFeedback('');
    setAudioUrl('');
    audioChunksRef.current = [];
  };

  return (
    <div className="word-recorder">
      <h2 className="prompt">Read and <span className="highlight">record</span> yourself saying the question in the space below.</h2>
      <h3 className="sentence">{sentence}</h3>
      <div className="controls">
        {!recording ? (
          <button onClick={startRecording} className="record-button">Press and hold to record</button>
        ) : (
          <button onClick={stopRecording} className="stop-button">Stop Recording</button>
        )}
      </div>
      {audioUrl && <audio controls src={audioUrl} />}
      <div className="buttons">
        <button onClick={handleSubmit} className="submit-button">Check Answer</button>
        <button onClick={handleRetry} className="retry-button">Retry</button>
      </div>
      {feedback && <div className={`feedback ${feedback.includes('correctly') ? 'success' : 'error'}`}>{feedback}</div>}
    </div>
  );
};

export default WordRecorder;
