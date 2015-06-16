uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform vec3 lightPos;
uniform float rainbow;

varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;
varying vec3 vPos;
varying vec3 vEye;

$getRainbow
$uvNormalMap
$semLookup

void main(){

  vec3 lightDir = normalize( lightPos - vMPos );

  vec3 fNorm = uvNormalMap( t_normal , vPos , vUv  , vMNorm , .2 , .3 );
  vec3 refl = reflect( lightDir , fNorm );
  float match = max( 0. , dot( refl , normalize(vEye) ));
  float lamb = max( 0. , dot( fNorm , lightDir ));

  vec3 col = vec3( pow( match , 20. ) );


  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    vec3 newCol = (fNorm * .5 + .5) * texture2D( t_audio , vec2( lamb , 0. )).xyz;
    col = mix( col , newCol,  clamp( ( rainbow - vRainbow ) * 1., 0. , 1. ));
  }
  gl_FragColor = vec4( col , 1. );



}