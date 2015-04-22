function City( batteryPosition , x ){

	var rowLength = 4;
	var buildingSize = .3;
	var buildingBuffer = .1;

	var bs = buildingSize;
	var geo = new THREE.CubeGeometry( bs , bs , bs );
	var mat = new THREE.MeshNormalMaterial();
	
	var buildingPositions = [];

	this.geometry = new THREE.Geometry();

	for( var i = 0; i < rowLength; i++ ){

		var x = i * ( buildingSize + buildingBuffer );

		var m = new THREE.Object3D();

		m.position.x = x;
		m.updateMatrix();

		this.geometry.merge( geo , m.matrix );
		buildingPositions.push( m.position );

	}


	this.buildings = new THREE.Mesh( this.geometry , mat );
	

}