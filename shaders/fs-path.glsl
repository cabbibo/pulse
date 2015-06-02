
uniform float rainbow;
uniform float slider1;
uniform float slider2;
uniform float slider3;
uniform sampler2D t_audio;
varying float vID;


$getRainbow
$hsv

void main(){
	

  vec4 col = texture2D( t_audio , vec2( abs(cos(vID*.7 * slider1)) , 0. ));
  float vRainbow = getRainbow();
  if( vRainbow < rainbow ){
    col.xyz *= hsv( abs(cos(vID*.5 * slider1)) , slider2 , slider3 );
  }

	gl_FragColor = col;

}