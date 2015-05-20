const int size  = @SIZE;


uniform vec2 resolution;

uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_og;
uniform sampler2D t_audio;
uniform float dT;
uniform float timer;

uniform mat4 cubeMatrix;
uniform mat4 mainBodyMatrix;

uniform vec4 repelers[ size ];

uniform float repulsionPower;
uniform float repulsionRadius;
uniform float dampening;
uniform float returnPower;

varying vec2 vUv;

void main(){


 
  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 oPos = texture2D( t_oPos , uv );
  vec4 pos  = texture2D( t_pos  , uv );
  vec4 og   = texture2D( t_og   , uv );
  vec3 vel  = pos.xyz - oPos.xyz;
  vec3 p    = pos.xyz;

 // vec3 gPos = (cubeMatrix * vec4( pos.xyz , 1. )).xyz;
  vec3 newOG = (cubeMatrix * vec4( og.xyz , 1. )).xyz;
  og = vec4( newOG , og.w );
  float life = pos.w;
  
  vec3 f = vec3( 0. , 0. , 0. );
 
  vec3 dif = pos.xyz - og.xyz;

  vec3 repel = pos.xyz - vec3( 1. , 0. , 0. );


  float repeled = 0.;

  // for each repeler in the repeler array, 
  // repel
  for( int i = 0; i < size; i++ ){

    vec3  rP = repelers[ i ].xyz;
    rP = ( mainBodyMatrix * vec4( rP.xyz , 1. ) ).xyz;
    vec3  rD = pos.xyz - rP;
    float rL = max( .01 , length( rD ) );
    vec3  rN = normalize( rD );

    float p = repelers[ i ].w;
    //float p = 1.;
    if( rL < p * p * p * repulsionRadius ){

      f += repulsionPower  * p * rN / (rL);
      repeled += 1.;

    }


  }


  f -= dif * returnPower;
 
  vel += f*min( .1 , dT);
  vel *= dampening;
  p += vel * 1.;//speed;*/



  //gl_FragColor = vec4( og.xyz + sin( timer ) * 1.* vec3( vUv.x , vUv.y , 0. ), 1.  );
  gl_FragColor = vec4( p ,  repeled );

}
