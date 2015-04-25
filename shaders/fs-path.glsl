varying float vID;

vec3 hsv(float h, float s, float v)
{
    
  return mix( vec3( 1.0 ), clamp( ( abs( fract(
    h + vec3( 3.0, 2.0, 1.0 ) / 3.0 ) * 6.0 - 3.0 ) - 1.0 ), 0.0, 1.0 ), s ) * v;
}


void main(){
	

	vec3 col = hsv( abs(cos(vID*.1)) , 1. ,1.);


	gl_FragColor = vec4( col , 1. );

}