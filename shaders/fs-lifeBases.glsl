uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform float rainbow;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;


const int numDisks = @NUMDISKS;

$getRainbow


void main(){
    
  vec3 lightDir = normalize( lightPos - vMPos );
  
  float match = max( 0. , dot( lightDir , -vMNorm ));
  float lookup = ( vUv.x / float( numDisks ) ) + ((vUv.y * 4. ) / float( numDisks ));
  vec4 a = texture2D( t_audio , vec2( lookup , 0. ));

  vec4 col = vec4( a.xyz * match , 1.);
  //vec4( vec3( vUv.y) , 1. );

  if( vUv.y > .95 || vUv.y < .3){
    col =  vec4( 1. ) * match;
  }


  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col = vec4( (vMNorm * .5 + .5) * a.xyz + a.xyz * match , 1.);
  }

  gl_FragColor = col;

}