import Header from '../components/header';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mainContractABI from '../assets/abi_files/MainContract.json';
import { ethers } from 'ethers';
import '../assets/stylesheets/AccountStyleSheet.css';

const Account = () => {
    let location = useLocation();
    const address = location.state.address;

    const mainContractAddress = '0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39';

    const[profilePicture, setProfilePicture] = useState('');
    const[numGamesPlayed, setNumGamesPlayed] = useState(0);
    const[numWins, setNumWins] = useState(0);
    const[currentGame, setCurrentGame] = useState('');
    const[exists, setExists] = useState(false);

    useEffect(() => {
        try{
            console.log('address: ', address);
            getInfo();
        }
        catch(err){
            console.log(err);
        }
    }, [])

    const getInfo = async() => {
        try{
            let abi = mainContractABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mainContractAddress, abi, signer);
            let transaction = await contract.getPlayerList();
            // address id;
            // string profilePicture; //holds ipfs hash
            // uint256 numGamesPlayed;
            // uint256 numWins;
            // Game currentGame;
            // bool exists;
            console.log('transaction: ', transaction);
            transaction.forEach(async (player) => {
                if(player.id.toLowerCase() === address.toLowerCase()){
                    console.log('found player');
                    setProfilePicture(player.profilePicture);
                    setNumGamesPlayed(parseInt(player.numGamesPlayed._hex, 16));
                    setNumWins(parseInt(player.numWins._hex, 16));
                    setCurrentGame(player.currentGame);
                    setExists(player.exists);
                }
            })
        }
        catch(err){
            console.log('error in getInfo: ', err);
        }
    }

    return(
        <div>
            <div className='parent-account-container'>
                {exists === true || exists !== '0x0000000000000000000000000000000000000000' ? (
                    <div className='stats-container'>
                        <h2 className='stats-entry'>Player: {address}</h2>
                        <h3 className='stats-entry' >Games Played: {numGamesPlayed}</h3>
                        <h3 className='stats-entry' >Wins: {numWins}</h3>
                        {currentGame === '0x0000000000000000000000000000000000000000' ? (
                            <h3 className='stats-entry' >Current Game: None</h3>
                        ) : (
                            <h3 className='stats-entry' >Current Game: {currentGame}</h3>
                        )}
                    </div>
                ) : (
                    <div className='stats-container'>
                        <h2 className='stats-entry' style={{color: 'black'}} >You havent played any matches yet!</h2>
                        <h2 className='stats-entry' style={{color: 'black'}} >Start playing for your stats to appear here!</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Account;