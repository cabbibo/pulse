
uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_audio;
uniform sampler2D t_monk;
uniform float puppyPos;
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

  vec3 toPos = vec3( 0. , .5 , -puppyPos  );
  float life  = pos.w;


  vec4 a = texture2D( t_audio , vec2( uv.y , 0. ) );

  vec3 f = vec3( 0. );

  float toDif = length(toPos - pos.xyz);


  //f +=  vec3( .0 , 0.003  * (  life - .5 )  * life, 0.01 * ( 1. - life ) );

  f += vec3( .0 , .0002 * ( 1. / pow( clamp( pos.y, .1 , 1. ) , 2. ) ) , 0. );
  f += normalize(toPos - pos.xyz) * .01;
  f += curlNoise( pos.xyz * .4 ) * .009 * ( 1. - life );


  if( life > 1. ){
    life = 1.;
    vel = vec3( 0. );
    f = vec3( 0. , .004 , 0. );

  }

  if( toDif < .05 ){ 
    life = -10000.; 
  }


  if( life > 0. ){
    life = clamp( length( toDif ) , 0. , 40. ) / 40.;
  }

  life -= .0003 + (1. + length( a ) * .1 ) * rand( uv ) * .001;

  if( life < 0. ){
    life = 10000.;
    vel = vec3( 0. );
    f = vec3( 0. );

    p = texture2D( t_monk , vec2( uv.x , 0. )).xyz;

    float t = uv.y * 2. * 3.14159;
    p.x += cos( t ) * ringRadius;
    p.z += sin( t ) * ringRadius;

    //p.z += rand( uv );
    //p.x += rand( uv * vec2( 33.512 ,  752.123 ));
  }






  vel += f;
  vel *= .9;
  p += vel * ( .6 + length( a ) * length( a ) * .1 );



  gl_FragColor = vec4( p , life );
  

}