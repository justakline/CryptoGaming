// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Game {
    address winner;
    uint256 wagerAmount;

    function payWinner() public payable virtual {
    //Needs to be overrideen by subcontracts
    }

    //this is for ColorGuess payWinner
    function payWinner(uint256 _difficulty) public payable virtual {
    //Needs to be overrideen by subcontracts
    }

    function wager() public payable virtual{
    //Needs to be overriden by subcontracts
    }
}