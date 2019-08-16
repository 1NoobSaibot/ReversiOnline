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
            if (!game || !game.move(x, y)) return response.send('rejected');
            session.put('game', JSON.stringify(game));
            return response.send('accepted');
        }catch(e){
            console.log(e.message);
        }
    }
}

module.exports = GameController;