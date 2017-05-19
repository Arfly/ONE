
function Vector4( x, y, z, w) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = (w !== undefined) ? w : 1;

}

Vector4.prototype = {
    
    constructor: Vector4,

    isVector4: true,

    add: function ( v, w ) {

        if ( w !== undefined ) {
            console.warn( 'Vector4: .add() only accepts one argument.' );
            return false
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
        
    }
};

export { Vector4 }