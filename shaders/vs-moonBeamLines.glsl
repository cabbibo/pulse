uniform sampler2D t_pos;
varying float vDepth;
varying float vLife;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

varying vec3 vVel;


void main(){

  vec4 p = vec4( 0. );
  vec4 p1 = vec4( 0. );

  for( int i = 0; i < depth; i++ ){ 
    if( i == int( position.z )){
      p = texture2D( t_posArray[i] , position.xy );

      if( int( position.z ) <= depth-1 ){
        p1 =  texture2D( t_posArray[i+1] , position.xy );
      }else{
        p1 =  texture2D( t_posArray[i-1] , position.xy );
      }

    }

    
     /* if( 5 == int( position.z )){
      p = texture2D( t_posArray[5] , position.xy ).xyz;
    }*/
  }

  vLife = p.w;

  vVel = p.xyz - p1.xyz;
  vDepth = float( position.z ) / float( depth );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p.xyz , 1. );


}
