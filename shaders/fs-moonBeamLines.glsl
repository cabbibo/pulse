
varying vec3 vVel;
varying float vDepth;
varying float vLife;
void main(){


  float multiplier = clamp( sqrt( vLife  ), 0. , 1. );
  if( length( vVel ) > .4 ){ multiplier = 0.; }
  if( vLife > 1. ){ multiplier = 0.; }

  if( multiplier == 0. ){ discard; }
  //gl_FragColor = vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );
  gl_FragColor = clamp( vLife * 10. , 0. , 1.  ) *  vec4( (1. - vDepth) * normalize( vVel ) * .5 + .5 ,( 1. - vDepth) );// vec4( 1.,.3,0.,1. )* vDepth + vec4( 0. , .3 , 1. , 1. ) * ( 1. - vDepth );



  /*if( vLife > 4. || vLife < .4 ){
    gl_FragColor = vec4( 0. );
  }*/
}