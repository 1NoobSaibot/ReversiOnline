'use strict'

const Board = use('App/Reversi/Board');

class Game{
    constructor(json){
        if (json){
            this.board = new Board(json.board);
            this.cpuSide = json.cpuSide;
        }
        else{
            this.board = new Board();
            this.cpuSide = Math.random > 0.5 ? Board.Cell.White : Board.Cell.Black;
        }
    }

    move(x, y){
        return this.board.move(x, y);
    }

    isCpuMove(){
        return this.cpuSide == this.board.currentPlayer;
    }

    isOver(){
        return this.board.gameOver;
    }

    toClient() {
        return {
            cpuSide: this.cpuSide,
            board: this.board.toEdgeArg()
        }
    }
}

module.exports = Game;