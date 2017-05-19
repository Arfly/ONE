import { Model } from './Model.js';

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
})

export { Sphere };