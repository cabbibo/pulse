
uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform float rainbow;


varying vec3 vMNorm;
varying vec3 vMPos;

$getRainbow
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );
  
  float match = max( 0. , dot( lightDir , -vMNorm ));

  float lu = rand(vec2( vMPos.y * .000001 ));
  vec3 a = texture2D( t_audio , vec2( lu , 0. )).xyz;
  vec3 col = a;

  col = (vMNorm * .5 + .5) * a ;

  gl_FragColor = vec4( col , 1. );



}