uniform float rainbow;
varying vec3 vMNorm;
varying vec3 vMPos;

$getRainbow
void main(){
  

  vec4 col = vec4( 1. );

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    vec3 newCol = vMNorm * .5 + .5;
    col.xyz = mix( col.xyz , newCol,  clamp( ( rainbow - vRainbow ) * 30., 0. , 1. ));
  }

  gl_FragColor = col;

}