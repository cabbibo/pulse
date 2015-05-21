uniform sampler2D t_audio;

const int numDisks = @NUMDISKS;

varying vec2 vUv;

void main(){
    
  float lookup = ( vUv.x / float( numDisks ) ) + ((vUv.y * 4. ) / float( numDisks ));
  vec4 a = texture2D( t_audio , vec2( lookup , 0. ));
  gl_FragColor = vec4( a.xyz , 1.);//vec4( vec3( vUv.y) , 1. );

  if( vUv.y > .95 || vUv.y < .3){
    gl_FragColor = vec4( 1. );
  }

}