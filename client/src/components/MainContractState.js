import { useState, useEffect } from 'react';
import '../assets/stylesheets/MainContractState.css';

const MainContractState = (props) => {

    //GAME SELECTOR SHARES THE SAME CLASS NAME 'GAME-CONTAINER' SO THE BORDER FOR THE CURRENT AND ALL GAMES IS LINKED TO THAT NAME
    return(
        <div className='game-container'>
            <div className='current-game-container'>
                <p className='current-game-entry'>Current Games Being Played!</p>
                {props.address ? (<p>something</p>) : (
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