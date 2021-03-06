'use strict'

const Board = use('App/Reversi/Board');

class Game {
  constructor(json) {
    if (json) {
      if (typeof (json) == 'string') json = JSON.parse(json);
      this.board = new Board(json.board);
      this.cpuSide = json.cpuSide;
      this.stack = json.stack;
    }
    else {
      this.board = new Board();
      this.cpuSide = Math.random() > 0.5 ? Board.Cell.White : Board.Cell.Black;
      this.stack = [];
    }
  }

  move(x, y) {
    let step = this.board.move(x, y);
    if (step) {
      this.stack.push(step);
      return true;
    }
    return false;
  }

  isCpuMove() {
    return this.cpuSide == this.board.currentPlayer;
  }

  isOver() {
    return this.board.gameOver;
  }

  async toClient(params) {
    return {
      cpuSide: this.cpuSide,
      board: await this.board.toEdgeArg(params)
    }
  }

  /**
   * @returns {number} White|Black|Empty value
   */
  getWinner() {
    let white = 0, black = 0;
    for (let x = 0; x < 8; x++)
      for (let y = 0; y < 8; y++)
        if (this.board.m[x][y] == Board.Cell.White) white++
        else if (this.board.m[x][y] == Board.Cell.Black) black++;

    if (white > black) return Board.Cell.White;
    if (black > white) return Board.Cell.Black;
    return Board.Cell.Empty;
  }

  printStack() {
    for (let i = 0; i < this.stack.length; i++) {
      let move = this.stack[i];
      console.log(`dt=${move.dt}`);
      for (let y = 0; y < 8; y++) {
        let cell = move.m[0][y];
        let str = cell == 0 ? '_' : cell;
        for (let x = 1; x < 8; x++) {
          cell = move.m[x][y];
          str = str + `|${cell == 0 ? '_' : cell}`;
        }
        console.log(str);
      }
      console.log(`player ${move.player} (${move.x}, ${move.y})\n`);
    }
  }
}

module.exports = Game;