
function Vector3( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
            
}

Vector3.prototype = {
    
    constructor: Vector3,

    isVector3: true,

    add: function ( v, w ) {

        if ( w !== undefined ) {
            console.warn( 'Vector3: .add() only accepts one argument.' );
            return false
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
        
    },

    copy: function ( v ) {

        if ( v == undefined ) {

            return console.error( 'Vector3.copy: argument 0 is undefined.' );
        }

        if ( !v.isVector3 ) {

            return console.error( 'Vector3.copy: argument 0 is not type of Vector3.' );
        }

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;

    },

    set: function ( x, y, z ) {

        if ( x == undefined || y == undefined || z == undefined ) {

            return console.error( 'Lack of argument: x, y or z.' );

        }

        this.x = x;
        this.y = y;
        this.z = z;

        return this;
        
    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    normalize: function () {

        var len = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
        this.x /= len;
        this.y /= len;
        this.z /= len;

        return this;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    }

};

export { Vector3 }