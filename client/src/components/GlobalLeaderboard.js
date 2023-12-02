//css file here
import '../assets/stylesheets/GlobalLeaderboardStyleSheet.css';
import { useState, useEffect } from 'react';
import mainContractABI from '../assets/abi_files/MainContract.json';
import { ethers } from 'ethers';

const Globaleaderboard = (props) => {

    const [playerList, setPlayerList] = useState();

    const mainContract = '0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39';

    useEffect(() => {
        if(props.address){
            getGlobalLeaderboard();
        }
    }, [])

    const getGlobalLeaderboard = async() => {
        try{
            let abi = mainContractABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mainContract, abi, signer);
            console.log('getting global leaderboard');
            const playerList = await contract.getPlayerList();
            console.log(playerList);
            setPlayerList(playerList);
        }
        catch(err){
            console.log('error fetching global leaderboard');
        }
    }

    return(
        <div className='parent-global-leaderboard-container'>
            <p className='global-leaderboard-entry' >Global Leaderboard!</p>
            {props.address ? (
                <div>
                    <p className='global-leaderboard-entry' >Wallet is linked</p>
                </div>
            ) : (
                <p>Connect your wallet to see the leaderboard!</p>
            )}
        </div>
    )
}

export default Globaleaderboard;