import { Object3D } from '../core/Object3D.js';

function Scene () {

    Object3D.call(this);
    
    this.children = [];
    this.type = 'Scene';

}

Scene.prototype = Object.assign( Object.create( Object3D.prototype ), {

    add: function ( object3d ) {

        if ( object3d == undefined) {
            return console.warn('Scene.add(): add() need an object3d as argument.');
        }

        if ( object3d.type === 'Model' ) {

            this.children.push( object3d );

        } else {

            return console.error('Scene.add(): argument need to be object3d.');

        }

    }
})

export { Scene };