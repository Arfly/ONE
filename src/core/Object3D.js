import { Vector3 } from '../math/Vector3.js';
import { Quaternion } from '../math/Quaternion.js';


function Object3D () {

    this.up = new Vector3();
    this.position = new Vector3();
    this.quaternion = new Quaternion();
    this.nature = 'Object3D';

}

Object3D.prototype = {
    
};

export { Object3D };