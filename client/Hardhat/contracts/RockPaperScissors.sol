// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MainContract.sol";
import "./Game.sol";

contract RockPaperScissors is Game {
    uint amount;
    Choice pChoice;
    Choice cChoice;
    address owner;
    bool isWinner;
    bool gameOver = false;

    enum Choice {
        Rock,
        Paper,
        Scissors
    }
    event GameResult(
        address player,
        Choice playerChoice,
        Choice computerChoice,
        string result
    );

    constructor(MainContract main, Choice playerChoice) payable {
        require(msg.value >= 0.0001 ether, "Not betting enough");
        owner = address(this);
        main.addCurrentGame(this);
        main.addPlayer(msg.sender);
        amount = msg.value;
        play(playerChoice);
        main.removeCurrentGame(this);
    }

    function play(Choice _playerChoice) public {
        Choice computerChoice = Choice(random() % 3);
        pChoice = _playerChoice;
        cChoice = computerChoice;
        string memory result = determineWinner(_playerChoice, computerChoice);

        emit GameResult(msg.sender, _playerChoice, computerChoice, result);
        gameOver = true;
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        msg.sender
                    )
                )
            );
    }

    function determineWinner(
        Choice _playerChoice,
        Choice _computerChoice
    ) private returns (string memory) {
        if (_playerChoice == _computerChoice) {
            payWinner();
            return "It's a tie!";
        }

        if (
            (_playerChoice == Choice.Rock &&
                _computerChoice == Choice.Scissors) ||
            (_playerChoice == Choice.Paper && _computerChoice == Choice.Rock) ||
            (_playerChoice == Choice.Scissors &&
                _computerChoice == Choice.Paper)
        ) {
            payWinner();
            isWinner = true;
            return "You win!";
        }

        isWinner = false;
        return "You lose!";
    }

    function payWinner() public payable override {
        payable(tx.origin).transfer(address(this).balance);
    }

    function getPlayerChoice() public view returns (Choice) {
        return pChoice;
    }

    function getComputerChoice() public view returns (Choice) {
        return cChoice;
    }

    function getIsWinner() public view returns (bool) {
        return isWinner;
    }

    function getWagerChoice() public view returns (uint) {
        return amount;
    }

    function getGameOver() public view returns (bool) {
        return gameOver;
    }
}
