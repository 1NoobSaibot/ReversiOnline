'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');
const Board = use('App/Reversi/Board');
const Field = use('App/Models/Field');

class GameController{
    board({session, response}){
        const game = getGame(session);
        response.json(game.board.toEdgeArg());
    }

    async move({session, request, response}){
        const {x, y} = request.all().params;

        try{
            const game = getGame(session);
            if (!game || game.isCpuMove() || !game.move(x, y)) return response.send('rejected');
            if (game.isOver()) await getExperience(game);
            putGame(session, game);
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    async cpuMove({session, response}){
        try{
            const game = getGame(session);
            if (!game || !game.isCpuMove() || game.isOver()) return response.send('rejected');
            const moves = game.board.getPossibleMoves();
            let i = Math.round(Math.random() * moves.length);
            i = (i == moves.length ? 0: i);
            const v = moves[i];
            if (!game.move(v.x, v.y)) throw new Error('Не могу сделать ход!');
            if (game.isOver()) await getExperience(game);
            putGame(session, game);
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    start({session, response}){
        try {
            let game = new Game();
            putGame(session, game);
            return response.send('GameIsReady');
        }
        catch (e){ console.log(e.message); }
    }

    game({session, response}){
        const game = getGame(session);
        response.json(game.toClient());
    }
}

module.exports = GameController;


function getGame(session){
    return new Game(JSON.parse(session.get('game')));
}

function putGame(session, game){
    session.put('game', JSON.stringify(game));
}

async function getExperience(game){
    //Сбор игровой статистики
    const winner = game.getWinner(); //TODO

    const stack = game.stack;
    for (let i = 0; i < stack.length; i++){
        const move = stack[i];
        let field = await Field.findBy('dt', move.dt);
        if (!field) 
        {
            let options = [];
            options[move.x] = [];
            options[move.x][move.y] = getNewOption(winner, move.player);
            field = await Field.create({
                dt: move.dt,
                last_time: Date.now() / 1000,
                options
            });
        }
        else {
            const result = getResult(winner, move.player);
            field.add(move.x, move.y, result);
        }
        await field.save();
    }
}

function getNewOption(winner, player){
    if (winner == Board.Cell.Empty) return { w: 0, d: 1, l: 0 };
    if (winner == player) return { w: 1, d: 0, l: 0 };
    return { w: 0, d: 0, l: 1 };
}

function getResult(winner, player){
    if (winner == Board.Cell.Empty) return 1;
    if (winner == player) return 2;
    return 0;
}