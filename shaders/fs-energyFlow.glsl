uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform vec3 lightPos;
uniform float rainbow;
uniform float cityButton;
uniform float time;
uniform float flowDirection;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;
varying vec3 vPos;
varying vec3 vEye;

$getRainbow
$uvNormalMap
$semLookup
$simplex

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );

  vec3 fNorm = vMNorm;//uvNormalMap( t_normal , vPos , vUv  , vMNorm , .2 , 10.3 );
  
  vec3 refl = reflect( lightDir , fNorm );
  float match = max( 0. , dot( refl , normalize(vEye) ));
  float lamb = max( 0. , dot( -fNorm , lightDir ));

  vec3 col = vec3( 1. );//vec3( pow( match , 20. ) );


  float vRainbow = getRainbow();
  if( vRainbow < rainbow || cityButton > .5 ){
    col = (fNorm * .5 + .5); //* lamb;
  }


  float lookup =  abs(sin(vUv.y * 30. - time * ( 2. ) * cityButton * flowDirection));

  col *= texture2D( t_audio , vec2( lookup , 0. )).xyz;

  gl_FragColor = vec4( col , 1. );



}