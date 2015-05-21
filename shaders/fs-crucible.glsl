
uniform sampler2D t_audio;
uniform vec3 lightPos;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );
  
  float match = max( 0. , dot( lightDir , -vMNorm ));

  vec3 col = texture2D( t_audio , vec2( vUv.y , 0. )).xyz;


  col *=  match; //vec3( match );

  if( vUv.y > .45 && vUv.y < .55 ){
    col = vec3( 1. );
  }

  if( vUv.y < .05 || vUv.y > .95 ){
    col = vec3( 1. );
  }

  gl_FragColor = vec4( col , 1. );



}