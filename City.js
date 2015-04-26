function City( batteryPosition , x ){


	//this.sbw = .01;	
	this.spaceBetweenWires = .0002;
	this.sbw = this.spaceBetweenWires;

	this.spaceBetweenRows = .08;
	this.buildingSize = .04;
	this.spaceBetweenBuildings = .06;

	this.buildingsInRow = 4;
	this.rowsInChunk = 4;

	this.spaceBetweenChunks = this.spaceBetweenBuildings * this.buildingsInRow * 1.2;
	this.chunksInChunkRow = 10;

	this.spaceBetweenChunkRows = .9//this.buildingsInRow * this.rowsInChunk * this.chunksInChunkRow * this.sbw * 4
	this.chunksInChunkChunk = 6;



	this.wireOffset = .04;

	this.rowWireOffset = this.buildingSize * 4.1;
	this.rowEndOffset  = this.buildingSize * 4.1;


	this.numOfRows = 6;
	

	this.upVec = new THREE.Vector3( 0 , 1 , 0 );


	this.buildingPositions = [];

	var basePos = new THREE.Vector3();
	var rowDir = new THREE.Vector3( -1 , 0 , 0 );
	var endOffset = this.buildingSize * 4;
	var wireOffset = this.buildingSize * 4;

	//var pathList = this.createChunk( basePos , rowDir , endOffset , wireOffset );


	var endOffset = this.rowsInChunk * this.spaceBetweenRows * 1.1;
	var wireOffset = this.spaceBetweenBuildings  * this.buildingsInRow;
	var pathList = this.createCity();

	var buildings = this.createBuildingMesh( this.buildingPositions );

	var paths = RecursiveConnector( pathList , this.sbw , 0 );

  var wireInfo = new Wire( paths ,  this.sbw );

  return {
  	wire: wireInfo.wire,
  	buildings: buildings,
  	debug: wireInfo.debug
  }

}

City.prototype.createCity = function(){

	var outputPath = {points:[]};
	var inputPaths = [];

	outputPath.points.push( new THREE.Vector3( 0 , 0 , -.1 ))
	outputPath.points.push( new THREE.Vector3( 0 , 0 , -6))

	outputPath.points.push( new THREE.Vector3( 3 , 0 , -9))
	outputPath.points.push( new THREE.Vector3( 3 , 0 , -12))
	outputPath.points.push( new THREE.Vector3( 0 , 0 , -15))

	for( var  i = 0; i < 4; i++){

		var basePos = new THREE.Vector3( .2 , 0 , 4 + i * 6 );
		var rowDir = new THREE.Vector3( 1, 0 , 0  );
		var endOffset = this.buildingSize * 4;
		var wireOffset = this.buildingSize * 4;

		//var pathList = this.createChunk( basePos , rowDir , endOffset , wireOffset );


		var endOffset = this.rowsInChunk * this.spaceBetweenRows * 1.1;
		var wireOffset = this.spaceBetweenBuildings  * this.buildingsInRow + i * this.sbw * this.buildingsInRow * this.rowsInChunk * this.chunksInChunkRow * this.chunksInChunkChunk;
		var pathList = this.createChunkChunk( basePos , rowDir , endOffset , wireOffset);

		inputPaths.push( pathList );

	}




	return {
		bufferSize: .6,
		output: outputPath,
		inputs: inputPaths
	}



}
City.prototype.createChunkChunk = function( basePos , dir , endOffset , wireOffset ){

	var v1 = new THREE.Vector3();

	var tan = dir.clone();
	tan.applyAxisAngle( this.upVec , -Math.PI / 2 );

	var outputPath = {points:[]};
	var inputPaths = [];

	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( 0 );
	v.add( v1 );

	outputPath.points.push( v );


	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( -endOffset );
	v.add( v1 );

	outputPath.points.push( v );






	for( var i = 0; i < this.chunksInChunkChunk; i++ ){

		var rowPos = new THREE.Vector3().copy( basePos );

		v1.copy( tan );
		v1.multiplyScalar( i * this.spaceBetweenChunkRows );

		rowPos.add( v1 );

		//var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.sbw * 1 * this.chunksInChunkRow );
		var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.rowsInChunk * this.chunksInChunkChunk * this.sbw );
		var rowWireOffset = this.buildingSize;
		var row = this.createChunkRow( rowPos , dir.clone().applyAxisAngle( this.upVec , Math.PI / 2) , rowEndOffset , rowWireOffset );

		inputPaths.push( row );

	}

	return {
		bufferSize: .1,
		output: outputPath,
		inputs: inputPaths
	}

}


City.prototype.createChunkRow = function( basePos , dir , endOffset , wireOffset ){

	var v1 = new THREE.Vector3();

	var tan = dir.clone();
	tan.applyAxisAngle( this.upVec , -Math.PI / 2 );

	var outputPath = {points:[]};
	var inputPaths = [];

	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( 0 );
	v.add( v1 );

	outputPath.points.push( v );


	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( -endOffset );
	v.add( v1 );

	outputPath.points.push( v );


	for( var i = 0; i < this.chunksInChunkRow; i++ ){

		var rowPos = new THREE.Vector3().copy( basePos );

		v1.copy( tan );
		v1.multiplyScalar( i * this.spaceBetweenChunks );

		rowPos.add( v1 );

		//var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.sbw * 1 * this.chunksInChunkRow );
		var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.rowsInChunk * this.sbw );
		var rowWireOffset = this.buildingSize;
		var row = this.createChunk( rowPos , dir.clone().applyAxisAngle( this.upVec , Math.PI / 2) , rowEndOffset , rowWireOffset );

		inputPaths.push( row );

	}

	return {
		bufferSize: .1,
		output: outputPath,
		inputs: inputPaths
	}

}


City.prototype.createChunk = function( basePos , dir , endOffset , wireOffset ){

	var v1 = new THREE.Vector3();

	var tan = dir.clone();
	tan.applyAxisAngle( this.upVec , -Math.PI / 2 );

	var outputPath = {points:[]};
	var inputPaths = [];

	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( 0 );
	v.add( v1 );

	outputPath.points.push( v );


	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( dir )
	v1.multiplyScalar( -wireOffset );
	v.add( v1 );

	v1.copy( tan );
	v1.multiplyScalar( -endOffset );
	v.add( v1 );

	outputPath.points.push( v );


	for( var i = 0; i < this.rowsInChunk; i++ ){

		var rowPos = new THREE.Vector3().copy( basePos );

		v1.copy( tan );
		v1.multiplyScalar( i * this.spaceBetweenRows );

		rowPos.add( v1 );

		var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.sbw * 1 );
		var rowWireOffset = ( this.buildingSize / 2 ) + this.spaceBetweenRows * .1
		var row = this.createRow( rowPos , dir , rowEndOffset , rowWireOffset );

		inputPaths.push( row );

	}

	return {
		bufferSize: .1,
		output: outputPath,
		inputs: inputPaths
	}

}

City.prototype.createRow = function( basePos , dir , endOffset , wireOffset ){

	var v1 = new THREE.Vector3();

	var outputPath = {points:[]};
	var inputPaths = [];

	var tan = dir.clone();
	tan.applyAxisAngle( this.upVec , -Math.PI / 2 )
	
	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( tan )
	v1.multiplyScalar( wireOffset );
	v.add( v1 );

	v1.copy( dir );
	v1.multiplyScalar( -endOffset * .5 );
	v.add( v1 );

	outputPath.points.push( v );

	var v = new THREE.Vector3().copy( basePos );
	
	v1.copy( tan )
	v1.multiplyScalar( wireOffset );
	v.add( v1 );

	v1.copy( dir );
	v1.multiplyScalar( -endOffset );
	v.add( v1 );

	outputPath.points.push( v );


	for( var i = 0; i < this.buildingsInRow; i++ ){

		var p = {
			points:[],
			numWires:1
		}

		var v = new THREE.Vector3().copy( basePos );

		v1.copy( dir );
		v1.multiplyScalar( i * this.spaceBetweenBuildings );
		v.add( v1 );

		p.points.push( v )
		this.buildingPositions.push( v );

		var v = new THREE.Vector3().copy( basePos );

		v1.copy( dir );
		v1.multiplyScalar( i * this.spaceBetweenBuildings );
		v.add( v1 );

		v1.copy( tan );
		v1.multiplyScalar( wireOffset + ( i * this.spaceBetweenWires ));
		v.add( v1 );

		p.points.push( v );

		inputPaths.push( p );


			
	}

	return {
		bufferSize: .6,
		output: outputPath,
		inputs: inputPaths
	}

}









// This part is good!
City.prototype.createBuildingMesh = function( buildingPositions ){

	var bs = this.buildingSize;

	var geo = new THREE.CubeGeometry( bs , bs , bs  );
	var mat = new THREE.MeshNormalMaterial();
	
	var geometry = new THREE.Geometry();

	for( var i = 0; i < buildingPositions.length; i++ ){
		
		var m = new THREE.Object3D();

		m.position.copy( buildingPositions[i] );
		

		var scaleBase = .4 + Math.pow( buildingPositions[i].x  , 2 ) * 1.;

		m.scale.y *= (Math.random() * scaleBase + scaleBase ) 
		m.position.y +=  m.scale.y * bs/ 2;
		m.updateMatrix();

		geometry.merge( geo , m.matrix );

	}

	return  new THREE.Mesh( geometry , mat );

}





