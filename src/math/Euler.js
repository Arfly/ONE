function Euler( x, y, z, order ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.order = order || 'XYZ';

}

Euler.prototype = {

    isEuler: true

}

export { Euler };