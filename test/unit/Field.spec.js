const {test} = use('Test/Suite')('Field')
const Field = use('App/Models/Field');

let field;

test('Field/create', async ({}) => {
    field = await Field.create({
        dt: 0,
        last_time: Date.now() / 1000,
        options: [[{w: 1, d: 0, l: 0}]]
    });
    console.dir(field);
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
    console.dir(field);
});

test('Field.add()', async () => {
    field.add(0, 0, 0);
});

test('Field.save()', async ({}) => {
    await field.save();
});

test('field.delete()', async ({}) => {
    let field = await Field.findBy('dt', 0);
    if (field) await field.delete();
});