'use strict'

const { test } = use('Test/Suite')('UBigInt');
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
      assert.equal((i * j).toString(), c.toString());
    }
  }
});

test('UBigInt.compare(a, b)', async ({ assert }) => {
  for (let i = 0; i <= 1000; i++){
      for (let j = 0; j <= 1000; j++){
      let a = UBigInt.toUBigInt(i);
      let b = UBigInt.toUBigInt(j);
      
      if (i > j) assert.equal(UBigInt.compare(a, b), 1);
      else if (i < j) assert.equal(UBigInt.compare(a, b), -1);
      else assert.equal(UBigInt.compare(a, b), 0);
    }
  }
});