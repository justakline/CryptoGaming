import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import ColorGuess from './games/ColorGuess';
import Checkers from './games/Checkers';
import WordSearch from './games/WordSearch';
import TicTacToe from './games/TicTacToe';

const App = () => {
    return(
        <div>
            <BrowserRouter >
                {" "}
                <Routes>
                    <Route exact path="/" element={<Home />} />{" "}
                    <Route exact path="/color-guess" element={<ColorGuess />} />{" "}
                    <Route exact path="/checkers" element={<Checkers />} />{" "}
                    <Route exact path="/word-search" element={<WordSearch />} />{" "}
                    <Route exact path="/tic-tac-toe" element={<TicTacToe />} />{" "}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;