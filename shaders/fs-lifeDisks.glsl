uniform sampler2D t_audio;
uniform float lifeOn;
uniform float rainbow;

const int numDisks = @NUMDISKS;

varying vec2 vUv;


$hsv

$getRainbow

void main(){
    
  if( vUv.y > lifeOn ){ discard; }
  float lookup = ( vUv.x / float( numDisks ) ) + ((vUv.y * 4. ) / float( numDisks ));
  vec4 a = texture2D( t_audio , vec2( lookup , 0. ));

  vec4 col = vec4( a );
  
  if( vUv.y > .95  || vUv.y < .1){
    gl_FragColor = vec4( 1. );
  }

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col += a * vec4( hsv( abs( sin( lookup * 10.)) , 1. , 1. ) , 1.);
  }

  gl_FragColor = col;//vec4( vec3( vUv.y) , 1. );


}