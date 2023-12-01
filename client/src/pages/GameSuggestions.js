import { useState, useEffect } from "react";
import Header from "../components/header";
import { useLocation } from "react-router-dom";
import '../assets/stylesheets/GameSuggestionsStyleSheet.css';

const GameSuggestions = () => {
    const [gameName, setGameName] = useState('');
    const [gameDescription, setGameDescription] = useState('');

    const gameSuggestionsContract = '0x48203614dd0B216C44D9FB7f1Eb1fC1273233b5a';

    let location = useLocation();
    let address = location.state.address;
    return(
        <div>
            <Header address={address}/>
            <div className='parent'>
                <div className='form-container'>
                    <h1>Have an idea for a game?</h1>
                    <h1>Enter it here!</h1>
                    <input className='form-entry' type='text' placeholder='Game Name' onChange={(e) => {setGameName(e.target.value)}}/>
                    <input className='form-entry' placeholder='Game Description' onChange={(e) => {setGameDescription(e.target.value)}}/>
                    <button className='submit-btn'>Submit Idea</button>
                </div>
            </div>
        </div>
    )
}

export default GameSuggestions;