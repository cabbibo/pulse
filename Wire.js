function Wire( paths  , xWidth ){

	var geo = this.createGeometry( paths , xWidth );

	var mat = new THREE.ShaderMaterial({

		uniforms: {},
		attributes:{ id:{type:"f" , value:null} },
		vertexShader: shaders.vs.path,
		fragmentShader: shaders.fs.path,

	});

	var wire = new THREE.Line( geo , mat , THREE.LinePieces );

	var geo = this.createDebugGeometry( paths );
	var mat = new THREE.ShaderMaterial({

	    uniforms: {},
	    attributes:{ id:{type:"f" , value:null} },
	    vertexShader: shaders.vs.pathDebug,
	    fragmentShader: shaders.fs.pathDebug,
	    linewidth: 10,
	    opacity: .01,
	    transparent: true

	  });

  	var debug = new THREE.Line( geo , mat , THREE.LinePieces );

	return { wire: wire , debug: debug }

}

Wire.prototype.createGeometry = function( paths , xWidth){

	var totalVerts = 0;

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	for( var i = 0; i < paths.length; i++ ){
		console.log( paths[i].points.length );
		console.log( paths[i].numWires );
		totalVerts += (paths[i].points.length-1) * paths[i].numWires * 2;
	}

	var posArray = new Float32Array( totalVerts * 3 );
	var idArray  = new Float32Array( totalVerts );

	var index = 0;

	for( var  i = 0; i < paths.length; i++ ){

		var path = paths[i];

		for( var j = 0; j < path.numWires; j++ ){

  		for( var k = 0; k < path.points.length -1; k++){

  			vIndex = index * 3;

  			var p = path.points[k];
  			var pU = path.points[k+1];
  			var d = path.directions[k];
  			var dU = path.directions[k+1];

			this.setPosAlongDir( v1 , p , d , xWidth , j );
			this.setPosAlongDir( v2 , pU , dU , xWidth , j );

			posArray[ vIndex + 0 ] = v1.x;
			posArray[ vIndex + 1 ] = 0;
			posArray[ vIndex + 2 ] = v1.z;

			posArray[ vIndex + 3 ] = v2.x;
			posArray[ vIndex + 4 ] = 0;
			posArray[ vIndex + 5 ] = v2.z;

			idArray[ index + 0 ] = j + path.baseID;
			idArray[ index + 1 ] = j + path.baseID;

  			index += 2;

  			
  		}

		}

	}


	var a_pos = new THREE.BufferAttribute( posArray , 3 );
	var a_id  = new THREE.BufferAttribute( idArray  , 1 );

	geo = new THREE.BufferGeometry();

	geo.addAttribute( 'position'  , a_pos );
	geo.addAttribute( 'id'  , a_id );

	return geo;

}

Wire.prototype.createDebugGeometry = function( paths ){

	var totalVerts = 0;

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	for( var i = 0; i < paths.length; i++ ){
		totalVerts += paths[i].points.length * 4;
	}

	var posArray = new Float32Array( totalVerts * 3 );
	var idArray  = new Float32Array( totalVerts );

	var index = 0;

	for( var  i = 0; i < paths.length; i++ ){

		var path = paths[i];

  		for( var j = 0; j < path.points.length; j++){

  			vIndex = index * 3;

  			var p = path.points[j];
  			var pU = path.points[j+1];

  			if( j == path.points.length - 1 ){
		      pU = path.points[j - 1 ].clone();
		      pU.sub( p );
		      pU.multiplyScalar( -1 );
		      pU.add( p );
		    }

  			var d = path.directions[j];
  	

			v1.copy( pU );
		    v1.sub( p);
		    v1.normalize();
		    v1.multiplyScalar( .5 );
		    v1.add( p );

		    //direction
		    posArray[ vIndex + 0  ] =  p.x; 
		    posArray[ vIndex + 1  ] =  p.y; 
		    posArray[ vIndex + 2  ] =  p.z; 

		    posArray[ vIndex + 3  ] =  v1.x; 
		    posArray[ vIndex + 4  ] =  v1.y; 
		    posArray[ vIndex + 5  ] =  v1.z;

		    idArray[ index + 0 ] = 0;
		    idArray[ index + 1 ] = 0;

		    v1.copy( p );
		    d.normalize();
		    d.multiplyScalar( .5 );
		    v1.add( d );

		    //normal
		    posArray[ vIndex + 6  ] =  p.x; 
		    posArray[ vIndex + 7  ] =  p.y; 
		    posArray[ vIndex + 8  ] =  p.z; 

		    posArray[ vIndex + 9  ] =  v1.x; 
		    posArray[ vIndex + 10 ] =  v1.y; 
		    posArray[ vIndex + 11 ] =  v1.z; 

		    idArray[ index + 2 ] = 1;
		    idArray[ index + 3 ] = 1;

  			index += 4;

  			
  		}



	}


	var a_pos = new THREE.BufferAttribute( posArray , 3 );
	var a_id  = new THREE.BufferAttribute( idArray  , 1 );

	geo = new THREE.BufferGeometry();

	geo.addAttribute( 'position'  , a_pos );
	geo.addAttribute( 'id'  , a_id );

	return geo;

}

// v = vector to set
// p = position start
// d = direction 
// w = xWidth
// i = wire index
Wire.prototype.setPosAlongDir = function( v , p , d , w , i ){

  var ratio = d.x / d.z;
  v.copy( p );
  v.add( d.clone().normalize().multiplyScalar( w * i ));
  //v.x = p.x + w * i;
  //v.z = p.z +( w * i / ratio );

}