
import React from "react";
import PlayerNumber from "../State/PlayerNumber";
class PieceComponent extends React.Component {
    render() {
      const { piece } = this.props;
      // Render the piece based on its properties
        // Basic styles for pieces
    const pieceStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: piece.player === PlayerNumber.PLAYER_1 ? 'red' : 'black',
        color: 'white',
        fontSize: '20px',
      };
      return (
        <div style={pieceStyle}>
        {piece.isKing && 'K'} {/* Display 'K' for king pieces */}
        </div>
      );
    }
  }

  export default PieceComponent