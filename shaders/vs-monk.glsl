uniform sampler2D t_monk;

attribute float id;
attribute float lookAt;

varying float vID;
varying float vLookAt;
varying vec3 vNorm;
varying vec2 vUv;


void main(){
  
  vec4 monkPos = texture2D( t_monk , vec2( id , 0. ));
  vec3 pos = position + monkPos.xyz;

  vID = id;
  vLookAt = lookAt;
  vUv = uv;

  if( lookAt > .5 ){

    pos = monkPos.xyz + vec3( 0. , 2. , 0. );
    pos += position;

  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}