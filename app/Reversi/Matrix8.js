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
     * @returns {Matrix8}
     */
    getHorReflect(){
        let res = new Matrix8();

        for(let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                res[i][7-j] = this[i][j];
            }
        }

        return res;
    }
    
    /**
     * @returns {Matrix8}
     */
    getVerReflect(){
        let res = new Matrix8();

        for(let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                res[7-i][j] = this[i][j];
            }
        }

        return res;
    }

    /**
     * @returns {Matrix8}
     */
    getTransposed(){
        let res = new Matrix8();
        
        for(let x = 0; x < 8; x++)
            for(let y = 0; y < 8; y++)
                res[x][y] = this[y][x];

        return res;
    }


    /**
     * @returns {Matrix8}
     */
    getRotated90() {
        let res = new Matrix8();

        for(let x = 0; x < 8; x++)
            for(let y = 0; y < 8; y++)
                res[7-y][x] = this[x][y];

        return res;
    }
}

module.exports = Matrix8;