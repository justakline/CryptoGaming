// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import './MainContract.sol';
import './ColorGuessTempContract.sol';
import './ColorGuessLeaderboardContract.sol';

contract ColorGuess {
    address payable owner;
    struct Player{
        address payable id;
        uint256 wagerAmmount;
        bool hasBet;
    }
    mapping(address => Player) public players;

    constructor(){
        owner = payable(tx.origin);
    }

    function wager(MainContract _contract) public payable{
        require(msg.sender.balance >= msg.value, "You must have enough funds to wager");
        require(msg.value > 0, "You must wager more than 0");
        require(players[msg.sender].hasBet == false, "You have already wagered and did not report your lost. Failure to do so results in not being able to play again!");
        players[msg.sender] = Player(payable(msg.sender), msg.value, true);
        ColorGuessTempContract temp = new ColorGuessTempContract();
        _contract.addColorGuessCurrentGame(msg.sender, temp);
    }

    function payWinner(uint256 _difficulty, MainContract _contract, ColorGuessLeaderboardContract _leaderboard, uint256 _score) public payable {
        require(players[msg.sender].hasBet, "You must have wagered to collect");
        require(players[msg.sender].wagerAmmount > 0, "You must wager more than 0");
        require(_difficulty > 0 && _difficulty < 5, "Difficulty must be greater than 0");
        uint256 payoutAmmount = players[msg.sender].wagerAmmount * _difficulty;
        payable(msg.sender).transfer(payoutAmmount);
        players[msg.sender].hasBet = false;
        players[msg.sender].wagerAmmount = 0;
        _contract.updatePlayer(1, 1, msg.sender);
        _contract.removeColorGuessCurrentGame(msg.sender);
        _leaderboard.updateColorGuessLeaderboard(msg.sender, _score);
    }

    function losingWager(MainContract _contract, ColorGuessLeaderboardContract _leaderboard, uint256 _score) public{
        require(players[msg.sender].hasBet, "You must have wagered to collect");
        payable(owner).transfer(players[msg.sender].wagerAmmount);
        players[msg.sender].hasBet = false;
        players[msg.sender].wagerAmmount = 0;
        _contract.updatePlayer(1, 0, msg.sender);
        _contract.removeColorGuessCurrentGame(msg.sender);
        _leaderboard.updateColorGuessLeaderboard(msg.sender, _score);
    }

    function contractBalance() public view returns(uint256){
        return address(this).balance;
    }

    function loadContractBalance() public payable{
        //this is only here so we can load the contract with a balance for paying out winning wagers
    }
}