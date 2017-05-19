

function WebGLBuffer ( gl, program ) {

    if ( gl == undefined ) {

        return console.error( 'Can not get WebGL context.' );

    }

    if ( program == undefined ) {

        return console.error( 'Lack of program argument.' );

    }

    this.context = gl;
    this.pointNum = 0;
    this.program = program;

}

WebGLBuffer.prototype = {

    bindData: function ( scene, camera ) {

        if ( scene.type !== 'Scene' ) {

            return console.error( 'Arguments 0 is not type of Scene.' );

        }

        var _this = this;

        var gl = this.context;
        

        var children = scene.children;

        children.forEach( function ( value ) {

            _this._createVertexBuffer( value.vertex );

            if ( value.material !== undefined ) {

                _this._createFragVertex( value.uv );
                value.material._load( _this.context, _this.program );

            }

            _this.pointNum += value.count;

        } );

        if ( camera && camera.type !== 'Camera') {

            return console.error( 'WebGLBuffer.bindData: arguments 0 require type of Camera.' );
        }

        if ( camera && camera.type == 'Camera' ) {

            _this._setMvp( camera );

        }

    },

    _createVertexBuffer: function ( data ) {

        var gl = this.context;

        var bufferData = new Float32Array( data );

        var buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

        gl.bufferData( gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW );

        var vertexLoc = gl.getAttribLocation( this.program, 'position');

        gl.enableVertexAttribArray( vertexLoc );

        gl.vertexAttribPointer( vertexLoc, 3, gl.FLOAT, false, 0, 0 );

    },

    _createFragVertex: function ( data ) {

        var gl = this.context;

        var bufferData = new Float32Array( data );

        var buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

        gl.bufferData( gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW );

        var uvCoordLoc = gl.getAttribLocation( this.program, 'textureCoord');

        gl.enableVertexAttribArray( uvCoordLoc );

        gl.vertexAttribPointer( uvCoordLoc, 2, gl.FLOAT, false, 0, 0 );

    },

    _setMvp: function ( camera ) {

        var mvpMatrix = this.context.getUniformLocation( this.program, "mvpMatrix");
        
        camera.update();
        
        this.context.uniformMatrix4fv( mvpMatrix, false, camera.mvpMatrix.elements );

    }
    
};

export { WebGLBuffer };