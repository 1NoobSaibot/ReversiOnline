'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');

class GameController{
    board({session, response}){
        const game = new Game(JSON.parse(session.get('game')));
        response.json(game.board.toEdgeArg());
    }

    move({session, request, response}){
        const {x, y} = request.all().params;

        try{
            const game = new Game(JSON.parse(session.get('game')));
            if (!game || game.isCpuMove() || !game.move(x, y)) return response.send('rejected');
            session.put('game', JSON.stringify(game));
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    cpuMove({session, response}){
        try{
            const game = new Game(JSON.parse(session.get('game')));
            console.dir(game);
            if (!game || !game.isCpuMove() || game.isOver()) return response.send('rejected');
            console.log(1);
            const moves = game.board.getPossibleMoves();
            console.dir(moves);
            let i = Math.round(Math.random() * moves.length);
            i = i == moves.length ? 0: i;
            const v = moves[i];
            console.dir(v);
            if (!game.move(v.x, v.y)) throw new Error('Не могу сделать ход!');
            session.put('game', JSON.stringify(game));
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    start({session, response}){
        let game = new Game();
        session.put('game', JSON.stringify(game));
        response.send('GameIsReady');
    }

    game({session, response}){
        const game = new Game(JSON.parse(session.get('game')));
        response.json(game.toClient());
    }
}

module.exports = GameController;