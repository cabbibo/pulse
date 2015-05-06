function RecursiveConnector( pathList , baseID ){

	var finishedWires = [];
	var baseID = baseID || 0;

	var basePaths = [];

	var percolate = function( pl , lor , baseID ){

		var tmpBase = baseID;
		var connections = [];


		for( var i = 0; i < pl.inputs.length; i++ ){

			var p = pl.inputs[i];

			// We've Reached the bottom!
			if( p.numWires ){
				
				connections.push( p );
				basePaths.push( p );
				tmpBase += p.numWires;
			
			// Need to dig further!
			}else{

				var connection = percolate( p , lor + 1 , tmpBase );
				connections.push( connection.output )

				tmpBase += connection.output.numWires;

			}

		}

		pl.bufferSize = pl.bufferSize || .1;


		var connection = PathConnector( 
			connections , 
			pl.output , 
			pl.output.wireSpacing ,  
			pl.bufferSize , 
			baseID , 
			pl.output.rightHanded 
		)

		finishedWires = finishedWires.concat( connection.inputPaths )

		var toReturn = {
			output: connection.outputPath,
			input:  connection.inputPaths,
			basePaths : basePaths
		};


		return toReturn

	}

	var final = percolate( pathList , 0 , 0 );

	finishedWires = finishedWires.concat( [ final.output ] )
		
	return {
		finishedWires:finishedWires,
		basePaths: basePaths,
		output: final.output
	}

}





