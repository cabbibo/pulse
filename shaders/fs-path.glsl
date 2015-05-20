
uniform float slider1;
uniform float slider2;
uniform float slider3;
varying float vID;

vec3 hsv(float h, float s, float v)
{
    
  return mix( vec3( 1.0 ), clamp( ( abs( fract(
    h + vec3( 3.0, 2.0, 1.0 ) / 3.0 ) * 6.0 - 3.0 ) - 1.0 ), 0.0, 1.0 ), s ) * v;
}


void main(){
	

	vec3 col = hsv( abs(cos(vID*.1 * slider1)) , slider2 , slider3 );


	gl_FragColor = vec4( col , 1. );

}