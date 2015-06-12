uniform float rainbow;
varying vec3 vMNorm;
varying float vMatch;

$getRainbow
void main(){
  

  vec4 col = vec4( vec3( 0. , 0. , 0. ) , 1.);

  //float vRainbow = getRainbow();
  if( vMatch < rainbow ){
    col.xyz = ( vMNorm * .5 + .5 ) * min( 1. , ( rainbow - vMatch ) * 10. );
  }

  gl_FragColor = col;

}