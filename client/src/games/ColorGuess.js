import style from '../assets/stylesheets/ColorGuessStylesheet.module.css'
import {useState, useEffect} from 'react';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import colorGuessABI from '../assets/abi_files/ColorGuess.json';
import useCountdown from '../hooks/useCountDown';

//EASY: All hex colors are different. pays 1:1
//MEDIUM: 1 Chunk of the hex values are the same. pays 2:1
//HARD: 2 Chunks of the hex values are the same. pays 3:1
//IMPOSSIBLE: only 1 hex digit is different. pays 4:1
const ColorGuess = () => {
    let location = useLocation();
    let address = location.state.address;

    const [color, setColor] = useState('');
    const [colorOptions, setColorOptions] = useState([]);
    const [guesses, setGuesses] = useState(0);
    const [ready, setReady] = useState(false);
    const [score, setScore] = useState(0);
    const {seconds, start, isActive} = useCountdown();
    const [difficulty, setDifficulty] = useState('');
    const [numDifficulty, setNumDifficulty] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [wager, setWager] = useState(0);
    const [hasWagered, setHasWagered] = useState(false);

    useEffect(() => {
        if((seconds === 0 && isActive) || guesses === 5){
            checkEndGame();
        }
    }, [seconds]);

    const handleColorChange = (myColor) => {
        console.log('myColor: ', myColor);
        const hexDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A','B','C','D','E','F'];
        if(!difficulty || difficulty === 'easy'){
            return new Array(6).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
        }
        else if(difficulty === 'medium'){
            console.log('inside medium function');
            let firstTwoDigits = myColor[1] + myColor[2];
            let restOfDigits = new Array(4).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            return firstTwoDigits.concat(restOfDigits);
        }
        else if(difficulty === 'hard'){
            let firstFourDigits = myColor[1] + myColor[2] + myColor[3] + myColor[4];
            let restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = '#' + firstFourDigits.concat(restOfDigits);
            while(finalArray === color){
                restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = '#' + firstFourDigits.concat(restOfDigits);
            }
            let returnArray = finalArray.split('#').pop();
            return returnArray;
        }
        else if(difficulty === 'impossible'){
            console.log('colorOptions[1]: ', colorOptions[1]);
            let firstFiveDigits = myColor[1] + myColor[2] + myColor[3] + myColor[4] + myColor[5];
            let restOfDigits = new Array(1).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            while(finalArray === color || finalArray === colorOptions[1]){
                restOfDigits = new Array(1).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            }
            // let returnArray = finalArray.split('#').pop();
            return finalArray;
        }
    }

    const handleColorSelection = (guessedColor) => {
        if(ready){
            setGuesses(guesses + 1);
            if(guessedColor === color){
                setScore(score + 1);
                document.getElementById(`${guesses + 1}`).style.backgroundColor = 'green';
            }
            else{
                document.getElementById(`${guesses + 1}`).style.backgroundColor = 'red';
            }
            checkEndGame();
        }
        else{
            alert('Please start the game first');
        }
    }

    const checkEndGame = () => {
        if(guesses === 5){
            setGuesses(6);
            start(0);
            alert('Game Over - Score: ' + score);
            setFinished(true);
            setGameComplete(true);
        }
        else{
            handleSetColorOptions();
        }
    }

    const handleSetColorOptions = () => {
        const myColor = handleSetColor();
        setColor('#' + myColor);
        setColorOptions(['#' + myColor, '#' + handleColorChange('#' + myColor), '#' + handleColorChange('#' + myColor)]);
    }

    const handleSetDifficulty = (difficulty) => {
        setDifficulty(difficulty);
        if(difficulty === 'easy'){
            setNumDifficulty(2);
        }
        else if(difficulty === 'medium'){
            setNumDifficulty(3);
        }
        else if(difficulty === 'hard'){
            setNumDifficulty(4);
        }
        else if(difficulty === 'impossible'){
            setNumDifficulty(5);
        }
    }

    const handleSetColor = () => {
        const hexDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A','B','C','D','E','F'];
        return new Array(6).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
    }

    const handleSetWager = (wager) => {
        setWager(wager);
    }

    const handleSubmitWager = () => {
        if(wager <= 0 || wager > .05){
            alert('Please enter a wager between 0 and .05');
        }
        else{
            setHasWagered(true);
            console.log('wager: ', wager);
        }
    }

    const startGame = () => {
        console.log('difficulty: ', difficulty);
        console.log('hasWagered: ', hasWagered);
        console.log(!difficulty && hasWagered == false);
        if(!difficulty || hasWagered == false){
            !difficulty ? alert('Please choose a difficulty') : alert('Please wager');
        }
        else{
            start(30);
            setColor('#' + handleSetColor());
            setReady(true);
            setGameStarted(true);
            checkEndGame();
        }
    }

    {/* <input type="number" placeholder="Wager" onChange={(e) => handleWager(e.target.value)}></input>
                <button onClick={() => submitWager()}>Wager</button>
                <button onClick={() => getBalance()}>Get Balance</button> */}
                {/* <button onClick={() => loadContract()}>Load Contract</button> */}

    return(
        <div>
        <Header address={address} />
        <div className={style.gameContainer}>
            <div>
                {hasWagered ? (<h2 style={{color: 'white'}}>Wagering {wager} sepolia</h2>) : (
                    <div id='wager'>
                        <input type='number' placeholder="Wager" onChange={(e) => handleSetWager(e.target.value)}></input>
                        <button onClick={() => handleSubmitWager()}>Wager</button>
                    </div>
                )}
                {!difficulty ? (<h1 style={{color: 'white'}}>Choose a difficulty</h1>) : <h1 style={{color: 'white'}}>Difficulty: {difficulty}</h1> }
                {!difficulty ? (
                <div className={style.colorGuessContainer}>
                    {/* <h1 style={{color: 'white'}}>Choose a difficulty</h1>  */}
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('easy')}>EASY</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('medium')}>MEDIUM</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('hard')}>HARD</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('impossible')}>IMPOSSIBLE</button>
                </div>) : (
                    gameComplete ? (<div className={style.timer}>GAME OVER</div>) : (
                        gameStarted ? (
                            seconds === 0 ?  (<div className={style.timer}>Game Over!</div>) : (
                                <div className={style.timer}>Time Left: {seconds} Seconds</div>
                            )
                        ) : (
                            <div className={style.timer}>Get Ready!</div>
                        )
                    )
                )}
                <div className={style.displayColorContainer} style={{background: color}}/>
                    <div className={style.colorGuessContainer}>
                        {seconds === 0 || finished ? (null) : (
                            colorOptions.map((color) => {
                                return(
                                    <button className={style.colorGuessBtn} key={color} style={{visibility: guesses === 5 ? 'hidden' : 'visible'}} onClick={() => handleColorSelection(color)}>{color}</button>
                                )
                            })
                        )}
                    </div>
                    <div className={style.scoreContainer}>
                        <div className={style.scoreBox}>
                            <div className={style.scoreIndicator} id='1'/>
                            <div className={style.scoreIndicator} id='2'/>
                            <div className={style.scoreIndicator} id='3'/>
                            <div className={style.scoreIndicator} id='4'/>
                            <div className={style.scoreIndicator} id='5'/>
                        </div>
                    </div>
                    {finished ? <button className={style.startBtn} onClick={() => window.location.reload()}>RESTART</button> : 
                    (ready === true ? null : <button className={style.startBtn} onClick={startGame}>START</button>) }
            </div>
            <div className={style.leaderBoardContainer}>
                <p>Leaderboard</p>
                <p className={style.numberOneEntry} >0xf210F925fe6B83Bb3E74CDA3D993ea3eE0ae4ba1s</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
            </div>
        </div>
    </div>
    )
}

export default ColorGuess;