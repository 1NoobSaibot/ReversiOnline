'use strict'

const digits = 1;
const limit = getLimitFromDigits();

class UBigInt{
    constructor(){
        this.m = new Array();
    }

    /**
     * 
     * @param {UBigInt|number} a unsigned big integer
     * @param {UBigInt|number} b unsigned big integer
     * @returns {UBigInt} new unsigned big integer
     */
    static add(a, b){
        if (typeof(a) == 'number') a = UBigInt.toUBigInt(a);
        if (typeof(b) == 'number') b = UBigInt.toUBigInt(b);
        let res = new UBigInt();
        res.m = addArrays(a.m, b.m);
        return res;
    }

    /**
     * 
     * @param {UBigInt} a
     * @param {number} b
     * @returns {UBigInt} new unsigned big integer
     */
    static mul(a, b){
        let res = new UBigInt();
        res.m = mulArrayAndNumber(a.m, Math.trunc(Math.abs(+b)));
        return res;
    }

    static toUBigInt(arg){
        let res = new UBigInt();

        for (let i = 0; arg > 0; i++){
            res.m[i] = arg % limit;
            arg = (arg - res.m[i]) / limit;
        }

        return res;
    }

    toString(){
        let i = this.m.length - 1;
        let res = this.m[i] === undefined ? '0' : this.m[i].toString();
        for (i--; i >= 0; i--){
            res += getPaddedInt(this.m[i]);
        }
        return res;
    }

    /**
     * -1 when a < b
     * 0 when a == b
     * 1 when a > b
     * @param {UBigInt} a 
     * @param {UBigInt} b 
     * @returns {number}
     */
    static compare(a, b){
        let iStart = a.m.length > b.m.length ? a.m.length : b.m.length;
        iStart--;

        for (let i = iStart; i >= 0; i--){
            let _a = a.m[i] ? a.m[i] : 0;
            let _b = b.m[i] ? b.m[i] : 0;
            if (_a > _b) return 1;
            if (_a < _b) return -1;
        }

        return 0;
    }
}

module.exports = UBigInt;

/**
 * 
 * @param {number[]} a 
 * @param {number[]} b 
 * @returns {number[]}
 */
function addArrays(a, b){
    let c = new Array();
    for (let i = 0; i < a.length || i < b.length; i++){
        c[i] =  (c[i] === undefined ? 0 : c[i]) + 
                (a[i] === undefined ? 0 : a[i]) + 
                (b[i] === undefined ? 0 : b[i]);

        if (c[i] >= limit){
            let mod = c[i] % limit;
            let div = (c[i] - mod) / limit;
            c[i] = mod;
            c[i+1] = div;
        }
    }
    return c;
}

/**
 * 
 * @param {number[]} a 
 * @param {number} b 
 */
function mulArrayAndNumber(a, b){
    let c = new Array();
    if (b == 0) return c;

    for (let i = 0; i < a.length; i++){
        c[i] = ((a[i] === undefined ? 0 : a[i]) * b) + (c[i] === undefined ? 0 : c[i]);
        if (c[i] >= limit){
            let mod = c[i] % limit;
            let div = (c[i] - mod) / limit;
            c[i] = mod;
            c[i+1] = div;
        }
    }
    return c;
}

function getLimitFromDigits(){
    let res = 1;
    for (let i = 0; i < digits; i++){
        res *= 10;
    }
    return res;
}

function getPaddedInt(arg){
    let str = (+arg).toString();
    while (str.length < digits) 
        str = '0' + str;
    return str;
}