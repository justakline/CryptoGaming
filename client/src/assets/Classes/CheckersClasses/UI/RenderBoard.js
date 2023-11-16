import React from 'react';
import Piece from '../State/Piece';
import Game from '../State/Game';
import PieceComponent from './PieceComponent'
import NoPieceComponent from './NoPieceComponent'
import './Checkers.css'
import { useState } from 'react';
import PlayerNumber from '../State/PlayerNumber';

const GameBoard = ({game, setGame}) => {
 
    const [selectedPiece, setSelectedPiece ] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(PlayerNumber.PLAYER_1)
  const renderBoard = () => {
    
    const board = game.getBoard()
    // console.log(board)

    //Go over the entire grid rows
    return  board.grid.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {/* Go over the colums */}
          {row.map((cell, colIndex) => (
            <div key={colIndex} className= {'board-cell ' + ((selectedPiece!= null && selectedPiece.row === rowIndex && selectedPiece.col === colIndex)? "selected": "")} onClick={() => onCellClick(rowIndex, colIndex)}>

            {
            cell?
              <PieceComponent piece={cell}/>
              :
              <NoPieceComponent />
            
          }
            </div>
          ))}
        </div>
      ));
   
        
    }; 
    const onCellClick = (row, col) => {

     
      const cell = game.getBoard().grid[row][col];
      // console.log(row + ", " + col)
    
      // If a piece is already selected, try to move it
      if (selectedPiece) { 
        //Deselect if already selected
        if (selectedPiece.row === row && selectedPiece.col === col) {
          setSelectedPiece(null);
        } else {


            const validMove = game.move( selectedPiece.row, selectedPiece.col, row, col, currentPlayer);
            if (validMove) {
              // Perform the move and update the state as necessary
              
              setSelectedPiece(null); // Deselect piece after move
              setCurrentPlayer(currentPlayer === PlayerNumber.PLAYER_1? PlayerNumber.PLAYER_2: PlayerNumber.PLAYER_1 )
            } else {
              console.log("errer")
              
              // If the move is invalid, keep the piece selected or show an error
            }



          // game.movePiece( selectedPiece.row, selectedPiece.col, row, col);
          //   // Perform the move and update the state as necessary
          //   setGame(game)
          //   setSelectedPiece(null); // Deselect piece after move
          //   setCurrentPlayer(currentPlayer === PlayerNumber.PLAYER_1? PlayerNumber.PLAYER_2: PlayerNumber.PLAYER_1 )
          //   console.log(`selected = ${selectedPiece.row}, ${selectedPiece.col}`)
        }

      } else if (cell) {

        // If no piece is selected and the cell clicked has a piece, select it
        setSelectedPiece({ row, col});
      }
      setGame(new Game(game))
    }
    
  

  return (
    <div className="game-board">
      {renderBoard()}
    </div>
  );
};




export default GameBoard;