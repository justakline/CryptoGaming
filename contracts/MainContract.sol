// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract MainContract{
    address owner;

    //all info stored for a player
    struct Player{
        address payable player;
        uint256 wagerAmmount;
        uint256 lifeTimeWagerAmount;
        string profilePicture;
        bool exists;
    }
    mapping(address => Player) public players;

    constructor(){
        owner = tx.origin;
    }

    //handles setting the wager ammount
    function wager(uint256 _wager) public payable {
        require(msg.sender.balance >= _wager, "You do not have enough funds to wager that ammount");
        require(msg.value == _wager, "You must wager the correct ammount");
        if(players[msg.sender].exists == true){
            players[msg.sender].wagerAmmount = _wager;
            players[msg.sender].lifeTimeWagerAmount += _wager;
        }
        else{
            players[msg.sender] = Player({
                player: payable(msg.sender),
                wagerAmmount: _wager,
                lifeTimeWagerAmount: _wager,
                profilePicture: "",
                exists: true
            });
        }
    }

    //there should be a way only the owner can call this?
    //matt dibbern
    //maybe an event can solve this?
    //called when player wins in color guess
    function payoutColorGuessWager(uint256 _difficulty, address playerToPay) public {
        require(players[msg.sender].exists == true, "You must have payed before to collect your winnings");
        payable(players[playerToPay].player).transfer(players[msg.sender].wagerAmmount * _difficulty);
        players[msg.sender].wagerAmmount = 0;
    }

    //there sould be a way only the owner can call this?
    //maybe an event can solve this?
    //called when the player loses in color guess
    function collectColorGuessWager(address playerToCollectFrom) public{
        require(players[msg.sender].exists == true, "No player found with that address");
        payable(owner).transfer(players[playerToCollectFrom].wagerAmmount);
        players[msg.sender].wagerAmmount = 0;
    }

    function getPlayerInfo() public view returns(Player memory){
        return players[msg.sender];
    }

    function setProfilePicture(string memory _profilePicture) public {
        require(players[msg.sender].exists == true, "You must have payed before to set a profile picture");
        players[msg.sender].profilePicture = _profilePicture;
    }
}