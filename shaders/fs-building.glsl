uniform float rainbow;
uniform sampler2D t_audio;

varying vec3 vDist;
varying vec3 vNorm;
varying vec2 vUv;
varying float vID;
$getRainbow

void main(){
	

  float x = sin( vUv.x * 10. );
  float y = sin( vUv.y * 10. );
  float window = 0.;
  if( abs( x ) > .5  && abs( y)> .5){
    window = 1.;
  }

  vec3 col = vec3( window );

  col *= (.1 / length( vDist ) );

  if( vID < .5 ){
    col = vec3( .1 / length( vDist ) );
  }

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    vec3 a = texture2D( t_audio , vec2( abs( sin( vUv.y * .1 ) ), 0.  )).xyz;
    col = (vNorm * .5 + .5 ) * ( 1. + window) * a;
  }


  gl_FragColor = vec4( col , 1.);
}