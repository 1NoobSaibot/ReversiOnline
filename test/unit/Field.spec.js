const {test} = use('Test/Suite')('Field')
const Field = use('App/Models/Field');

let field;

test('Field/create', async ({}) => {
    field = await Field.create({
        dt: 0,
        last_time: Date.now() / 1000,
        options: [[{w: 1, d: 0, l: 0}]]
    });
});

test('Field.search()', async ({}) => {
    field = await Field.search([
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]);
});

test('Field.add()', async ({assert}) => {
    field.add(0, 7, 0);
    assert.deepEqual(field.options, [[{w:1, d:0, l:1}]]);
    field.add(1, 7, 2);
    assert.deepEqual(field.options, [[{w:1, d:0, l:1},{w:1, d:0, l:0}]]);
});

test('Field.options', async ({assert}) => {
    let options = field.getOptions();
    assert.deepEqual(options, [
        [{w:1, d:0, l:1},{w:1, d:0, l:0}, undefined, undefined, undefined, undefined, {w:1, d:0, l:0}, {w:1, d:0, l:1}],
        [{w:1, d:0, l:0}, undefined, undefined, undefined, undefined, undefined, undefined, {w:1, d:0, l:0}],
        undefined, undefined, undefined, undefined,
        [{w:1, d:0, l:0}, undefined, undefined, undefined, undefined, undefined, undefined, {w:1, d:0, l:0}],
        [{w:1, d:0, l:1},{w:1, d:0, l:0}, undefined, undefined, undefined, undefined, {w:1, d:0, l:0}, {w:1, d:0, l:1}],
    ]);
})

test('Field.save()', async ({}) => {
    await field.save();
});

test('field.delete()', async ({}) => {
    let field = await Field.findBy('dt', 0);
    if (field) await field.delete();
});