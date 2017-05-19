precision mediump float;  
  
uniform sampler2D sampler;  
varying vec2      vTextureCoord;  
  
void main(void){
    vec4 smpColor = texture2D(sampler, vTextureCoord);  
    gl_FragColor  = smpColor;
}