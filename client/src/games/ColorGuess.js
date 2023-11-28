import style from '../assets/stylesheets/ColorGuessStylesheet.module.css'
import {useState, useEffect} from 'react';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import colorGuessABI from '../assets/abi_files/ColorGuessABI_Files/ColorGuess.json';
import colorGuessLeaderboardABI from '../assets/abi_files/ColorGuessABI_Files/ColorGuessLeaderboardContract.json';
import useCountdown from '../hooks/useCountDown';
import MoonLoader from "react-spinners/MoonLoader";

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

    const [placingWager, setPlacingWager] = useState(false);

    const [account, setAccount] = useState('');
    const [leaderboardList, setLeaderboardList] = useState([]);

    const mainContract = "0xEDdede02b21e6747E34415a31500fe917eD2442f";
    const colorGuessLeaderboard = "0xEDcDC47B7fCC83C6E275aE1Af4d966F37dF3bED7"
    const tempColorGuess = "0xA38D7F6d0b713c2E71bB8aDf88B8E767f4dE4292";
    const colorGuessContract = "0x7D9BD636e780E562c96b3375750c90168D4E7897";

    //this only runs once when the page is loaded
    useEffect(() => {
        if(!address){
            const {ethereum} = window;
            if(!ethereum){

            }
            else{
                fetchLeaderboard();
                getAccount();
            }
        }
        else{
            fetchLeaderboard();
        }
    }, []);

    useEffect(() => {
        if((seconds === 0 && isActive) || guesses === 5){
            checkEndGame();
        }
    }, [seconds]);

    const getAccount = async() => {
        console.log('ETH detected');
        try{
            const {ethereum} = window;
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            console.log(accounts[0]);
        }
        catch(err){
            console.log(err);
        }
    }

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
            if(score == 5){
                payWinner();
            }
            else{
                losingWager();
            }
        }
        else{
            handleSetColorOptions();
        }
    }

    const payWinner = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(colorGuessContract, abi, signer);
        const transaction = await contract.payWinner(numDifficulty, mainContract, colorGuessLeaderboard, score);
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished, check the wallet!');
    }

    const losingWager = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(colorGuessContract, abi, signer);
        const transaction = await contract.losingWager(mainContract, colorGuessLeaderboard, score);
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished, thanks for playing!');
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
    
    const loadContract = async() => {
        const {ethereum} = window;
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(colorGuessContract, abi, signer);
        const wager = .2;
        const wagerFixed = ethers.FixedNumber.from(wager.toString());
        const transaction = await contract.loadContractBalance({value: ethers.utils.parseEther(wagerFixed.toString())});
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished');
    }

    const handleWager = async() => {
        if(wager <= 0 || wager > .05){
            alert('Please enter a wager between 0 and .05');
        }
        else{
            const {ethereum} = window;
            let abi = colorGuessABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(colorGuessContract, abi, signer);
            const wagerFixed = ethers.FixedNumber.from(wager.toString());
            setPlacingWager(true);
            const transaction = await contract.wager(mainContract, numDifficulty, {value: ethers.utils.parseEther(wagerFixed.toString())});
            console.log('waiting for transaction to finish');
            await transaction.wait();
            console.log('transaction finished');
            setHasWagered(true);
            console.log('wager: ', wager);
            setPlacingWager(false);
        }
    }

    const fetchLeaderboard = async() => {
        const {ethereum} = window;
        let abi = colorGuessLeaderboardABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(colorGuessLeaderboard, abi, signer);
        const leaderboard = await contract.getColorGuessLeaderboard();
        setLeaderboardList(leaderboard);
    }

    console.log('leaderboard list: ' + leaderboardList[0])

    return(
        <div>
        <Header address={address} />
        <div className={style.gameContainer}>
            {/* <button onClick={() => getBalance()}>Get Balance</button> */}
            <button onClick={() => loadContract()}>load contract</button>
            <button onClick={() => fetchLeaderboard()}>fetch leaderboard</button>
            <div>
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
                {placingWager ? (<MoonLoader color={'#ffffff'} />) : (
                    hasWagered ? (<h2 style={{color: 'white'}}>Wagering {wager} sepolia</h2>) : (
                    <div id='wager'>
                        <input type='number' placeholder="Wager" onChange={(e) => handleSetWager(e.target.value)}></input>
                        <button onClick={() => handleWager()}>Wager</button>
                    </div>
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
                    (ready === true || placingWager == true ? null : <button className={style.startBtn} onClick={startGame}>START</button>) }
            </div>
            <div>
                <div className={style.leaderBoardContainer}>
                    <p>Leaderboard</p>
                    {leaderboardList.map((player, index) => {
                        console.log('player: ', player[0]);
                        console.log('index: ', index)
                        if(player[0] === '0x0000000000000000000000000000000000000000'){
                            return(
                                ''
                            )
                        }
                        else{
                            if(index == 0){
                                return(
                                    <p className={style.numberOneEntry} >{player[0]} | score: {parseInt(player[1]._hex, 16)}</p>
                                )
                            }
                            else{
                                return(
                                    <p>{player[0]} | score: {parseInt(player[1]._hex, 16)}</p>
                                )
                            }
                        }
                    })}
                </div>
            </div>
        </div>
    </div>
    )
}

export default ColorGuess;