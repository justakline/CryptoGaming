// TicTacToe.js
import React, { useState, useEffect } from 'react';
import '../assets/stylesheets/TicTacToeStylesheet.css';

const TicTacToe = ({ address }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameInProgress, setGameInProgress] = useState(true);
  const [gameTied, setGameTied] = useState(false);
  const [wager, setWager] = useState(0);
  const [hasWagered, setHasWagered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { address: 'Player X', balance: 0 },
    { address: 'Player O', balance: 0 },
  ]);

  useEffect(() => {
    // Update leaderboard based on game results
    if (!gameInProgress && hasWagered) {
      const winner = calculateWinner(squares);
      if (winner) {
        // Update leaderboard for the winner
        setLeaderboard((prevLeaderboard) => {
          const updatedLeaderboard = [...prevLeaderboard];
          const winnerIndex = updatedLeaderboard.findIndex(
            (entry) => entry.address === (winner === 'X' ? 'Player X' : 'Player O')
          );
          const winnings = wager * 2; // Double the balance for the winner
          updatedLeaderboard[winnerIndex].balance += winnings;
          return updatedLeaderboard;
        });
        setTimeout(() => {
          window.alert(`Game Over - ${winner === 'X' ? 'Player X' : 'Player O'} wins ${wager * 2} sepolia!`);
        }, 100);
      } else if (gameTied) {
        // Update leaderboard for a tie
        setLeaderboard((prevLeaderboard) => {
          const updatedLeaderboard = [...prevLeaderboard];
          const winnings = wager; // The player gets their wager back in case of a tie
          updatedLeaderboard.forEach((entry) => {
            entry.balance = winnings; // Reset the balance to the new value
          });
          return updatedLeaderboard;
        });
        setTimeout(() => {
          window.alert(`Game Over - It's a Tie! Both players get back ${wager} sepolia.`);
        }, 100);
      }
    }
  }, [gameInProgress, gameTied, wager, hasWagered, squares]);

  const handleClick = (i) => {
    if (!hasWagered) {
      alert('Please wager before making a move.');
      return;
    }
  
    const currentSquares = squares.slice();
  
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }
  
    currentSquares[i] = xIsNext ? 'X' : 'O';
  
    setSquares(currentSquares);
    setXIsNext(!xIsNext);
  
    const winner = calculateWinner(currentSquares);
    if (winner) {
      setGameInProgress(false);
    } else if (currentSquares.indexOf(null) === -1) {
      // The game is tied
      setGameInProgress(false);
      setGameTied(true);
    }
  };  

  const restartGame = () => {
    if (gameInProgress || !hasWagered) {
      alert('You cannot restart the game until the round is finished!');
      return;
    }
  
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameTied(false);
    setGameInProgress(true);
    setHasWagered(false);
    setWager(0);
    // Reset balances to 0 each time the game restarts
    setLeaderboard([
      { address: 'Player X', balance: 0 },
      { address: 'Player O', balance: 0 },
    ]);
  };
  

  const renderSquare = (i) => (
    <button className="square" onClick={() => handleClick(i)}>
      {squares[i]}
    </button>
  );

  const handleWagerChange = (e) => {
    setWager(e.target.value);
  };

  const handleWagerSubmit = () => {
    if (wager <= 0 || wager > 0.05) {
      alert('Please enter a wager between 0 and 0.05');
    } else {
      setHasWagered(true);
      console.log('Wager: ', wager);
    }
  };

  const renderStatus = () => {
    const winner = calculateWinner(squares);

    if (winner) {
      return `Winner: ${winner === 'X' ? 'Player X' : 'Player O'}`;
    } else if (gameTied) {
      return "It's a Tie!";
    } else {
      return `Next Player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  return (
    <>
      <div className="button-container">
        <div className="game-board">
          <div className="status">{renderStatus()}</div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        <button onClick={() => restartGame()}>Restart Game</button>
      </div>
      <div className="wager-section">
        {hasWagered ? (
          <p>{`Wagering ${wager} sepolia`}</p>
        ) : (
          <div>
            <input
              type="number"
              placeholder="Wager (0 - 0.05)"
              onChange={handleWagerChange}
            />
            <button onClick={handleWagerSubmit}>Wager</button>
          </div>
        )}
      </div>
      <div className="leaderboard-section">
        <p>Leaderboard</p>
        {leaderboard.map((entry) => (
          <p key={entry.address} className="leaderboard-entry">
            {`${entry.address}: ${entry.balance} ETH Accumulated Gain`}
          </p>
        ))}
      </div>
    </>
  );
};

export default TicTacToe;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}




