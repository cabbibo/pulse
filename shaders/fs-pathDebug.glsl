varying float vID;

void main(){
	

	float val = 1.;

	vec3 col = vec3( val , 0. , 0. );
	
	if( vID > .5 && vID < 1.5 ){
		//discard;
		col = vec3(  0. , val , 0. );
	}

	if( vID > 1.5 ){
		//discard;
		col = vec3(  0. , 0. , val );
	}

	gl_FragColor = vec4( col , 1. );

}