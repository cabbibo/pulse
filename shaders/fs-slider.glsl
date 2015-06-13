
uniform vec2 scale;
uniform float filled;


varying vec2 vUv;

void main(){

	vec3 baseCol = vec3( 1. );

	vec4 col = vec4( baseCol , .2 );

	vec2 xy = vUv - vec2( .5 ) ;
	xy *= 2.;

	if( 
		abs( xy.x ) > 1. - ( .1 /  scale.x  ) || 
		abs( xy.y ) > 1. - ( .1 /  scale.y  )
	){ 
		col = vec4( baseCol ,1. ); 
	}

	if( vUv.y < filled ){

		col = vec4( baseCol ,1. ); 

	}

	gl_FragColor = col;

}