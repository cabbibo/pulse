// This part is good!
function BuildingMesh( basePaths , buildingSize , uniforms ){

  var totalVerts = basePaths.length * ( 3 * 2 * 5 );



  // Get base position in shader by looking up into 
  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );
  var ids       = new Float32Array( totalVerts     );

  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();

  var u1 = new THREE.Vector2();
  var u2 = new THREE.Vector2();
  var u3 = new THREE.Vector2();
  var u4 = new THREE.Vector2();

  // Base Position
  var bp = new THREE.Vector3();

  for( var  i = 0; i < basePaths.length; i++ ){



    bp.copy( basePaths[i].points[0] )

    var height = ( 4 + 5 * Math.random() );
    var buildingIndex = i * ( 3 * 2 * 5 );

    // Sides of building
    for( var j = 0; j < 4; j++ ){

      var index = buildingIndex + j * 3 * 2

      var t = ( j / 4 ) * 2 * Math.PI;
      var tU = ( ((j+1) % 4) / 4 ) * 2 * Math.PI;

      p1.x = .5 * buildingSize * Math.cos( t );
      p1.y = 0;
      p1.z = .5 * buildingSize * Math.sin( t );

      p2.x = .5 * buildingSize * Math.cos( tU );
      p2.y = 0;
      p2.z = .5 * buildingSize * Math.sin( tU );
      
      p3.x = .5 * buildingSize * Math.cos( t );
      p3.y = buildingSize * height;
      p3.z = .5 * buildingSize * Math.sin( t );

      p4.x = .5 * buildingSize * Math.cos( tU );
      p4.y = buildingSize * height;
      p4.z = .5 * buildingSize * Math.sin( tU );
      
      p1.add( bp );
      p2.add( bp );
      p3.add( bp );
      p4.add( bp );

      u1.x = 0;
      u2.x = 1;
      u3.x = 0;
      u4.x = 1;

      u1.y = 0;
      u2.y = 0;
      u3.y = 2 * height;
      u4.y = 2 * height;

      this.setQuadValue1( ids , index , i , i , i , i );
      this.setQuadValue2( uvs , index , u1 , u2 , u3 , u4 );
      this.setQuadValue3( positions , index , p1 , p2 , p3 , p4 );
      this.setQuadNormals( normals , index , p1 , p2 , p3 , p4 );

    }

    // TOP
    var index = buildingIndex + 4 * 3 * 2;

    p1.x = .5 * buildingSize * Math.cos( ( 0 / 4 ) * 2 * Math.PI );
    p1.y = buildingSize * height;
    p1.z = .5 * buildingSize * Math.sin( ( 0 / 4 ) * 2 * Math.PI );

    p2.x = .5 * buildingSize * Math.cos( ( 1 / 4 ) * 2 * Math.PI );
    p2.y = buildingSize * height;
    p2.z = .5 * buildingSize * Math.sin( ( 1 / 4 ) * 2 * Math.PI );
   
    p3.x = .5 * buildingSize * Math.cos( ( 3 / 4 ) * 2 * Math.PI );
    p3.y = buildingSize * height;
    p3.z = .5 * buildingSize * Math.sin( ( 3 / 4 ) * 2 * Math.PI );
    
    p4.x = .5 * buildingSize * Math.cos( ( 2 / 4 ) * 2 * Math.PI );
    p4.y = buildingSize * height;
    p4.z = .5 * buildingSize * Math.sin( ( 2 / 4 ) * 2 * Math.PI );

    p1.add( bp );
    p2.add( bp );
    p3.add( bp );
    p4.add( bp );

    u1.x = 0;
    u2.x = 1;
    u3.x = 0;
    u4.x = 1;

    u1.y = 0;
    u2.y = 0;
    u3.y = 1;
    u4.y = 1;

    var id = 0;

    this.setQuadValue1( ids , index , id , id , id , id );
    this.setQuadValue2( uvs , index , u1 , u2 , u3 , u4 );
    this.setQuadValue3( positions , index , p1 , p2 , p3 , p4 );
    this.setQuadNormals( normals , index , p1 , p2 , p3 , p4 );


  }


  var geo = new THREE.BufferGeometry();

  var pos     = new THREE.BufferAttribute( positions , 3 );
  var uv      = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );
  var id      = new THREE.BufferAttribute( ids , 1 );


  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );
  geo.addAttribute( 'id' , id);




  console.log('BUDDD')
  console.log( uniforms );
  console.log( G.fingers.tips.length )
  var vs = shaders.setValue( shaders.vs.building , 'SIZE' , G.fingers.tips.length );
  var fs = shaders.fs.building;
  var mat = new THREE.ShaderMaterial({
    uniforms:uniforms,
    attributes:{ 
      id: { type:"f" , value: null }
    },
    vertexShader:vs,
    fragmentShader:fs,
   // side: THREE.DoubleSide
  })

  return  new THREE.Mesh( geo , mat );

}



BuildingMesh.prototype.setTriNormal = function( normals , index , p1 , p2 , p3 ){

  G.v3.copy( p1 );
  G.v3.sub( p2 );

  G.v2.copy( p1 );
  G.v2.sub( p3 );

  G.v1.crossVectors( G.v2 , G.v3 );
  G.v1.normalize();

  this.setTriValue3( normals , index , G.v1 , G.v1 , G.v1 );

}

BuildingMesh.prototype.setQuadValue3 = function( values , index , p1 , p2 , p3 , p4 ){

  this.setTriValue3( values , index     , p1 , p2 , p3 );
  this.setTriValue3( values , index + 3 , p4 , p3 , p2 );

}

BuildingMesh.prototype.setQuadValue2 = function( values , index , p1 , p2 , p3 , p4 ){

  this.setTriValue2( values , index     , p1 , p2 , p3 );
  this.setTriValue2( values , index + 3 , p4 , p3 , p2 );
}

BuildingMesh.prototype.setQuadValue1 = function( values , index , p1 , p2 , p3 , p4 ){

  this.setTriValue1( values , index     , p1 , p2 , p3 );
  this.setTriValue1( values , index + 3 , p4 , p3 , p2 );
}


BuildingMesh.prototype.setQuadNormals = function( normals , index , p1 , p2 , p3 , p4 ){

  this.setTriNormal( normals , index      , p1 , p2 , p3 );
  this.setTriNormal( normals , index + 3  , p4 , p3 , p2 );

}


BuildingMesh.prototype.setTriValue1 = function( values , index , p1 , p2 , p3 ){

  values[ index + 0  ] = p1;
  values[ index + 1  ] = p3;
  values[ index + 2  ] = p3;

}

BuildingMesh.prototype.setTriValue2 = function( values , index , p1 , p2 , p3 ){

  values[ index * 2 + 0  ] = p1.x;
  values[ index * 2 + 1  ] = p1.y;

  values[ index * 2 + 2  ] = p3.x;
  values[ index * 2 + 3  ] = p3.y;

  values[ index * 2 + 4  ] = p2.x;
  values[ index * 2 + 5  ] = p2.y;

}

BuildingMesh.prototype.setTriValue3 = function( values , index , p1 , p2 , p3 ){

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



