// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import './Game.sol';

contract MainContract{
    mapping(address=>bool) addressToIsOwner;

    Game[] gamesPlayed;
    Game[] currentGames;
    Game[] allowedGameTypes;

    struct Player{
        string profilePicture; //holds ipfs hash
        uint256 numGamesPlayed;
        uint256 numWins;
        Game currentGame;
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

    function addColorGuessCurrentGame(address _sender, Game game) public {
        currentGames.push(game);
        gamesPlayed.push(game);
        players[_sender].currentGame = game;
    }

    function getCurrentGames() public view returns(Game[] memory){
        return currentGames;
    }

    function getGamesPlayed() public view returns(Game[] memory){
        return gamesPlayed;
    }

    function removeCurrentGame(Game game) public {
        //There is no indexOf or remove, so just iterate through the array and find the game
        //And replace it with the last one, thereby removing it
        Game[] memory temp;
        uint256 count = 0;
        for(uint256 i = 0; i < currentGames.length; i++){
            if(currentGames[i] != game){
                temp[count] = currentGames[i];
                count++;
            }
        }
        currentGames = temp;
        delete temp;
    }

    function removeGame(Game game) public onlyOwner {
        for (uint256 i =0; i < currentGames.length; i++){
            if (allowedGameTypes[i] == game){
                allowedGameTypes[i] = allowedGameTypes[allowedGameTypes.length-1];
                break;
            }
        }
    }
    
    function removeColorGuessCurrentGame(address _sender) public {
        Game[] memory temp = new Game[](currentGames.length);
        uint256 count = 0;
        uint256 removed = 0;
        for(uint256 i = 0; i < currentGames.length; i++){
            if(currentGames[i] != players[_sender].currentGame){
                temp[count] = currentGames[i];
                count++;
            }
            else{
                removed++;
            }
        }
        Game[] memory temp2 = new Game[](currentGames.length - removed);
        count = 0;
        for(uint256 i = 0; i < temp.length; i++){
            if(temp[i] != Game(address(0))){
                temp2[count] = temp[i];
                count++;
            }
        }
        currentGames = temp2;
        players[_sender].currentGame = Game(address(0));
        delete temp;
        delete temp2;
    }

    function addOwner(address admin) public onlyOwner{
        addressToIsOwner[admin] = true;
    }

    function setProfilePicture(string memory _profilePicture) public {
        require(players[msg.sender].exists == true, "Player does not exist");
        players[msg.sender].profilePicture = _profilePicture;
    }

    function addPlayer(address _player) public {
        if(players[_player].exists == false){
            players[_player] = Player("", 0, 0, Game(address(0)), true);
        }
    }

    //a universal function to update the player's stats regardless of game played
    function updatePlayer(uint256 _numGamesPlayed, uint256 _numWins, address _address) public {
        require(players[_address].exists == true, "Player does not exist");
        players[_address].numGamesPlayed += _numGamesPlayed;
        players[_address].numWins += _numWins;
    }

    function getPlayerInfo() public view returns(Player memory){
        return players[msg.sender];
    }
}