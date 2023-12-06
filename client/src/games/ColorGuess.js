import style from '../assets/stylesheets/ColorGuessStylesheet.module.css'
import {useState, useEffect} from 'react';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import colorGuessABI from '../assets/abi_files/ColorGuessABI_Files/ColorGuess.json';
import colorGuessLeaderboardABI from '../assets/abi_files/ColorGuessABI_Files/ColorGuessLeaderboardContract.json';
import useCountdown from '../hooks/useCountDown';
import MoonLoader from "react-spinners/MoonLoader";
import ColorGuessRulesModal from '../components/ColorGuessRulesModal';

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
    const [updatingPlayer, setUpdatingPlayer] = useState(false);

    const [gameRules, setGameRules] = useState('');

    const[showModal, setShowModal] = useState(false);

    const [handlePayment, setHandlePayment] = useState(false);

    const mainContract = "0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39";
    const colorGuessLeaderboard = "0x2bc875296730Ee24d786d92DF9EEc929a60E308b"
    const tempColorGuess = "0x200B73C8AA3353B1CC6D3dd72eA0Ee52ad0E1853";
    const colorGuessContract = "0x1ED5dC0DFA54675EbB4cbf2d8720D60a1D27E5aD";

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
            let finalArray = firstTwoDigits.concat(restOfDigits);
            while(finalArray === color.replace('#', '') || finalArray === colorOptions[1].replace('#', '')){
                restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = firstTwoDigits.concat(restOfDigits);
            }
            return '#' + finalArray;
        }
        else if(difficulty === 'hard'){
            let firstFourDigits = myColor[1] + myColor[2] + myColor[3] + myColor[4];
            let restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = firstFourDigits.concat(restOfDigits);
            while(finalArray === color.replace('#', '') || finalArray === colorOptions[1].replace('#', '')){
                restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = firstFourDigits.concat(restOfDigits);
            }
            return '#' + finalArray;
        }
        else if(difficulty === 'impossible'){
            let firstFiveDigits = myColor[1] + myColor[2] + myColor[3] + myColor[4] + myColor[5];
            let restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = firstFiveDigits.concat(restOfDigits);
            while(finalArray === color.replace('#', '') || finalArray === colorOptions[1].replace('#', '')){
                restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = firstFiveDigits.concat(restOfDigits);
            }
            return '#' + finalArray;
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
        try{
            setUpdatingPlayer(true);
            let abi = colorGuessABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(colorGuessContract, abi, signer);
            const transaction = await contract.payWinner(numDifficulty, mainContract, colorGuessLeaderboard, score);
            console.log('waiting for transaction to finish');
            await transaction.wait();
            console.log('transaction finished, check the wallet!');
            setUpdatingPlayer(false);
            setHandlePayment(true);
        }
        catch(err){
            console.log(err);
        }
    }

    const losingWager = async() => {
        try{
            setUpdatingPlayer(true);
            let abi = colorGuessABI.abi;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(colorGuessContract, abi, signer);
            const transaction = await contract.losingWager(mainContract, colorGuessLeaderboard, score);
            console.log('waiting for transaction to finish');
            await transaction.wait();
            console.log('transaction finished, thanks for playing!');
            setUpdatingPlayer(false);
            setHandlePayment(true);
        }
        catch(err){

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
        if(!wager){
            alert('Please choose a difficulty before wagering');
        }
        else{
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

    const handleGetGameRules = async() => {
        console.log('inside handleGetGameRules');
        try{
            // const hash = 'bafkreidzta7xekkvyavsrktnch4aa23rkpvnw2ei7ft2ibpzhtxmh7gnli';
            const url = `https://gateway.pinata.cloud/ipfs/bafkreidzta7xekkvyavsrktnch4aa23rkpvnw2ei7ft2ibpzhtxmh7gnli`;
            console.log('awaiting response')
            const response = await fetch(url);
            console.log('done awaiting response, awaiting data');
            let data = await response.text();
            console.log('done awaiting data');
            console.log(data);
            setGameRules(data);
        }
        catch(err){
            console.log(err);
        }
    }

    const handleCloseModal = () => {
        setGameRules('');
    }

    return(
        <div>
        {gameRules && (<ColorGuessRulesModal gameRules={gameRules} handleCloseModal={handleCloseModal} />) }
        <div className={style.gameContainer}>
            {/* <button onClick={() => getBalance()}>Get Balance</button> */}
            <button onClick={() => loadContract()}>load contract</button>
            <button onClick={() => fetchLeaderboard()}>fetch leaderboard</button>
            <div>
                <button onClick={() => handleGetGameRules()} className={style.startBtn}>Not sure how to play?</button>
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
                {placingWager ? (
                    <div className={style.centerStuff}>
                        <MoonLoader color={'#ffffff'} />
                    </div>
                ) : (
                    hasWagered ? (
                        !handlePayment ? (
                            <h2 style={{color: 'white'}} >Wagering {wager} sepolia</h2>
                        ) : (
                            <h2 style={{color: 'white'}} >Thanks for playing!</h2>
                        )
                    ) : (
                    <div id='wager' className={style.wager}>
                        <input type='number' placeholder="Wager" onChange={(e) => handleSetWager(e.target.value)}></input>
                        <button className={style.colorGuessBtn} onClick={() => handleWager()}>Wager</button>
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
            <div>
                {updatingPlayer ? (
                    <div className={style.leaderBoardContainer}>
                        <h2 className={style.myH2}>Leaderboard</h2>
                        <MoonLoader color={'#ffffff'} />
                    </div>
                ) : (
                    <div className={style.leaderBoardContainer}>
                        <h2 className={style.myH2}>Leaderboard</h2>
                        {leaderboardList.map((player, index) => {
                            if(player[0] === '0x0000000000000000000000000000000000000000'){
                                return(
                                    ''
                                )
                            }
                            else{
                                if(index == 0){
                                    return(
                                        <h3 className={style.numberOneEntry} >{player[0]} | score: {parseInt(player[1]._hex, 16)}</h3>
                                    )
                                }
                                else{
                                    return(
                                        <h4>{player[0]} | score: {parseInt(player[1]._hex, 16)}</h4>
                                    )
                                }
                            }
                        })}
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
    )
}

export default ColorGuess;