(function (exports) {
'use strict';

function Vector3( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
            
}

Vector3.prototype = {
    
    constructor: Vector3,

    isVector3: true,

    add: function ( v, w ) {

        if ( w !== undefined ) {
            console.warn( 'Vector3: .add() only accepts one argument.' );
            return false
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
        
    },

    copy: function ( v ) {

        if ( v == undefined ) {

            return console.error( 'Vector3.copy: argument 0 is undefined.' );
        }

        if ( !v.isVector3 ) {

            return console.error( 'Vector3.copy: argument 0 is not type of Vector3.' );
        }

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;

    },

    set: function ( x, y, z ) {

        if ( x == undefined || y == undefined || z == undefined ) {

            return console.error( 'Lack of argument: x, y or z.' );

        }

        this.x = x;
        this.y = y;
        this.z = z;

        return this;
        
    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    normalize: function () {

        var len = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
        this.x /= len;
        this.y /= len;
        this.z /= len;

        return this;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    }

};

function Quaternion ( x, y, z, w ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

}

Quaternion.prototype = {

    
    
};

function Object3D () {

    this.up = new Vector3();
    this.position = new Vector3();
    this.quaternion = new Quaternion();
    this.nature = 'Object3D';

}

Object3D.prototype = {
    
};

function Matrix4 (e11, e12, e13, e14, e21, e22, e23, e24, e31, e32, e33, e34, e41, e42, e43, e44 ) {

    this.elements = new Float32Array([

        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1

    ]);

}

Matrix4.prototype = {

    constructor: Matrix4,
    
    set: function ( e11, e12, e13, e14, e21, e22, e23, e24, e31, e32, e33, e34, e41, e42, e43, e44 ) {

        var te = this.elements;

        te[ 0 ] = e11; te[ 4 ] = e12; te[ 8 ] = e13; te[ 12 ] = e14;
        te[ 1 ] = e21; te[ 5 ] = e22; te[ 9 ] = e23; te[ 13 ] = e24;
        te[ 2 ] = e31; te[ 6 ] = e32; te[ 10 ] = e33; te[ 14 ] = e34;
        te[ 3 ] = e41; te[ 7 ] = e42; te[ 11 ] = e43; te[ 15 ] = e44;

        return this;

    },

    setIdentity: function () {

        this.set(

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

        );

        return this;
    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        for( var i = 0; i < 16; i ++ ) {

            this.elements[ i ] = array[ i + offset ];

        }

        return this;

    },

    clone: function () {

        return new Matrix4().fromArray( this.elements );

    },

    makeFrustum: function ( left, right, bottom, top, near, far ) {

        var te = this.elements;
        var x = 2 * near / ( right - left );
        var y = 2 * near / ( top - bottom );

        var a = ( right + left ) / ( right - left );
        var b = ( top + bottom ) / ( top - bottom );
        var c = - ( far + near ) / ( far - near );
        var d = - 2 * far * near / ( far - near );

        te[ 0 ] = x;    te[ 4 ] = 0;    te[ 8 ] = a;    te[ 12 ] = 0;
        te[ 1 ] = 0;    te[ 5 ] = y;    te[ 9 ] = b;    te[ 13 ] = 0;
        te[ 2 ] = 0;    te[ 6 ] = 0;    te[ 10 ] = c;   te[ 14 ] = d;
        te[ 3 ] = 0;    te[ 7 ] = 0;    te[ 11 ] = - 1; te[ 15 ] = 0;

        return this;

    },

    lookAt: function ( eye, target, up ) {

        var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

        fx = target.x - eye.x;
        fy = target.y - eye.y;
        fz = target.z - eye.z;

        // Normalize f.
        rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        // Calculate cross product of f and up.
        sx = fy * up.z - fz * up.y;
        sy = fz * up.x - fx * up.z;
        sz = fx * up.y - fy * up.x;

        // Normalize s.
        rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;

        // Calculate cross product of s and f.
        ux = sy * fz - sz * fy;
        uy = sz * fx - sx * fz;
        uz = sx * fy - sy * fx;

        // Set to this.
        e = this.elements;
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;

        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;

        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;

        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;

        // Translate.
        return this.translate(-eye.x, -eye.y, -eye.z);

    },

    translate: function(x, y, z) {

        var e = this.elements;
        e[12] += e[0] * x + e[4] * y + e[8]  * z;
        e[13] += e[1] * x + e[5] * y + e[9]  * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this;

    },

    setRotate: function(angle, x, y, z) {
        var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

        angle = Math.PI * angle / 180;
        e = this.elements;

        s = Math.sin(angle);
        c = Math.cos(angle);

        if (0 !== x && 0 === y && 0 === z) {
            // Rotation around X axis
            if (x < 0) {
              s = -s;
            }
            e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
            e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
            e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else if (0 === x && 0 !== y && 0 === z) {
            // Rotation around Y axis
            if (y < 0) {
              s = -s;
            }
            e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
            e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
            e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else if (0 === x && 0 === y && 0 !== z) {
            // Rotation around Z axis
            if (z < 0) {
              s = -s;
            }
            e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
            e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
            e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else {
            // Rotation around another axis
            len = Math.sqrt(x*x + y*y + z*z);
            if (len !== 1) {
                rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            nc = 1 - c;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;

            e[ 0] = x*x*nc +  c;
            e[ 1] = xy *nc + zs;
            e[ 2] = zx *nc - ys;
            e[ 3] = 0;

            e[ 4] = xy *nc - zs;
            e[ 5] = y*y*nc +  c;
            e[ 6] = yz *nc + xs;
            e[ 7] = 0;

            e[ 8] = zx *nc + ys;
            e[ 9] = yz *nc - xs;
            e[10] = z*z*nc +  c;
            e[11] = 0;

            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
        }

        return this;
    },


    multiply: function ( m, n ) {

        if ( n !== undefined ) {

            console.warn( 'ONE.Matrix4: .multiply() only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
            return this.multiplyMatrices( m, n );

        }

        return this.multiplyMatrices( this, m );

    },

    multiplyMatrices: function ( a, b ) {

        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;

        var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
        var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
        var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
        var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

        var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
        var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
        var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
        var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

        te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return this;

    }

};

function Vector4( x, y, z, w) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = (w !== undefined) ? w : 1;

}

Vector4.prototype = {
    
    constructor: Vector4,

    isVector4: true,

    add: function ( v, w ) {

        if ( w !== undefined ) {
            console.warn( 'Vector4: .add() only accepts one argument.' );
            return false
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
        
    }
};

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

function WebGLShader ( gl, type, string ) {

    var shader = gl.createShader( type );

    gl.shaderSource( shader, string );
    gl.compileShader( shader );

    if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

        console.error( 'ONE.WebGLShader: Shader couldn\'t compile.' );

    }

    if ( gl.getShaderInfoLog( shader ) !== '' ) {

        console.warn( 'ONE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog( shader ), string );

    }

    return shader;

}

var model_vtex = "attribute vec3 position;\nvoid main ( void )\n{\n    gl_Position = vec4( position, 1.0 );\n}";

var model_frag = "void main ( void )\n{\n    gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0);\n} ";

var model_texture_vtex = "attribute vec3 position;   \nattribute vec2 textureCoord;  \nvarying   vec2 vTextureCoord;  \n  \nvoid main(void){  \n    vTextureCoord = textureCoord;\n    gl_Position   = vec4(position, 1.0);\n}";

var model_texture_frag = "precision mediump float;  \n  \nuniform sampler2D sampler;  \nvarying vec2      vTextureCoord;  \n  \nvoid main(void){\n    vec4 smpColor = texture2D(sampler, vTextureCoord);  \n    gl_FragColor  = smpColor;\n}";

var model_texture_camera_vtex = "attribute vec3 position;   \nattribute vec2 textureCoord;  \nvarying   vec2 vTextureCoord;\nuniform mat4 mvpMatrix; \n  \nvoid main(void){  \n    vTextureCoord = textureCoord;\n    gl_Position   = mvpMatrix * vec4(position, 1.0);\n}";

var model_texture_camera_frag = "precision mediump float;  \n  \nuniform sampler2D sampler;  \nvarying vec2      vTextureCoord;  \n  \nvoid main(void){\n    vec4 smpColor = texture2D(sampler, vTextureCoord);  \n    gl_FragColor  = smpColor;\n}";

var ShaderSource = {

    model_vtex: model_vtex,
    model_frag: model_frag,

    model_texture_vtex: model_texture_vtex,
    model_texture_frag: model_texture_frag,

    model_texture_camera_vtex: model_texture_camera_vtex,
    model_texture_camera_frag: model_texture_camera_frag

};

function WebGLProgram ( gl ) {


    var vertexShader = new WebGLShader( gl, gl.VERTEX_SHADER, ShaderSource['model_texture_camera_vtex']);
    var fragmentShader = new WebGLShader( gl, gl.FRAGMENT_SHADER, ShaderSource['model_texture_camera_frag']);

    var program = gl.createProgram();

    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );

    gl.linkProgram( program );

    var programLog = gl.getProgramInfoLog( program );
    var vertexLog = gl.getShaderInfoLog( vertexShader );
    var fragmentLog = gl.getShaderInfoLog( fragmentShader );

    if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

        console.error( 'ONE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog );

    }

    this.program = program;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    return this;
}

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

function Tube () {

    this.handlers = {};

    this.state = {

        programIndex: 0
        
    };

}

Tube.prototype = {

    subscribe: function ( name, handler ) {

        if ( this.handlers[name] == undefined ) {

            this.handlers[name] = {};

        }

        if ( this.handlers[name][handler.name] !== undefined ) {

            return console.warn( 'The handler ' + handler.name + ' for this Message has exist.' );
        }

        this.handlers[name][handler.name] = handler;

    },

    publish: function ( name ) {

        if ( this.handlers[name] == undefined ) {

            return console.error( 'There is no '+ name + ' in Tube.' );

        }

        var handlers = this.handlers[name];

        for ( var _handler in handlers ) {

            handlers[_handler]();

        }
            
    },

    unsubscribe: function ( name, handler ) {

        if ( this.handlers[name][handler.name] == undefined ) {

            return console.warn('No handler: ' + handler.name + ' for ' + name );

        }

        delete this.handlers[name][handler.name];

    },

    once: function ( name ) {

        if ( this.handlers[name] == undefined ) return;

        var handlers = this.handlers[name];

        for ( var _handler in handlers ) {

            handlers[_handler]();

        }

        delete this.handlers[name];

    },

    destroy: function ( name ) {

        if ( this.handlers[name] == undefined ) {

            return console.error( 'No such ' + name + ' in Tube.');

        }

        delete this.handlers[name];

    }
    
};

var TUBE = new Tube();

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

        _gl.clearColor(0,0,0,1);

        _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );
        
        _gl.drawArrays( _gl.TRIANGLES, 0, this.count );
        
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

function Texture () {

    this.list = {
        
        video: [ 'mp4' ],
        image: [ 'png', 'jpg', 'jpeg' ]

    };
    this.file = {
        elem: null,
        url: null
    };

    this.mediaType = null;

    this.context = null;

}

Texture.prototype = {
    
    _init: function ( gl, program ) {

        this.context = gl;

        var texture = gl.createTexture();
        var sampler = gl.getUniformLocation( program, 'sampler' );
        //对纹理图像进行Y轴反转
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, 1 );
        //开启0号纹理单元
        gl.activeTexture( gl.TEXTURE0 );
        //向target绑定纹理对象
        gl.bindTexture( gl.TEXTURE_2D, texture );
        //配置纹理参数
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        //配置纹理图像
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.file.elem );
        //将0号纹理图像传递给着色器
        gl.uniform1i( sampler, 0 );

    },

    load: function ( url ) {
        var _this = this;
        var fileExt = url.replace(/.+\./,'');

        if ( this.list.video.indexOf( fileExt ) == -1 && this.list.image.indexOf( fileExt ) == -1 ) {

            return console.error( fileExt + ' files are not in the accept list.');
        }

        if ( this.list.video.indexOf( fileExt ) !== -1 ) {

            this.file.elem = document.createElement('video');
            this.file.elem.src = url;
            this.file.elem.autoplay = true;
            this.file.elem.loop = true;
            this.file.elem.muted = true;
            this.file.url = url;
            this.mediaType = 'video';
            

        }

        if ( this.list.image.indexOf( fileExt ) !== -1 ) {

            this.file.elem = document.createElement('img');
            this.file.elem.src = url;
            this.file.url = url;
            this.mediaType = 'image';

        }

    },

    _load: function ( gl, program ) {

        var _this = this;

        var init = true;

        if ( this.mediaType == 'video' ) {

            this.file.elem.addEventListener( 'canplay', function(e){

                _this._init( gl, program );

                if ( init ) {

                    _this._update();
                    init = false;

                }


            }, false );

        }

        if ( this.mediaType == 'image' ) {

            this.file.elem.addEventListener( 'load', function(){

                _this._init( gl, program );

                if ( init ) {

                    _this._updateImg();
                    init = false;

                }

            }, false );

        }

    },

    _update: function () {

        this.context.texImage2D( this.context.TEXTURE_2D, 0, this.context.RGB, this.context.RGB, this.context.UNSIGNED_BYTE, this.file.elem );

        window.requestAnimationFrame( this._update.bind(this) );

    },

    _updateImg: function () {

        this.context.texImage2D( this.context.TEXTURE_2D, 0, this.context.RGB, this.context.RGB, this.context.UNSIGNED_BYTE, this.file.elem );

    }

};

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
});

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

function Sphere( radius, latNum, lonNum ) {

    Model.call(this);

    this.radius = radius || 1;
    this.latNum = latNum || 50;
    this.lonNum = lonNum || 50;

    this._init( this.radius, this.latNum, this.lonNum );

}

Sphere.prototype = Object.assign( Object.create( Model.prototype ), {
    
    _init: function ( radius, latNum, lonNum ) {
        
        var points = [];

        for ( var lat = 0; lat < latNum; lat++ ) {
            for ( var lon = 0; lon < lonNum; lon++ ) {

                points.push( this._getVertexUV( lat, lon ) );
                points.push( this._getVertexUV( lat, lon + 1 ) );
                points.push( this._getVertexUV( lat + 1, lon + 1 ) );

                points.push( this._getVertexUV( lat, lon ) );
                points.push( this._getVertexUV( lat + 1, lon + 1 ) );
                points.push( this._getVertexUV( lat + 1, lon ) );

            }
        }
        
        var len = points.length;
        for ( var i = 0; i < len; i++ ) {
            
            this.vertex.push( points[i].x );
            this.vertex.push( points[i].y );
            this.vertex.push( points[i].z );

            this.uv.push( points[i].v );
            this.uv.push( points[i].u );

        }

        this.count = len;

    },

    _getVertexUV: function ( lat, lon ) {

        var alpha = lat / this.latNum * Math.PI;
        var beta = lon / this.lonNum * 2 * Math.PI;

        return {
            x: Math.sin( alpha ) * Math.sin( beta ) * this.radius,
            y: Math.cos( alpha ) * this.radius,
            z: Math.sin( alpha ) * Math.cos( beta ) * this.radius,
            u: 1 - lat / this.latNum,
            v: 1 - lon / this.lonNum
        }
    }
});

function Triangle() {

    Model.call(this);
    this.vertex = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0,  0.0,  0.0
    ];

}

function Matrix3 () {

}

Matrix3.prototype = {
    
};

function Vector2 () {

}

Vector2.prototype = {
    // body...
};

exports.Camera = Camera;
exports.PerspectiveCamera = PerspectiveCamera;
exports.WebGLRenderer = WebGLRenderer;
exports.Texture = Texture;
exports.Scene = Scene;
exports.Sphere = Sphere;
exports.Triangle = Triangle;
exports.Matrix3 = Matrix3;
exports.Matrix4 = Matrix4;
exports.Vector2 = Vector2;
exports.Vector3 = Vector3;
exports.Vector4 = Vector4;

}((this.ONE = this.ONE || {})));
//# sourceMappingURL=one.js.map
