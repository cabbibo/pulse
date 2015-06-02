uniform sampler2D t_audio;
uniform float lifeOn;
uniform float rainbow;

const int numDisks = @NUMDISKS;

varying vec2 vUv;

$getRainbow
$hsv

void main(){

  if( vUv.x < 1.- lifeOn ){
    discard;
  }

    
  float yLookup = vUv.y / float( numDisks );
  float lookup = yLookup + ((vUv.x * 4. )/ float( numDisks));
  vec4 a = texture2D( t_audio , vec2( lookup , 0. ));


  vec4 col = a;
  gl_FragColor = vec4( a );//vec4( vec3( vUv.y) , 1. );




  if( vUv.x < .2 ){
    gl_FragColor = vec4( 1. );
  }

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col.xyz += hsv( vUv.x , 1. , 1. ) * a.xyz;
  }

  gl_FragColor = col;

  //gl_FragColor = vec4( vUv.x  , 0. , vUv.y / float( numDisks ), 1. );

}