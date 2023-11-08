import '../assets/ColorGuessStylesheet.css'
import {useState, useEffect} from 'react';

const ColorGuess = () => {
    const [color, setColor] = useState("");
    const [colorOptions, setColorOptions] = useState([]);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [numGuesses, setNumGuesses] = useState(0);
    const [time, setTime] = useState(30);
    const [ready, setReady] = useState(false);
    const [outOfGuesses, setOutOfGuesses] = useState(false);

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
        return new Array(6).fill('').map(() => hexDigits[Math.floor(Math.random() * hexDigits.length)]).join('');
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
            }
            else{
                setNumGuesses(numGuesses + 1);
                let scoreIndicator = document.getElementById(`${numGuesses + 1}`);
                scoreIndicator.style.backgroundColor = 'red';
                console.log("Incorrect!, thanks for your ETH");
            }
            if(numGuesses === 5){
                setReady(false);
                setOutOfGuesses(true);
                setTime(0);
            }
            else{
                setHasGuessed(!hasGuessed);
            }
        }
    }

    const startGame = () => {
        setReady(true);
        timer();
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

    return(
        <div className="game-container">
            <div>
                {time === 0 ? <div className="timer">GAME OVER</div> : <div className="timer">Time Left: {time} Seconds</div>}
                <div className="display-color-container" style={{background: color}}/>
                    <div className="color-guess-container">
                        {colorOptions.map((color) => {
                            return(
                                <button className="color-guess-btn" key={color} style={{visibility: numGuesses === 5 ? 'hidden' : 'visible'}} onClick={() => handleColorClick(color)}>{color}</button>
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
                    {time === 0 || outOfGuesses === true ? <button className="start-btn" onClick={() => window.location.reload()}>RESTART</button> : 
                    (ready === true ? null : <button className="start-btn" onClick={startGame}>START</button>) }
            </div>
        </div>
    )
}

export default ColorGuess;