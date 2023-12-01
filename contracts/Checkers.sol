import Board from './Board';
import PlayerNumber from './PlayerNumber';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Checkers{

    Board public board;
    PlayerNumber public currentPlayer;
    event InvalidMove (String err);

    constructor(Checkers existingGame){


        board = Board();
        currentPlayer = PlayerNumber.PLAYER_1;
    }

    function switchPlayer() public {
        if(currentPlayer == PlayerNumber.PLAYER_1){
            currentPlayer = PlayerNumber.PLAYER_2;
        }else{
            currentPlayer = PlayerNumber.PLAYER_1;
        }
    }   

    function getCurrentPlayer() returns (PlayerNumber){
        return currentPlayer;
    }


    function isValidMore(int fromRow, int fromCol, int toRow, int intCol, PlayerNumber player){
        Piece piece = board.getPiece(fromRow, fromCol);
        if(board.getPiece(toRow, toCol) == PlayerNumber.NULL){
            emit InvalidMove("Can not Jump to a piece that is already there");
            return false;
        }
         if(fromRow <0 || fromRow >7  ||toRow <0 || toRow >7  || fromCol <0 || fromCol >7  ||  toCol <0 || toCCol >7 ){
            emit InvalidMove("Can not Jump off the board");
            return false;
        }
         if(piece.belongsTo(PlayerNumber.NULL)){
            emit InvalidMove("Can not move a no piece");
            return false;
        }
         if(!piece.belongsTo(player)){
            emit InvalidMove("Can not move other person's piece");
            return false;
        }

        int dRow = toRow-fromRow;
        int dCol = toCol-fromCol;
        if(abs(dRow) > 2 || abs(dCol) > 2){
            emit InvalidMove("Can't move that far");
            return false;
        }
        if(piece.isKing()){

            if(player == PlayerNumber.PLAYER_1){
                //SIMPLE TURN   Player one moves up or down and either to the right or left, we already know where we are jumping to is empty
                if(abs(dRow) == 1){ 
                    if(dCol == 1 || dCol == -1) {
                    return true;
                    }
                    emit InvalidMove("Can move left and right only 1 for a simple turn");
                    return false;
                }
                //CAPTURING TURN  Player one can move 2 places up or down
                else if(Math.abs(dRow) == 2){
                    //Down jump
                    if(dRow > 0){
                        //DownLeft Jump
                        if(dCol < 0){
                            Piece capturePiece = board.getPiece(fromRow +1, fromCol -1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                        
                        //DownRight Jump
                        else {
                        Piece capturePiece = board.getPiece(fromRow +1, fromCol +1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                    }
                    //up Jump
                    else{
                    
                        //UpLeft Jump
                        if(dCol < 0){
                            Piece capturePiece = board.getPiece(fromRow -1, fromCol -1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                        
                        //UpRight Jump
                        else {
                        Piece capturePiece = board.getPiece(fromRow -1, fromCol +1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                    }
                
                }
            

            }else{

                //SIMPLE TURN   Player 2 moves up or down and either to the right or left, we already know where we are jumping to is empty
                if(Math.abs(dRow) == 1){ 
                    if(dCol == 1 || dCol == -1) {
                    return true;
                    }
                    emit InvalidMove("Can move left and right only 1 for a simple turn");
                    return false;
                }
                //CAPTURING TURN  Player 2 can move 2 places up or down
                else if(Math.abs(dRow) === 2){
                    //Down jump
                    if(dRow > 0){
                        //DownLeft Jump
                        if(dCol < 0){
                            Piece capturePiece = board.getPiece(fromRow + 1, fromCol -1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                        
                        //DownRight Jump
                        else {
                            Piece capturePiece = board.getPiece(fromRow + 1, fromCol +1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                    }
                    //up Jump
                    else{
                    
                        //UpLeft Jump
                        if(dCol < 0){
                            Piece capturePiece = board.getPiece(fromRow -1, fromCol -1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                        
                        //UpRight Jump
                        else {
                        Piece capturePiece =board.getPiece(fromRow -1, fromCol +1);
                            return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                    }
                
                }
                




            }           


        } //Piece is not the king
      else{

        if(player == PlayerNumber.PLAYER_1){

            //SIMPLE TURN   Player one moves up and either to the right or left, we already know where we are jumping to is empty
            if(dRow == 1){
                return (dCol == 1 || dCol == -1) ;
            }
            //CAPTURING TURN  Player one can move 2 places up
            else if(dRow == 2){
                //left jump
                if(dCol < 0){
                    Piece capturePiece = board.getPiece(fromRow +1, fromCol -1);

                    //If the capture piece exosts and it is their piece
                    return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                }
                //Right Jump
                else{
                    Piece capturePiece = board.getPiece(fromRow +1, fromCol +1);

                    //If the capture piece exosts and it is their piece
                    return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                }
               
            }
            
        }else{
            //SIMPLE TURN   Player 2 moves down and either to the right or left, we already know where we are jumping to is empty
            if(dRow == -1){
                return (dCol == 1 || dCol == -1) ;
            }

            //CAPTURING TURN  Player 2 can move 2 places down
            else if(dRow == -2){
                //left jump
                if(dCol < 0){
                   Piece capturePiece = board.getPiece(fromRow -1, fromCol -1)

                    //If the capture piece exosts and it is their piece
                    return capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                }
                //Right Jump
                else{
                    Piece capturePiece = board.getPiece(fromRow -1, fromCol +1)

                    //If the capture piece exosts and it is their piece
                    return capturePiece.belongsTo(PlayerNumber.PLAYER_1)
                }
               
            }

        }

      }

      //Default to it being a false move
      return false;






    }
    function move(int fromRow, int fromCol, int toRow, int toCol, PlayerNumber player) public returns (bool){
        if(isValidMore(fromRow, fromCol, toRow, toCol, player)){
            movePiece(fromRow, fromCol, toRow, toCol);
            return true;
        }
        return false;
    }

    function movePiece(int fromRow, int fromCol, int toRow, int toCol) internal {
        if(abs(fromRow-toRow) == 2){
            int captureRow = fromRow-toRow < 0? toRow-1 : fromRow -1 ;
            int captureCol = fromCol-toCol < 0? toCol-1 : fromCol -1 ;
            board.getBoard()[captureRow][captureCol] = PlayerNumber.NULL;
        }
        board.movePiece(fromRow, fromCol,toRow, toCol);
    }

    public abs(int value) public pure returns(int){
        if(value < 0)
            return value*-1;
        return value;
    }







}