
const int size = @SIZE;
uniform vec3 touchers[ size ];
uniform float bufferDistance;
uniform float distanceCutoff;

varying vec2 vUv;
varying float vDist;
varying vec3 vNorm;


float distanceToPlane( vec3 n , vec3 p1 , vec3 p2 , out vec3 perp , out vec3 para ){
	
	vec3 dif = p2 - p1;

	float d = dot( n , dif );

	perp = n * d;

	para = dif - perp;

	return d;

}

float getDisplacement( vec3 n , vec3 pos ){


  float push = 0.;
 // float dist = 0.;

  float pd = 0.;

	for( int  i = 0; i < size; i++ ){
		  

		vec3 touch = touchers[i];

		vec3 para = vec3(0.);
		vec3 perp = vec3(0.);

		float d = distanceToPlane( n , pos , touch , perp , para );
    //dist = d;
    //dist = min( dist , d );


		//float push = 0.;
		//float cutoff = .2;
    float len = length( para );

		if( len <= distanceCutoff ){
			push = pow( ( distanceCutoff - len ) / distanceCutoff , 3. );
		}

    pd = min( pd , d * push );

	}

  float toReturn = max( -bufferDistance  , pd  );

  return toReturn;


}

vec3 getNormal( vec3 normal , vec3 position ){

  vec3 mNorm = (modelMatrix * vec4( normal , 0. )).xyz;
  mNorm = normalize( mNorm );

  float distance = .01;

  vec3 pUpX = position + vec3(   distance ,  0. , 0. );
  vec3 pDoX = position + vec3(  -distance ,  0. , 0. );
  vec3 pUpY = position + vec3(   .0 ,  distance , 0. );
  vec3 pDoY = position + vec3(   .0 , -distance , 0. );


  vec3 mUpX = (modelMatrix * vec4( pUpX , 1. )).xyz;
  vec3 mDoX = (modelMatrix * vec4( pDoX , 1. )).xyz;
  vec3 mUpY = (modelMatrix * vec4( pUpY , 1. )).xyz;
  vec3 mDoY = (modelMatrix * vec4( pDoY , 1. )).xyz;

  float dUpX = getDisplacement( mNorm , mUpX );
  float dDoX = getDisplacement( mNorm , mDoX );
  float dUpY = getDisplacement( mNorm , mUpX );
  float dDoY = getDisplacement( mNorm , mDoY );

  vec3 fUpX = pUpX + normal * dUpX * 10.;
  vec3 fDoX = pDoX + normal * dDoX * 10.;
  vec3 fUpY = pUpY + normal * dUpY * 10.;
  vec3 fDoY = pDoY + normal * dDoY * 10.;

  vec3 difX = fUpX - fDoX;
  vec3 difY = fUpY - fDoY;

  vec3 norm = cross( difX , difY );
  norm = normalize( norm );

  return norm;

}



void main(){
	


	vec3 mNorm = (modelMatrix * vec4( normal , 0. )).xyz;
  mNorm = normalize( mNorm );

	vec3 mPos = (modelMatrix * vec4( position , 1. )).xyz;

  vDist = getDisplacement( mNorm , mPos );
	vec3 pos = position + normal * vDist;

  vNorm = (modelMatrix * vec4( getNormal( normal , position ), 0. )).xyz;


	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );

}