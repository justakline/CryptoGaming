import style from '../assets/stylesheets/ColorGuessStylesheet.module.css'
import {useState, useEffect} from 'react';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import colorGuessABI from '../assets/abi_files/ColorGuess.json';

//EASY: All hex colors are different. pays 1:1
//MEDIUM: 1 Chunk of the hex values are the same. pays 2:1
//HARD: 2 Chunks of the hex values are the same. pays 3:1
//IMPOSSIBLE: only 1 hex digit is different. pays 4:1
const ColorGuess = () => {
    let location = useLocation();
    let address = location.state.address;

    const [color, setColor] = useState("");
    const [colorOptions, setColorOptions] = useState([]);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [numGuesses, setNumGuesses] = useState(0);
    const [time, setTime] = useState(30);
    const [ready, setReady] = useState(false);
    const [outOfGuesses, setOutOfGuesses] = useState(false);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState();
    const [wager, setWager] = useState(0);

    let tempWei = 1000000000000000000;
    // let wei = BigInt(tempWei);

    const handleWager = (wager) =>{
        setWager(Number(wager));
    }

    // const contractAddress = "0x70043DE190f8642AF885c839cF941f9e78De228A"
    const contractAddress = "0x3c4C20255783a54DeD57D123F642590068Ab7622"

    const submitWager = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const wagerFixed = ethers.FixedNumber.from(wager.toString());
        const transaction = await contract.wager({value: ethers.utils.parseEther(wagerFixed.toString())});
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished');
    }

    const collectWager = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const transaction = await contract.payout(2);
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished, check the wallet!');
    }

    const getBalance = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const balance = await contract.contractBalance();
        console.log('balance of contract is: ' + Number(balance/tempWei));
    }

    const loadContract = async() => {
        let abi = colorGuessABI.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const wager = .2;
        const wagerFixed = ethers.FixedNumber.from(wager.toString());
        const transaction = await contract.loadContractBalane({value: ethers.utils.parseEther(wagerFixed.toString())});
        console.log('waiting for transaction to finish');
        await transaction.wait();
        console.log('transaction finished');
    }

    let hasGeneratedColor = false;

    useEffect(() => {
        const myColor = getColor();
        console.log("My Color: " + myColor);
        setColor('#' + myColor);
        setColorOptions(['#' + myColor, '#' + getColor(), '#' + getColor()]);
    }, [hasGuessed, ready]);

    useEffect(() => {
        if(ready){
            if(timer !== 0){
                timer();
            }
        }
    }, [time])
    const getColor = () => {
        const hexDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A','B','C','D','E','F'];
        if(!difficulty || difficulty === 'easy'){
            return new Array(6).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
        }
        else if(difficulty === 'medium'){
            let firstFiveDigits = color[1] + color[2];
            let restOfDigits = new Array(4).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            while(finalArray === color){
                restOfDigits = new Array(4).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            }
            let returnArray = finalArray.split('#').pop();
            return returnArray;
        }
        else if(difficulty === 'hard'){
            let firstFiveDigits = color[1] + color[2] + color[3] + color[4];
            let restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            while(finalArray === color){
                restOfDigits = new Array(2).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            }
            let returnArray = finalArray.split('#').pop();
            return returnArray;
        }
        else if(difficulty === 'impossible'){
            let firstFiveDigits = color[1] + color[2] + color[3] + color[4] + color[5];
            let restOfDigits = new Array(1).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
            let finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            while(finalArray === color){
                restOfDigits = new Array(1).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
                finalArray = '#' + firstFiveDigits.concat(restOfDigits);
            }
            let returnArray = finalArray.split('#').pop();
            return returnArray;
        }
    }

    const handleColorClick = (guessedColor) => {
        if(!ready){
            alert('Please click the START button to begin the game!')
        }
        else if(numGuesses >= 5){
            alert('out of guesses!');
        }
        else{
            if(guessedColor === color){
                setNumGuesses(numGuesses + 1);
                let scoreIndicator = document.getElementById(`${numGuesses + 1}`);
                scoreIndicator.style.backgroundColor = 'green';
                console.log("Correct!");
                setScore(score + 1);
            }
            else{
                setNumGuesses(numGuesses + 1);
                let scoreIndicator = document.getElementById(`${numGuesses + 1}`);
                scoreIndicator.style.backgroundColor = 'red';
                console.log("Incorrect!, thanks for your ETH");
            }
            // console.log("this is numguesses after the if else stmt: " + numGuesses);
            hasGeneratedColor = false;
            setHasGuessed(!hasGuessed);
        }
    }

    const checkEndOfGame = () => {
        if(numGuesses + 1 === 5){
            setOutOfGuesses(true);
            alert(`You got ${score} out of 5 correct!`);
        }
    }

    const startGame = () => {
        if(!difficulty){
            alert('Please choose a difficulty!');
        }
        else{
            setReady(true);
            timer();
        }
    }

    const timer = () => {
        if(time === 0 || numGuesses >= 5){
            setTime(0);
        }
        else{
            setInterval(() => {
                if(time !== 0){
                    setTime(time - 1);
                }
            }, 1000)
        }
    }

    const handleSetDifficulty = (difficulty) => {
        setDifficulty(difficulty);
    }

    return(
        <div>
            <Header address={address} />
            <div className={style.gameContainer}>
            <div>
                <input type="number" placeholder="Wager" onChange={(e) => handleWager(e.target.value)}></input>
                <button onClick={() => submitWager()}>Wager</button>
                <button onClick={() => getBalance()}>Get Balance</button>
                <button onClick={() => collectWager()}>Collect Wager</button>
                <button onClick={() => loadContract()}>Load Contract</button>
                {!difficulty ? (<h1 style={{color: 'white'}}>Choose a difficulty</h1>) : <h1 style={{color: 'white'}}>Difficulty: {difficulty}</h1> }
                {!difficulty ? (
                <div className={style.colorGuessContainer}>
                    {/* <h1 style={{color: 'white'}}>Choose a difficulty</h1>  */}
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('easy')}>EASY</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('medium')}>MEDIUM</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('hard')}>HARD</button>
                    <button className={style.colorGuessBtn} onClick={() => handleSetDifficulty('impossible')}>IMPOSSIBLE</button>
                </div>) : (
                    time === 0 ? (<div className={style.timer}>GAME OVER</div>) :( <div className={style.timer}>Time Left: {time} Seconds</div>)
                )}
                <div className={style.displayColorContainer} style={{background: color}}/>
                    <div className={style.colorGuessContainer}>
                        {colorOptions.map((color) => {
                            return(
                                <button className={style.colorGuessBtn} key={color} style={{visibility: numGuesses === 5 ? 'hidden' : 'visible'}} onClick={() => handleColorClick(color)}>{color}</button>
                            )
                        })}
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
                    {time === 0 || outOfGuesses === true ? <button className={style.startBtn} onClick={() => window.location.reload()}>RESTART</button> : 
                    (ready === true ? null : <button className={style.startBtn} onClick={startGame}>START</button>) }
            </div>
        </div>
        </div>
    )
}

export default ColorGuess;