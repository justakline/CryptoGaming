pragma solidity ^0.8.4;
import "../MainContract.sol";
import "./Piece.sol";
import "./PlayerNumber.sol";

contract Board {
    uint public constant boardSize = 8;
    Piece[boardSize][boardSize] public board;

    constructor() {
        board = createBoard();
    }

    function createBoard()
        private
        returns (Piece[boardSize][boardSize] memory)
    {
        for (uint row = 0; row < boardSize; row++) {
            for (uint col = 0; col < boardSize; col++) {
                if (
                    row <= 2 &&
                    ((row % 2 == 0 && col % 2 == 0) ||
                        (row % 2 == 1 && col % 2 == 1))
                ) {
                    // all of the red ones in every other col
                    board[row][col] = new Piece(PlayerNumber.PLAYER_1); //The first 3 rows
                } else if (
                    row >= 5 &&
                    ((row % 2 == 0 && col % 2 == 0) ||
                        (row % 2 == 1 && col % 2 == 1))
                ) {
                    board[row][col] = new Piece(PlayerNumber.PLAYER_2); //Last 3 rows
                } else {
                    board[row][col] = new Piece(PlayerNumber.NULL);
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
        board[fromRow][fromCol] = new Piece(PlayerNumber.NULL);
        board[toRow][toCol] = piece;
        if (
            (piece.belongsTo(PlayerNumber.PLAYER_1) && toRow == 7) ||
            (piece.belongsTo(PlayerNumber.PLAYER_2) && toRow == 0)
        ) {
            piece.makeKing();
        }
    }

    function getPiece(uint row, uint col) public view returns (Piece) {
        return board[row][col];
    }

    function getPiecePlayer(
        uint row,
        uint col
    ) public view returns (PlayerNumber) {
        return board[row][col].playerNumber();
    }

    function setPiece(uint row, uint col, PlayerNumber number) public {
        board[row][col] = new Piece(number);
    }

    function getBoardSize() public view returns (uint) {
        return boardSize;
    }

    function getBoardPlayer()
        public
        view
        returns (uint[boardSize][boardSize] memory)
    {
        uint[boardSize][boardSize] memory temp;
        for (uint i = 0; i < boardSize; i++) {
            for (uint j = 0; j < boardSize; j++) {
                Piece p = board[i][j];
                if (p.belongsTo(PlayerNumber.PLAYER_1)) {
                    temp[i][j] = 1;
                } else if (p.belongsTo(PlayerNumber.PLAYER_2)) {
                    temp[i][j] = 2;
                } else {
                    temp[i][j] = 0;
                }
            }
        }

        return temp;
    }
}
