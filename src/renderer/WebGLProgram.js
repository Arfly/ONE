import { WebGLShader } from './WebGLShader.js';
import { ShaderSource } from './shaders/ShaderSource.js';

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

export { WebGLProgram };