// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract GameSuggestions {
    address owner;

    struct GameIdea{
        string name;
        string details;
    }
    mapping(address => GameIdea) public gameIdeas;
    GameIdea[] gameIdeasArray;
    
    constructor() {
        owner = tx.origin;
    }

    function suggestGame(string memory _name, string memory _details) public {
        gameIdeas[msg.sender] = GameIdea(_name, _details);
        gameIdeasArray.push(gameIdeas[msg.sender]);
    }

    function getGameIdeas() public view returns(GameIdea[] memory) {
        return gameIdeasArray;
    }
}