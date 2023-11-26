import { useState, useEffect } from 'react';
import '../assets/stylesheets/MainContractState.css';
import MainContractABI from '../assets/abi_files/MainContract.json';
import { ethers } from 'ethers';

const MainContractState = (props) => {

    const mainContract = '0x1e4d96d215bcab7329D37BBFAa116dB77cc7ddBb'

    const [currentGames, setCurrentGames] = useState([]);

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
            // const gameHistory = await contract.getGameHistory();
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
        <div className='game-container'>
            <div className='current-game-container'>
                <p className='current-game-entry'>Current Games Being Played!</p>
                {props.address ? (
                    currentGames.map((game) => {
                        return(
                            <div className='game-entry'>
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
                {props.address ? (<p>something</p>) : (
                        <p>Connect your wallet to see games being played!</p>
                )}
            </div>
        </div>
    )
}

export default MainContractState;