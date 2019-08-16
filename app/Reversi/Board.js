'use strict'

const Cell = { Empty: 0, White: 1, Black: 2 }

class Board{
    constructor(json){
        if (json){
            this.m = json.m;
            this.currentPlayer = json.currentPlayer;
            this.gameOver = json.gameOver;
        }
        else{
            this.m = buildArray();
            this.currentPlayer = Cell.White;
            this.gameOver = false;
        }
    }
    
    swapPlayer(){
        if (this.currentPlayer == Cell.White) this.currentPlayer = Cell.Black;
        else if (this.currentPlayer == Cell.Black) this.currentPlayer = Cell.White;
        else throw Error('');
    }

    move(x, y)
    {
        x = +x; y = +y;
        if (this.gameOver) throw Error('GameOver! You cant move it!');

        if (set(this, x, y))
        {
            this.swapPlayer();
            if (!existMove(this))
            {
                this.swapPlayer();
                if (!existMove(this)){ this.currentPlayer = Cell.Empty; }
            }
        }
    }

    getTransposedMatrix(){
        let m = new Array(8);
        for (let i = 0; i < 8; i++)
            m[i] = new Array(8);
        
        for(let x = 0; x < 8; x++)
            for(let y = 0; y < 8; y++)
                m[x][y] = this.m[y][x];

        return m;
    }
}

module.exports = Board;


function invert(cell){
    if (cell == Cell.White) return Cell.Black;
    if (cell == Cell.Black) return Cell.White;
    else throw new Error('WTF');
}

function validLine(board, x, y, a, b){
    let ok = false;
    
    for (let i = x + a, j = y + b; ; i += a, j += b)
    {
        if (i < 0 || j < 0 || i > 7 || j > 7 || board.m[i][j] == Cell.Empty) return false;
        if (board.m[i][j] == board.currentPlayer) return ok;
        if (board.m[i][j] == invert(board.currentPlayer)) ok = true;
    }
}

function invertLine(board, x, y, a, b) {
    for (   
            let i = x + a, j = y + b; 
            board.m[i][j] != board.currentPlayer;
            i += a, j += b
        )
        board.m[i][j] = invert(board.m[i][j]);
}

function set(board, x, y){
    board.m[x][y] = board.currentPlayer;

    let res = false;
    for (let a = -1; a < 2; a++)
        for (let b = -1; b < 2; b++)
            if (validLine(board, x, y, a, b))
            {
                invertLine(board, x, y, a, b);
                res = true;
            }

    return res;
}

function existMove(board)
{
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            if (_let(board, x, y)) return true;
    return false;
}

function _let(board, x, y)
{
    if (board.m[x][y] != Cell.Empty) return false;
    for (let a = -1; a < 2; a++)
        for (let b = -1; b < 2; b++)
            if (validLine(board, x, y, a, b)) return true;
    return false;
}

function buildArray(){
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