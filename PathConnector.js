function PathConnector( connectionPaths , output , xWidth , bufferSize){
	

	var totalWires = 0; 

	this.paths = [];

	this.body = new THREE.Object3D();

	for( var i = 0; i < connectionPaths.length; i++ ){

		var cp = connectionPaths[i];

		var buffer = output.points[0].clone();
		buffer.z -= bufferSize;
		buffer.x += totalWires * xWidth;

		var connection = output.points[0].clone();
		connection.x += totalWires * xWidth;

		cp.points.push( buffer );
		cp.points.push( connection );

		var p = new Path( cp.points , cp.numWires , xWidth , totalWires );

		this.body.add( p.body );
		this.paths.push( p );

		totalWires += cp.numWires;

	}



	

	var opPath = new Path( output.points , totalWires , xWidth , 0 );
	this.body.add( opPath.body );


}