
varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;


void main(){

  vUv = uv;
  vMNorm = normalize((modelMatrix * vec4( normal , 0. )).xyz);
  vMPos = (modelMatrix * vec4( position , 1. )).xyz;

 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );


}