
uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_audio;
uniform float puppyPos;

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


  vec4 a = texture2D( t_audio , vec2( uv.x , 0. ) );

  vec3 f = vec3( 0. );



  f +=  vec3( .0 , 0.003  * (  life - .5 )  * life, -0.01 * ( 1. - life ) );
  f += curlNoise( pos.xyz * .4 ) * .003 * ( 1. - life );


  if( life > 1. ){
    life = 1.;
    vel = vec3( 0. );
    f = vec3( 0. , .01 , 0. );
  }

  life -= .0003 + (1. + length( a ) * .1 ) * rand( uv ) * .001;

  if( life < 0. ){
    life = 1.1;
    vel = vec3( 0. );
    p = vec3( uv.x -.5 , 0. , uv.y-.5 ) * .3;

    p = vec3( 0. , 0. , -30. );

    float t = ( uv.x * .5 + .5) * 3.14195 * 2. ;

    p.x += cos( t ) * (uv.y *.4+1.);
    p.z += sin( t ) * (uv.y *.4+1.);
   // p = vec3( (uv.x -.5) * 10. * ( uv.y + .1 ) , 0. , -(uv.y + 1.) * 10. );

  }




  vel += f;
  vel *= .9;
  p += vel * ( .6 + length( a ) * length( a ) * .2 );



  gl_FragColor = vec4( p , life );
  

}