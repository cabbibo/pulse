const int size = @SIZE;

uniform vec3 touchers[ size ];
uniform vec2 scale;
uniform float touching;
uniform float bufferDistance;
uniform float rainbow;
uniform float cityButton;
uniform sampler2D t_audio;

varying float vDist; // .w is which toucher
varying vec3 vNorm;


const float bandSize = .99;
varying vec2 vUv;
$getRainbow

void main(){

	vec3 baseCol = vec3( max( 0. , dot( vNorm , vec3( 0. , 1. , 0. ))));

	float vRainbow = getRainbow();
	if( vRainbow < rainbow || cityButton > .5 ){
		baseCol = vNorm * .5 + .5;
	}

	vec4 col = vec4( baseCol , 0. );

	if( vDist < 0. ){ col = vec4( baseCol , -vDist / bufferDistance ); }

	if( vDist < -bufferDistance * .95 ){ col = vec4( 0. , 0. , 0. , 0. );}
	

	vec2 xy = vUv - vec2( .5 ) ;
	xy *= 2.;

	if( abs( xy.x ) > 1. - ( .1 /  scale.x  ) || abs( xy.y ) > 1. - ( .1 /  scale.y  )){ 

		float lu = 0.;
		if( abs( xy.x ) >  abs( xy.y ) ){
			lu = abs( xy.x ) - ( 1. - ( .1 /  scale.x  ) );
			lu *= 10.;
		}else{
			lu = lu = abs( xy.y ) - ( 1. - ( .1 /  scale.y  ) );
			lu *= 10.;
		}

		vec3 a = texture2D( t_audio , vec2( lu , 0.)).xyz;



		col = vec4( baseCol * a ,1. ); 
	}


	// col = vec4( baseCol ,1. ); 

	//if( length( vPara ) < .03 && vDistToPlane < 0. ){ col = vec4( baseCol ,1. ); }

	//col *= 1.- vDistToPlane;

	//if( vDistToPlane < 0. ){ col = vec4( 1. ); }
	gl_FragColor = col;

	//gl_FragColor = vec4( 1. );


}