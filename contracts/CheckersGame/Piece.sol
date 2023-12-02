pragma solidity ^0.8.4;
import "./PieceType.sol";
import "./PlayerNumber.sol";

contract Piece {
    PlayerNumber public playerNumber;
    PieceType public pieceType = PieceType.REGULAR;

    constructor(PlayerNumber initialPlayerNumber) {
        playerNumber = initialPlayerNumber;
    }

    function makeKing() public {
        pieceType = PieceType.KING;
    }

    function isKing() public view returns (bool) {
        return pieceType == PieceType.KING;
    }

    function belongsTo(PlayerNumber player) public view returns (bool) {
        return playerNumber == player;
    }

    function switchType(PlayerNumber player) public {
        playerNumber = player;
    }
}
