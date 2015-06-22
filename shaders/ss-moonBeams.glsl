
uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_audio;
uniform sampler2D t_monk;
uniform vec3 toPos;
uniform float ringRadius;

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


  vec4 a = texture2D( t_audio , vec2( uv.y , 0. ) );

  vec3 f = vec3( 0. );

  float toDif = length(toPos - pos.xyz);


  //f +=  vec3( .0 , 0.003  * (  life - .5 )  * life, 0.01 * ( 1. - life ) );

  f += vec3( .0 , .0002 * ( 1. / pow( clamp( pos.y, .1 , 1. ) , 2. ) ) , 0. );
  f += normalize(toPos - pos.xyz) * .01;
  f += curlNoise( pos.xyz * .4 ) * .009 * ( 1. - clamp( length( toDif ) , 0. , 40. ) / 40. );


  if( life > 2. && life < 10. ){
    life = .9;
    vel = vec3( 0. );
    f = vec3( 0. , .004 , 0. );
  }

  if( life > 10. ){
    life = 9.5;
    vel = vec3( 0. );
    f = vec3( 0. , .0 , 0. );

    p = texture2D( t_monk , vec2( uv.x , 0. )).xyz;

    float t = uv.y * 2. * 3.14159;
    p.x += cos( t ) * ringRadius;
    p.z += sin( t ) * ringRadius;

  }


  if( toDif < .5 && life < 2. ){ 
  
    vel = vec3( 0. );
    f = vec3( 0. );
    life = 1000.;


    //p.z += rand( uv );
    //p.x += rand( uv * vec2( 33.512 ,  752.123 ));
  }








  vel += f;
  vel *= .9;
  p += vel * ( .6 + length( a ) * length( a ) * .1 );



  gl_FragColor = vec4( p , life );
  

}