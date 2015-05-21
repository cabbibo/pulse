
uniform sampler2D t_pos;
uniform sampler2D t_oPos;

uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

$simplex
$curl

void main(){


 
  vec2 uv     = gl_FragCoord.xy / resolution;
  vec4 oPos   = texture2D( t_oPos , uv );
  vec4 pos    = texture2D( t_pos  , uv );
  vec3 vel    = pos.xyz - oPos.xyz;
  vec3 p      = pos.xyz;
  float life  = pos.w;


  vec3 f = vec3( 0. );

  f += normalize( pos.xyz ) * .0001 / length( pos.xyz);/// vec3( .01 , 0. , 0. );
  f += curlNoise( pos.xyz * .3 ) * .001;


  if( life > 5. ){
    life = 5.;
    vel = vec3( 0. );
  }

  life -= .003 + rand( uv ) * .01;

  if( life < 0. ){
    life = 5.3;
    vel = vec3( 0. );
    p = vec3( rand( uv ), rand( uv * 3.515), rand( uv * 993.51 ) );
    p = normalize( p ) - .5;
    p = normalize( p ) * 2.;
  }




  vel += f;
  vel *= .9;
  p += vel;



  gl_FragColor = vec4( p , life );
  

}