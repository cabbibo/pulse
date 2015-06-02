uniform sampler2D t_sprite;
uniform sampler2D t_audio;
uniform float rainbow;

varying float vLife;
varying float vToggled;
varying float vDist;
varying vec3 vVel;

$getRainbow

void main(){

  if( vToggled < .5 ){
    discard;
  }

  float multiplier = clamp( vLife * 40. , 0. , 1.  );
  vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) ); 
  vec4 a = texture2D( t_audio , vec2( length( gl_PointCoord - vec2( .5 )) * 2. , 0. ) ); 

  vec4 col = clamp( vDist * 3. , 0. , 1. )* a * s * multiplier;
  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col.xyz *= normalize( vVel ) * .5 + .5;
  }

  gl_FragColor = col;
}