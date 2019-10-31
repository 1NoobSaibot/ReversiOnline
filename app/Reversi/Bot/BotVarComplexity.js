'use strict'

module.exports = function selectMove(moves) {
  for (let i = 0; i < moves.length; i++)
    moves[i].value = moves[i].w + moves[i].d * 0.5

  let sum = 0;
  for (let i = 0; i < moves.length; i++)
    sum += moves.value;

  for (let i = 1; i < moves.length; i++)
    moves[i].value += moves[i - 1].value;

  let r = Math.random() * sum;

  for (let i = 0; i < moves.length; i++)
    if (moves[i].value > r) return moves[i];
  return moves[moves.length - 1];
}
