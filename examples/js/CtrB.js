ONE.CtrB = function ( camera ) {

    var _this = this;

    this.keyDown = false;
    this.lastX = 0;
    this.lastY = 0;
    this.camera = camera;
    
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.distance = 1;
    this.screenOrientation = 0;
    this.fov = 75;
    this.landscapeR = 0;

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

    document.addEventListener( 'mousewheel', _this.handleMousewheel.bind(this), false );

}

ONE.CtrB.prototype = {

    init: function () {
 
        if ( this.camera.fov !== this.fov ) {

            util.lerp( this.camera, 'fov', this.fov );

        }

        if ( Math.sqrt( this.camera.position.lengthSq() ) !== 1 || this.camera.position.y !== 0 ) {

            var start = {

                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            }

            var target = {

                x: Math.sqrt( 1 ) * start.x / Math.sqrt( start.x * start.x + start.z * start.z ),
                y: 0,
                z: Math.sqrt( 1 ) * start.z / Math.sqrt( start.x * start.x + start.z * start.z )
            }

            util.lerpVector( this.camera, 'position', target )
        }

        this.camera.near = 0.01;
        this.camera.target.set( 0, 0, 0);
        this.camera.up.set( 0, 1, 0 );

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

        if ( this.on && this.gON ) {

            this.keyDown = true;
            this.lastX = e.pageX;
            this.lastY = e.pageY;

        }

        
    },

    handleMouseMove: function ( e ) {

        if ( this.on && !this.gON ) {

            e.preventDefault();
            if ( this.keyDown ) {

                var deltaX = e.pageX - this.lastX;
                var deltaY = -(e.pageY - this.lastY);

                this.alpha += deltaY  / 10 * Math.PI / 180;
                this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);
                this.beta += deltaX / 10 * Math.PI / 180;
                this.gamme = 0;

                this.lastDeltaX = deltaX;
                this.lastDeltaY = deltaY;
                
                // this.alphaTxt.value = this.alpha * 180 / Math.PI;
                // this.betaTxt.value = this.beta * 180 / Math.PI;
                // this.gammaTxt.value = this.gamma * 180 / Math.PI;

                this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
                this.camera.position.y = this.distance * Math.sin( this.alpha);
                this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

                this.lastX = e.pageX;
                this.lastY = e.pageY;

            }

        }

        if ( this.on && this.gON ) {

            e.preventDefault();
            if ( this.keyDown) {
                
                if ( Math.abs( this.camera.up.x) < Math.abs( this.camera.up.y) ) {

                    var deltaX = Math.abs(e.pageX - this.lastX) > 3 ? (e.pageX - this.lastX):0;

                    this.landscapeR += deltaX / 10;

                }

                if ( Math.abs( this.camera.up.y) < Math.abs( this.camera.up.x) ) {

                    var deltaY = Math.abs(e.pageY - this.lastY) > 3 ? (e.pageY - this.lastY):0;

                    this.landscapeR += deltaY / 10;

                }

                var R = this.beta * 180 / Math.PI + this.landscapeR;

                this.camera.modelMatrix.setRotate( -R, 0, 1, 0);
            
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

        if ( this.on && this.gON ) {

            e.preventDefault();
            this.keyDown = false;

        }
       

    },

    ScreenOrientationChange: function ( e ) {

        this.screenOrientation = window.orientation || 0;
        
    },

    handleOrientationchange: function ( e ) {

        if ( this.on && e.alpha && this.gON ) {

            this.alphaTxt.value = e.alpha;
            this.betaTxt.value = e.beta;
            this.gammaTxt.value = e.gamma;

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

            this.camera.position.x = target.x;
            this.camera.position.y = target.y;
            this.camera.position.z = target.z;

            this.alpha = Math.asin( target.y );
            if ( target.z >= 0 ) {

                this.beta = Math.asin( target.x / Math.sqrt( target.x * target.x + target.y * target.y ) );

            }

            if ( target.z < 0 && target.x > 0 ) {

                this.beta = Math.asin( target.x / Math.sqrt( target.x * target.x + target.y * target.y ) ) + Math.PI / 2;

            }

            if ( target.z < 0 && target.x < 0 ) {

                this.beta = Math.asin( target.x / Math.sqrt( target.x * target.x + target.y * target.y ) ) + Math.PI / 2 - Math.PI / 2;

            }

            var Z = new ONE.Vector3( 0, 0, -1 );
            Z.applyMatrix4( R ).normalize();
            this.camera.up.x = Z.x;
            this.camera.up.y = Z.y;
            this.camera.up.z = Z.z;

        }

    },

    handleMousewheel: function ( e ) {

        if ( this.on ) {

            this.fov += e.deltaY * 0.025;
            this.fov = Math.min( 140, Math.max( 75, this.fov) );

            this.camera.fov = this.fov;


        }

       
    },

    handleZoom: function ( e ) {

        if ( this.on && e.touches[1] ) {
            e.preventDefault();
            if ( e.scale < 1 ) {
                
                this.fov += 2;
                this.fov = Math.min( 140, Math.max( 75, this.fov) );

            }

            if ( e.scale > 1 ) {

                this.fov -= 2;
                this.fov = Math.min( 140, Math.max( 75, this.fov) );

            }



            this.camera.fov = this.fov;

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
