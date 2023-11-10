import React from 'react';
import TicTacToe from './games/TicTacToe';  // Import the TicTacToe component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic-Tac-Toe Game</h1>
        <TicTacToe />  
      </header>
    </div>
  );
}

export default App;

