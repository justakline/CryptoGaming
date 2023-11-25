// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract ColorGuessLeaderboardContract{
    address owner;
    struct ColorGuessLeaderboard{
        address player;
        uint256 score;
    }
    ColorGuessLeaderboard[] colorGuessLeaderboardArray;

    constructor(){
        owner = tx.origin;
    }

    function updateColorGuessLeaderboard(address _player, uint256 _score) public {
        if(colorGuessLeaderboardArray.length < 5){
            colorGuessLeaderboardArray.push(ColorGuessLeaderboard(_player, _score));
        }
        else{
            uint256 lowestScore = colorGuessLeaderboardArray[0].score;
            for(uint256 i = 0; i < colorGuessLeaderboardArray.length; i++){
                if(colorGuessLeaderboardArray[i].score < lowestScore){
                    lowestScore = colorGuessLeaderboardArray[i].score;
                }
            }

            for(uint256 i = 0; i < colorGuessLeaderboardArray.length; i++){
                if(colorGuessLeaderboardArray[i].score == lowestScore){
                    colorGuessLeaderboardArray[i].player = _player;
                    colorGuessLeaderboardArray[i].score = _score;
                    break;
                }
            }
        }
    }

    function getColorGuessLeaderboard() public view returns(ColorGuessLeaderboard[] memory){
        return colorGuessLeaderboardArray;
    }
}