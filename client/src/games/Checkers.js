import { useState } from 'react';
import GameBoard from '../assets/Classes/CheckersClasses/UI/RenderBoard'
import Game from '../assets/Classes/CheckersClasses/State/Game';
import InfoScreen from '../assets/Classes/CheckersClasses/UI/InfoScreen'
import "../assets/Classes/CheckersClasses/UI/Checkers.css"
const Checkers = () =>{
    const [game, setGame] = useState(new Game());
    return (
        <div className="checkers">
            <GameBoard game = {game} setGame={setGame} />
            <InfoScreen game={game} />
        </div>
    )

    

}

export default Checkers;