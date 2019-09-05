'use strict'

const { test } = use('Test/Suite')('Symmetry');
const Symmetry = use('App/Reversi/Symmetry');

test('new Symmetry()', async ({assert})=> {
    let symmetry = new Symmetry();
    assert.deepEqual(symmetry, [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    assert.equal(symmetry.h, true);
    assert.equal(symmetry.v, true);
    assert.equal(symmetry.md, true);
    assert.equal(symmetry.sd, true);
    assert.equal(symmetry.r90, true);
    assert.equal(symmetry.r180, true);
}) 