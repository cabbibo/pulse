varying vec3 vDist;
void main(){
	
	gl_FragColor = vec4( normalize( vDist ) * .5 + .5 , 1.);

}