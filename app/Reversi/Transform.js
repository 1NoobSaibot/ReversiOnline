'use strict'

/** @type {typeof import('App/Reversi/Determinant.js')}*/
const getDt = use('App/Reversi/Determinant');
const Symmetry = use('App/Reversi/Symmetry');
const UBigInt = use('App/Reversi/UBigInt');

class Transform {
    /**
     * @param {Matrix8} m
     */
    constructor (m) {
        this.m = new Symmetry(m);
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
            point = this[this.trs[i]](point);
        }

        let points = this.m.getPointsOfGroupWith(point);
        points.sort((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            return 0;
        });

        return points[0];
    }

    translateBack(point) {
        for (let i = this.trs.length - 1; i >= 0; i--){
            point = this['_' + this.trs[i]](point);
        }
        return point;
    }

    getGroups(moves){
        return this.m.groupUp(moves);
    }

    /**
     * 
     * @param {object[][]} options 
     * @returns {object[][]}
     */
    shareOptions(options){
        let res = [];

        for (let x0 = 0; x0 < 8; x0++) {
            if (!options[x0]) continue;
            for (let y0 = 0; y0 < 8; y0++){
                if(!options[x0][y0]) continue;
                let group = this.m.getPointsOfGroupWith({x:x0, y:y0});
                for (let i = 0; i < group.length; i++){
                    const {x, y} = group[i];
                    if (!res[x]) res[x] = [];
                    if (res[x][y]) throw new Error('This point must be empty!');
                    res[x][y] = options[x0][y0];
                }
            }
        }

        return res;
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
    
    _h(point){
        return {
            x: point.x,
            y: 7- point.y
        }
    }

    _r90(point){
        return{
            x: point.y,
            y: 7 - point.x
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