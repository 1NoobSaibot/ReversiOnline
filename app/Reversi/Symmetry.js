'use strict'

const Matrix8 = use('App/Reversi/Matrix8');

class Symmetry extends Matrix8 {
    constructor(m){
        if (m){
            super(m);
            this.h = this.isHorSymmetry();
            this.v = this.isVerSymmetry();
            this.md = this.isMDSymmetry();
            this.sd = this.isSDSymmetry();
            this.r90 = this.isR90Symmetry();
            this.r180 = this.isR180Symmetry();
        }
        else{
            super();
            this.h = true;
            this.v = true;
            this.md = true;
            this.sd = true;
            this.r90 = true;
            this.r180 = true;
        }
    }

    isHorSymmetry() {
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 8; x++){
                if (this[x][y] != this[x][7-y]) return false;
            }
        }
        return true;
    }

    isVerSymmetry() {
        for (let x = 0; x < 4; x++){
            for (let y = 0; y < 8; y++){
                if (this[x][y] != this[7-x][y]) return false;
            }
        }
        return true;
    }

    /**
     * Main Diagonal
     * TODO: simplify
     * @returns {boolean}
     */
    isMDSymmetry(){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++) {
                if (this[x][y] != this[y][x]) return false;
            }
        }

        return true;
    }

    /**
     * Side Diagonal
     * TODO: simplify
     * @returns {boolean}
     */
    isSDSymmetry(){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++) {
                if (this[x][y] != this[7-y][7-x]) return false;
            }
        }

        return true;
    }

    /**
     * 
     */
    isR90Symmetry(){
        for (let x = 0; x < 4; x++){
            for (let y = 0; y < 4; y++){
                if (this[x][y] != this[7-y][x]) return false;
                if (this[7-x][7-y] != this[y][7-x]) return false;
                if (this[x][y] != this[7-x][7-y]) return false;
            }
        }
        return true;
    }

    /**
     * 
     */
    isR180Symmetry(){
        for (let x = 0; x < 4; x++){
            for (let y = 0; y < 8; y++){
                if (this[x][y] != this[7-x][7-y]) return false;
            }
        }
        return true;
    }


    /**
     * @returns {Symmetry}
     */
    getHorReflect(){
        if (this.h) {
            return this;
        }
        
        let res = Matrix8.horReflect(this, new Symmetry());
        res.md = this.sd;
        res.sd = this.md;
        res.h = this.h;
        res.v = this.v;
        res.r90 = this.r90;
        res.r180 = this.r180;
        
        return res;
    }
    
    /**
     * @returns {Matrix8}
     */
    getVerReflect(){
        if (this.v) {
            return this;
        }
        
        let res = Matrix8.verReflect(this, new Symmetry());
        res.md = this.sd;
        res.sd = this.md;
        res.h = this.h;
        res.v = this.v;
        res.r90 = this.r90;
        res.r180 = this.r180;
        
        return res;
    }

    /**
     * @returns {Matrix8}
     */
    getTransposed(){
        if (this.md) {
            return this;
        }
        
        let res = Matrix8.transpose(this, new Symmetry());
        res.md = this.md;
        res.sd = this.sd;
        res.h = this.v;
        res.v = this.h;
        res.r90 = this.r90;
        res.r180 = this.r180;

        return res;
    }


    /**
     * @returns {Symmetry}
     */
    getRotated90() {
        if (this.r90) {
            return this;
        }
        
        let res = Matrix8.rotate90(this, new Symmetry());
        res.md = this.sd;
        res.sd = this.md;
        res.h = this.v;
        res.v = this.h;
        res.r90 = this.r90;
        res.r180 = this.r180;

        return res;
    }

    groupUp(points){
        let groups = [];

        for (let p = 0; p < points.length;){
            let sums = this.getPointsOfGroupWith(points[p]);
            groups.push(sums);
            deleteFrom(points, sums);
        }

        return groups;
    }

    getPointsOfGroupWith(point){
        let res = [point];
        this.checkH([point]);
        this.checkV(res);
        this.checkMD(res);
        this.checkSD(res);
        this.checkR90(res);
        this.checkR180(res);
        return res;
    }

    checkH(ps){
        if (this.h) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = h(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }

    checkV(ps){
        if (this.v) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = v(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }
    
    checkMD(ps){
        if (this.md) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = md(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }
    checkSD(ps){
        if (this.sd) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = sd(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }

    checkR90(ps){
        if (this.r90) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = r90(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }

    checkR180(ps){
        if (this.r180) {
            const length = ps.length;
            for (let i = 0; i < length; i++){
                let points = r180(ps[i]);
                for (let j = 0; j < points.length; j++)
                    if (!included(ps, points[j])) ps.push(points[j]);
            }
        }
    }
}

module.exports = Symmetry;

function included(points, p){
    for (let i = 0; i < points.length; i++){
        if (points[i].x == p.x && points[i].y == p.y) return true;
    }
    return false;
}

function h(point){
    return [{
        x: point.x,
        y: 7 - point.y
    }]
}

function v(point){
    return [{
        x: 7 - point.x,
        y: point.y
    }]
}

function md(point){
    return [{
        x: point.y,
        y: point.x
    }]
}

function sd(point){
    return [{
        x: 7 - point.y,
        y: 7 - point.x
    }]
}

function r90(point){
    return [{
        x: 7 - point.y,
        y: point.x
    },
    {
        x: 7 - point.x,
        y: 7 - point.y
    },
    {
        x: point.y,
        y: 7 - point.x
    }]
}

function r180(point){
    return [{
        x: 7 - point.x,
        y: 7 - point.y
    }]
}

/** Delete items from arr */
function deleteFrom(arr, items){
    for (let i = 0; i < items.length; i++){
        for (let p = 0; p < arr.length; p++){
            if (items[i].x == arr[p].x && items[i].y == arr[p].y){
                arr.splice(p, 1);
                p--;
            }
        }
    }
}