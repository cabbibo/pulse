
uniform sampler2D t_audio;
uniform float rainbow;

varying vec3 vVel;
varying float vDepth;
varying float vLife;
varying float vToggled;
varying float vDist;
varying float vLock;
varying float vDot;

$getRainbow

void main(){

  if( vToggled < .5 || vLife > .95){
    discard;
  }

  /*float multiplier = clamp( sqrt( vLife  ), 0. , 1. );
  if( length( vVel ) > .4 ){ multiplier = 0.; }
  if( vLife > 1. ){ multiplier = 0.; }

  if( multiplier == 0. ){ discard; }*/

  vec4 a = texture2D( t_audio , vec2( 1. - vDepth , 0.));

  vec4 col = a * 4. * clamp( vDist * 3. , 0. , 1. ) * clamp( vLife * 40. , 0. , 1.  ) * (1. - vDepth);

  col = a * vec4( normalize( vVel ) * .5 + .5 , 1. );

  //gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );
  gl_FragColor = col;

  /*if( vLife > 4. || vLife < .4 ){
    gl_FragColor = vec4( 0. );
  }*/
}