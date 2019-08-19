'use strict'

const Board = use('App/Reversi/Board');

class Game{
    constructor(json){
        if (json){
            this.board = new Board(json.board);
            this.cpuSide = json.cpuSide;
            this.stack = json.stack;
        }
        else{
            this.board = new Board();
            this.cpuSide = Math.random > 0.5 ? Board.Cell.White : Board.Cell.Black;
            this.stack = [];
        }
    }

    move(x, y){
        let step = this.board.move(x, y);
        if (step) {
            this.stack.push(step);
            return true;
        }
        return false;
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

    printStack(){
        for (let i = 0; i < this.stack.length; i++)
        {
            for (let y = 0; y < 8; y++){
                let cell = this.stack[i].m[0][y];
                let str = cell == 0 ? '_' : cell;
                for (let x = 1; x < 8; x++){
                    cell = this.stack[i].m[x][y];
                    str = str + `|${cell == 0 ? '_' : cell}`;
                }
                console.log(str);
            }
            console.log(`player ${this.stack[i].player} (${this.stack[i].x}, ${this.stack[i].y})\n`);
        }
    }
}

module.exports = Game;