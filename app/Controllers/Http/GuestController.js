'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');
const Env = use('Env');

class GuestController{
    play({view}){
        let m = new Array(8);
        for (let i = 0; i < 8; i++){
            m[i] = new Array(8);
            for (let j = 0; j < 8; j++)
                m[i][j] = 0;
        }
        
        return view.render('game', { url: Env.get('APP_URL'), m});
    }
}

module.exports = GuestController;