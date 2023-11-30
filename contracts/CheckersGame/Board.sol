pragma solidity ^0.8.4;
import "../MainContract.sol";
import "./Piece.sol";

contract Board {
    uint public constant boardSize = 8;
    Piece[][] public board;

    constructor() {}

    function createBoard() private returns (Piece[][] memory) {
        Piece[boardSize][boardSize] memory tempBoard;
        for (uint row = 0; row < boardSize; row++) {
            for (uint col = 0; col < boardSize; col++) {
                if (
                    row <= 2 &&
                    ((row % 2 == 0 && col % 2 == 0) ||
                        (row % 2 == 1 && col % 2 == 1))
                ) {
                    // all of the red ones in every other col
                    tempBoard[row][col] = new Piece(PlayerNumber.PLAYER_1); //The first 3 rows
                } else if (
                    row >= 5 &&
                    ((row % 2 == 0 && col % 2 == 0) ||
                        (row % 2 == 1 && col % 2 == 1))
                ) {
                    tempBoard[row][col] = new Piece(PlayerNumber.PLAYER_2); //Last 3 rows
                } else {
                    tempBoard[row][col] = new Piece(PlayerNumber.PLAYER_2);
                }
            }
        }
        return board;
    }

    function movePiece(
        uint fromRow,
        uint fromCol,
        uint toRow,
        uint toCol
    ) public {
        Piece piece = board[fromRow][fromCol];
    }
}
