import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TicTacToe from './games/TicTacToe';
import ColorGuess from './games/ColorGuess';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <div>
      <ColorGuess />
      <TicTacToe />
    </div>
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
