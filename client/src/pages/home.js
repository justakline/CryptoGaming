import { useState, useEffect } from 'react';
import GameSelector from '../components/GameSelector';
import MainContractState from '../components/MainContractState';
import { useNavigate } from "react-router-dom";
import '../assets/stylesheets/HomePageStyleSheet.css';

const Home = (props) => {
    //props coming in from App.js: address, addressAuthenticated

    const [address, setAddress] = useState('');
    const [addressAuthenticated, setAddressAuthenticated] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        const isBrave = 'brave' in window.navigator;
        if(!isBrave){
            alert("It looks like your not using the Brave browser. Some features may not work as intended.");
        }
        else{
            console.log('your using brave!');
        }
    }, [])

    const handleLinkWallet = async() => {
        const { ethereum } = window;
        if(!ethereum){
            console.log("Make sure you have metamask!");
            return;
        }

        try{
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length !== 0){
                const account = accounts[0];
                setAddressAuthenticated(true)
                setAddress(account);
                fetchCurrentGames();
            }
            else{
                console.log("no account found!");
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchCurrentGames = async() => {
        console.log('fetching current games')
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
        else if(page === 'game-suggestion'){
            navigate('/game-suggestion', {state: {address}});
        }
        else if(page === 'your-account'){
            if(props.address){
                navigate('/your-account', {state: {address}});
            }
            else{
                alert('Please link your wallet first!');
            }
        }
    }

    return (
        <div>
            <GameSelector handleNavigation={handleNavigation} />
            <MainContractState address={props.address} />
        </div>
    )
}

export default Home;