'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game')
const Bot = use('App/Reversi/Bot/index')


class GameController {
  board({ session, response }) {
    const game = getGame(session);
    response.json(game.board.toEdgeArg());
  }

  async move({ session, request, response }) {
    const { x, y } = request.all();

    try {
      const game = getGame(session);
      if (!game || game.isCpuMove() || !game.move(x, y)) return response.send('rejected');
      if (game.isOver()) Bot.learn(game).catch((e) => { console.dir(e) });
      putGame(session, game);
      return response.send('accepted');
    } catch (e) {
      console.dir(e);
    }
  }

  async cpuMove({ session, response }) {
    try {
      const game = getGame(session);
      if (!game || game.isOver()) return response.send('rejected')

      let v = await Bot.move(game.board, session.get('hard'))

      if (!game.move(v.x, v.y)) throw new Error('Не могу сделать ход!')
      if (game.isOver()) Bot.learn(game).catch((e) => { console.dir(e) })
      putGame(session, game)
      return response.send('accepted')
    } catch (e) {
      console.dir(e);
    }
  }

  start({ session, response }) {
    try {
      let game = new Game();
      putGame(session, game);
      return response.send('GameIsReady');
    }
    catch (e) { console.log(e.message); }
  }

  async game({ session, request, response }) {
    const params = request.all()
    const game = getGame(session);
    response.json(await game.toClient(params));
  }

  setCpuMode ({ session, request }) {
    const { hard } = request.all()
    session.put('hard', hard)
  }
}

module.exports = GameController;


function getGame(session) {
  return new Game(JSON.parse(session.get('game')));
}

function putGame(session, game) {
  session.put('game', JSON.stringify(game));
}
