import React from 'react';

import WordRecorder from './WordRecorder';
import './WordRecorder.css';
import './App.css';

const App = () => {
  const sentence = "Are you a boy?";

  return (
    <div className="App">
      <WordRecorder sentence={sentence} />
    </div>
  );
};

export default App;
