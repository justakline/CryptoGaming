
import PieceType from './PieceType'
//Represents a piece, we can make King, decide whose piece it is and blah blah blah

class Piece {
    constructor(player) {
      this.player = player;
      this.type = PieceType.REGULAR;
    }
  
    makeKing() {
      this.type = PieceType.KING;
    }
  
    isKing() {
      return this.type === PieceType.KING;
    }
  
    belongsTo(player) {
      return this.player === player;
    }
  }
  export default Piece;