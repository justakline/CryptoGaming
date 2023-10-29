import '../assets/ColorGuessStylesheet.css'
import {useState, useEffect} from 'react';

const ColorGuess = () => {
    const [color, setColor] = useState("");
    const [colorOptions, setColorOptions] = useState([]);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [numGuesses, setNumGuesses] = useState(1);
    const [time, setTime] = useState(30);
    const [ready, setReady] = useState(false);
    const [outOfGuesses, setOutOfGuesses] = useState(false);

    useEffect(() => {
        const myColor = getColor();
        console.log("My Color: " + myColor);
        setColor('#' + myColor);
        setColorOptions(['#' + myColor, '#' + getColor(), '#' + getColor()]);
        
        if(ready){
            const intervalId = setInterval(() => {
                setTime((time) => {
                    if(time > 0 && numGuesses <= 5){
                        return time - 1;
                    }
                    else{
                        clearInterval(intervalId);
                        setOutOfGuesses(true);
                        return time;
                    }
                })
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [hasGuessed, ready, numGuesses]);

    const getColor = () => {
        const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A','B','C','D','E','F'];
        return new Array(6).fill('').map(() => digits[Math.floor(Math.random() * digits.length)]).join('');
    }

    const handleColorClick = (guessedColor) => {
        if(!ready){
            alert('Please click the START button to begin the game!')
        }
        else{
            if(guessedColor === color){
                setNumGuesses(numGuesses + 1);
                let scoreIndicator = document.getElementById(`${numGuesses}`);
                scoreIndicator.style.backgroundColor = 'green';
                console.log("Correct!");
            }
            else{
                setNumGuesses(numGuesses + 1);
                let scoreIndicator = document.getElementById(`${numGuesses}`);
                scoreIndicator.style.backgroundColor = 'red';
                console.log("Incorrect!, thanks for your ETH");
            }
            setHasGuessed(!hasGuessed);
        }
    }

    const startGame = () => {
        setReady(true);
    }

    return(
        <div className="game-container">
            <div>
                <div className="timer">Time Left: {time} Seconds</div>
                <div className="display-color-container" style={{background: color}}/>
                    <div className="color-guess-container">
                        {colorOptions.map((color) => {
                            return(
                                <button className="color-guess-btn" key={color} onClick={() => handleColorClick(color)}>{color}</button>
                            )
                        })}
                    </div>
                    <div className="score-container">
                        <div className="score-box">
                            <div className="score-indicator" id='1'/>
                            <div className="score-indicator" id='2'/>
                            <div className="score-indicator" id='3'/>
                            <div className="score-indicator" id='4'/>
                            <div className="score-indicator" id='5'/>
                        </div>
                    </div>
                    {time === 0 || outOfGuesses == true ? <button className="start-btn" onClick={() => window.location.reload()}>RESTART</button> : 
                    <button className="start-btn" onClick={startGame}>START</button> }
            </div>
        </div>
    )
}

export default ColorGuess;