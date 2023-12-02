import "./Board.sol";
import "./PlayerNumber.sol";
import "../Game.sol";

contract Checkers is Game {
    Board public board;
    MainContract public main;
    PlayerNumber public currentPlayer;
    bool isOpen = false;
    address payable[] players;
    mapping(address => PlayerNumber) addressToPlayerNumber;
    mapping(address => uint) addresstToBet;

    modifier gameIsOpen() {
        require(isOpen == true, "Game is closed");
        _;
    }
    modifier gameIsClosed() {
        require(isOpen == false, "Game is closed");
        _;
    }

    modifier onlyCurrentPlayer() {
        require(
            (players[0] == msg.sender || players[1] == msg.sender) &&
                currentPlayer == addressToPlayerNumber[msg.sender],
            "Not a player"
        );
        _;
    }

    event InvalidMove(string err);
    event Winner(string s);

    constructor(MainContract main, Checkers existingGame, uint256 wagerAmount) {
        board = new Board();
        currentPlayer = PlayerNumber.PLAYER_1;
        main = main;
        main.addCurrentGame(this);
    }

    function addPlayer(address player, uint wager) public payable {
        require(
            msg.value >= wager && msg.value > 0,
            "you did not wager enough"
        );
        require(players.length < 2, "Already have 2 players");
        if (players.length == 0) {
            addressToPlayerNumber[player] = PlayerNumber.PLAYER_1;
        } else {
            addressToPlayerNumber[player] = PlayerNumber.PLAYER_2;
        }

        this.wager(player, wager);
        players.push(payable(player));
        //Start the game at 2 players
        if (players.length == 2) {
            isOpen = false;
        }
    }

    function payWinner() public payable virtual override gameIsClosed {
        require(
            msg.sender == address(this),
            "No one is allowed to pay besides this contract"
        );
        if (countPieces(PlayerNumber.PLAYER_1) <= 0) {
            emit Winner("Player 1 won ");
            payable(players[0]).transfer(address(this).balance);
        } else {
            emit Winner("Player 2 won ");
            payable(players[1]).transfer(address(this).balance);
        }
    }

    function wager(
        address player,
        uint wager
    ) public payable virtual gameIsClosed {
        require(
            msg.sender == address(this),
            "No one is allowed to add wagers besides this contract"
        );

        addresstToBet[player] = wager;
    }

    function switchPlayer() public {
        if (currentPlayer == PlayerNumber.PLAYER_1) {
            currentPlayer = PlayerNumber.PLAYER_2;
        } else {
            currentPlayer = PlayerNumber.PLAYER_1;
        }
    }

    function getCurrentPlayer() public view returns (PlayerNumber) {
        return currentPlayer;
    }

    function isValidMore(
        uint fromRow,
        uint fromCol,
        uint toRow,
        uint toCol,
        PlayerNumber player
    ) public returns (bool) {
        Piece piece = board.getPiece(fromRow, fromCol);
        if (board.getPiece(toRow, toCol).belongsTo(PlayerNumber.NULL)) {
            emit InvalidMove("Can not Jump to a piece that is already there");
            return false;
        }
        if (
            fromRow < 0 ||
            fromRow > 7 ||
            toRow < 0 ||
            toRow > 7 ||
            fromCol < 0 ||
            fromCol > 7 ||
            toCol < 0 ||
            toCol > 7
        ) {
            emit InvalidMove("Can not Jump off the board");
            return false;
        }
        if (piece.belongsTo(PlayerNumber.NULL)) {
            emit InvalidMove("Can not move a no piece");
            return false;
        }
        if (!piece.belongsTo(player)) {
            emit InvalidMove("Can not move other person's piece");
            return false;
        }

        int dRow = (int)(toRow) - (int)(fromRow);
        int dCol = (int)(toCol) - (int)(fromCol);
        if (abs(dRow) > 2 || abs(dCol) > 2) {
            emit InvalidMove("Can't move that far");
            return false;
        }
        if (piece.isKing()) {
            if (player == PlayerNumber.PLAYER_1) {
                //SIMPLE TURN   Player one moves up or down and either to the right or left, we already know where we are jumping to is empty
                if (abs(dRow) == 1) {
                    if (dCol == 1 || dCol == -1) {
                        return true;
                    }
                    emit InvalidMove(
                        "Can move left and right only 1 for a simple turn"
                    );
                    return false;
                }
                //CAPTURING TURN  Player one can move 2 places up or down
                else if (abs(dRow) == 2) {
                    //Down jump
                    if (dRow > 0) {
                        //DownLeft Jump
                        if (dCol < 0) {
                            Piece capturePiece = board.getPiece(
                                fromRow + 1,
                                fromCol - 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                        //DownRight Jump
                        else {
                            Piece capturePiece = board.getPiece(
                                fromRow + 1,
                                fromCol + 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                    }
                    //up Jump
                    else {
                        //UpLeft Jump
                        if (dCol < 0) {
                            Piece capturePiece = board.getPiece(
                                fromRow - 1,
                                fromCol - 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                        //UpRight Jump
                        else {
                            Piece capturePiece = board.getPiece(
                                fromRow - 1,
                                fromCol + 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                        }
                    }
                }
            } else {
                //SIMPLE TURN   Player 2 moves up or down and either to the right or left, we already know where we are jumping to is empty
                if (abs(dRow) == 1) {
                    if (dCol == 1 || dCol == -1) {
                        return true;
                    }
                    emit InvalidMove(
                        "Can move left and right only 1 for a simple turn"
                    );
                    return false;
                }
                //CAPTURING TURN  Player 2 can move 2 places up or down
                else if (abs(dRow) == 2) {
                    //Down jump
                    if (dRow > 0) {
                        //DownLeft Jump
                        if (dCol < 0) {
                            Piece capturePiece = board.getPiece(
                                fromRow + 1,
                                fromCol - 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                        //DownRight Jump
                        else {
                            Piece capturePiece = board.getPiece(
                                fromRow + 1,
                                fromCol + 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                    }
                    //up Jump
                    else {
                        //UpLeft Jump
                        if (dCol < 0) {
                            Piece capturePiece = board.getPiece(
                                fromRow - 1,
                                fromCol - 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                        //UpRight Jump
                        else {
                            Piece capturePiece = board.getPiece(
                                fromRow - 1,
                                fromCol + 1
                            );
                            return
                                capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                        }
                    }
                }
            }
        }
        //Piece is not the king
        else {
            if (player == PlayerNumber.PLAYER_1) {
                //SIMPLE TURN   Player one moves up and either to the right or left, we already know where we are jumping to is empty
                if (dRow == 1) {
                    return (dCol == 1 || dCol == -1);
                }
                //CAPTURING TURN  Player one can move 2 places up
                else if (dRow == 2) {
                    //left jump
                    if (dCol < 0) {
                        Piece capturePiece = board.getPiece(
                            fromRow + 1,
                            fromCol - 1
                        );

                        //If the capture piece exosts and it is their piece
                        return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                    }
                    //Right Jump
                    else {
                        Piece capturePiece = board.getPiece(
                            fromRow + 1,
                            fromCol + 1
                        );

                        //If the capture piece exosts and it is their piece
                        return capturePiece.belongsTo(PlayerNumber.PLAYER_2);
                    }
                }
            } else {
                //SIMPLE TURN   Player 2 moves down and either to the right or left, we already know where we are jumping to is empty
                if (dRow == -1) {
                    return (dCol == 1 || dCol == -1);
                }
                //CAPTURING TURN  Player 2 can move 2 places down
                else if (dRow == -2) {
                    //left jump
                    if (dCol < 0) {
                        Piece capturePiece = board.getPiece(
                            fromRow - 1,
                            fromCol - 1
                        );

                        //If the capture piece exosts and it is their piece
                        return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                    }
                    //Right Jump
                    else {
                        Piece capturePiece = board.getPiece(
                            fromRow - 1,
                            fromCol + 1
                        );

                        //If the capture piece exosts and it is their piece
                        return capturePiece.belongsTo(PlayerNumber.PLAYER_1);
                    }
                }
            }
        }

        //Default to it being a false move
        return false;
    }

    function move(
        uint fromRow,
        uint fromCol,
        uint toRow,
        uint toCol,
        PlayerNumber player
    ) public gameIsOpen returns (bool) {
        if (isValidMore(fromRow, fromCol, toRow, toCol, player)) {
            movePiece(fromRow, fromCol, toRow, toCol);
            return true;
        }
        return false;
    }

    function movePiece(
        uint fromRow,
        uint fromCol,
        uint toRow,
        uint toCol
    ) internal {
        if (abs((int)(fromRow) - (int)(toRow)) == 2) {
            uint captureRow = fromRow - toRow < 0 ? toRow - 1 : fromRow - 1;
            uint captureCol = fromCol - toCol < 0 ? toCol - 1 : fromCol - 1;
            board.getBoard()[captureRow][captureCol].switchType(
                PlayerNumber.NULL
            );
        }
        board.movePiece(fromRow, fromCol, toRow, toCol);
        //Is the game over now?
        if (
            countPieces(PlayerNumber.PLAYER_1) <= 0 ||
            countPieces(PlayerNumber.PLAYER_2) <= 0
        ) {
            isOpen = false;
            payWinner();
            main.removeCurrentGame(this);
        }
    }

    function countPieces(PlayerNumber player) public returns (uint) {
        uint count = 0;

        for (uint i = 0; i < board.getBoard().length; i++) {
            for (uint j = 0; j < board.getBoard().length; j++) {
                if (board.getBoard()[i][j].belongsTo(player)) count++;
            }
        }
        return count;
    }

    function abs(int value) public pure returns (int) {
        if (value < 0) return value * -1;
        return value;
    }
}
