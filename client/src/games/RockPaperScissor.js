//0xAC2F073afc043eD1Eed64375DCE94C99Dc39A7df
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RockPaperScissorsContract from '../assets/abi_files/RockPaperScissors.json'; 
import MainContract from '../assets/abi_files/MainContract.json'; 
import '../assets/stylesheets/RockPaperScissor.css';

const choices = ['rock', 'paper', 'scissors'];

// Map to convert choice from string to contract enum type
const rpsMap = {
  "rock": 0,
  "paper": 1,
  "scissors": 2
}; 

const contractAddress = "0xAC2F073afc043eD1Eed64375DCE94C99Dc39A7df"; // Replace with your contract address
const mainAddress = "0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39"

const RockPaperScissor = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [wager, setWager] = useState('');
  const [loading, setLoading] = useState(false);
  const [mainContract, setMainContract] = useState(null);
  const [addressOfGame, setAddressOfGame] = useState('');


  useEffect(() => {
    const setMain = async () => {
      const main = new ethers.Contract("0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39", MainContract.abi, signer);
      setMainContract( main)
    }
    setMain()

    

  }, [])
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const rpsContractFactory = new ethers.ContractFactory(RockPaperScissorsContract.abi, RockPaperScissorsContract.bytecode, signer);

  const handleChoice = async (choice) => {
    try{
           setLoading(true);
          const rpsContract = await rpsContractFactory.deploy(mainContract.address, rpsMap[choice],{ value: ethers.utils.parseEther(wager) });

          const playerChoice = await rpsContract.getPlayerChoice();
          const compChoice = await rpsContract.getComputerChoice();
          const gameResult = await rpsContract.getIsWinner();

          setUserChoice(choice);
          setComputerChoice(choices[compChoice]);
          const winResult= calculateWinner(playerChoice, computerChoice);
          setResult(winResult);
          setLoading(false);
          setAddressOfGame(rpsContract.address)
    }catch (error) {
      setLoading(false);
      console.log("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(error.message);
    }
    
  };

  const calculateWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
      return 'Tie!';
    } else if (playerChoice === 'rock' && computerChoice ==='scissors') {
      return 'You win!';
    } else if (playerChoice ==='scissors' && computerChoice === 'paper') {
      return 'You win!';
    } else if (playerChoice === 'paper' && computerChoice === 'rock') {
      return 'You win!';
    } else {
      return 'You lose!';
    }
  };

  const handleWagerChange = (e) => {
    setWager(e.target.value);
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setWager('');
    setAddressOfGame('');
  };

  return (
    <div className="App">
      <h1>Rock, Paper, Scissors</h1>
      <input type="text" value={wager} onChange={handleWagerChange} placeholder="Enter your wager in ETH" />
      {!userChoice && !loading && (
        <div>
          <p>Choose your move:</p>
          <div className="choices">
            {choices.map((choice) => (
              <button key={choice} onClick={() => handleChoice(choice)}>
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {userChoice && (
        <div>
          <p>You chose: {userChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p>{result}</p>
          <p>{addressOfGame}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissor;
