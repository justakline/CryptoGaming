import '../assets/GameSelectorStyleSheet.css';

const GameSelector = () => {
    return(
        <div className='game-container'>
            <button className='game-select-button'>Color Guess</button>
            <button className='game-select-button'>Checkers</button>
            <button className='game-select-button'>Crossword</button>
            <button className='game-select-button'>Tic-Tac-Toe</button>
        </div>
    )
}

export default GameSelector;