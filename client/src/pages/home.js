import { useState, useEffect } from 'react';
import Header from '../components/header';
import GameSelector from '../components/GameSelector';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [address, setAddress] = useState('');
    const [addressAuthenticated, setAddressAuthenticated] = useState(false);

    let navigate = useNavigate();

    const handleLinkWallet = async() => {
        const { ethereum } = window;
        if(!ethereum){
            console.log("Make sure you have metamask!");
            return;
        }

        try{
            const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length !== 0){
                const account = accounts[0];
                setAddressAuthenticated(true)
                setAddress(account);
            }
            else{
                console.log("no account found!");
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const handleNavigation = (page) => {
        //set up nav logic here
        if(page === 'color-guess'){
            navigate('/color-guess', {state: {address}});
        }
        else if(page === 'checkers'){
            navigate('/checkers', {state: {address}});
        }
        else if(page === 'word-search'){
            navigate('/word-search', {state: {address}});
        }
        else if(page === 'tic-tac-toe'){
            navigate('/tic-tac-toe', {state: {address}});
        }
    }

    return (
        <div>
            <Header address={address} handleLinkWallet={handleLinkWallet} />
            <GameSelector handleNavigation={handleNavigation} />
        </div>
    )
}

export default Home;