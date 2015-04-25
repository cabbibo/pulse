function City( batteryPosition , x ){



	this.spaceBetweenRows = .3;
	this.buildingSize = .1;
	this.spaceBetweenBuildings = .2;

	this.buildingsInRow = 6;
	this.rowsInChunk = 6;



	this.xWidth = .02;	
	this.wireOffset = .04;

	this.rowWireOffset = .06
	this.rowEndOffset  = .1;

	this.spaceBetweenWires = this.xWidth;
	this.sbw = this.spaceBetweenWires;

	this.numOfRows = 6;
	

	this.upVec = new THREE.Vector3( 0 , 1 , 0 );


	this.buildingPositions = [];

	var basePos = new THREE.Vector3();
	var rowDir = new THREE.Vector3( 1.5 , 0 , 1 );
	var endOffset = .1;
	var wireOffset = .1;

	var pathList = this.createChunk( basePos , rowDir , endOffset , wireOffset );

	var buildings = this.createBuildingMesh( this.buildingPositions );

	var paths = RecursiveConnector( pathList , this.xWidth , 0 );
  var wireInfo = new Wire( paths ,  this.xWidth );

  return {
  	wire: wireInfo.wire,
  	buildings: buildings,
  	debug: wireInfo.debug
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

		var rowEndOffset = wireOffset + ( i * this.buildingsInRow * this.sbw * .5 );
		var rowWireOffset = this.spaceBetweenRows * .2
		var row = this.createRow( rowPos , dir , rowEndOffset , rowWireOffset );

		inputPaths.push( row );

	}

	return {
		bufferSize: .5,
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
		

		m.scale.y *= (Math.random() * 5 + .1)
		m.position.y +=  m.scale.y * bs/ 2;
		m.updateMatrix();

		geometry.merge( geo , m.matrix );

	}

	return  new THREE.Mesh( geometry , mat );

}





