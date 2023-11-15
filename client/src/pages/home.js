import { useState, useEffect } from 'react';
import Header from '../components/header';
import GameSelector from '../components/GameSelector';

const Home = () => {
    const [address, setAddress] = useState('');
    const [addressAuthenticated, setAddressAuthenticated] = useState(false);

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

    return (
        <div>
            <Header address={address} handleLinkWallet={handleLinkWallet}/>
            <GameSelector />
        </div>
    )
}

export default Home;