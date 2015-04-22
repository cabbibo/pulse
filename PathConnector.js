function PathConnector( connectionPaths , output , xWidth , bufferSize){
	

	var totalWires = 0; 

	var paths = [];

	this.body = new THREE.Object3D();

	for( var i = 0; i < connectionPaths.length; i++ ){

		var cp = connectionPaths[i];


		var buffer = output.points[0].clone();
		buffer.z -= bufferSize;
		buffer.x += totalWires * xWidth;

		// Make sure we start at the right offset 
		// compared to previous line
		if( i  !== 0 ){
			
			var pDown = paths[ i - 1 ];
			var pos = pDown.points[ pDown.points.length - 2 ];
			var dir = pDown.directions[ pDown.points.length - 2 ];

			this.setPosAlongDir( buffer , pos , dir , xWidth , pDown.numWires );


		}

		var connection = output.points[0].clone();
		connection.x += totalWires * xWidth;

		cp.points.push( buffer );
		cp.points.push( connection );

		var p = new Path( cp.points , cp.numWires , totalWires );

		paths.push( p );

		totalWires += cp.numWires;

	}

	var opPath = new Path( output.points , totalWires , 0 );

	paths.push( opPath );

	return  paths

}

// v = vector to set
// p = position start
// d = direction 
// w = xWidth
// i = wire index
PathConnector.prototype.setPosAlongDir = function( v , p , d , w , i ){

  var ratio = d.x / d.z;
  v.x = p.x + w * i;
  v.z = p.z + ( w * i / ratio );

}