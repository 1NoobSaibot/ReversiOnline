'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Transform = use('App/Reversi/Transform');

class Field extends Model{
    static get table(){
        return 'field';
    }

    static boot() {
        super.boot()
        this.addTrait('NoTimestamp');
        this.addHook('beforeSave', (field) => {
            if (field.dirty.options) {
                field.options = from2Dto1D(field.options);
                field.options = JSON.stringify(field.options);
            }
            delete field.$attributes.transform;
        });
        this.addHook('afterFind', (field) => {
            field.options = JSON.parse(field.options);
            field.options = from1Dto2D(field.options);
        });
    }

    add(x, y, res){
        let point = this.transform.translate({x, y});
        x = point.x;
        y = point.y;

        if (!this.options[x]) this.options[x] = [];
        if (!this.options[x][y]) {
            this.options[x][y] = {
                w: res == 2 ? 1: 0,
                d: res == 1 ? 1: 0,
                l: res == 0 ? 1: 0
            };
        }
        else {
            let op = this.options[x][y];
            switch (res) {
                case 0: op.l++;
                    if (op.l >= 60000) cut(op);
                    break;
                case 1: op.d++;
                    if (op.d >= 60000) cut(op);
                    break;
                case 2: op.w++;
                    if (op.w >= 60000) cut(op);
                    break;
                default: throw new Error('Unexpected res in App/Models/Field.add(x, y, res)');
            }
        }
        this.last_time = Date.now() / 1000;
    }

    static get primaryKey () {
        return 'dt'
    }

    /**
     * 
     * @param {number[][]} m friend-foes board 
     */
    static async search(m){
        let transform = new Transform(m);
        transform = transform.toMinDt();
        let dt = transform.getDt();

        let field = await Field.findBy('dt', dt.toString());
        if (field) {
            field.transform = transform;
            return field;
        }
        return null;
    }

    getOptions(){
        //options => sharedOptions
        let sharedOptions = this.transform.shareOptions(this.options);

        //sharedOptions => translatedOptions
        let m = [];

        for (let i = 0; i < 8; i++){
            if (!sharedOptions[i]) continue;
            for (let j = 0; j < 8; j++){
                if (!sharedOptions[i][j]) continue;
                const {x, y} = this.transform.translateBack({x:i, y:j});

                if (!m[x]) m[x] = [];
                m[x][y] = sharedOptions[i][j];
            }
        }
        
        return m;
    }
}

module.exports = Field;

function cut(op){
    op.w = op.w / 2;
    op.d = op.d / 2;
    op.l = op.l / 2;
}

/**
 * 
 * @param {Object[]} options 
 */
function from1Dto2D(options){
    let m = [];
    for (let i = 0; i < options.length; i++){
        const {x, y, w, d, l} = options[i];
        if (!m[x]) m[x] = [];
        m[x][y] = {w, d, l};
    }
    return m;
}

function from2Dto1D(options){
    let m = [];
    for (let x = 0; x < options.length; x++){
        if (!options[x]) continue;
        for (let y = 0; y < options[x].length; y++){
            if (options[x][y]) {
                const {w, d, l} = options[x][y];
                m.push({x:x, y:y, w:w, d:d, l:l});
            }
        }
    }
    return m;
}