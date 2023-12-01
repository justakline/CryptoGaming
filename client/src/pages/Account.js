import Header from '../components/header';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mainContractABI from '../assets/abi_files/MainContract.json';
import { ethers } from 'ethers';
import '../assets/stylesheets/AccountStyleSheet.css';

const Account = () => {
    let location = useLocation();
    const address = location.state.address;

    const mainContractAddress = '0xEDdede02b21e6747E34415a31500fe917eD2442f';

    const[profilePicture, setProfilePicture] = useState('');
    const[numGamesPlayed, setNumGamesPlayed] = useState(0);
    const[numWins, setNumWins] = useState(0);
    const[currentGame, setCurrentGame] = useState('');
    const[exists, setExists] = useState(false);

    useEffect(() => {
        try{
            getInfo();
        }
        catch(err){
            console.log(err);
        }
    }, [])

    const getInfo = async() => {
        let abi = mainContractABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(mainContractAddress, abi, signer);
        const transaction = await contract.getPlayerInfo();
        console.log('profile picture: ', transaction[0]);
        setProfilePicture(transaction[0]);
        console.log('num games played: ', parseInt(transaction[1], 16));
        setNumGamesPlayed(parseInt(transaction[1], 16));
        console.log('num wins: ', parseInt(transaction[2], 16));
        setNumWins(parseInt(transaction[2], 16));
        console.log('current game: ', transaction[3]);
        setCurrentGame(transaction[3]);
        console.log('exists: ', transaction[4]);
    }

    return(
        <div>
            <Header address={address} />
            <div className='parent-account-container'>
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
            </div>
        </div>
    )
}

export default Account;