var G = {};

G.setTriValue3 = function( values , index , p1 , p2 , p3 ){

  values[ index * 3 + 0  ] = p1.x;
  values[ index * 3 + 1  ] = p1.y;
  values[ index * 3 + 2  ] = p1.z;

  values[ index * 3 + 3  ] = p3.x;
  values[ index * 3 + 4  ] = p3.y;
  values[ index * 3 + 5  ] = p3.z;

  values[ index * 3 + 6  ] = p2.x;
  values[ index * 3 + 7  ] = p2.y;
  values[ index * 3 + 8  ] = p2.z;

}

G.setTriValue2 = function( values , index , p1 , p2 , p3 ){

  values[ index * 2 + 0  ] = p1.x;
  values[ index * 2 + 1  ] = p1.y;

  values[ index * 2 + 2  ] = p3.x;
  values[ index * 2 + 3  ] = p3.y;

  values[ index * 2 + 4  ] = p2.x;
  values[ index * 2 + 5  ] = p2.y;

}

G.setTriValue1 = function( values , index , p1 , p2 , p3 ){

  values[ index + 0  ] = p1;
  values[ index + 1  ] = p3;
  values[ index + 2  ] = p3;

}

G.setTriNormal = function( normals , index , p1 , p2 , p3 ){

  G.v3.copy( p1 );
  G.v3.sub( p2 );

  G.v2.copy( p1 );
  G.v2.sub( p3 );

  G.v1.crossVectors( G.v2 , G.v3 );
  G.v1.normalize();

  this.setTriValue3( normals , index , G.v1 , G.v1 , G.v1 );

}

G.setQuadPositions = function( positions , index , p1 , p2 , p3 , p4 ){

  this.setTriValue3( positions , index , p1 , p2 , p3 );
  this.setTriValue3( positions , index + 3 , p4 , p3 , p2 );

}

G.setQuadUVs = function( uvs , index , p1 , p2 , p3 , p4 ){

  this.setTriValue2( uvs , index , p1 , p2 , p3);
  this.setTriValue2( uvs , index + 3 , p4 , p3 , p2 );
}


G.setQuadNormals = function( normals , index , p1 , p2 , p3 , p4 ){

  this.setTriNormal( normals , index , p1 , p2 , p3 );
  this.setTriNormal( normals , index + 3  , p4 , p3 , p2 );

}

G.setQuadValue1 = function( value , index , p1 , p2 , p3 , p4 ){

  this.setTriValue1( value , index , p1 , p2 , p3 );
  this.setTriValue1( value , index + 3  , p4 , p3 , p2 );

}

G.setQuadValue2 = function( value , index , p1 , p2 , p3 , p4 ){

  this.setTriValue2( value , index , p1 , p2 , p3 );
  this.setTriValue2( value , index + 3  , p4 , p3 , p2 );

}

G.setQuadValue3 = function( value , index , p1 , p2 , p3 , p4 ){

  this.setTriValue3( value , index , p1 , p2 , p3 );
  this.setTriValue3( value , index + 3  , p4 , p3 , p2 );

}
