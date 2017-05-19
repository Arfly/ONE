ONE.CtrD = function ( camera ) {

    var _this = this;

    

    this.keyDown = false;
    this.lastX = 0;
    this.lastY = 0;
    this.camera = camera;
    
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    
    camera.position.set( 0, 0, 0 );
    camera.target.set( 0, 0, 1 );

    document.addEventListener( 'mouseover', function ( e ) {

        e.target.style.cursor = '-webkit-grab';

    }, false );

    document.addEventListener( 'mousedown', _this.handleMouseDown.bind(this), false );

    document.addEventListener( 'mousemove', _this.handleMouseMove.bind(this), false );

    document.addEventListener( 'mouseup', _this.handleMouseUp.bind(this), false );

    // this.alphaTxt = document.getElementById('alpha');
    // this.betaTxt = document.getElementById('beta');
    // this.gammaTxt = document.getElementById('gamma');

    window.addEventListener( 'deviceorientation', _this.handleOrientationchange.bind(this), false );

}

ONE.CtrD.prototype = {

    handleMouseDown: function ( e ) {

        e.target.style.cursor = "-webkit-grabbing";
        this.keyDown = true;
        this.lastX = e.pageX;
        this.lastY = e.pageY;

        
    },

    handleMouseMove: function ( e ) {

        if ( this.keyDown ) {

            var deltaX = this.lastX - e.pageX;
            var deltaY = e.pageY - this.lastY;

            this.alpha += deltaY  / 10 * Math.PI / 180;
            this.alpha = Math.max(Math.min(Math.PI / 2 * 0.98, this.alpha ), -Math.PI / 2 * 0.98);
            this.beta += deltaX / 20 * Math.PI / 180;
            this.gamme = 0;
            
            // this.alphaTxt.value = this.alpha * 180 / Math.PI;
            // this.betaTxt.value = this.beta * 180 / Math.PI;
            // this.gammaTxt.value = this.gamma * 180 / Math.PI;

            this.camera.target.x = Math.cos( this.alpha ) * Math.sin( this.beta );
            this.camera.target.y = Math.sin( this.alpha);
            this.camera.target.z = Math.cos( this.alpha ) * Math.cos( this.beta );

            this.lastX = e.pageX;
            this.lastY = e.pageY;

        }
        
    },

    handleMouseUp: function ( e ) {

        e.target.style.cursor = "-webkit-grab";
        this.keyDown = false;

    },

    handleOrientationchange: function ( e ) {

        this.alphaTxt.value = e.alpha;
        this.betaTxt.value = e.beta;
        this.gammaTxt.value = e.gamma;

    }

}
