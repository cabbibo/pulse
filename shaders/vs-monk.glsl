uniform sampler2D t_monk;
uniform sampler2D t_oMonk;
uniform sampler2D t_audio;
uniform float height;
uniform vec3 lookPos;

attribute float id;
attribute float lookAt;

varying float vID;
varying float vLookAt;
varying vec3 vNorm;
varying vec2 vUv;


void main(){
  
  vec4 monkPos  = texture2D( t_monk , vec2( id , 0. ));
  vec4 oMonkPos = texture2D( t_oMonk , vec2( id , 0. ));

  vec3 monkVel = monkPos.xyz - oMonkPos.xyz;

  //vec3 pos = position * ( vec3( 1. )  + -monkVel * 1000. * uv.y  ) + monkPos.xyz ;

  vec3 pos = monkPos.xyz;

  vID = id;
  vLookAt = lookAt;
  vUv = uv;

  vec4 a = texture2D( t_audio , vec2( id , 0. ));

  vNorm = normalize( (modelMatrix * vec4( normal , 0. )).xyz );
  if( lookAt > .5 ){

    pos = monkPos.xyz + vec3( 0. , height , 0. ); //+ ( monkVel * 10. );

  }

  vec3 look = cameraPosition;
  if( monkPos.w > 0. ){
    look = lookPos;
  }

  look = vec3( 0. , 0. , -30. );

  vec3 dif = look - pos.xyz;//( modelMatrix * vec4( pos , 1. ) ).xyz;
  dif = normalize( dif  );

  dif.y +=  length( a ) * .2;

  vec3 y = vec3( 0. , 1. , 0.);
  vec3 z = dif;
  vec3 x = normalize( cross( z , y ) );
  
  y = normalize( cross( x , z ) );
  z = -normalize( z );

  mat3 rot = mat3(
    x.x , x.y , x.z ,
    y.x , y.y , y.z ,
    z.x , z.y , z.z
  );


  pos = pos + ( rot * position );// * ( vec3( 1. )  + -monkVel * 2000. * uv.y * ( 1. - monkPos.w)  ) );


  vNorm = normalize( (modelMatrix * vec4( rot * normal , 0. )).xyz );



  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}