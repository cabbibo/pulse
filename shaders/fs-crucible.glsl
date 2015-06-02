
uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform float rainbow;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;

$getRainbow

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );
  
  float match = max( 0. , dot( lightDir , -vMNorm ));

  vec3 a = texture2D( t_audio , vec2( vUv.y , 0. )).xyz;
  vec3 col = a;


  col *=  match; //vec3( match );

  if( vUv.y > .45 && vUv.y < .55 ){
    col = vec3( 1. ) * match;
  }

  if( vUv.y < .05 || vUv.y > .95 ){
    col = vec3( 1. ) * match;
  }

  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col = (vMNorm * .5 + .5) * a + a * match;
  }

  gl_FragColor = vec4( col , 1. );



}