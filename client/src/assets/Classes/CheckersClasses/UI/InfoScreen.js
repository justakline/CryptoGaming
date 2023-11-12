import PlayerNumber from '../State/PlayerNumber'
import './Checkers.css'

const InfoScreen = ({game,}) => {


    const currentPlayer = game.getCurrentPlayer();
    const playerColor = currentPlayer === PlayerNumber.PLAYER_1? "Red": "Black"
    // const playerOnePieces = game.getPieceCount(PlayerNumber.PLAYER_1);
    // const playerTwoPieces = game.getPieceCount(PlayerNumber.PLAYER_2);

    return (
        <div className="info-screen">
            <h2>Checkers Game Info</h2>
            <div className={playerColor}>Current Player: {currentPlayer === PlayerNumber.PLAYER_1 ? 'Player 1' : 'Player 2'}</div>
            {/* <div>Pieces Remaining:</div>
            <ul>
                <li>Player 1: {playerOnePieces}</li>
                <li>Player 2: {playerTwoPieces}</li>
            </ul> */}
            {/* Add any other game info you want to display here */}
        </div>
    );
}

export default InfoScreen;