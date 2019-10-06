'use strict'

/** Cell Enum */
const Cell = { Empty: 0, White: 1, Black: 2 }
const getDt = use('App/Reversi/Determinant');
const Field = use('App/Models/Field');

class Board {
  static Cell = Cell;

  /**
   * Restores a Board from JSON-object or creates a new Board.
   * @param {object} json 
   */
  constructor(json) {
    if (json) {
      this.m = json.m;
      this.currentPlayer = json.currentPlayer;
      this.gameOver = json.gameOver;
    }
    else {
      this.m = buildArray();
      this.currentPlayer = Cell.White;
      this.gameOver = false;
    }
  }

  /**
   * Changes the player.
   */
  swapPlayer() {
    if (this.currentPlayer == Cell.White) this.currentPlayer = Cell.Black;
    else if (this.currentPlayer == Cell.Black) this.currentPlayer = Cell.White;
    else throw Error('');
  }

  /**
   * Make a move, if possible in x, Y coordinates. 
   * Returns an object with a description of the move or false
   * @param {number} x 
   * @param {number} y 
   * @returns {object|false} {x, y, player, m} | false
   */
  move(x, y) {
    x = +x; y = +y;
    let res = {
      x, y, player: this.currentPlayer,
      m: this.getMatrix(),
      ffm: this.getFriendsFoes(),
      possibleMoves: this.getPossibleMoves()
    }
    if (this.gameOver || !set(this, x, y)) return false;

    this.swapPlayer();
    if (!existMove(this)) {
      this.swapPlayer();
      if (!existMove(this)) {
        this.gameOver = true;
      }
    }
    return res;
  }

  /**
   * Creates a Clone of the Board Matrix and return it
   * @returns {number[][]} White|Black Matrix 
   */
  getMatrix() {
    let m = new Array(8);
    for (let i = 0; i < 8; i++)
      m[i] = new Array(8);

    for (let x = 0; x < 8; x++)
      for (let y = 0; y < 8; y++)
        m[x][y] = this.m[x][y];

    return m;
  }

  /**
   * Creates a transposed clone of the field matrix and returns it.
   * @returns {number[][]} White|Black Matrix
   */
  getTransposedMatrix() {
    let m = new Array(8);
    for (let i = 0; i < 8; i++)
      m[i] = new Array(8);

    for (let x = 0; x < 8; x++)
      for (let y = 0; y < 8; y++)
        m[x][y] = this.m[y][x];

    return m;
  }

  /**
   * Collects data and gives it to the client side in the required form. Outdated
   * @returns {object} board data for a client
   */
  async toEdgeArg({ tips }) {
    let probs;
    if ((typeof(tips) === 'boolean' && tips) || tips === "true")
      probs = await this.getProbs()
    let arg = {
      m: this.getTransposedMatrix(),
      gameOver: this.gameOver,
      currentPlayer: this.currentPlayer,
      probs
    }
    return arg;
  }

  /**
   * Returns all possible moves for the current player as an array of coordinate pairs
   * @return {object[]} Array of {x, y}
   */
  getPossibleMoves() {
    let moves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (_let(this, x, y)) {
          moves.push({ x, y });
        };
      }
    }
    return moves;
  }

  /**
   * 
   * Returns a FriendsFoes Matrix.
   * Empty cells remain empty.
   * @returns {number[][]} Friend|Foe Matrix
   */
  getFriendsFoes() {
    return Board.toFriendsFoes(this.m, this.currentPlayer);
  }

  /**
   * Converts chips on the field, calling them their own (1) and strangers (2).
   * @param {number[][]} im White|Black Matrix
   * @param {number} player White|Black
   * @returns {number[][]} Friend|Foe Matrix
   */
  static toFriendsFoes(im, player) {
    let m = new Array(8);
    for (let x = 0; x < 8; x++) {
      m[x] = new Array(8);
      for (let y = 0; y < 8; y++)
        m[x][y] = im[x][y] == 0 ? 0 : im[x][y] == player ? 1 : 2;
    }

    return m;
  }

  /**
   * @returns {}
   */
  getFriendsFoesDt() {
    let m = this.getFriendsFoes();
    return getDt(m);
  }

  async getProbs() {
    //Запросить вероятности из БД
    const field = await Field.search(this.getFriendsFoes());
    if (!field) return undefined
    let probM = field.getOptions()
    let res = []

    for (let i = 0; i < probM.length; i++) {
      if (!probM[i]) continue
      for (let j = 0; j < probM[i].length; j++) {
        if (!probM[i][j]) continue
        if (!res[j]) res[j] = []
        res[j][i] = probM[i][j]
      }
    }

    return res
  }
}

module.exports = Board;

/**
 * Inverts a cell value and returns it
 * @param {number} cell Empty|White|Black value 
 * @returns {number} (throw Error)|Black|White value 
 */
function invert(cell) {
  if (cell == Cell.White) return Cell.Black;
  if (cell == Cell.Black) return Cell.White;
  else throw new Error('WTF');
}

/**
 * Checks the possibility of a chip flip.
 * @param {Board} board 
 * @param {number} x start
 * @param {number} y start
 * @param {number} a horisontal direction
 * @param {number} b vertical direction
 * @returns {boolean} return true if this line could be fliped.
 */
function validLine(board, x, y, a, b) {
  let ok = false;

  for (let i = x + a, j = y + b; ; i += a, j += b) {
    if (i < 0 || j < 0 || i > 7 || j > 7 || board.m[i][j] == Cell.Empty) return false;
    if (board.m[i][j] == board.currentPlayer) return ok;
    if (board.m[i][j] == invert(board.currentPlayer)) ok = true;
  }
}

/**
 * Flips the line
 * @param {Board} board 
 * @param {number} x start
 * @param {number} y start
 * @param {number} a horisontal direction
 * @param {number} b vertical direction
 */
function invertLine(board, x, y, a, b) {
  for (
    let i = x + a, j = y + b;
    board.m[i][j] != board.currentPlayer;
    i += a, j += b
  )
    board.m[i][j] = invert(board.m[i][j]);
}

/**
 * Checks the conditions and executes the move, if they are met. 
 * Returns true if successful.
 * @param {Board} board 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} success
 */
function set(board, x, y) {
  if (!_let(board, x, y)) return false;
  board.m[x][y] = board.currentPlayer;

  let res = false;
  for (let a = -1; a < 2; a++)
    for (let b = -1; b < 2; b++)
      if (validLine(board, x, y, a, b)) {
        invertLine(board, x, y, a, b);
        res = true;
      }

  return res;
}

/**
 * Checks the existence of a move for the current player. 
 * Returns true if there is at least one.
 * @param {Board} board 
 * @returns {boolean} move exists
 */
function existMove(board) {
  for (let x = 0; x < 8; x++)
    for (let y = 0; y < 8; y++)
      if (_let(board, x, y)) return true;
  return false;
}

/**
 * Checks the ability to make a move at the given coordinates for the current player. 
 * Checks lines in all eight directions. 
 * Returns true if a move is possible.
 * @param {Board} board 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} Move is possible
 */
function _let(board, x, y) {
  if (board.m[x][y] !== Cell.Empty) return false;
  for (let a = -1; a < 2; a++)
    for (let b = -1; b < 2; b++)
      if (validLine(board, x, y, a, b)) return true;
  return false;
}

/**
 * Returns and initializes a new game matrix.
 * @returns {number[][]} White|Black Matrix
 */
function buildArray() {
  let m = new Array(8);
  for (let i = 0; i < m.length; i++)
    m[i] = new Array(8);

  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++)
      m[i][j] = 0;

  m[3][3] = Cell.White;
  m[3][4] = Cell.Black;
  m[4][3] = Cell.Black;
  m[4][4] = Cell.White;

  return m;
}
