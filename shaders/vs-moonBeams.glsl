const int depth = @DEPTH;
uniform sampler2D t_monk;

uniform sampler2D t_posArray[ depth ];

varying float vLife;
varying float vToggled;
varying float vDist;
varying vec3 vVel;

void main(){

  vec4 p = texture2D( t_posArray[0] , position.xy );
  vec4 oP = texture2D( t_posArray[1] , position.xy );
  vVel = p.xyz - oP.xyz;
  vLife = p.w;

 vToggled = texture2D( t_monk , vec2( position.x , 0. )).a;

  vec4 mPos = modelViewMatrix * vec4( p.xyz , 1. );
  gl_PointSize = min( 10., 10000. / length(mPos.xyz));
  //gl_PointSize = 20.;
  gl_Position = projectionMatrix *  mPos;

  vDist = 1. / length(( modelViewMatrix * vec4( p.xyz , 1. )).xyz);


}