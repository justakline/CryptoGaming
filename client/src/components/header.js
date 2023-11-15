import { useState } from 'react';
import '../assets/HomePageStyleSheet.css';
import profile_picture from '../assets/temp_pictures/hellcat_logo.jpg';

const Header = (props) => {
    return (
        <div className='nav-header-container'>
            <div className='nav-wallet-container'>
                {/* <p className='wallet-address'>no address linked</p> */}
            </div>
            <h3 className='site-name'>Crypto Gamers</h3>
            <div className='nav-wallet-container'>
                <img className='nav-wallet-picture' src={profile_picture}/>
                {!props.address ? (<p className='wallet-address-text' onClick={props.handleLinkWallet}>No wallet detected!</p>) : (
                    <p className='wallet-address-text'>{props.address}</p>
                )}
            </div>
        </div>
    )
}

export default Header;