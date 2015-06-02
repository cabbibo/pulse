uniform float rainbow;

varying float vID;
varying float vLookAt;
varying vec3 vNorm;
varying vec2 vUv;

$getRainbow

void main(){

  vec3 col = vec3( vUv.y );
  
  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col = vNorm * .5 + .5;
  }


  gl_FragColor =  vec4( col , 1. ) ;

}