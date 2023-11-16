import '../assets/GameSelectorStyleSheet.css';

const GameSelector = (props) => {
    return(
        <div className='game-container'>
            <button className='game-select-button' onClick={() => {props.handleNavigation('color-guess')}}>Color Guess</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('checkers')}}>Checkers</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('crossword')}}>Crossword</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('tic-tac-toe')}}>Tic-Tac-Toe</button>
        </div>
    )
}

export default GameSelector;