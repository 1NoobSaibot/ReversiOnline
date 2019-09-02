'use strict'

/** @typedef {import('App/Reversi/UBigInt')} */
const UBigInt = use('App/Reversi/UBigInt');

/**
 * 
 * @param {number[][]} m number[8][8]
 * @returns {UBigInt} 
 */
function getDt(m){
    let sum = new UBigInt();

    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            sum = UBigInt.mul(sum, 3);
            sum = UBigInt.add(sum, m[x][y]);
        }
    }

    return sum;
}

module.exports = getDt;