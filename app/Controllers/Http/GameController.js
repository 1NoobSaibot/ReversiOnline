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
    const params = request.all();
    const { x, y } = params

    const game = getGame(session);
    if (!game || game.isCpuMove() || !game.move(x, y)) {
      return response.json({ status: 'fail' })
    }
    if (game.isOver()) Bot.learn(game).catch((e) => { console.dir(e) })
    putGame(session, game)
    return response.json({
      status: 'success',
      game: await game.toClient(params)
    })
  }

  async cpuMove({ session, request, response }) {
    const params = request.all()
    const game = getGame(session)
    if (!game || game.isOver()) return response.json({
      status: 'fail',
      description: game ? 'Игра окончена' : 'Игра не запущена'
    })

    let v = await Bot.move(game.board, session.get('hard'))

    if (!game.move(v.x, v.y)) return response.json({
      status: 'fail',
      description: 'Бот не смог совершить ход',
      board: await game.board.toClient({ tips: false }),
      position: v
    })

    if (game.isOver()) Bot.learn(game).catch((e) => { console.dir(e) })
    putGame(session, game)
    return response.json({
      status: 'success',
      game: await game.toClient(params)
    })
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
