import { WebGLProgram } from './WebGLProgram.js';
import { WebGLBuffer } from './WebGLBuffer.js';
import { TUBE } from '../core/Tube.js';

var init = true;

function WebGLRenderer ( domEle ) {

    var _this = this;

    var _canvas = domEle !== undefined ? domEle : document.createElement('canvas');
    var _gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');

    if ( domEle == undefined ) {

        document.body.appendChild( _canvas );

    }

    if ( _gl === null ) {

        return console.error( 'WebGL not support.' );

    }


    var program = new WebGLProgram( _gl );

    _gl.useProgram( program.program );

    TUBE.state.program = program.program;

    var buffer = new WebGLBuffer( _gl, program.program );

    


    TUBE.subscribe( 'dataInit', initData );

    function initData () {
        
        buffer.bindData( TUBE.state.scene, TUBE.state.camera );
        
        _this.count = buffer.pointNum;

        console.log( 'TUBE message: dataInit.' );
        
    }

    TUBE.subscribe( 'updateMVP', updateMVP );

    function updateMVP () {

        buffer._setMvp( TUBE.state.camera );

    }

    this.context = _gl;
    this.domEle = _canvas;
    this.count = 0;
    this.stereo = false;

    
}

WebGLRenderer.prototype = {

    render: function ( scene, camera ) {

        if ( init ) {
            
            TUBE.state.scene = scene;
            TUBE.state.camera = camera;
            TUBE.once( 'dataInit' );
            init = false;

        }

        TUBE.publish('updateMVP');

        var _gl = this.context;

        if ( this.stereo ) {//test code

            _gl.enable( _gl.SCISSOR_TEST );

            _gl.clearColor(0,0,0,1);

            _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

            _gl.scissor( 0,0, window.innerWidth / 2, window.innerHeight );
            
            _gl.viewport( 0, 0, window.innerWidth / 2, window.innerHeight );
            
            _gl.drawArrays( _gl.TRIANGLES, 0, this.count );

            // _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

            _gl.scissor( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
            
            _gl.viewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
            
            _gl.drawArrays( _gl.TRIANGLES, 0, this.count );

        } else {

            _gl.disable( _gl.SCISSOR_TEST );

            _gl.clearColor(0,0,0,1);

            _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

            _gl.viewport( 0, 0, window.innerWidth, window.innerHeight );
            
            _gl.drawArrays( _gl.TRIANGLES, 0, this.count );

        }

    },

    setSize: function ( width, height ) {

        this.domEle.width = width || window.innerWidth;
        this.domEle.height = height || window.innerHeight;

        if ( TUBE.state.camera ) {
            TUBE.state.camera.aspect = this.domEle.width/this.domEle.height;
            TUBE.state.camera.updateProjectionMatrix();
            TUBE.publish('updateMVP');
        }
        

        this.context.viewport( 0, 0, this.domEle.width, this.domEle.height );


    }

};

export { WebGLRenderer };