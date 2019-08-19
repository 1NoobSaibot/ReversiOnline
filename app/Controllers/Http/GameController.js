'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');

class GameController{
    board({session, response}){
        const game = getGame(session);
        response.json(game.board.toEdgeArg());
    }

    move({session, request, response}){
        const {x, y} = request.all().params;

        try{
            const game = getGame(session);
            if (!game || game.isCpuMove() || !game.move(x, y)) return response.send('rejected');
            putGame(session, game);
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    cpuMove({session, response}){
        try{
            const game = getGame(session);
            if (!game || !game.isCpuMove() || game.isOver()) return response.send('rejected');
            const moves = game.board.getPossibleMoves();
            let i = Math.round(Math.random() * moves.length);
            i = i == moves.length ? 0: i;
            const v = moves[i];
            if (!game.move(v.x, v.y)) throw new Error('Не могу сделать ход!');
            putGame(session, game);
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }

    start({session, response}){
        try {
            let game, json = session.get('game');
            if (json){
                game = new Game(JSON.parse(json));
                game.printStack();
            }
            
            game = new Game();
            putGame(session, game);
            response.send('GameIsReady');
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