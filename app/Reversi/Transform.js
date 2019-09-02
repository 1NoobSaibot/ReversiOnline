'use strict'

/** @type {typeof import('App/Reversi/Determinant.js')}*/
const getDt = use('App/Reversi/Determinant');
/** @type {typeof import from('App/Reversi/Matrix8.js')}*/
const Matrix8 = use('App/Reversi/Matrix8');
const UBigInt = use('App/Reversi/UBigInt');

class Transform {
    /**
     * @param {Matrix8} m
     */
    constructor (m) {
        this.m = new Matrix8(m);
        this.trs = [];
    }

    horReflect(){
        let res = new Transform(this.m.getHorReflect());
        res.trs = this.trs.concat('h');
        return res;
    }

    verReflect(){
        let res = new Transform(this.m.getVerReflect());
        res.trs = this.trs.concat('v');
        return res;
    }

    mainDiaReflect(){
        let res = new Transform(this.m.getTransposed());
        res.trs = this.trs.concat('md');
        return res;
    }

    rotate90(){
        let res = new Transform(this.m.getRotated90());
        res.trs = this.trs.concat('r90');
        return res;
    }

    toMinDt(){
        return searchMinDt(this);
    }

    getDt(){
        return getDt(this.m);
    }

    translate(point) {
        for (let i = 0; i < this.trs.length; i++){
            console.dir(point);
            point = this[this.trs[i]](point);
        }
        return point;
    }

    h(point){
        return {
            x: point.x,
            y: 7- point.y
        }
    }

    r90(point){
        return{
            x: 7 - point.y,
            y: point.x
        }
    }
}

module.exports = Transform;

function searchMinDt(tr){
    let min = {
        dt: getDt(tr.m),
        tr: tr
    }

    for (let i = 1; i < 4; i++){
        tr = tr.rotate90();
        min = transformMin(min, tr);
    }

    tr = tr.horReflect();
    min = transformMin(min, tr);

    for (let i = 1; i < 4; i++){
        tr = tr.rotate90();
        min = transformMin(min, tr);
    }
    return min.tr;
}

function transformMin(min, tr2){
    let dt = tr2.getDt();
    if (UBigInt.compare(min.dt, dt) <= 0) return min;
    return {
        dt,
        tr: tr2
    }
}