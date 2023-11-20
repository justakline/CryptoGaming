// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import './Game.sol';

contract MainContract{
    mapping(address=>bool) addressToIsOwner;

    Game[] gamesPlayed;
    Game[] currentGames;
    Game[] allowedGameTypes;

    // struct Player{
    //     string profilePicture;
    //     uint256[] gamesPlayed;
    //     uint256[] currentGames;
    //     uint256[] allowedGameTypes;
    // }
    // mapping(address => Player) players;

    struct Player{
        string profilePicture; //holds ipfs hash
        uint256[] numGamesPlayed;
        uint256[] numWins;
        bool exists;
    }
    mapping(address => Player) players;

    modifier onlyOwner(){
        require(addressToIsOwner[msg.sender] == true, "Only the owner can do this");
        _;
    }


    constructor(){
        addressToIsOwner[tx.origin] = true;
    }

    //Which type of game can be played
    function addPlayableGame(Game game) public onlyOwner{
        allowedGameTypes.push(game);
    }

    //List of games currently being played
    function addCurrentGame(Game game) public {
        currentGames.push(game);
        gamesPlayed.push(game);
    }

    function removeCurrentGame(Game game) public {
        //There is no indexOf or remove, so just iterate through the array and find the game
        //And replace it with the last one, thereby removing it
        for (uint256 i =0; i < currentGames.length; i++){
            if (currentGames[i] == game){
            currentGames[i] = currentGames[currentGames.length-1];
            break;
            }
        }
    }

    function removeGame(Game game) public onlyOwner {
        for (uint256 i =0; i < currentGames.length; i++){
            if (allowedGameTypes[i] == game){
                allowedGameTypes[i] = allowedGameTypes[allowedGameTypes.length-1];
                break;
            }
        }
    }

    function addOwner(address admin) public onlyOwner{
        addressToIsOwner[admin] = true;
    }

    function setProfilePicture(string memory _profilePicture) public {
        players[msg.sender].profilePicture = _profilePicture;
    }

    function addPlayer() public {
        require(players[msg.sender].exists == false, "Player already exists");
        players[msg.sender].exists = true;
    }

    function updatePlayer(uint256 _numGamesPlayed, uint256 _numWins) public {
        require(players[msg.sender].exists == true, "Player does not exist");
        players[msg.sender].numGamesPlayed.push(_numGamesPlayed);
        players[msg.sender].numWins.push(_numWins);
    }

    function getPlayer() public view returns(Player memory){
        return players[msg.sender];
    }
}