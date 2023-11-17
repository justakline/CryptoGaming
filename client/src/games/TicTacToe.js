import "../assets/stylesheets/TicTacToeStylesheet.css";
import React, { Component } from "react";

class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      gameInProgress: true, // Start the game immediately
      gameTied: false, // Flag for a tie game
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });

    if (squares.indexOf(null) === -1) {
      // If there are no empty squares, it's a tie
      this.setState({
        gameInProgress: false,
        gameTied: true,
      });
    }
  }

  restartGame() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
      gameTied: false,
      gameInProgress: true,
    });
  }

  renderSquare(i) {
    return (
      <button className="square" onClick={() => this.handleClick(i)}>
        {this.state.squares[i]}
      </button>
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
  
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.gameTied) {
      status = "It's a Tie!";
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }
  
    return (
      <div className="button-container">
        <div className="game-board">
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <button onClick={() => this.restartGame()}>Restart Game</button>
      </div>
    );
  }}
  
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









