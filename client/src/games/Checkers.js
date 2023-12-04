import { useState } from 'react';
import GameBoard from '../assets/Classes/CheckersClasses/UI/RenderBoard'
import Game from '../assets/Classes/CheckersClasses/State/Game';
import InfoScreen from '../assets/Classes/CheckersClasses/UI/InfoScreen'
import "../assets/Classes/CheckersClasses/UI/Checkers.css"
import abi from '../assets/abi_files/Checkers.json'
const Checkers = () =>{

    const checkersAddress = '0x5B344B85336C36Da5Fa49b15b199d3674641C44D'
    const trackerAddress = '0x33c71836bD74D542D5D37b5E09b625652901b6B1'
    // const abi = abi

    const [game, setGame] = useState(new Game());
    return (
        <div className="checkers">
            <GameBoard game = {game} setGame={setGame} />
            <InfoScreen game={game} />
        </div>
    )

    

}

export default Checkers;