ONE.CtrA = function ( camera ) {

    var _this = this;

    this.keyDown = false;
    this.lastX = 0;
    this.lastY = 0;
    this.camera = camera;
    
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.distance = 0.02;
    this.screenOrientation = 0;
    this.fov = 75;

    this.on = false;
    this.gON = false;

    document.addEventListener( 'mouseover', function ( e ) {

        e.target.style.cursor = '-webkit-grab';

    }, false );

    document.addEventListener( 'mousedown', _this.handleMouseDown.bind(this), false );

    document.addEventListener( 'mousemove', _this.handleMouseMove.bind(this), false );

    document.addEventListener( 'mouseup', _this.handleMouseUp.bind(this), false );

    document.addEventListener( 'touchstart', _this.handleMouseDown.bind(this), false );

    document.addEventListener( 'touchmove', _this.handleMouseMove.bind(this), false );

    document.addEventListener( 'touchmove', _this.handleZoom.bind(this), false );

    document.addEventListener( 'touchend', _this.handleMouseUp.bind(this), false );

    this.alphaTxt = document.getElementById('alpha');
    this.betaTxt = document.getElementById('beta');
    this.gammaTxt = document.getElementById('gamma');

    window.addEventListener( 'deviceorientation', _this.handleOrientationchange.bind(this), false );
    window.addEventListener( 'orientationchange', _this.ScreenOrientationChange.bind(this), false );
    window.addEventListener( 'devicemotion', _this.handleDeviceMotion.bind(this), false );

    document.addEventListener( 'mousewheel', _this.handleMousewheel.bind(this), false );

}

ONE.CtrA.prototype = {

    init: function () {

        this.camera.fov = this.fov;
        this.camera.position.set( 0, 0, 0.02 );
        this.camera.target.set( 0, 0, 0);

    },

    handleMouseDown: function ( e ) {

        if ( this.on && !this.gON ) {

            e.preventDefault();
            e.target.style.cursor = "-webkit-grabbing";
            this.keyDown = true;
            this.lastX = e.pageX;
            this.lastY = e.pageY;
            this.camera.up.set( 0, 1, 0 );

        }

       

        
    },

    handleMouseMove: function ( e ) {

        if ( this.on && !this.gON ) {

            e.preventDefault();
            if ( this.keyDown) {

                var deltaX = e.pageX - this.lastX;
                var deltaY = -(e.pageY - this.lastY);

                this.alpha += deltaY  / 10 * Math.PI / 180;
                this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);
                this.beta += deltaX / 10 * Math.PI / 180;
                this.gamme = 0;

                this.lastDeltaX = deltaX;
                this.lastDeltaY = deltaY;

                this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
                this.camera.position.y = this.distance * Math.sin( this.alpha);
                this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

                this.lastX = e.pageX;
                this.lastY = e.pageY;

            }

        }
        
        
    },

    handleMouseUp: function ( e ) {

        if ( this.on && !this.gON ) {

            e.preventDefault();
            e.target.style.cursor = "-webkit-grab";
            this.keyDown = false;
            this._tick();

        }        

    },

    handleOrientationchange: function ( e ) {

        if ( this.on && this.gON ) {

            this.alphaTxt.value = Math.floor(e.alpha);
            this.betaTxt.value = Math.floor(e.beta);
            this.gammaTxt.value = Math.floor(e.gamma);

            var alpha = parseFloat( e.alpha.toFixed(1));
            var beta = parseFloat( e.beta.toFixed(1));
            var gamma = parseFloat( e.gamma.toFixed(1));
            
            var euler = new ONE.Euler( beta * Math.PI / 180, alpha * Math.PI / 180, -gamma * Math.PI / 180, 'YXZ');

            var R = new ONE.Matrix4();

            R.makeRotationFromEuler( euler );

            var orientR = new ONE.Matrix4();

            orientR.setRotate( -this.screenOrientation, 0, 1, 0 );

            R.multiply( orientR );

            this.alphaTxt.value = Math.floor(alpha);
            this.betaTxt.value = Math.floor(beta);
            this.gammaTxt.value = Math.floor(gamma);

            var target = new ONE.Vector3( 0, 1, 0);

            target.applyMatrix4(R);

            var len = Math.sqrt(this.distance);

            this.camera.position.x = target.x * len;
            this.camera.position.y = target.y * len;
            this.camera.position.z = target.z * len;

            this.alpha = Math.asin( target.y );
            this.beta = Math.asin( target.x / Math.sqrt( target.x * target.x + target.y * target.y ) );

            var Z = new ONE.Vector3( 0, 0, -1 );
            Z.applyMatrix4( R ).normalize();
            this.camera.up.x = Z.x;
            this.camera.up.y = Z.y;
            this.camera.up.z = Z.z;
            

        }

    },

    ScreenOrientationChange: function ( e ) {

        this.screenOrientation = window.orientation || 0;

    },

    handleDeviceMotion: function ( e ) {

    },

    handleMousewheel: function ( e ) {

        if ( this.on ) {

            this.distance += event.deltaY * 0.025;

            this.distance = Math.max( 0.01, Math.min( 3, this.distance ) );

            this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
            this.camera.position.y = this.distance * Math.sin( this.alpha);
            this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

            this.camera.near = this.distance;


        }
        
    },

    handleZoom: function ( e ) {

        if ( this.on && e.touches[1] ) {
            e.preventDefault();
            if ( e.scale < 1 ) {
                
                this.distance += 0.08;
                this.distance = Math.max( 0.01, Math.min( 3, this.distance ) );
                console.log(this.distance);

            }

            if ( e.scale > 1 ) {

                this.distance -= 0.08;
                this.distance = Math.max( 0.01, Math.min( 3, this.distance ) );
                console.log(this.distance);

            }

            this.camera.near = this.distance;

        } 

    },

    _tick: function () {

        if ( this.lastDeltaY || this.lastDeltaX ) {

            this.lastDeltaY *= 0.95;
            this.lastDeltaX *= 0.95;

            if ( Math.abs(this.lastDeltaX) < 0.001 ) { this.lastDeltaX = 0; }
            if ( Math.abs(this.lastDeltaY) < 0.001 ) { this.lastDeltaY = 0; }

            this.alpha += this.lastDeltaY  / 10 * Math.PI / 180;
            this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);
            this.beta += this.lastDeltaX / 10 * Math.PI / 180;

            this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
            this.camera.position.y = this.distance * Math.sin( this.alpha);
            this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

            clearTimeout( this._tick );

            setTimeout( this._tick.bind(this), 16 );

        }

    }

}
