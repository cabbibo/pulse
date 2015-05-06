function Wire( paths ){

	var geo = this.createGeometry( paths );

	var mat = new THREE.ShaderMaterial({

		uniforms: {},
		attributes:{ id:{type:"f" , value:null} },
		vertexShader: shaders.vs.path,
		fragmentShader: shaders.fs.path,

	});

	var wire = new THREE.Line( geo , mat , THREE.LinePieces );

	var geo = this.createDebugGeometry( paths , .1 );
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

Wire.prototype.createGeometry = function( paths ){

	var totalVerts = 0;

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	for( var i = 0; i < paths.length; i++ ){
		totalVerts += ( paths[i].points.length-1) * paths[i].numWires * 2;
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

				var t =  path.tangents[k];
	  			var tU = path.tangents[k+1];

	  			var b =  path.bisectors[k];
	  			var bU = path.bisectors[k+1];

				this.setPosAlongDir( v1 , p , b , t , path.wireSpacing , j * path.rightHanded );


				// Makes sure that we place vertices according to the 'space between wires'
				// of the correct path. If we have an output path, we want to make sure that
				// we connect the paths accurately
				if( k + 1 < path.points.length - 1 || !path.outputPath ){

					//console.log( 'WS1 : ' + path.wireSpacing)
					this.setPosAlongDir( v2 , pU , bU , tU , path.wireSpacing , j  * path.rightHanded );

				}else{

					var opBi = path.outputPath.bisectors[0];
					var opTan = path.outputPath.tangents[0];
					var dot = opBi.dot( opTan )

			

					//console.log( 'WS2 : ' + path.outputPath.wireSpacing)
					this.setPosAlongDir( v2 , pU , opBi , opTan , dot * path.outputPath.wireSpacing ,  j * path.outputPath.rightHanded  );

				}

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

Wire.prototype.createDebugGeometry = function( paths , size ){

	var totalVerts = 0;

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	for( var i = 0; i < paths.length; i++ ){
		totalVerts += paths[i].points.length * 6;
	}

	var posArray = new Float32Array( totalVerts * 3 );
	var idArray  = new Float32Array( totalVerts );

	var index = 0;

	for( var  i = 0; i < paths.length; i++ ){

		var path = paths[i];

  		for( var j = 0; j < path.points.length; j++){

  			vIndex = index * 3;

  			var p  = path.points[j];
  			var pU = path.points[j+1];

  			var d  = path.directions[j];
  			var b  = path.bisectors[j];
  			var t  = path.tangents[j];


  			var fd  = p.clone().add( d.clone().multiplyScalar( size ) );
  			var fb  = p.clone().add( b.clone().multiplyScalar( size ) );
  			var ft  = p.clone().add( t.clone().multiplyScalar( size ) );


		    // Direction
		    posArray[ vIndex + 0  ] =  p.x; 
		    posArray[ vIndex + 1  ] =  p.y; 
		    posArray[ vIndex + 2  ] =  p.z; 

		    posArray[ vIndex + 3  ] =  fd.x; 
		    posArray[ vIndex + 4  ] =  fd.y; 
		    posArray[ vIndex + 5  ] =  fd.z;

		    idArray[ index + 0 ] = 0;
		    idArray[ index + 1 ] = 0;

		    v1.copy( p );
		    d.normalize();
		    d.multiplyScalar( size );
		    v1.add( d );

		    // Bisector
		    posArray[ vIndex + 6  ] =  p.x; 
		    posArray[ vIndex + 7  ] =  p.y; 
		    posArray[ vIndex + 8  ] =  p.z; 

		    posArray[ vIndex + 9  ] =  fb.x; 
		    posArray[ vIndex + 10 ] =  fb.y; 
		    posArray[ vIndex + 11 ] =  fb.z; 

		    idArray[ index + 2 ] = 1;
		    idArray[ index + 3 ] = 1;


		    // Tangent
		    posArray[ vIndex + 12 ] =  p.x; 
		    posArray[ vIndex + 13 ] =  p.y; 
		    posArray[ vIndex + 14 ] =  p.z;

		    posArray[ vIndex + 15 ] =  ft.x; 
		    posArray[ vIndex + 16 ] =  ft.y; 
		    posArray[ vIndex + 17 ] =  ft.z; 

		    idArray[ index + 4 ] = 2;
		    idArray[ index + 5 ] = 2;

  			index += 6;

  			
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

// b = bisector
// t = tangent
// w = xWidth
// i = wire index
Wire.prototype.setPosAlongDir = function( v , p , b , t , w , i ){

  var dot = b.dot( t );

  v.copy( p );
  v.add( b.clone().normalize().multiplyScalar( w * i  * 1 / dot ));
  //v.x = p.x + w * i;
  //v.z = p.z +( w * i / ratio );

}