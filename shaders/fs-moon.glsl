uniform float rainbow;
varying vec3 vMNorm;
varying vec3 vMPos;

$getRainbow
void main(){
  

  vec4 col = vec4( 1. );

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col.xyz *= vMNorm * .5 + .5;
  }

  gl_FragColor = col;

}