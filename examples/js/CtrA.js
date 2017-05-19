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
    
    camera.position.set( 0, 0, 0.02 );
    camera.target.set( 0, 0, 0);

    document.addEventListener( 'mouseover', function ( e ) {

        e.target.style.cursor = '-webkit-grab';

    }, false );

    document.addEventListener( 'mousedown', _this.handleMouseDown.bind(this), false );

    document.addEventListener( 'mousemove', _this.handleMouseMove.bind(this), false );

    document.addEventListener( 'mouseup', _this.handleMouseUp.bind(this), false );

    document.addEventListener( 'touchstart', _this.handleMouseDown.bind(this), false );

    document.addEventListener( 'touchmove', _this.handleMouseMove.bind(this), false );

    document.addEventListener( 'touchend', _this.handleMouseUp.bind(this), false );

    this.alphaTxt = document.getElementById('alpha');
    this.betaTxt = document.getElementById('beta');
    this.gammaTxt = document.getElementById('gamma');

    window.addEventListener( 'deviceorientation', _this.handleOrientationchange.bind(this), false );
    window.addEventListener( 'orientationchange', _this.ScreenOrientationChange.bind(this), false );

    document.addEventListener( 'mousewheel', _this.handleMousewheel.bind(this), false );

}

ONE.CtrA.prototype = {

    handleMouseDown: function ( e ) {

        e.preventDefault();
        e.target.style.cursor = "-webkit-grabbing";
        this.keyDown = true;
        this.lastX = e.pageX;
        this.lastY = e.pageY;

        
    },

    handleMouseMove: function ( e ) {
        e.preventDefault();
        if ( this.keyDown ) {

            var deltaX = e.pageX - this.lastX;
            var deltaY = -(e.pageY - this.lastY);

            this.alpha += deltaY  / 10 * Math.PI / 180;
            this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);
            this.beta += deltaX / 10 * Math.PI / 180;
            this.gamme = 0;
            
            // this.alphaTxt.value = this.alpha * 180 / Math.PI;
            // this.betaTxt.value = this.beta * 180 / Math.PI;
            // this.gammaTxt.value = this.gamma * 180 / Math.PI;

            this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
            this.camera.position.y = this.distance * Math.sin( this.alpha);
            this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

            this.lastX = e.pageX;
            this.lastY = e.pageY;

        }
        
    },

    handleMouseUp: function ( e ) {
        e.preventDefault();
        e.target.style.cursor = "-webkit-grab";
        this.keyDown = false;

    },

    handleOrientationchange: function ( e ) {

        this.alphaTxt.value = Math.floor(e.alpha);
        this.betaTxt.value = Math.floor(e.beta);
        this.gammaTxt.value = Math.floor(e.gamma);

        var alpha = parseFloat( e.alpha.toFixed(1));
        var beta = parseFloat( e.beta.toFixed(1));
        var gamma = parseFloat( e.gamma.toFixed(1));
        
        var Rx = new ONE.Matrix4();

        Rx.setRotate( alpha, 1, 0, 0 );


        var Ry = new ONE.Matrix4();

        Ry.setRotate( beta, 0, 1, 0 );

        var Rz = new ONE.Matrix4();

        Rz.setRotate( gamma, 0, 0, 1 );

        var orientR = new ONE.Matrix4();
        orientR.setRotate( -this.screenOrientation, 0, 0, 1 );    

        // var R = orientR.multiply( reviseR1 ).multiply( Rx ).multiply( Ry ).multiply( Rz );
        var R = Rx.multiply( Ry ).multiply( Rz );
        // var R = Rx.multiply( Ry ).multiply( Rz ).multiply( reviseR1 ).multiply( orientR );

        // var R = Rx.multiply( Ry ).multiply( Rz ).multiply( reviseR1 ).multiply( reviseR2 ).multiply( orientR );

        // this.alpha = beta;
        // this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);

        // this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
        // this.camera.position.y = this.distance * Math.sin( this.alpha);
        // this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

        this.camera.modelMatrix.fromArray( Rx.elements );

    },

    ScreenOrientationChange: function ( e ) {

        this.screenOrientation = window.orientation || 0;

    },

    handleMousewheel: function ( e ) {

        this.distance += event.deltaY * 0.025;

        this.distance = Math.max( 0.01, Math.min( 3, this.distance ) );

        this.camera.position.x = this.distance * Math.cos( this.alpha ) * Math.sin( this.beta );
        this.camera.position.y = this.distance * Math.sin( this.alpha);
        this.camera.position.z = this.distance * Math.cos( this.alpha ) * Math.cos( this.beta );

        this.camera.near = this.distance;

    }

}
