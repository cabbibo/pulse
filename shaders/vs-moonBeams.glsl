const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

varying float vLife;
void main(){

  vec4 p = texture2D( t_posArray[0] , position.xy );
  vLife = p.w;

  gl_PointSize = min( 10., 10000. / length(( p.xyz - cameraPosition)));
  //gl_PointSize = 20.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p.xyz , 1. );


}