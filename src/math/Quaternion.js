
function Quaternion ( x, y, z, w ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

}

Quaternion.prototype = {

    
    
};

export { Quaternion };