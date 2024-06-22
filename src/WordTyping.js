import React, { useState, useEffect } from 'react';
import './WordTyping.css';

const words = ["encyclopedia", "programming", "javascript", "react", "validation"];

const WordTyping = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.toLowerCase() === currentWord.toLowerCase()) {
      setFeedback('Your typing is correct');
    } else {
      setFeedback(`Your typing is incorrect. The correct word is ${currentWord}`);
    }
  };

  const handleTryAgain = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setInputValue('');
    setFeedback('');
  };

  return (
    <div className="word-typing-container">
      <h1>Write a sentence using this sight word:</h1>
      <div className="display-word">{currentWord}</div>
      <div className="instruction">Write at least 1 sentence in your response.</div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        className="input-box"
        placeholder="Type your response here..."
        rows="4"
      />
      <div className="buttons">
        <button onClick={handleSubmit} className="submit-button">Check Answer</button>
        <button onClick={handleTryAgain} className="try-again-button">Try Again</button>
      </div>
      {feedback && <div className={`feedback ${feedback.includes('correct') ? 'success' : 'error'}`}>{feedback}</div>}
    </div>
  );
};

export default WordTyping;
