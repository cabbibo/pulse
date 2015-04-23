function PathConnector( connectionPaths , output , xWidth , bufferSize , baseID ){
	

	var totalWires = 0; 

	var paths = [];

	this.body = new THREE.Object3D();


	// Getting path at beginning
	var opPath = new Path( output.points , 0 , baseID );


	var outputDir = output.points[0].clone();
	outputDir.sub( output.points[1] );
	outputDir.normalize();

	var outputTangent = outputDir.clone();
	outputTangent.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ), Math.PI /2)


	var v1 = new THREE.Vector3();


	for( var i = 0; i < connectionPaths.length; i++ ){

		var cp = connectionPaths[i];

		var buffer = output.points[0].clone();

		v1.copy( outputDir );
		v1.multiplyScalar( bufferSize );
		buffer.add( v1 );
		

		v1.copy( outputTangent );
		v1.multiplyScalar( totalWires * xWidth );
		buffer.sub( v1 );
		// Make sure we start at the right offset 
		// compared to previous line
		if( i  !== 0 ){
			
			var pDown = paths[ i - 1 ];

			// care about the ones that haven't been pushed yet
			var pos = pDown.points[ pDown.points.length - 2 ];
			var dir = pDown.directions[ pDown.points.length - 2 ];

			this.setPosAlongDir( buffer , pos , dir , xWidth , pDown.numWires );

		}


		var pos = opPath.points[0];
		var dir = opPath.directions[0];


		var connection = output.points[0].clone();
		

		this.setPosAlongDir( connection , pos , dir , xWidth , totalWires  );



		//connection.x += totalWires * xWidth;

		/*var bufferHalf = connection.clone();
		bufferHalf.z -= bufferSize / 2;*/
		cp.points.push( buffer );
		cp.points.push( connection );

		var p = new Path( cp.points , cp.numWires , totalWires + baseID );

		//p.directions[ p.directions.length - 1 ] =
		paths.push( p );

		totalWires += cp.numWires;

	}

	opPath.numWires = totalWires

	// set the last direction in the same as our new path
	// so wires align
	for( var i = 0 ; i < paths.length; i++ ){
		var p = paths[i];
		p.directions[ p.directions.length - 1 ] = opPath.directions[0];
	}

	//paths.push( opPath );
	console.log( opPath )
	return {
		inputPaths: paths,
		outputPath: opPath
	}

}

// v = vector to set
// p = position start
// d = direction 
// w = xWidth
// i = wire index
PathConnector.prototype.setPosAlongDir = function( v , p , d , w , i ){

  var ratio = d.x / d.z;
  v.copy( p );
  v.add( d.clone().normalize().multiplyScalar( w * i ));
  //v.x = p.x + w * i;
  //v.z = p.z +( w * i / ratio );

}