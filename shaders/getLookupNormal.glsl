vec3 getLookupNormal( vec3 p , vec2 uv ){

  vec3 upX  = p;
  vec3 doX  = p;
  vec3 upY  = p;
  vec3 doY  = p;

  if( uv.x > iSize ){
    doX = texture2D( t_pos , uv - vec2( iSize , 0. ) ).xyz;
  }
   
  if( uv.x < 1.- iSize ){
    upX = texture2D( t_pos , uv + vec2( iSize , 0. ) ).xyz;
  }

  if( uv.y > iSize ){
    doY = texture2D( t_pos , uv - vec2( 0. , iSize ) ).xyz;
  }


  if( uv.y < 1. - iSize ){
    upY = texture2D( t_pos , uv + vec2( 0. , iSize ) ).xyz;
  }


  vec3 dX = upX - doX;
  vec3 dY = upY - doY;

  return normalize( cross( dX , dY ) );


}
