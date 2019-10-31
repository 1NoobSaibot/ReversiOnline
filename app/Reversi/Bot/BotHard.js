'use strict'

module.exports = function (moves) {
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
