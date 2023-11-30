// SPDX-License-Identifier: MIT
// TicTacToe.sol
pragma solidity ^0.8.4;
import './MainContract.sol';

contract TicTacToe {
    address public owner;
    address public player1;
    address public player2;
    address public winner;
    uint8 public turn;
    uint8 public movesCount;
    bool public gameInProgress;
    uint256 public wagerAmount;

    mapping(address => mapping(uint8 => bool)) public moves;

    event MoveMade(address indexed player, uint8 position);
    event GameResult(address indexed winner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "You are not a player in this game");
        _;
    }

    modifier gameNotInProgress() {
        require(!gameInProgress, "Game is already in progress");
        _;
    }

    modifier gameInProgressOnly() {
        require(gameInProgress, "Game is not in progress");
        _;
    }

    modifier validMove(uint8 position) {
        require(position >= 0 && position <= 8, "Invalid move. Position must be between 0 and 8");
        require(!moves[player1][position] && !moves[player2][position], "Position already taken");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function startGame(address _player2, uint256 _wagerAmount) external onlyOwner gameNotInProgress {
        player1 = msg.sender;
        player2 = _player2;
        wagerAmount = _wagerAmount;
        gameInProgress = true;
        turn = 1;
    }

    function makeMove(uint8 position) external onlyPlayers gameInProgressOnly validMove(position) {
        require(msg.sender == (turn == 1 ? player1 : player2), "It's not your turn");
        movesCount++;

        moves[msg.sender][position] = true;

        if (checkWinner()) {
            gameInProgress = false;
            winner = msg.sender;
            emit GameResult(winner, wagerAmount * 2);
        } else if (movesCount == 9) {
            // It's a tie
            gameInProgress = false;
            emit GameResult(address(0), wagerAmount);
        } else {
            turn = 3 - turn; // Switch turn between 1 and 2
            emit MoveMade(msg.sender, position);
        }
    }

    function checkWinner() internal view returns (bool) {
        uint8[3][3] memory board;

        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (moves[player1][i * 3 + j]) {
                    board[i][j] = 1;
                } else if (moves[player2][i * 3 + j]) {
                    board[i][j] = 2;
                }
            }
        }

        for (uint8 i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != 0) {
                return true; // Horizontal win
            }
            if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != 0) {
                return true; // Vertical win
            }
        }

        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != 0) {
            return true; // Diagonal win
        }

        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != 0) {
            return true; // Diagonal win
        }

        return false;
    }

    function claimWinnings() external gameInProgressOnly {
        require(msg.sender == winner, "You are not the winner");
        gameInProgress = false;
        payable(msg.sender).transfer(wagerAmount * 2);
    }

    function withdrawFunds() external onlyOwner {
        require(!gameInProgress, "Cannot withdraw funds while a game is in progress");
        payable(owner).transfer(address(this).balance);
    }
}
