function City( batteryPosition , x ){


	this.rowLength = 6;
	this.spaceBetweenRows = 1.;
	this.buildingSize = .5;
	this.spaceBetweenBuildings = 1;

	this.xWidth = .02;	
	this.wireOffset = .4;

	this.numOfRows = 6;
	
	var connectionPaths = [];
	var completedPaths = [];
	var buildingPositions = [];

	for( var i = 0; i < this.numOfRows; i++ ){

		var start = new THREE.Vector3( .6 , 0 ,  i * this.spaceBetweenRows );
		var end = new THREE.Vector3( .3 - ( i * this.xWidth * this.rowLength), 0 , i * this.spaceBetweenRows );	
		var row = this.createRow( i , start , end  );

		connectionPaths.push( row.outputPath );
		completedPaths = completedPaths.concat( row.inputPaths );
		buildingPositions = buildingPositions.concat( row.buildingPositions );

	}

	var finalC = [];
	finalC.push( new THREE.Vector3(  .3 - this.xWidth * this.rowLength , 0 , 0 ))
	finalC.push( new THREE.Vector3(  0 , 0 , -1 ))
	finalC.push( new THREE.Vector3(  0 , 0 , -1.1 ))



	var finalConnect = { points: finalC }
	var connected = new PathConnector( connectionPaths , finalConnect , this.xWidth , .1 , 0 )

	completedPaths = completedPaths.concat( connected.inputPaths );
	completedPaths = completedPaths.concat([ connected.outputPath ]);

	this.buildings = this.createBuildingMesh( buildingPositions );
	
	var paths = row.inputPaths.concat([ row.outputPath ]);

	var wireInfo = new Wire( completedPaths ,  this.xWidth );
	this.wires = wireInfo.wire;
	this.debug = wireInfo.debug;

	//this.buildings = this.createBuildingMesh( row.buildingPositions );
	

}

City.prototype.createBuildingMesh = function( buildingPositions ){

	var bs = this.buildingSize;

	var geo = new THREE.CubeGeometry( bs , bs , bs  );
	var mat = new THREE.MeshNormalMaterial();
	
	var geometry = new THREE.Geometry();

	for( var i = 0; i < buildingPositions.length; i++ ){
		
		var m = new THREE.Object3D();

		m.position.copy( buildingPositions[i] );
		

		m.scale.y *= (Math.random()+ .5)
		m.position.y +=  m.scale.y * bs/ 2;
		m.updateMatrix();

		geometry.merge( geo , m.matrix );

	}

	return  new THREE.Mesh( geometry , mat );

}

City.prototype.createRow = function( rowNumber , start , end ){

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
	var baseID = this.rowLength * rowNumber;

	var connected = new PathConnector( buildingPaths , connectionPath , this.xWidth , .1 , rowNumber * this.rowLength )


	return{ 
		buildingPositions: buildingPositions,
		outputPath: connected.outputPath,
		inputPaths: connected.inputPaths
	}

}




