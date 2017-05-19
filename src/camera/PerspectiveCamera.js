import { Camera } from './Camera.js';
import { Matrix4 } from '../math/Matrix4.js';

function PerspectiveCamera ( fov, aspect, near, far ) {

    Camera.call( this );

    this.aspect = aspect || 2;
    this.fov = fov || 75;
    this.near = near || 0.01;
    this.far = far || 1000;
    this.view = null;
    this.filmGauge = 35;    // width of the film (default in millimeters)
    this.filmOffset = 0;    // horizontal film offset (same unit as gauge)
    this.projectionMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.modelMatrix = new Matrix4();
    this.mvpMatrix = new Matrix4();

    this.init();

}

PerspectiveCamera.prototype = {

    init: function () {

        this.updateProjectionMatrix();
        this.lookAt( this.target );
        this.update();

    },

    updateProjectionMatrix: function () {

        var near = this.near,
            top = near * Math.tan( this.fov * Math.PI / 360  ),
            height = 2 * top,
            width = this.aspect * height,
            left = - 0.5 * width,
            view = this.view;

        if ( view !== null ) {

            var fullWidth = view.fullWidth,
                fullHeight = view.fullHeight;

            left += view.offsetX * width / fullWidth;
            top -= view.offsetY * height / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;

        }

        var skew = this.filmOffset;
        if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

        this.projectionMatrix.makeFrustum( left, left + width, top - height, top, near, this.far );

    },

    getFilmWidth: function () {

        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min( this.aspect, 1 );

    },

    lookAt: function ( vector ) {
        
        if ( vector.isVector3 ) {

            this.target.copy( vector );

        }

        if ( !vector.isVector3 && arguments.length == 3 ) {

            if ( typeof arguments[0] !== 'number' ) {

                return console.error( 'arguments 0 is not a number.' );

            }

            if ( typeof arguments[1] !== 'number' ) {

                return console.error( 'arguments 0 is not a number.' );

            }

            if ( typeof arguments[2] !== 'number' ) {

                return console.error( 'arguments 0 is not a number.' );

            }

            this.target.set( arguments[0], arguments[1], arguments[2] );

        }
        

        var m1 = new Matrix4();

        m1.lookAt( this.position, this.target, this.up );

        this.viewMatrix.fromArray( m1.elements );
        
    },

    update: function () {

        this.updateProjectionMatrix();
        
        this.lookAt( this.target );

        var pMat = this.projectionMatrix.clone();
        var vMat = this.viewMatrix.clone();
        var mMat = this.modelMatrix.clone();

        var mvpMatrix = pMat.multiply( vMat ).multiply( mMat );
        this.mvpMatrix.fromArray( mvpMatrix.elements );

    }

};

export { PerspectiveCamera };