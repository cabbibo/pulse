const int size = @SIZE;

uniform vec3 touchers[ size ];
uniform vec2 scale;
uniform float touching;
uniform float bufferDistance;

varying float vDist; // .w is which toucher
varying vec3 vNorm;

const float bandSize = .99;
varying vec2 vUv;

void main(){

	vec3 baseCol = vNorm * .5 + .5;

	vec4 col = vec4( baseCol , 0. );
	
//	float xy = vUv - vec2( .5 );
//	float y = sin( vUv.y * 300.);




	//if( abs( xy.x ) > .4 || abs( xy.y ) > .4 ){ col = vec4( baseCol ,1. ); }

	/*if( vDist < 0. && touching > .5 ){
		col = vec4( vec3( 1. ) , 1. );
	}*/
	//float d = sin( vDist * 3000. );
	if( vDist < 0. ){ col = vec4( baseCol , -vDist / bufferDistance ); }

	if( vDist < -bufferDistance * .95 ){ col = vec4( 0. , 0. , 0. , 0. );}
	

	vec2 xy = vUv - vec2( .5 ) ;
	xy *= 2.;

	if( abs( xy.x ) > 1. - ( .1 /  scale.x  ) || abs( xy.y ) > 1. - ( .1 /  scale.y  )){ col = vec4( baseCol ,1. ); }


	// col = vec4( baseCol ,1. ); 

	//if( length( vPara ) < .03 && vDistToPlane < 0. ){ col = vec4( baseCol ,1. ); }

	//col *= 1.- vDistToPlane;

	//if( vDistToPlane < 0. ){ col = vec4( 1. ); }
	gl_FragColor = col;

	//gl_FragColor = vec4( 1. );


}