import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import ColorGuess from './games/ColorGuess';
import Checkers from './games/Checkers';
import WordSearch from './games/WordSearch';
import TicTacToe from './games/TicTacToe';
import GameSuggestions from './pages/GameSuggestions';
import Account from './pages/Account';
import Header from './components/header';
import { useState, useEffect } from 'react';

const App = () => {

    const [address, setAddress] = useState('');

    const handleLinkWallet = async() => {
        const { ethereum } = window;
        if(!ethereum){
            console.log("Make sure you have metamask!");
            return;
        }

        try{
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length !== 0){
                const account = accounts[0];
                setAddress(account);
                // fetchCurrentGames();
            }
            else{
                console.log("no account found!");
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <div>
            <Header address={address} handleLinkWallet={handleLinkWallet}/>
            <BrowserRouter >
                {" "}
                <Routes>
                    <Route exact path="/" element={<Home address={address}/>} />{" "}
                    <Route exact path="/color-guess" element={<ColorGuess />} />{" "}
                    <Route exact path="/checkers" element={<Checkers />} />{" "}
                    <Route exact path="/word-search" element={<WordSearch />} />{" "}
                    <Route exact path="/tic-tac-toe" element={<TicTacToe />} />{" "}
                    <Route exact path="/game-suggestion" element={<GameSuggestions />} />{" "}
                    <Route exact path="/your-account" element={<Account />} />{" "}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;