import '../assets/stylesheets/HomePageStyleSheet.css';
import profile_picture from '../assets/temp_pictures/hellcat_logo.jpg';
import { useState, useEffect } from 'react';

const Header = (props) => {

    return (
        <div className='nav-header-container'>
            <div className='nav-wallet-container'>
            </div>
            <h3 className='site-name'>Crypto Gamers</h3>
            <div className='nav-wallet-container'>
                <img className='nav-wallet-picture' src={profile_picture}/>
                {!props.address ? (<p className='wallet-address-text' onClick={props.handleLinkWallet}>Click here to link your wallet!</p>) : (
                    <p className='wallet-address-text'>{props.address}</p>
                )}
            </div>
        </div>
    )
}

export default Header;