function City( batteryPosition , x ){


	this.rowLength = 6;
	this.spaceBetweenRows = 1.;
	this.buildingSize = .5;
	this.spaceBetweenBuildings = 1;

	this.xWidth = .01;	
	this.wireOffset = .4;

	this.numOfRows = 6;
	
	this.completedPaths = [];
	this.connectionPaths = [];
	this.buildingPositions = [];





	for( var i = 0 ; i < 4; i++ ){

		//var 

		var full = new THREE.Vector3(i * 8 , 0,0);
		var end  = new THREE.Vector3( 0 , 0 , 0 );


		var finalC = [];

		var offset = new THREE.Vector3(0 , 0 ,-((i+4) * 4) * this.numOfRows * this.rowLength * this.xWidth );
		//offset.add( full );
		//offset.add( end )
		//finalC.push( new THREE.Vector3(  .3, 0 , 0 ))
		//finalC.push( new THREE.Vector3(.3 , 0 , -1.3).add( full ))
		finalC.push( new THREE.Vector3(.3 , 0 , -2.1 * ((4-i)+1) ).add( full))
		finalC.push( new THREE.Vector3(4, 0 , -2.1  * ((4-i)+1) ).add( full))

		var connectionPaths = [];
		for( var j = 0; j < 4; j++ ){

			var full = new THREE.Vector3(i * 8 , 0,0);
			var start = new THREE.Vector3( 0 , 0 , j * 6.5);
			//var end = new THREE.Vector3( 0 , 0 , -(i *4+ (4-j)) * this.rowLength * this.numOfRows * this.xWidth );
			
			endOffset = new THREE.Vector3( 0 , 0 , 0 );//this.rowLength * this.numOfRows * this.xWidth )
			var end = end.add( endOffset );
			var connected = this.createChunk( full , start , end , j );//new PathConnector( connectionPaths , finalConnect , this.xWidth , .1 , 0 )

			connectionPaths.push( connected.outputPath );
			this.completedPaths = this.completedPaths.concat( connected.inputPaths );

			// only happens for very very end!
			//this.completedPaths = this.completedPaths.concat([ connected.outputPath ]);

		}

		var finalConnect = { points: finalC }
		var connected = new PathConnector( connectionPaths , finalConnect , this.xWidth , .1 , i * this.rowLength * this.numOfRows * 4 );

		this.completedPaths = this.completedPaths.concat( connected.inputPaths );
		this.completedPaths = this.completedPaths.concat([ connected.outputPath ]);


	}

	this.buildings = this.createBuildingMesh( this.buildingPositions );
	


	var wireInfo = new Wire( this.completedPaths ,  this.xWidth );
	this.wires = wireInfo.wire;
	this.debug = wireInfo.debug;

	//this.buildings = this.createBuildingMesh( row.buildingPositions );
	

}

City.prototype.createChunk = function( fullPos , startPos , endPos , startID ){

	var connectionPaths = [];

	for( var i = 0; i < this.numOfRows; i++ ){

		var start = new THREE.Vector3(.6 , 0 ,  i * this.spaceBetweenRows );
		var end = new THREE.Vector3(
			 .3 - ( i * this.xWidth * this.rowLength ) -  ( startID * this.rowLength * this.numOfRows * this.xWidth ), 0 , 
			 i * this.spaceBetweenRows )

		var sp = startPos.clone().add( fullPos );
		start.add( sp );
		end.add( sp );	

		var row = this.createRow( startID * this.numOfRows * this.rowLength , i , start , end  );

		connectionPaths.push( row.outputPath );
		this.completedPaths = this.completedPaths.concat( row.inputPaths );
		this.buildingPositions = this.buildingPositions.concat( row.buildingPositions );

	}

	var finalC = [];

	var offset = new THREE.Vector3( -startID * this.numOfRows * this.rowLength * this.xWidth );
	offset.add( fullPos );
	offset.add( endPos )
	//finalC.push( new THREE.Vector3(  .3, 0 , 0 ))
	finalC.push( new THREE.Vector3(  .33 , 0 , -this.spaceBetweenRows * .9 ).add( offset))
	finalC.push( new THREE.Vector3(  .33 , 0 , -this.spaceBetweenRows ).add(offset))
	//finalC.push( new THREE.Vector3(  0 , 0 , -1.1 ))



	var finalConnect = { points: finalC }
	var connected = new PathConnector( connectionPaths , finalConnect , this.xWidth , .1 , startID );

	return connected;

}

City.prototype.createBuildingMesh = function( buildingPositions ){

	var bs = this.buildingSize;

	var geo = new THREE.CubeGeometry( bs , bs , bs  );
	var mat = new THREE.MeshNormalMaterial();
	
	var geometry = new THREE.Geometry();

	for( var i = 0; i < buildingPositions.length; i++ ){
		
		var m = new THREE.Object3D();

		m.position.copy( buildingPositions[i] );
		

		m.scale.y *= (Math.random() * 5 + .1)
		m.position.y +=  m.scale.y * bs/ 2;
		m.updateMatrix();

		geometry.merge( geo , m.matrix );

	}

	return  new THREE.Mesh( geometry , mat );

}

City.prototype.createRow = function( base , rowNumber , start , end ){

	var buildingPositions = [];
	var buildingPaths = [];
	for( var i = 0; i < this.rowLength; i++ ){

		var x = i * this.spaceBetweenBuildings + start.x;
		var z = start.z;
		var bp = new THREE.Vector3( x , 0 , z );
		buildingPositions.push( bp  );

		var path = []
		path.push( bp.clone() );
		path.push( bp.clone().add( new THREE.Vector3(0, 0, ( this.xWidth * i ) + this.wireOffset )));

		buildingPaths.push({
			points:path,
			numWires:1
		})

	}

	var connectP = [];
	var dir = new THREE.Vector3();
	dir.copy( start );
	dir.sub( end );


	connectP.push( new THREE.Vector3( end.x + dir.x * .1 , 0 , this.wireOffset + end.z + dir.z * .1 ));
	connectP.push( new THREE.Vector3( end.x , 0 , this.wireOffset  + end.z ));
	

	connectionPath = { points: connectP }

	// how many buildings have already been created
	var baseID = this.rowLength * rowNumber + base;

	var connected = new PathConnector( buildingPaths , connectionPath , this.xWidth , .1 , baseID )


	return{ 
		buildingPositions: buildingPositions,
		outputPath: connected.outputPath,
		inputPaths: connected.inputPaths
	}

}




