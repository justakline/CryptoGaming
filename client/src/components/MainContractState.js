import { useState, useEffect } from 'react';
import '../assets/stylesheets/MainContractState.css';
import MainContractABI from '../assets/abi_files/MainContract.json';
import { ethers } from 'ethers';
import GameStateModal from './GameStatModal';

const MainContractState = (props) => {

    const mainContract = '0xEA1A1C0d576E1aF072c4FE96A66A4f76B8C7325b'

    const [currentGames, setCurrentGames] = useState([]);
    const [gameHistory, setGameHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [clickedGame, setClickedGame] = useState('');

    const handleClick = (g) => {
        setClickedGame(g);
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    useEffect(() => {
        fetchGameHistory();
        fetchCurrentGame();
    }, [])

    const fetchGameHistory = async() => {
        try{
            const { ethereum } = window;
            let abi = MainContractABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mainContract, abi, signer);
            console.log('getting game history');
            const gameHistory = await contract.getGamesPlayed();
            setGameHistory(gameHistory);
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchCurrentGame = async() => {
        try{
            const { ethereum } = window;
            let abi = MainContractABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mainContract, abi, signer);
            console.log('getting current games');
            const currentGames = await contract.getCurrentGames();
            console.log(currentGames);
            setCurrentGames(currentGames);
        }
        catch(err){
            console.log(err);
        }
    }
    
    //GAME SELECTOR SHARES THE SAME CLASS NAME 'GAME-CONTAINER' SO THE BORDER FOR THE CURRENT AND ALL GAMES IS LINKED TO THAT NAME
    return(
        <div>
            {showModal && <GameStateModal handleClose={handleClose} game={clickedGame}/>}
            <div className='game-container'>
                <div className='current-game-container'>
                    <p className='current-game-entry'>Current Games Being Played!</p>
                    {props.address ? (
                        currentGames.map((game) => {
                            return(
                                <div key={game} className='game-entry' onClick={() => {
                                    handleClick(game);
                                }} >
                                    <p>{game}</p>
                                </div>
                            )
                        })
                    ) : (
                            <p>Connect your wallet to see games being played!</p>
                    )}
                </div>
                <div className='all-games-container'>
                    <p className='all-games-entry'>All Games That Have Been Played!</p>
                    {props.address ? (
                        gameHistory.map((game) => {
                            return(
                                <div key={game} className='games-entry' onClick={() => {
                                    handleClick(game);
                                }} >
                                    <p>{game}</p>
                                </div>
                            )
                        })
                    ) : (
                            <p>Connect your wallet to see games being played!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainContractState;