varying vec2 vUv;
varying vec3 vMNorm;
varying vec3 vMPos;
varying vec3 vPos;
varying vec3 vEye;

void main(){

  vUv = position.xz;
  vPos = position;
  vMNorm = normalize((modelMatrix * vec4( normal , 0. )).xyz);
  vMPos = (modelMatrix * vec4( position , 1. )).xyz;

  vEye = vMPos - cameraPosition;
 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}