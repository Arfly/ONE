import { Object3D } from '../core/Object3D.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Vector4 } from '../math/Vector4.js';
import { Vector3 } from '../math/Vector3.js';


function Camera () {

    this.type = 'Camera';
    
    this.up = new Vector3( 0, 1, 0 );
    this.position = new Vector3();
    this.target = new Vector3( 0, 0, 1 );
    this.matrix = null;
    
}

Camera.prototype = {

    lookAt: function ( target ) {

        this.target.copy( target );

    },

    setPosition: function ( x, y, z ) {

        this.position.set( x, y, z );

    }
    
};

export { Camera };