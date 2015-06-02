const int size = @SIZE;

uniform vec3 touchers[ size ];
uniform vec2 scale;
uniform float touching;
uniform float bufferDistance;
uniform float rainbow;

varying float vDist; // .w is which toucher
varying vec3 vNorm;


const float bandSize = .99;
varying vec2 vUv;
$getRainbow

void main(){

	vec3 baseCol = vec3( max( 0. , dot( vNorm , vec3( 0. , 1. , 0. ))));

	float vRainbow = getRainbow();
	if( vRainbow < rainbow ){
		baseCol = vNorm * .5 + .5;
	}

	vec4 col = vec4( baseCol , 0. );

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