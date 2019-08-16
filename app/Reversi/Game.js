'use strict'

const Board = use('App/Reversi/Board');

class Game{
    constructor(json){
        if (json){
            this.board = new Board(json.board);
        }
        else{
            this.board = new Board();
        }
    }

    move(x, y){
        return this.board.move(x, y);
    }
}

module.exports = Game;