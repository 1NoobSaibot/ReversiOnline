'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Field extends Model{
    async getOption(x, y){
        return await this.hasMany(MoveOption, 'id', 'field_id').where('xy', x*8 + y);
    }
    
    static get table(){
        return 'field';
    }

    static boot() {
        super.boot()
        this.addTrait('NoTimestamp');
        this.addHook('beforeSave', (field) => {
            if (field.dirty.options) {
                field.options = JSON.stringify(field.options);
            }
        });
        this.addHook('afterFind', (field) => {
            field.options = JSON.parse(field.options);
        });
    }

    add(x, y, res){
        if (!this.options[x]) this.options[x] = [];
        if (!this.options[x][y]) this.options[x][y] = {
            w: res == 2 ? 1: 0,
            d: res == 1 ? 1: 0,
            l: res == 0 ? 1: 0
        }
        else {
            let op = this.options[x][y];
            switch (res) {
                case 0: op.l++;
                    if (op.l > 60000) cut(op);
                    break;
                case 1: op.d++;
                    if (op.d > 60000) cut(op);
                    break;
                case 2: op.w++;
                    if (op.w > 60000) cut(op);
                    break;
                default: throw new Error('Unexpected res in App/Models/Field.add(x, y, res)');
            }
        }
    }
}

module.exports = Field;

function cut(op){
    op.w = op.w / 2;
    op.d = op.d / 2;
    op.l = op.l / 2;
}