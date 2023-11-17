// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract ColorGuess{
    address owner;

    //all info stored for a player
    struct Player{
        address payable player;
        uint256 wagerAmmount;
        uint256 lifeTimeWagerAmount;
        uint256 lifeTimeScore;
        uint256 lifeTimeWins;
        uint256 lifeTimeLosses;
        uint256 lifeTimePlays;
        string profilePicture;
        bool exists;
    }
    mapping(address => Player) public players;

    //stores the leaderboard, only the top 5 players
    //this should only ever have a length of 5
    address[] public leaderboardAddresses;

    constructor(){
        owner = tx.origin;
    }

    //should this go in the main contract?
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
                lifeTimeScore: 0,
                lifeTimeWins: 0,
                lifeTimeLosses: 0,
                lifeTimePlays: 0,
                profilePicture: "",
                exists: true
            });
        }
    }

    //there should be a way to where the user does not need to pay for this
    function setScore(uint256 _score, uint256 _difficulty) public payable {
        //gets gas before any changes to state are made
        uint256 initialGas = gasleft();
        require(players[msg.sender].exists == true, "You must have played before to set a score");
        if(_score == 5){
            //multiplying the payout by the difficulty, the most is 5x
            players[msg.sender].wagerAmmount *= _difficulty;
            players[msg.sender].lifeTimeScore += _score;
            updateLeaderboard(msg.sender);
            //matt dibbern
            //refunding the gas used to set the score and update leaderboard
            uint256 gasUsed = initialGas - gasleft();
            payable(msg.sender).transfer((gasUsed * tx.gasprice) + (players[msg.sender].wagerAmmount));
        }
        players[msg.sender].wagerAmmount = 0;
    }

    //updates the leaderboard, only the top 5 players
    function updateLeaderboard(address player) private{
        if(leaderboardAddresses.length < 5){
            leaderboardAddresses.push(player);
        }
        else{
            if(players[leaderboardAddresses[4]].lifeTimeScore < players[player].lifeTimeScore){
                leaderboardAddresses[4] = player;
            }
            else{
                //doesnt put them in order, the frontend will have to sort them
                address[] memory temp = new address[](5);
                for(uint256 i = 0; i < leaderboardAddresses.length; i++){
                    if(players[leaderboardAddresses[i]].lifeTimeScore < players[player].lifeTimeScore){
                        temp[i] = player;
                    }
                    else{
                        temp[i] = leaderboardAddresses[i];
                    }
                }
                leaderboardAddresses = temp;
                delete temp;
            }
        }
    }

    //returns the leaderboard
    function getLeaderboard() public view returns(address[] memory){
        return leaderboardAddresses;
    }

    function getPlayerInfo() public view returns(Player memory){
        return players[msg.sender];
    }
}