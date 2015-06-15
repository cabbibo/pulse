
uniform sampler2D t_audio;
uniform vec3 lightPos;
uniform float rainbow;
uniform float time;
uniform float cityButton;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;

$getRainbow
$hsv


float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );
  
  float match = max( 0. , dot( lightDir , -vMNorm ));


  
  float lookup  = fract( sin( vUv.y * 20. ));
        lookup *= fract( cos( vUv.x * 20. ));


  lookup = rand( vUv * .0000001 );
  vec3 a = texture2D( t_audio , vec2( lookup , 0. )).xyz;
  vec3 col = a;

  vec3 aCol = hsv( length(a)/4. , 1. , 1. );



  col = a; //vec3( match );

  
  float vRainbow = getRainbow();
  if( vRainbow < rainbow || cityButton > .5 ){
    col = (vMNorm * .5 + .5) * a + a * match;
  }

  gl_FragColor = vec4( col , 1. );



}