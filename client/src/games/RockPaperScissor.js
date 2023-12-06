import React, { useState, useEffect } from 'react';
import '../assets/stylesheets/RockPaperScissor.css';

const choices = ['rock', 'paper', 'scissors'];

const getResult = (userChoice, computerChoice) => {
  if (userChoice === computerChoice) {
    return 'It\'s a tie!';
  } else if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'You win!';
  } else {
    return 'You lose!';
  }
};

const RockPaperScissor = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);

  const handleChoice = (choice) => {
    const computerRandomChoice = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(computerRandomChoice);
    setResult(getResult(choice, computerRandomChoice));
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className="App">
      <h1>Rock, Paper, Scissors</h1>
      {!userChoice && (
        <div>
          <p>Choose your move:</p>
          <div className="choices">
            {choices.map((choice) => (
              <button key={choice} onClick={() => handleChoice(choice)}>
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
      {userChoice && (
        <div>
          <p>You chose: {userChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p>{result}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissor;
