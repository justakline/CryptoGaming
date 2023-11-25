// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import './Game.sol';

contract ColorGuessTempContract is Game {
    function payWinner() public payable override {
        //only a temp contrcat, not actually paying out   //Needs to be overrideen by subcontracts
    }
}