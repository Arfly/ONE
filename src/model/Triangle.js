import { Model } from './Model.js';

function Triangle() {

    Model.call(this);
    this.vertex = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0,  0.0,  0.0
    ];

}

export { Triangle };