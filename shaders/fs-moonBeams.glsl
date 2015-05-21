uniform sampler2D t_sprite;
varying float vLife;
void main(){

  float multiplier = clamp( vLife , 0. , 1. );
  vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );  
  gl_FragColor = s * multiplier;
}