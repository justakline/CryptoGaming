// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

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

    function wager() public payable{
        require(msg.sender.balance >= msg.value, "You must have enough funds to wager");
        require(msg.value > 0, "You must wager more than 0");
        require(!players[msg.sender].hasBet, "You have already wagered");
        players[msg.sender] = Player(payable(msg.sender), msg.value, true);
    }

    function payout(uint256 _difficulty) public{
        require(players[msg.sender].hasBet, "You must have wagered to collect");
        require(players[msg.sender].wagerAmmount > 0, "You must wager more than 0");
        require(_difficulty > 0 && _difficulty < 5, "Difficulty must be greater than 0");
        uint256 payoutAmmount = players[msg.sender].wagerAmmount * _difficulty;
        payable(msg.sender).transfer(payoutAmmount);
        players[msg.sender].hasBet = false;
        players[msg.sender].wagerAmmount = 0;
    }

    function losingWager() public{
        require(players[msg.sender].hasBet, "You must have wagered to collect");
        payable(owner).transfer(players[msg.sender].wagerAmmount);
        players[msg.sender].hasBet = false;
    }

    function contractBalance() public view returns(uint256){
        return address(this).balance;
    }

    function loadContractBalane() public payable{
        
    }
}