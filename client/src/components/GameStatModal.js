import '../assets/stylesheets/GameStatModalStyleSheet.css'
import ColorGuessTempABI from '../assets/abi_files/ColorGuessABI_Files/ColorGuessTempContract.json'
import MoonLoader from 'react-spinners/MoonLoader';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const GameStateModal = (props) => {

    const [fetching, setFetching] = useState();
    const [difficulty, setDifficulty] = useState();
    const [player, setPlayer] = useState();
    const [wager, setWager] = useState();
    const [status, setStatus] = useState();
    const [gameName, setGameName] = useState();
    const [error, setError] = useState(false);

    const tempWei = 1000000000000000000;
    // const wei = BigInt(tempWei);

    useEffect(() => {
        fetchGameStats();
    }, [props.game]);

    const fetchGameStats = async() => {
        try{
            setFetching(true);
            const { ethereum } = window;
            let abi = ColorGuessTempABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.game, abi, signer);
            console.log('getting game stats');

            try{
                let temp = await contract.getWagerAmmount();
                setWager(temp/tempWei);
                console.log('wager ' + temp/tempWei);

                temp = await contract.getDifficulty();
                setDifficulty(temp.toString());
                console.log('difficulty ' + temp);

                temp = await contract.getPlayer();
                setPlayer(temp.toString());
                console.log('player ' + temp);

                temp = await contract.getStatus();
                setStatus(temp.toString());
                console.log('status ' + temp);

                temp = await contract.getGameName();
                setGameName(temp.toString());
                console.log('game name ' + temp);
            }
            catch(err){
                setError(true);
                console.log(err);
            }

            setFetching(false);
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className='parent'>
            <div className='modal-container'>
                {error ? (
                    <h3>There was an error getting that game</h3>
                ) : (
                    <div>
                        <h2 onClick={props.handleClose}>Game: {props.game}</h2>
                        <h3>Game: {gameName}</h3>
                        <h3>Difficulty: {difficulty}</h3>
                        <h3>Player: {player}</h3>
                        <h3>Wager: {wager}</h3>
                        <h3>Status: {status}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GameStateModal;