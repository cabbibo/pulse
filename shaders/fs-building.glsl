varying vec3 vDist;
varying vec3 vNorm;
varying vec2 vUv;
void main(){
	
  vec3 col = vec3( 0. );

  float x = sin( vUv.x * 8. );
  float y = sin( vUv.y * 40. );
  if( abs( x ) > .8  && abs( y)> .8){
    col = vec3( 1. );
  }

	gl_FragColor = vec4( col , 1.);

}