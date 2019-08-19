'use strict'

const { test } = use('Test/Suite')('Example');
const UBigInt = use('App/Reversi/UBigInt');

test('ToBigInt() and toString()', async ({ assert }) => {
  for (let i = 0; i <= 100000; i++){
    let a = UBigInt.toUBigInt(i);
    assert.equal(i.toString(), a.toString());
  }
});

test('UBigInt.add(a, b)', async ({ assert }) => {
  for (let i = 0; i <= 1000; i++){
      for (let j = 0; j <= 1000; j++){
      let a = UBigInt.toUBigInt(i);
      let b = UBigInt.toUBigInt(j);
      let c = UBigInt.add(a, b);
      assert.equal((i + j).toString(), c.toString());
    }
  }
});

test('UBigInt.mul(a, b)', async ({ assert }) => {
  for (let i = 10000; i >= 0; i--){
    for (let j = 9; j >= 0; j--){
      let a = UBigInt.toUBigInt(i);
      let c = UBigInt.mul(a, j);
      if (i == 0 && j == 0) {
        console.dir(a);  
        console.dir(c);
      }
      assert.equal((i * j).toString(), c.toString());
    }
  }
});