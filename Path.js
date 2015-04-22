function Path( points ,  wires, xWidth , baseID ){

  this.points = points;

  this.body = new THREE.Object3D();

  this.xWidth = xWidth || 1;
  this.baseID = baseID || 0;

  this.directions = this.getDirections( this.points );

  this.debugGeo = this.createDebugGeometry();
  this.geometry = this.createGeometry( wires );
  

  var mat = new THREE.ShaderMaterial({

    uniforms: {},
    attributes:{ id:{type:"f" , value:null} },
    vertexShader: shaders.vs.pathDebug,
    fragmentShader: shaders.fs.pathDebug,

  });

  this.debug = new THREE.Line( this.debugGeo , mat , THREE.LinePieces )
  this.body.add( this.debug );


  var mat = new THREE.ShaderMaterial({

    uniforms: {},
    attributes:{ id:{type:"f" , value:null} },
    vertexShader: shaders.vs.path,
    fragmentShader: shaders.fs.path,

  });

  this.wires = new THREE.Line( this.geometry , mat , THREE.LinePieces )
  this.body.add( this.wires );


}


Path.prototype.createGeometry = function( numWires ){

  var totalVerts = numWires  * (this.points.length - 1 ) * 2; 

  var posArray = new Float32Array( totalVerts * 3 );
  var idArray  = new Float32Array( totalVerts );

  for( var  i= 0 ;  i< numWires; i++ ){

    for( var  j = 0; j< this.points.length -1; j++){

      var index = ((i * (this.points.length-1)) + j) * 2;

      var vIndex = index * 3;

      var d = this.directions[ j ];
      var dU = this.directions[ j + 1 ];
      var p = this.points[ j ];
      var pU = this.points[ j + 1 ];

      var ratio = d.x / d.z;
      var ratioU = dU.x / dU.z;

      var x = this.xWidth * i;
      var z = this.xWidth * i / ratio;

      var xU = this.xWidth * i;
      var zU = this.xWidth * i / ratioU;

      console.log( p )
      console.log( d )
      console.log( pU )
      console.log( dU )

      posArray[ vIndex + 0 ] = p.x + x;
      posArray[ vIndex + 1 ] = 0;
      posArray[ vIndex + 2 ] = p.z + z;

      posArray[ vIndex + 3 ] = pU.x + xU;
      posArray[ vIndex + 4 ] = 0;
      posArray[ vIndex + 5 ] = pU.z + zU;

      idArray[ index + 0 ] = i + this.baseID;
      idArray[ index + 1 ] = i + this.baseID;


    }


  }

  var a_pos = new THREE.BufferAttribute( posArray , 3 );
  var a_id  = new THREE.BufferAttribute( idArray  , 1 );

  geo = new THREE.BufferGeometry();
  geo.addAttribute( 'position'  , a_pos );
  geo.addAttribute( 'id'  , a_id );


  return geo;




}

Path.prototype.createDebugGeometry = function(){

  // two per point
  // two per direction

  var v1 = new THREE.Vector3();
  
  var totalVerts = ( this.points.length - 1 ) * 2 * 2;

  var posArray = new Float32Array( totalVerts * 3 );
  var idArray  = new Float32Array( totalVerts );

  for( var i = 0; i < ( this.points.length - 1 ); i++ ){

    var p = this.points[i];
    var pUp = this.points[ i + 1 ];
    var d = this.directions[i];
   
    // 2 for direction
    // 2 for tangent
    var index = i  * 2 * 2;
    var pIndex = index * 3;

    //var dir = pUp.clone().sub( p );
       
    v1.copy( pUp );
    v1.sub( p);
    v1.normalize();
    v1.multiplyScalar( .5 );
    v1.add( p );

    //direction
    posArray[ pIndex + 0  ] =  p.x; 
    posArray[ pIndex + 1  ] =  p.y; 
    posArray[ pIndex + 2  ] =  p.z; 

    posArray[ pIndex + 3  ] =  v1.x; 
    posArray[ pIndex + 4  ] =  v1.y; 
    posArray[ pIndex + 5  ] =  v1.z;

    idArray[ index + 0 ] = 0;
    idArray[ index + 1 ] = 0;



    v1.copy( p );
    d.normalize();
    //v1.sub( p );
    //v1.normalize();
    d.multiplyScalar( .5 );
    v1.add( d );

    //normal
    posArray[ pIndex + 6  ] =  p.x; 
    posArray[ pIndex + 7  ] =  p.y; 
    posArray[ pIndex + 8  ] =  p.z; 

    posArray[ pIndex + 9  ] =  v1.x; 
    posArray[ pIndex + 10 ] =  v1.y; 
    posArray[ pIndex + 11 ] =  v1.z; 

    idArray[ index + 2 ] = 1;
    idArray[ index + 3 ] = 1;



  }

  var a_pos = new THREE.BufferAttribute( posArray , 3 );
  var a_id  = new THREE.BufferAttribute( idArray  , 1 );

  geo = new THREE.BufferGeometry();
  geo.addAttribute( 'position'  , a_pos );
  geo.addAttribute( 'id'  , a_id );


  return geo;



}

Path.prototype.getDirections = function( points ){

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();

  var upVec = new THREE.Vector3();

  var directions = [];

  for( var i = 0; i < points.length; i++ ){

    v1.copy( points[i] );
    v2.copy( points[i] );

    var p = points[i];


     
    var up = false;
    var down = false;
    if( i > 0 ){

      down = true;
      v1.copy( points[ i - 1 ] );

    }

    if( i < points.length - 1 ){

      up = true;
      v2.copy( points[ i + 1 ] );

    }


    var angle = Math.PI /2;

    upVec.set( 0 , 1 , 0 );

    var direction = new THREE.Vector3();


    if( up == true && down == true ){

      v1.sub( p );
      v2.sub( p );

      v1.multiplyScalar( -1 );

      v1.normalize();
      v2.normalize();

      direction.copy( v1 );
      direction.add( v2 );
      direction.normalize();


    }else{

      upVec.set( 0 , 1,  0 );
      
      if( up == true ){

        direction.copy( v2 );
        angle = Math.PI / 2;

      }else{

        direction.copy( v1 );
        direction.multiplyScalar( -1 );
        angle = - Math.PI / 2;

      }

    }

    direction.applyAxisAngle( upVec , Math.PI / 2 );

    directions.push( direction );

  }


  return directions;


}
