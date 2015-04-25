function RecursiveConnector( pathList , xWidth ,  baseID ){

	var finishedWires = [];
	var baseID = baseID || 0;
	var xWidth = xWidth || .1;

	var percolate = function( pl , lor , baseID ){

		var tmpBase = baseID;
		var connections = [];

		for( var i = 0; i < pl.inputs.length; i++ ){

			var p = pl.inputs[i];

			// We've Reached the bottom!
			if( p.numWires ){
				
				connections.push( p );
				tmpBase += p.numWires;
			
			// Need to dig further!
			}else{

				var connection = percolate( p , lor + 1 , tmpBase );
				connections.push( connection.output )

				tmpBase += connection.output.numWires;

			}

		}

		pl.bufferSize = pl.bufferSize || .1;

		var connection = PathConnector( connections , pl.output , xWidth ,  pl.bufferSize , baseID )

		finishedWires = finishedWires.concat( connection.inputPaths )

		return {
			output: connection.outputPath,
			input:  connection.inputPaths
		}

	}

	var final = percolate( pathList , 0 , 0 );

	finishedWires = finishedWires.concat( [ final.output ] )
		
	return finishedWires;

}





