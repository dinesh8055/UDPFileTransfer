/**
 * @fileoverview This file contains the javascript code for the 
 *     unbeatable Tic-tac-toe game.
 * @author Dinesh Gudi
 * @Version: 
 *     $Id: game.js , Version 1.0 10/27/2015 $ 
 * 
 * Revisions: 
 *     $Log Initial Version $ 
 */


/**
 * This is an initialization function which initializes the board
 */
function startGame() {
    for (var i = 1; i < 10; i++) {
        clearBox(i);
    }
    document.turn = "O";
    document.victor = " ";
    setMessage(document.turn + " gets to start.");
}

/**
 * This is a Board constructor
 * @constructor This constructor is used for creatig the Board object
 */
function Board() {
    this.boardState = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
    this.rank = 999;
    this.turn = "O";
}

/**
 * This function shows the game state
 * @param  msg  This parameter stores the message to be printed
 */
function setMessage(msg) {
    document.getElementById("message").innerText = msg;
}

/**
 * This function calls other functions which set the player move and the corresponding computer move
 * @param square This parameter stores the position in the board
 */
function nextMove(square) {
    moveOptions = [];
    humanMove(square);
    window.setTimeout(computerMove, 1000);
}

/**
 * This function sets the human player move
 * @param square This parameter stores the position in the board
 */
function humanMove(square) {
    if (document.victor != " ") {
        setMessage(document.victor + " already won the game.");
    } else if (square.innerText == "") {
        document.turn = "O";
        square.innerText = document.turn;
        switchTurn();
    } else {
        setMessage("That square is already used.");
    }
}

/**
 * This function is a move by the computer
 */
function computerMove() {
    var board;
    var theMove;
    var bestMove;

    if (document.victor != " "){
        return;
    }
    board = getBoard(999, "O");
    theMove = miniMax(board);
    bestMove = getBestMove(moveOptions, theMove.rank);
    if (bestMove === 0) {
        setMessage("The game ended in a draw!");
    }
    else {
        move(bestMove);
        switchTurn();
    }
}

/**
 * This function switches the turn of one player to another
 */
function switchTurn() {
    if (checkForWinner(document.turn)) {
        setMessage("Congratulations, " + document.turn + "!  You win!");
        document.victor = document.turn;
    } else if (document.turn == "X") {
        document.turn = "O";
        setMessage("It's " + document.turn + "'s turn!");
    } else {
        document.turn = "X";
        setMessage("It's " + document.turn + "'s turn!");
    }
}

/**
 * This function checks if we have a winner by checking if the winning conditions are satisfied
 * @param move This parameter stores the move which causes a win
 * @returns {boolean} This returns true if we have a winner, else returns false
 */
function checkForWinner(move) {
    var result = false;

    if (checkRow(1, 2, 3, move) ||
        checkRow(4, 5, 6, move) ||
        checkRow(7, 8, 9, move) ||
        checkRow(1, 4, 7, move) ||
        checkRow(2, 5, 8, move) ||
        checkRow(3, 6, 9, move) ||
        checkRow(1, 5, 9, move) ||
        checkRow(3, 5, 7, move)) {

        result = true;
    }
    return result;
}
/**
 * This function checks if a winning condition is satisfied
 * @param a First element in winning condition
 * @param b Second element in winning condition
 * @param c Third element in winning condition
 * @param move Winning move
 * @returns {boolean} This returns true if winning condition is satisfied
 */
function checkRow(a, b, c, move) {
    var result = false;

    if (getBox(a) == move && getBox(b) == move && getBox(c) == move) {
        result = true;
    }
    return result;
}
/**
 * This function gets the current state of the board as a Board object
 * @param rank This stores the rank of the Board object that is being created
 * @param turn  This stores the turn of the Board object that is being created
 * @returns {Board} This returns the Board object of current board being displayed
 */
function getBoard(rank, turn) {
    var board = new Board();
    var square = "";
    var x = 0;
    var y = 0;

    for (var i = 1; i < 10; i++) {//setting the boardState
        square = "s" + i;
        x = Math.floor((i - 1) / 3);
        y = (i - 1) % 3;
        if (getBox(i) === "") {
            board.boardState[x][y] = " ";
        }
        else {
            board.boardState[x][y] = getBox(i);
        }
    }

    board.rank = rank;    //setting the rank

    board.turn = turn;    //setting the turn

    return board;
}

/**
 * This function gets the move in a box
 * @param number This is used to generate id of the box
 * @returns {string} This returns string of the move in the box
 */
function getBox(number) {
    return document.getElementById("s" + number).innerText;
}

/**
 * This function clears a box
 * @param number This is used to generate id of the box
 */
function clearBox(number) {
    document.getElementById("s" + number).innerText = "";
}

/**
 * This function sets a computer move on the board
 * @param position This is used to generate id of the box
 */
function move(position) {
    document.getElementById("s" + position).innerText = document.turn;
}

var moveOptions = [];   //Used for storing different options for next move
/**
 * This function is the minimax algorithm which calculates an unbeatable move
 * @param board This stores the Board for the minimax algorithm
 * @returns {Board} This returns the Board after calculating the rank using Minimax algorithm
 */
function miniMax(board) {
    var children = [];
    var childrenOptions = [];

    if (board.turn === "X") {
        children = getChildren(board, "O");
    }
    else {
        children = getChildren(board, "X");
    }

    if (children.length === 0) {
        if (checkForBoardWinner(board)) {
            if (board.turn === "X") {
                board.rank = 10;
            }
            else {
                board.rank = -10;
            }
        }
        else {
            board.rank = 0;
        }
        return board;
    }
    else {
        for (var i = 0; i < children.length; i++) {
            var out = miniMax(children[i]);
            childrenOptions.push(out);
        }
        if (board.turn === "X") {
            board.rank = getMin(childrenOptions);
        }
        else {
            board.rank = getMax(childrenOptions);
        }
        moveOptions = childrenOptions;
        return board;
    }
    return board;
}

/**
 * This function gets the children of the board which represent the next possible moves
 * @param board This stores the board for which children are to be generated
 * @param turn This stores the turn of the children being generated
 * @returns {Array} This returns an array of children of the board
 */
function getChildren(board, turn) {
    var children = [];

    if (checkForBoardWinner(board)) {
        return children;
    }
    for (var row = 0; row < 3; row++) {
        for (var column = 0; column < 3; column++) {
            if (board.boardState[row][column] === " ") {
                var child = new Board();
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        child.boardState[i][j] = board.boardState[i][j];
                    }
                }
                child.boardState[row][column] = turn;
                child.turn = turn;
                if (turn === "X") {
                    child.rank = -999;
                }
                else {
                    child.rank = 999;
                }
                children.push(child);
            }
        }
    }
    return children;
}

/**
 * This function checks the Board object for winner by checking the win conditions
 * @param board This stores the board which is to be checked for winner
 * @returns {boolean} This returns a boolean value of win(true) or no win(false)
 */
function checkForBoardWinner(board) {
    var result = false;

    result = checkBoard(1, 2, 3, board) ||
        checkBoard(4, 5, 6, board) ||
        checkBoard(7, 8, 9, board) ||
        checkBoard(1, 4, 7, board) ||
        checkBoard(2, 5, 8, board) ||
        checkBoard(3, 6, 9, board) ||
        checkBoard(1, 5, 9, board) ||
        checkBoard(3, 5, 7, board);
    return result;
}

/**
 * This function checks if a win condition is satisfied
 * @param a First element in winning condition
 * @param b Second element in winning condition
 * @param c Third element in winning condition
 * @param move Winning move
 * @returns {boolean} This returns true if winning condition is satisfied
 */
function checkBoard(a, b, c, board) {
    var result = false;

    if (getBlock(board, a) === getBlock(board, b) &&
        getBlock(board, c) === getBlock(board, b) &&
        getBlock(board, a) != " ") result = true;
    return result;
}

/**
 * This function gets a Block element in a board
 * @param board This stores the board to be checked for winning conditions
 * @param number This stores the position to be checked
 * @returns {string} This returns an element at 'number'
 */
function getBlock(board, number) {
    return board.boardState[getX(number)][getY(number)];
}

/**
 * This function gets the x-coordinate
 * @param number This stores the position to be checked
 * @returns {number} This returns the x-coordinate
 */
function getX(number) {
    return Math.floor((number - 1) / 3);
}

/**
 * This function gets the y-coordinate
 * @param number This stores the position to be checked
 * @returns {number} This returns the y-coordinate
 */
function getY(number) {
    return (number - 1) % 3;
}

/**
 * This function gets the best move among possible options
 * @param childrenOptions This stores the possible move options
 * @param rank This stores the rank of the best move
 * @returns {number} This returns the position of the best move
 */
function getBestMove(childrenOptions, rank) {

    var currentBoard = getBoard(999, "X");
    var bestBoard = currentBoard;
    var bestMove = 0;

    for (var i = 0; i < childrenOptions.length; i++) {
        if (childrenOptions[i].rank === rank) {
            bestBoard = childrenOptions[i];
        }
    }
    for (var row = 0; row < 3; row++) {
        for (var column = 0; column < 3; column++) {
            if (bestBoard.boardState[row][column] !=
                currentBoard.boardState[row][column]) {
                bestMove = (row * 3) + column + 1;
            }
        }
    }
    return bestMove;
}

/**
 * This function gets the maximum ranked option
 * @param children This stores the possible options
 * @returns {number} This returns rank of the maximum ranked option
 */
function getMax(children) {
    var max = children[0].rank;

    for (var i = 0; i < children.length; i++) {
        if (children[i].rank > max) {
            max = children[i].rank;
        }
    }
    return max;
}

/**
 * This function gets the minimum ranked option
 * @param children This stores the possible options
 * @returns {number} This returns rank of the manimum ranked option
 */
function getMin(children) {
    var min = children[0].rank;

    for (var i = 0; i < children.length; i++) {
        if (children[i].rank < min) {

            min = children[i].rank;
        }
    }
    return min;
}