'use strict'

class Matrix8 extends Array{
    constructor(m){
        super(8);
        if (m){
            for (let i = 0; i < 8; i++){
                this[i] = [0,0,0,0,0,0,0,0];
                for (let j = 0; j < 8; j++){
                    this[i][j] = m[i][j]
                }
            }
        }
        else{
            for (let i = 0; i < 8; i++){
                this[i] = [0,0,0,0,0,0,0,0];
            }
        }
        
    }

    /**
     * 
     * @param {number[][]|Matrix8|Symmetry} res 
     * @returns {Matrix8|any}
     */
    getHorReflect(res){
        return Matrix8.horReflect(this, res);
    }

    
    /**
     * 
     * @param {number[][]|Matrix8|Symmetry} res 
     * @returns {Matrix8|any}
     */
    getVerReflect(res){
        return Matrix8.verReflect(this, res);
    }

    /**
     * 
     * @param {number[][]|Matrix8|Symmetry} res 
     * @returns {Matrix8|any}
     */
    getTransposed(res){
        return Matrix8.transpose(this, res);
    }

    /**
     * 
     * @param {number[][]|Matrix8|Symmetry} res 
     * @returns {Matrix8|any}
     */
    getRotated90(res) {
        return Matrix8.rotate90(this, res);
    }

    static horReflect(source, res){
        res = res ? res : new Matrix8();

        for(let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                res[i][7-j] = source[i][j];
            }
        }

        return res;
    }

    static verReflect(source, res){
        res = res ? res : new Matrix8();

        for(let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                res[7-i][j] = source[i][j];
            }
        }

        return res;
    }

    static transpose(source, res){
        res = res ? res : new Matrix8();
        
        for(let x = 0; x < 8; x++)
            for(let y = 0; y < 8; y++)
                res[x][y] = source[y][x];

        return res;
    }

    static rotate90(source, res){
        res = res ? res : new Matrix8();

        for(let x = 0; x < 8; x++)
            for(let y = 0; y < 8; y++)
                res[7-y][x] = source[x][y];

        return res;
    }
}

module.exports = Matrix8;