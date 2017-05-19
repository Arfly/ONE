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

export { WebGLShader };