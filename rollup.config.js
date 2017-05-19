function glsl () {
    return {
        transform ( source, id ) {
            
            if ( !/\.glsl$/.test( id ) ) return;

            var transformedCode = 'export default ' + JSON.stringify(
                source
                    .replace( /[ \t]*\/\/.*\n/g, '' )
                    .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
                    .replace( /\n{2,}/g, '\n' )
            ) + ';';
            
            return {
                code: transformedCode,
                map: { mappings: '' }
            }
        }
    }

}


export default {
    entry: 'src/one.js',
    plugins:[
        glsl()
    ],
    targets:[
        {
            format: 'iife',
            moduleName: 'ONE',
            dest: 'build/one.js'
        }
    ],
    sourceMap: true
}