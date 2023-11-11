import React from 'react';
import Piece from '../State/Piece';
import Game from '../State/Game';
import PieceComponent from './PieceComponent'
import NoPieceComponent from './NoPieceComponent'
import './RenderBoard.css'

const GameBoard = ({ game, onCellClick }) => {
  const renderBoard = () => {
    const game = new Game()
    const board = game.getBoard()
    console.log(board)

    //Go over the entire grid rows
    return  board.grid.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {/* Go over the colums */}
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="board-cell" onClick={() => {} /*onCellClick(rowIndex, colIndex)*/}>
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
  

  return (
    <div className="game-board">
      {renderBoard()}
    </div>
  );
};

export default GameBoard;