'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/lucid/src/Database')} */

const Game = use('App/Reversi/Game');
const Board = use('App/Reversi/Board');
const Field = use('App/Models/Field');
const Transform = use('App/Reversi/Transform');

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
      if (game.isOver()) getExperience(game).catch((e) => { console.dir(e) });
      putGame(session, game);
      return response.send('accepted');
    } catch (e) {
      console.dir(e);
    }
  }

  async cpuMove({ session, response }) {
    try {
      const game = getGame(session);
      if (!game || !game.isCpuMove() || game.isOver()) return response.send('rejected');
      let v;

      const field = await Field.search(game.board.getFriendsFoes());
      const moves = game.board.getPossibleMoves();
      if (!field) {
        let i = Math.round(Math.random() * moves.length);
        i = (i == moves.length ? 0 : i);
        v = moves[i];
      }
      else {
        const probabilities = field.getOptions();
        bindProbabilitiesToMoves(moves, probabilities);
        v = selectMove(moves, session.get('hard'));
      }

      if (!game.move(v.x, v.y)) throw new Error('Не могу сделать ход!');
      if (game.isOver()) getExperience(game).catch((e) => { console.dir(e) });
      putGame(session, game);
      return response.send('accepted');
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

async function getExperience(game) {
  //Сбор игровой статистики
  const winner = game.getWinner(); //TODO

  const stack = game.stack;
  for (let i = 0; i < stack.length; i++) {
    const move = stack[i];
    let field = await Field.search(move.ffm);
    if (!field) {
      let transform = new Transform(move.ffm);
      transform = transform.toMinDt();
      let groups = transform.getGroups(move.possibleMoves);
      if (groups.length > 1) {
        const { x, y } = transform.translate({ x: move.x, y: move.y });
        let options = [];
        options[x] = [];
        options[x][y] = getNewOption(winner, move.player);
        field = await Field.create({
          dt: transform.getDt().toString(),
          last_time: Date.now() / 1000,
          options
        });
      }
    }
    else {
      const result = getResult(winner, move.player);
      field.add(move.x, move.y, result);
    }
    if (field) await field.save();
  }
}

function getNewOption(winner, player) {
  if (winner == Board.Cell.Empty) return { w: 0, d: 1, l: 0 };
  if (winner == player) return { w: 1, d: 0, l: 0 };
  return { w: 0, d: 0, l: 1 };
}

function getResult(winner, player) {
  if (winner == Board.Cell.Empty) return 1;
  if (winner == player) return 2;
  return 0;
}

function bindProbabilitiesToMoves(moves, probs) {
  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i];
    if (!probs[x] || !probs[x][y]) {
      moves[i].value = 0.5;
      moves[i].w = 0.333;
      moves[i].d = 0.333;
      moves[i].l = 0.333;
    }
    else attachValue(moves[i], probs[x][y]);
  }
}

function attachValue(move, probs) {
  const sum = (probs.w + probs.d + probs.l) * 1.0;
  move.value = sum == 0 ? 0.5 : (probs.d / (sum * 2) + probs.w / sum);
  move.w = probs.w / sum;
  move.d = probs.d / sum;
  move.l = probs.l / sum;
}

function selectMove(moves, hard) {
  if (typeof(hard) === 'string') hard = hard === 'true'
  if (hard) {
    //Выбрать ходы с максимальным показателем шанса на победу
    let max = [moves[0]]
    for (let i = 1; i < moves.length; i++) {
      if (max[0].w > moves[i].w) continue
      if (max[0].w == moves[i].w) max.push(moves[i])
      else max = [moves[i]]
    }
    if (max.length == 1) return max[0]

    //Выбрать среди самых победных ходов самый ничейный
    let max2 = [max[0]]
    for (let i = 1; i < max.length; i++) {
      if (max2[0].d > max[i].d) continue
      if (max2[0].d == max[i].d) max2.push(max[i])
      else max2 = [max[i]]
    }
    if (max2.length == 1) return max2[0]
    let index = Math.round(Math.random() * max2.length)
    if (index >= max2.length) index = 0
    return max2[index]
  }
  else {
    let sum = 0;
    for (let i = 0; i < moves.length; i++)
      sum += moves.value;

    for (let i = 1; i < moves.length; i++)
      moves[i].value += moves[i - 1].value;

    let r = Math.random() * sum;

    for (let i = 0; i < moves.length; i++)
      if (moves[i].value > r) return moves[i];
  }
  return moves[moves.length - 1];
}
