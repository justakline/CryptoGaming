// src/components/WordSearch.js
import React, { useState, useEffect } from 'react';
import '../assets/WordSearch.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandomLetter() {
  const randomIndex = Math.floor(Math.random() * ALPHABET.length);
  return ALPHABET[randomIndex];
}

const WordSearch = () => {
  const [board, setBoard] = useState([]);
  const [wordsToFind, setWordsToFind] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    if (showWelcomeMessage) {
      const welcomeMessageTimeout = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000); // Show welcome message for 5 seconds
      return () => clearTimeout(welcomeMessageTimeout);
    }
  }, [showWelcomeMessage]);

  useEffect(() => {
    startNewGame();
  }, [playAgain]);

  useEffect(() => {
    if (foundWords.length === wordsToFind.length) {
      setGameCompleted(true);
    }
  }, [foundWords, wordsToFind]);

  useEffect(() => {
    if (gameCompleted) {
      showCongratulationMessage();
    }
  }, [gameCompleted]);

  function startNewGame() {
    const newWordsToFind = generateRandomWords(3);
    setWordsToFind(newWordsToFind);
    setBoard(generateRandomBoard(10, 10, newWordsToFind));
    setFoundWords([]);
    setSelectedCells([]);
    setGameCompleted(false);
    setShowWelcomeMessage(true); // Show the welcome message on starting a new game
  }

  function generateRandomBoard(rows, cols, words) {
    const newBoard = Array.from({ length: rows }, () => Array.from({ length: cols }, getRandomLetter));

    words.forEach((word) => {
      // Randomly choose a direction
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      // Randomly choose starting position
      let startRow, startCol;
      if (direction === 'horizontal') {
        startRow = Math.floor(Math.random() * rows);
        startCol = Math.floor(Math.random() * (cols - word.length + 1));
      } else {
        startRow = Math.floor(Math.random() * (rows - word.length + 1));
        startCol = Math.floor(Math.random() * cols);
      }

      placeWordOnBoard(newBoard, word, startRow, startCol, direction);
    });

    return newBoard;
  }

  function placeWordOnBoard(board, word, startRow, startCol, direction) {
    const wordLength = word.length;

    for (let i = 0; i < wordLength; i++) {
      const currentRow = direction === 'horizontal' ? startRow : startRow + i;
      const currentCol = direction === 'vertical' ? startCol : startCol + i;

      if (currentRow >= 0 && currentRow < board.length && currentCol >= 0 && currentCol < board[0].length) {
        board[currentRow][currentCol] = word[i];
      } else {
        // Handle the case where the word placement goes out of bounds
        // This can happen when the randomly chosen startRow or startCol is too close to the edge
        console.error('Error: Word placement out of bounds');
        // Optionally, you can choose to regenerate the board or handle this error in another way
      }
    }
  }

  function generateRandomWords(count) {
    const possibleWords = ['APPLE', 'BANANA', 'CHERRY', 'ORANGE', 'GRAPE', 'LEMON', 'MANGO', 'KIWI', 'PEAR', 'PLUM', 'WATERMELON', 'STRAWBERRY', 'BLUEBERRY'];
    return Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * possibleWords.length);
      return possibleWords.splice(randomIndex, 1)[0];
    });
  }

  function handleCellClick(row, col) {
    const clickedCell = { row, col };
  
    // Check if the game is already completed
    if (gameCompleted) {
      return;
    }
  
    const isCellSelected = selectedCells.some((cell) => cell.row === row && cell.col === col);
  
    if (isCellSelected) {
      // If the cell is already selected, remove it from selectedCells
      const updatedSelectedCells = selectedCells.filter((cell) => !(cell.row === row && cell.col === col));
      setSelectedCells(updatedSelectedCells);
    } else {
      // If the cell is not selected, add it to selectedCells
      const updatedSelectedCells = [...selectedCells, clickedCell];
      setSelectedCells(updatedSelectedCells);
  
      const selectedWord = getSelectedWord(updatedSelectedCells);
      const isWordFound = wordsToFind.includes(selectedWord);
  
      if (isWordFound) {
        handleWordFound(selectedWord);
      }
    }
  }
  

  function getSelectedWord(selectedCells) {
    const sortedCells = selectedCells.slice().sort((a, b) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return a.col - b.col;
    });

    return sortedCells.map((cell) => board[cell.row][cell.col]).join('');
  }

  function handleWordFound(word) {
    setFoundWords((prevFoundWords) => [...prevFoundWords, word]);
    setSelectedCells([]); // Clear selected cells to allow finding the next word
  }

  function showCongratulationMessage() {
    const playAgainConfirmation = window.confirm('Congratulations! You found all the words. Do you want to play again?');

    if (playAgainConfirmation) {
      setPlayAgain(!playAgain);
    }
  }

  return (
    <div className="word-search">
      {showWelcomeMessage && (
        <div className="welcome-message">
          <p>Welcome to the Word Searching game. Find all words to win!</p>
        </div>
      )}
      <table>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`${
                    selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex)
                      ? 'clicked-cell'
                      : ''
                  } ${
                    foundWords.some((foundWord) => foundWord === getSelectedWord(selectedCells))
                      ? 'found-word-cell'
                      : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="word-list">
        <h2>Words to Find</h2>
        <ul>
          {wordsToFind.map((word, index) => (
            <li key={index} className={foundWords.includes(word) ? 'found-word' : ''}>
              {word}
            </li>
          ))}
        </ul>
        <h2>Found Words</h2>
        <ul>
          {foundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordSearch;