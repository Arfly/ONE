function Texture () {

    this.list = {
        
        video: [ 'mp4' ],
        image: [ 'png', 'jpg', 'jpeg' ]

    };
    this.file = {
        elem: null,
        url: null
    };

    this.mediaType = null;

    this.context = null;

}

Texture.prototype = {
    
    _init: function ( gl, program ) {

        this.context = gl;

        var texture = gl.createTexture();
        var sampler = gl.getUniformLocation( program, 'sampler' );
        //对纹理图像进行Y轴反转
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, 1 );
        //开启0号纹理单元
        gl.activeTexture( gl.TEXTURE0 );
        //向target绑定纹理对象
        gl.bindTexture( gl.TEXTURE_2D, texture );
        //配置纹理参数
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        //配置纹理图像
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.file.elem );
        //将0号纹理图像传递给着色器
        gl.uniform1i( sampler, 0 );

    },

    load: function ( url ) {
        var _this = this;
        var fileExt = url.replace(/.+\./,'');

        if ( this.list.video.indexOf( fileExt ) == -1 && this.list.image.indexOf( fileExt ) == -1 ) {

            return console.error( fileExt + ' files are not in the accept list.');
        }

        if ( this.list.video.indexOf( fileExt ) !== -1 ) {

            this.file.elem = document.createElement('video');
            this.file.elem.src = url;
            this.file.elem.autoplay = true;
            this.file.elem.loop = true;
            this.file.elem.muted = true;
            this.file.url = url;
            this.mediaType = 'video';
            

        }

        if ( this.list.image.indexOf( fileExt ) !== -1 ) {

            this.file.elem = document.createElement('img');
            this.file.elem.src = url;
            this.file.url = url;
            this.mediaType = 'image';

        }

    },

    _load: function ( gl, program ) {

        var _this = this;

        var init = true;

        if ( this.mediaType == 'video' ) {

            this.file.elem.addEventListener( 'canplay', function(e){

                _this._init( gl, program );

                if ( init ) {

                    _this._update();
                    init = false;

                }


            }, false )

        }

        if ( this.mediaType == 'image' ) {

            this.file.elem.addEventListener( 'load', function(){

                _this._init( gl, program );

                if ( init ) {

                    _this._updateImg();
                    init = false;

                }

            }, false );

        }

    },

    _update: function () {

        this.context.texImage2D( this.context.TEXTURE_2D, 0, this.context.RGB, this.context.RGB, this.context.UNSIGNED_BYTE, this.file.elem );

        window.requestAnimationFrame( this._update.bind(this) );

    },

    _updateImg: function () {

        this.context.texImage2D( this.context.TEXTURE_2D, 0, this.context.RGB, this.context.RGB, this.context.UNSIGNED_BYTE, this.file.elem );

    }

};

export { Texture };