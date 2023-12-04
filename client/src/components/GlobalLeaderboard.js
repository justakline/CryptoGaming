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
    }, [props.address])

    const getGlobalLeaderboard = async() => {
        try{
            let abi = mainContractABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mainContract, abi, signer);
            console.log('getting global leaderboard');
            const transaction = await contract.getPlayerList();
            console.log(transaction);
            setPlayerList(transaction);
        }
        catch(err){
            console.log('error fetching global leaderboard: ', err);
        }
    }

    return(
        <div className='parent-global-leaderboard-container'>
            <p className='global-leaderboard-title' >Global Leaderboard!</p>
            {props.address ? (
                playerList ? (
                    playerList.map((player) => {
                        return(
                            <p className='global-leaderboard-entry'>{player.id} | wins: {parseInt(player.numWins._hex, 16)}</p>
                        )
                    })
                ) : (
                    <p>Trying to get the leaderboard!</p>
                )
            ) : (
                <p>Link your wallet to see your rank!</p>
            )}
        </div>
    )
}

export default Globaleaderboard;