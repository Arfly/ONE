ONE.CtrD = function ( camera ) {

    var _this = this;

    this.fov = 75;
    this.camera = camera;
    this.on = false;
    this.gON = false;
    this.alphaTxt = document.getElementById('alpha');
    this.betaTxt = document.getElementById('beta');
    this.gammaTxt = document.getElementById('gamma');
    this.screenOrientation = 0;

    window.addEventListener( 'deviceorientation', _this.handleOrientationchange.bind(this), false );
    window.addEventListener( 'orientationchange', _this.ScreenOrientationChange.bind(this), false );

    window.addEventListener( 'devicemotion', _this.handleDeviceMotion.bind(this), false );
    
}

ONE.CtrD.prototype = {

    init: function () {

        this.camera.position.set( 0, 0, 0 );
        this.camera.target.set( 0, -1, 0 );
        this.camera.up.set( 0, 0, -1 );
        this.camera.fov = this.fov;

    },

    handleOrientationchange: function ( e ) {

        if ( this.on && e.alpha ) {

            var alpha = parseFloat( e.alpha.toFixed(1)) * Math.PI / 180;
            var beta = parseFloat( e.beta.toFixed(1)) * Math.PI / 180;
            var gamma = parseFloat( e.gamma.toFixed(1)) * Math.PI / 180;

            var euler = new ONE.Euler( beta, alpha, -gamma, 'YXZ');

            var R = new ONE.Matrix4();

            R.makeRotationFromEuler( euler );

            // var R1 = new ONE.Matrix4();
            // R1.setRotate( -90, 1, 0, 0 );

            // R.multiply(R1);

            // R.multiply( R2 );
            
            var orientR = new ONE.Matrix4();

            orientR.setRotate( -this.screenOrientation, 0, 1, 0 );

            R.multiply( orientR );

            var target = new ONE.Vector3( 0, -1, 0);

            target.applyMatrix4(R);
            
            this.camera.target.x = target.x;
            this.camera.target.y = target.y;
            this.camera.target.z = target.z;

            this.alphaTxt.value = parseFloat( e.alpha.toFixed(1));
            this.betaTxt.value = parseFloat( e.beta.toFixed(1));
            this.gammaTxt.value = parseFloat( e.gamma.toFixed(1));
             
            var X = new ONE.Vector3( 1, 0, 0 );
            
            var Y = new ONE.Vector3( 0, 1, 0 );

            var Z = new ONE.Vector3( 0, 0, -1 );
            
            Z.applyMatrix4( R ).normalize();

            this.camera.up.x = Z.x;
            this.camera.up.y = Z.y;
            this.camera.up.z = Z.z;


        }
    },

    ScreenOrientationChange: function () {

        this.screenOrientation = window.orientation || 0;

    },

    handleDeviceMotion: function ( e ) {

    }

}
