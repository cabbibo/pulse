const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];
uniform sampler2D t_monk;
uniform sampler2D t_lock;
varying float vDepth;
varying float vLife;
varying float vToggled;
varying float vDist;
varying float vLock;

varying vec3 vVel;
varying float vDot;





void main(){

  vec4 p = vec4( 0. );
  vec4 p1 = vec4( 0. );
  vec4 p2 = vec4( 0. );

  vec4 top = texture2D( t_posArray[0] , position.xy );
  float p1Flipped = 1.;
  float p2Flipped = 2.;

  for( int i = 0; i < depth; i++ ){ 
    if( i == int( position.z )){
      p = texture2D( t_posArray[i] , position.xy );

      if( int( position.z ) <= depth-1 ){
        p1 =  texture2D( t_posArray[i+1] , position.xy );
      }else{
        p1 =  texture2D( t_posArray[i-1] , position.xy );
        p1Flipped = -1.;
      }

      if( int( position.z ) <= depth-2 ){
        p2 =  texture2D( t_posArray[i+2] , position.xy );
      }else{
        p2 =  texture2D( t_posArray[i-2] , position.xy );
        p2Flipped = -1.;
      }

    }
    
     /* if( 5 == int( position.z )){
      p = texture2D( t_posArray[5] , position.xy ).xyz;
    }*/
  }



  vToggled = texture2D( t_monk , vec2( position.x , 0. )).a;
  vLock = texture2D( t_lock , vec2( position.x , 0. )).x;

  vLife = p.w;
  float topLife = top.w;

  vDot = 1.;
  if( topLife < 1. && vLife >= 1. ){
    vDot = -100.;
  }

  if( topLife < 1. && p1.w >= 1. ){
    vDot = -100.;
  }

  vVel = p1Flipped * p.xyz - p1Flipped * p1.xyz;
  vDepth = float( position.z ) / float( depth );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p.xyz , 1. );

  vDist = 1. / length(( modelViewMatrix * vec4( p.xyz , 1. )).xyz);



  
}
