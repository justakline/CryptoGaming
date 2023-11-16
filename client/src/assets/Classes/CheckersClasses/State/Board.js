
import Piece from './Piece';
import PlayerNumber from './PlayerNumber';

class Board {
    constructor() {
      this.grid = this.createBoard();
    }
  
    createBoard() {
      const rows = 8;
      const cols = 8;
      let board = new Array(rows)
  
      for (let row = 0; row < rows; row++) {
        board[row] = new Array(cols)
        for (let col = 0; col < cols; col ++) {
          if (row <= 2 && ((row%2 ==0 && col %2 ==0) ||  (row%2 ==1 && col %2 ==1))){ // all of the red ones in every other col
             board[row][col] = new Piece(PlayerNumber.PLAYER_1); //The first 3 rows
        
         }
          else if (row >= 5 && ((row%2 ==0 && col %2 ==0) ||  (row%2 ==1 && col %2 ==1))) {
            board[row][col] = new Piece(PlayerNumber.PLAYER_2); //Last 3 rows
          } else board[row][col] = null;
        }
      }
  
      return board;
    }
  
    //not caring about the rules here, that will be done somewhere else, only worrying about moving the state
    movePiece(fromRow, fromCol, toRow, toCol) {
        //Moving piece
        
        console.log(this.grid)
      const piece = this.grid[fromRow][fromCol];



      // console.log(fromRow +", " + fromCol +" -> " + toRow +", " + toCol  )
      // console.log(piece);
      this.grid[fromRow][fromCol] = null;
      //  console.log("here")
      this.grid[toRow][toCol] = piece;
      // console.log(piece);
  
      // Check if piece should be kinged
      console.log(this.grid)
      if (piece && ((piece.belongsTo(PlayerNumber.PLAYER_1) && toRow === 7) || (piece.belongsTo( PlayerNumber.PLAYER_2) && toRow === 0))) {
        piece.makeKing();
      }
    }
  
    getPiece(row, col) {
      return this.grid[row][col];
    }

    getBoard(){
      return this;
    }
  

  }

  export default Board;