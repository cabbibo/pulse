varying vec3 vMNorm;
varying float vMatch;

void main(){

  vMNorm = ( modelMatrix * vec4( normal , 0. ) ).xyz;

  vMatch = ( (position.y +1.) / 60.) ; //max( 0. , dot( vMNorm , -vec3( 0. , 1. , 0. ) ));

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}