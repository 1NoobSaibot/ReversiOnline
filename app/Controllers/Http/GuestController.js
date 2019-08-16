'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');
const Env = use('Env');

class GuestController{
    play({view, session}){
        let game = new Game();
        session.put('game', JSON.stringify(game));

        let edgeArgs = {
            state: 'game', 
            board: {
                m: game.board.getTransposedMatrix()
            }, 
            url: Env.get('APP_URL') 
        };
        return view.render('game', edgeArgs);
    }

    move({session, view, request}){
        const {x, y} = request.all();
        const game = new Game(JSON.parse(session.get('game')));
        game.move(x, y);
        session.put('game', JSON.stringify(game));

        const board = {
            m: game.board.getTransposedMatrix()
        }

        return view.render('game', {state: 'game', board, url: Env.get('APP_URL') });
    }
}

module.exports = GuestController;