var expect = chai.expect;
var assert = chai.assert;

var v4 = new ONE.Vector4( 1, 2, 3, 4);
var test = new ONE.Vector4( 5, 6, 7, 8);
var result = new ONE.Vector4( 6, 8, 10, 12);

v4.add(test);

describe( "Vector4", function () {
    it( "Vector.add()", function () {
        expect( v4 ).to.be.deep.equal(result);
    })
})