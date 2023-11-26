// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract ColorGuessLeaderboardContract{
    address owner;
    struct ColorGuessLeaderboard{
        address player;
        uint256 score;
        bool exists;
    }
    mapping(address => ColorGuessLeaderboard) public colorGuessLeaderboard;
    ColorGuessLeaderboard[] colorGuessLeaderboardArray;

    ColorGuessLeaderboard[] top5;

    constructor(){
        owner = tx.origin;
    }

    function updateColorGuessLeaderboard(address _player, uint256 _score) public {
        //check to see if the player exists if they do add the score to their total
        //otherwise create them
        if(colorGuessLeaderboard[_player].exists){
            colorGuessLeaderboard[_player].score += _score;
        }
        else{
            colorGuessLeaderboard[_player] = ColorGuessLeaderboard(_player, _score, true);
        }

        //loop over the array to see if they are in there
        //if they set the bool to true and break
        bool isInArray = false;
        for(uint256 i = 0; i < colorGuessLeaderboardArray.length; i++){
            if(colorGuessLeaderboardArray[i].player == _player){
                isInArray = true;
                break;
            }
        }

        //if they are in the array add the score to their total
        //otherwise add them to the array
        if(isInArray){
            for(uint256 i = 0; i < colorGuessLeaderboardArray.length; i++){
                if(colorGuessLeaderboardArray[i].player == _player){
                    colorGuessLeaderboardArray[i].score += _score;
                }
            }
        }
        else{
            colorGuessLeaderboardArray.push(colorGuessLeaderboard[_player]);
        }

        //sort the array with bubble sort
        //front end will have to limit it to 5
        for(uint256 i = 0; i < colorGuessLeaderboardArray.length; i++){
            for(uint256 j = 0; j < colorGuessLeaderboardArray.length; j++){
                if(colorGuessLeaderboardArray[i].score > colorGuessLeaderboardArray[j].score){
                    ColorGuessLeaderboard memory temp = colorGuessLeaderboardArray[i];
                    colorGuessLeaderboardArray[i] = colorGuessLeaderboardArray[j];
                    colorGuessLeaderboardArray[j] = temp;
                }
            }
        }
    }

    function getColorGuessLeaderboard() public view returns(ColorGuessLeaderboard[5] memory){
        ColorGuessLeaderboard[5] memory topFive;
        for (uint i = 0; i < 5; i++) {
            if (i < colorGuessLeaderboardArray.length) {
                topFive[i] = colorGuessLeaderboardArray[i];
            }
        }
        return topFive;
    }
}