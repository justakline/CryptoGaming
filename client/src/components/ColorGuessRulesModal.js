import '../assets/stylesheets/ColorGuessRulesModalStyleSheet.css'

const ColorGuessRulesModal = (props) => {
    return(
        <div className='parent-container' >
            <div className='rule-container'>
                <p onClick={props.handleCloseModal} style={{'whiteSpace': 'pre-wrap', margin: '1%'}} >{props.gameRules}</p>
            </div>
        </div>
    )
}

export default ColorGuessRulesModal;