//TODO: BREAKS WHEN ONLY 1 POINT IS GIVEN IN PATH!

// Takes multiply input path
// and alters them so that they connect to an output path
function PathConnector( connectionPaths , output , xWidth , bufferSize , baseID , rightHanded ){


	//console.log( 'xWidth : ' + xWidth );

	//TODO: should we try and always make the wires set apart?

	// v = vector to set
	// p = position start
	// d = direction 
	// w = xWidth
	// i = wire index
	var setPosAlongDir = function( v , p , d , w , i ){

	  v.copy( p );
	  v.add( d.clone().normalize().multiplyScalar( w * i ) );

	}




	// Add to the total wires, so that we 
	// know what the output path number of wires will be.
	var totalWires = 0; 

	var paths = [];

	// Getting path at beginning
	var opPath = new Path( output.points , 0 , baseID , xWidth , undefined , rightHanded );


	// Get our final output direction and tangent
	// to make sure that when points connect, they dont overlap
	var outputDir = opPath.directions[0].clone();

	var outputTangent = opPath.tangents[0].clone();

	// assigning a temp vec3 to use
	var v1 = new THREE.Vector3();



	// For each path, add 2 more points to the path
	// that connect it to the new path location
	// this is the 'connection' part
	for( var i = 0; i < connectionPaths.length; i++ ){

		var cp = connectionPaths[i];

		var buffer = opPath.points[0].clone();

		var dirVec = opPath.points[0].clone();
		dirVec.sub( cp.points[ cp.points.length-1 ]);



		// Offset out buffer position
		// by the direction of the output
		// adding this to the path will
		// make sure that we get a new
		// proper direction of the wire layout
		// in the previous location
		v1.copy( dirVec );
		v1.multiplyScalar( -bufferSize );
		buffer.add( v1 );
		

		v1.copy( outputTangent );
		v1.multiplyScalar( totalWires * xWidth );
		buffer.sub( v1 );

		//		console.log( buffer )


		// Make sure we start at the right offset 
		// compared to previous line
		if( i  !== 0 ){
			
			var pDown = paths[ i - 1 ];

			// care about the ones that haven't been pushed yet
			var pos = pDown.points[ pDown.points.length - 2 ];
			var dir = pDown.bisectors[ pDown.points.length - 2 ];

			dot = pDown.bisectors[ pDown.points.length - 2 ].dot( pDown.tangents[ pDown.points.length - 2])
			//console.log( dot )
			setPosAlongDir( buffer , pos , dir ,  pDown.wireSpacing / dot , pDown.numWires * rightHanded );

		}


		var pos = opPath.points[0];
		var dir = opPath.bisectors[0];

		var connection = output.points[0].clone();

		//dot = pDown.bisectors[ pDown.points.length - 2 ].dot( pDown.tangents[ pDown.points.length - 2])
		// makes sure that we place these connection wires along the proper
		// so the points *exactly* match the locations of the wires of the
		// connection path
		setPosAlongDir( connection , pos , dir , xWidth , totalWires * rightHanded  );

		// Now that we have these new points
		// push them to the points of the connection path
		cp.points.push( buffer );
		cp.points.push( connection );

	


		//console.log( 'wireSpacing : ' + cp.wireSpacing )


		// Now we can get a new path, that will give us the 
		// proper directions for the new points
		var p = new Path( cp.points , cp.numWires , totalWires + baseID , cp.wireSpacing , opPath , cp.rightHanded );

		p.bisectors[ p.directions.length - 1 ] = dir;

		paths.push( p );

		// Adding more wires, so the next connector
		// we add will be put in the right location
		totalWires += cp.numWires;

	}


	// Now we know how many wires the output path has
	opPath.numWires = totalWires;

	// set the last direction in the same as our new path
	// so wires align
	for( var i = 0 ; i < paths.length; i++ ){
		var p = paths[i];
		p.bisectors[ p.bisectors.length - 1 ] = opPath.bisectors[0];
	}


	// Remember: our opPath doesn't have a next path yet!
	// Return the altered input paths
	// and the output path, which now has an assigned wire number
	return {
		inputPaths: paths,
		outputPath: opPath
	}

}



