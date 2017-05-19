import { Object3D } from '../core/Object3D.js';

function Model () {

    Object3D.call(this);
    
    this.vertex = [];
    this.fragment = [];
    this.uv = [];
    this.count = 0;
    this.type = 'Model';
    this.material = undefined;

}

Model.prototype = {
    
};

export { Model };