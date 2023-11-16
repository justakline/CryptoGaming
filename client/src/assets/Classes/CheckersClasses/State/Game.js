import Board from './Board'
import PlayerNumber from './PlayerNumber'

class Game {
    //Simulate overloading a constructor
    constructor(existingGame) {

      if(existingGame instanceof Game){
        this.board = existingGame.getBoard()
        this.currentPlayer = existingGame.getCurrentPlayer()
      }else{
         this.board = new Board();
        this.currentPlayer = PlayerNumber.PLAYER_1;
      }
     
    }


    
    //Simple enough
    switchPlayer() {
      this.currentPlayer = this.currentPlayer === PlayerNumber.PLAYER_1 ? PlayerNumber.PLAYER_2 : PlayerNumber.PLAYER_1;
    }

    getCurrentPlayer(){
      return this.currentPlayer
    }
  
  
    isValidMove(fromRow, fromCol, toRow, toCol, player) {
      const piece = this.board.getPiece(fromRow, fromCol);

      //Can't jump to a piece that is already there
      if(this.board.getPiece(toRow, toCol) != null){
        console.log("Cant jump to a piece already there")
        return false
      }

      //If out of bounds
      if(fromRow < 0 || fromRow >= 8 ||fromCol < 0 || fromCol >= 8 || toRow < 0 || toRow >= 8 ||toCol < 0 || toCol >= 8){
        return false;
      }

      //There is no piece here
      if(!piece){
        return false;
      }
    
      //Can only move your own piece
      if(!piece.belongsTo(player)){
        console.log("Can only move your piece")
        return false;
      }

    let [dRow, dCol] = [toRow - fromRow, toCol -fromCol];

    //You can either do a simple move or a jump, so anything more than 2 is wrong
      if(Math.abs(dRow) > 2 || Math.abs(dCol) >2){
        console.log("Can't move that far")
        return false;
      }


      //Now testing for a valid move

      if(piece.isKing()){

        if(player === PlayerNumber.PLAYER_1){
             //SIMPLE TURN   Player one moves up or down and either to the right or left, we already know where we are jumping to is empty
             if(Math.abs(dRow) === 1){ 
                if(dCol === 1 || dCol === -1) {
                  return true
                }
                console.log("Can move left and right only 1 for a simple turn")
                return false
            }
            //CAPTURING TURN  Player one can move 2 places up or down
            else if(Math.abs(dRow) === 2){
                //Down jump
                if(dRow > 0){
                    //DownLeft Jump
                    if(dCol < 0){
                        this.capturePiece = this.board.getPiece(fromRow +1, fromCol -1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                    }
                    
                    //DownRight Jump
                    else {
                        this.capturePiece = this.board.getPiece(fromRow +1, fromCol +1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                    }
                }
                //up Jump
                else{
                
                    //UpLeft Jump
                    if(dCol < 0){
                        this.capturePiece = this.board.getPiece(fromRow -1, fromCol -1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                    }
                    
                    //UpRight Jump
                    else {
                        this.capturePiece = this.board.getPiece(fromRow -1, fromCol +1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                    }
                 }
               
            }
            

        }else{

              //SIMPLE TURN   Player 2 moves up or down and either to the right or left, we already know where we are jumping to is empty
            if(Math.abs(dRow) === 1){ 
                if(dCol === 1 || dCol === -1) {
                  return true
                }
                console.log("Can move left and right only 1 for a simple turn")
                return false
            }
            //CAPTURING TURN  Player 2 can move 2 places up or down
            else if(Math.abs(dRow) === 2){
                //Down jump
                if(dRow > 0){
                    //DownLeft Jump
                    if(dCol < 0){
                        this.capturePiece = this.board.getPiece(fromRow + 1, fromCol -1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                    }
                    
                    //DownRight Jump
                    else {
                        this.capturePiece = this.board.getPiece(fromRow + 1, fromCol +1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                    }
                }
                //up Jump
                else{
                
                    //UpLeft Jump
                    if(dCol < 0){
                        this.capturePiece = this.board.getPiece(fromRow -1, fromCol -1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                    }
                    
                    //UpRight Jump
                    else {
                        this.capturePiece = this.board.getPiece(fromRow -1, fromCol +1)
                        return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                    }
                 }
               
            }
            




        }

      }
      
      //Piece is not the king
      else{

        if(player === PlayerNumber.PLAYER_1){

            //SIMPLE TURN   Player one moves up and either to the right or left, we already know where we are jumping to is empty
            if(dRow === 1){
                return (dCol === 1 || dCol === -1) 
            }
            //CAPTURING TURN  Player one can move 2 places up
            else if(dRow === 2){
                //left jump
                if(dCol < 0){
                    this.capturePiece = this.board.getPiece(fromRow +1, fromCol -1)

                    //If the capture piece exosts and it is their piece
                    return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                }
                //Right Jump
                else{
                    this.capturePiece = this.board.getPiece(fromRow +1, fromCol +1)

                    //If the capture piece exosts and it is their piece
                    return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_2)
                }
               
            }
            
        }else{
            //SIMPLE TURN   Player 2 moves down and either to the right or left, we already know where we are jumping to is empty
            if(dRow === -1){
                return (dCol === 1 || dCol === -1) 
            }

            //CAPTURING TURN  Player 2 can move 2 places down
            else if(dRow === -2){
                //left jump
                if(dCol < 0){
                    this.capturePiece = this.board.getPiece(fromRow -1, fromCol -1)

                    //If the capture piece exosts and it is their piece
                    return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                }
                //Right Jump
                else{
                    this.capturePiece = this.board.getPiece(fromRow -1, fromCol +1)

                    //If the capture piece exosts and it is their piece
                    return this.capturePiece && this.capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                }
               
            }

        }

      }

      //Default to it being a false move
      return false;

    }
  
    // Method to move a piece if the move is valid
    move(fromRow, fromCol, toRow, toCol, player) {

      if (this.isValidMove(fromRow, fromCol, toRow, toCol, player)) {
        this.movePiece(fromRow, fromCol, toRow, toCol);
        console.log("Valid")
        this.switchPlayer();
        return true
      } else {
        return false
        // throw new Error('Invalid move');
       
      }
    }

      //Will move the piece and capture
    movePiece(fromRow, fromCol, toRow, toCol){
      
      // Remove the captured peice
      if(Math.abs(fromRow - toRow) == 2){
        const captureRow = fromRow-toRow < 0? toRow-1 : fromRow -1  
        const captureCol = fromCol-toCol < 0? toCol-1 : fromCol -1  
        console.log("Jump")
       
        this.board.getBoard().grid[captureRow][captureCol] = null
      }

      //Move
      this.board.movePiece(fromRow, fromCol, toRow, toCol)
    

    }
    

    //returns the 8x8 matrix with pieces as each index
    getBoard(){
      return this.board;
    }

    
  }

  export default Game;