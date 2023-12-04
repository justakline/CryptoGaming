pragma solidity ^0.8.4;

import "./Checkers.sol";

contract CheckersTracker {
    address[] games;
    address[] players;
    mapping(address => GamePlay) addressToCurrentGame;

    struct GamePlay {
        address game;
        bool isPlaying;
    }

    constructor() {
        //Dynamic array
        games = new address[](0);
        players = new address[](0);
    }

    function addGame(address game) public {
        require(!isAddedGame(game), "Game already Being played");
        games.push(address(game));
    }

    function removeGame(address game) public {
        require(isAddedGame(game), "Game not added");

        uint index = games.length + 1;
        for (uint i = 0; i < games.length; i++) {
            if (address(game) == games[i]) {
                index = i;
                break;
            }
        }
        if (index == games.length + 1) return;

        //Remove the game
        for (uint i = index; i < games.length; i++) {
            games[i] = games[i + 1];
        }
        //Remove the players in that game
        removePlayersToGame(game);
    }

    function addPlayerToGame(address game, address player) public {
        require(isAddedGame(game), "Game is not already added");
        require(
            !addressToCurrentGame[player].isPlaying,
            "You are already Playing a game"
        );
        require(
            !Checkers(game).isOpenGame(),
            "Game is already Playing or there are already 2 players in the game"
        );
        addressToCurrentGame[player] = GamePlay(game, true);
        players.push(player);
    }

    function removePlayersToGame(address game) internal {
        for (uint i = 0; i < players.length; i++) {
            if (
                address(addressToCurrentGame[players[i]].game) == address(game)
            ) {
                addressToCurrentGame[players[i]] = GamePlay(address(0), false);
            }
        }
    }

    function isAddedGame(address game) public view returns (bool) {
        for (uint i = 0; i < games.length; i++) {
            if (games[i] == address(game)) return true;
        }
        return false;
    }

    function currentGameFromPlayer(
        address player
    ) public view returns (address) {
        return addressToCurrentGame[player].game;
    }

    function playerisPlaying(address player) public view returns (bool) {
        return addressToCurrentGame[player].isPlaying;
    }

    function getAllGames() public view returns (address[] memory) {
        return games;
    }
}
