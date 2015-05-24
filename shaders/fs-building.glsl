varying vec3 vDist;
varying vec3 vNorm;
varying vec2 vUv;
varying float vID;
void main(){
	
  vec3 col = vec3( 0. );

  float x = sin( vUv.x * 10. );
  float y = sin( vUv.y * 10. );
  if( abs( x ) > .5  && abs( y)> .5){
    col = vec3( 1. );
  }

  gl_FragColor = vec4( col * (.1 / length( vDist ) ), 1.);
	//gl_FragColor = vec4( normalize( vDist ) , 1.);

  if( vID < .5 ){
    gl_FragColor = vec4( vec3( .1 / length( vDist ) ) , 1. );
  }

}