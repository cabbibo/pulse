

float getRainbow(){ 
  if( rainbow == 0. ){
    return 100.;
  }else{
    float depth = gl_FragCoord.z / gl_FragCoord.w;

    vec2 p = vec2( gl_FragCoord.x / 100. , depth * 1. );

   // float noise = RBsnoise( p );

    
    //depth += .1; //* noise * min( 10. ,  depth * depth);
    depth *= .001;

    return min( .99 , depth );
  }
}