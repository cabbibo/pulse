varying float vID;

void main(){
	

	vec3 col = vec3( .4 , 0. , 0. );
	if( vID > .5 ){
		//discard;
		col = vec3(  0. , .4 , 0. );
	}

	gl_FragColor = vec4( col , 1. );

}