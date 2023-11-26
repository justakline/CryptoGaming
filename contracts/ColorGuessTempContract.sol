// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import './Game.sol';

contract ColorGuessTempContract is Game {

    uint256 wagerAmmount;
    address player;
    uint256 difficulty;
    string gameName;

    constructor(){
        gameName = "ColorGuess";
    }

    function payWinner() public payable override {
        //only a temp contrcat, not actually paying out   //Needs to be overrideen by subcontracts
    }

    function setWagerAmmount(uint256 _wagerAmmount) public {
        wagerAmmount = _wagerAmmount;
    }

    function setPlayer(address _player) public {
        player = _player;
    }

    function setDifficulty(uint256 _difficulty) public {
        difficulty = _difficulty;
    }

    function getWagerAmmount() public view returns(uint256){
        return wagerAmmount;
    }

    function getPlayer() public view returns(address){
        return player;
    }

    function getDifficulty() public view returns(uint256){
        return difficulty;
    }

    function getGameName() public view returns(string memory){
        return gameName;
    }
}