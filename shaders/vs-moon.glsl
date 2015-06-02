varying vec3 vMNorm;

void main(){

  vMNorm = ( modelMatrix * vec4( normal , 0. ) ).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}