import json from 'rollup-plugin-json';

export default {
    entry: 'src/One.js',
    format: 'umd',
    plugins: [
        json()
    ],
    dest:'build/One.js',
    sourceMap: true
}