import '../assets/stylesheets/GameSelectorStyleSheet.css';

const GameSelector = (props) => {
    return(
        <div className='game-container'>
            <button className='game-select-button' onClick={() => {props.handleNavigation('color-guess')}}>Color Guess</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('checkers')}}>Checkers</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('word-search')}}>Word Search</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('tic-tac-toe')}}>Tic-Tac-Toe</button>
            <button className='game-select-button' onClick={() => {props.handleNavigation('rock-paper-scissor')}}>Rock-Paper-Scissor</button>
            <button className='suggest-game-button' onClick={() => {props.handleNavigation('game-suggestion')}}>Suggest A Game!</button>
            <button className='suggest-game-button' onClick={() => {props.handleNavigation('your-account')}}>Your Account</button>
        </div>
    )
}

export default GameSelector;