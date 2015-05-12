function City( params ){

	var params = _.defaults( params || {} , {
		buildingSize: .5
	});

	this.buildingPositions = [];

	this.v1 = new THREE.Vector3();
 	this.v2 = new THREE.Vector3();
	this.upVec = new THREE.Vector3( 0 , 1 , 0 );


	var endPosition

	var finishedWires = [];
	var buildingPositions = [];

	var totalWires = 0;

	

  return  this.createLung();

}


City.prototype.createLung = function(){


  var finishedWires = [];
  var basePaths = [];

  var totalWires = 0;

  var batteries = [];




  var battMat =  new THREE.MeshNormalMaterial();
	for( var i = 0; i < 12; i++ ){

    var endPositions = [];

    var side = Math.floor(  i  / 4 );

    var rowNum = i % 4;

    var p1 = new THREE.Vector3();
    var p2 = new THREE.Vector3();
    var p3 = new THREE.Vector3();
    var p4 = new THREE.Vector3();


    var dir = new THREE.Vector3();
    var tan = new THREE.Vector3();
    if( side < 2 ){

      dir.x = side - .5;
      dir.z = 0;
      dir.normalize();

      tan.copy( dir );
      tan.applyAxisAngle( this.upVec ,  dir.x * Math.PI / 2 );


    }else{

      dir.x = 0;
      dir.z = 1;
      dir.normalize();

      tan.copy( dir );
      tan.applyAxisAngle( this.upVec ,  Math.PI / 2 );

    }


    outNess = rowNum - 1.5;
    tanAmount = rowNum - 1.5;
   // outNess = -outNess;

    var sideOffsetSize = 17;

    var sideOffset = side * sideOffsetSize;

    if( side == 2 ){
      sideOffset = sideOffsetSize;
    }
    sideOffset -= sideOffsetSize / 2;

    var startOut = 100;
    var endOut = 180;
    var range = endOut - startOut


    this.v1.set( 0 , 0 , 0 );

    this.v2.copy( tan );
    this.v2.multiplyScalar( tanAmount * 40 + outNess * 40 + sideOffset   );
    this.v1.add( this.v2 );

    this.v2.copy( dir );
    this.v2.multiplyScalar(( startOut + range * 1)+ 50 * Math.abs( outNess ));
    this.v1.add( this.v2 );
    
    p1.copy( this.v1 );

    this.v1.set( 0 , 0 , 0 );

    this.v2.copy( tan );
    this.v2.multiplyScalar( tanAmount * 40  + outNess * 40 + sideOffset );
    this.v1.add( this.v2 );

    this.v2.copy( dir );
    this.v2.multiplyScalar( ( startOut + range * .6666));
    this.v1.add( this.v2 );
    
    p2.copy( this.v1 );

    this.v1.set( 0 , 0 , 0 );

    this.v2.copy( tan );
    this.v2.multiplyScalar( tanAmount * 40 + sideOffset  );
    this.v1.add( this.v2 );

    this.v2.copy( dir );
    this.v2.multiplyScalar( ( startOut + range * .3333 ));
    this.v1.add( this.v2 );
    
    p3.copy( this.v1 );



    this.v1.set( 0 , 0 , 0 );

    this.v2.copy( tan );
    this.v2.multiplyScalar( tanAmount * 40  + sideOffset );
    this.v1.add( this.v2 );

    this.v2.copy( dir );
    this.v2.multiplyScalar( ( startOut + range * 0 ) );
    this.v1.add( this.v2 );

    p4.copy( this.v1 );
  


    endPositions.push( p1 )
    endPositions.push( p2 )
    endPositions.push( p3 )
    endPositions.push( p4 )

    var newDir = new THREE.Vector3();
    newDir.copy( p4 );
    newDir.sub( p3 );
    newDir.normalize();



		var pathList = this.createBoquet( newDir, endPositions  );

		var paths = RecursiveConnector( pathList , totalWires );

    finishedWires = finishedWires.concat( paths.finishedWires );
    basePaths = basePaths.concat( paths.basePaths );
    totalWires + paths.numWires;

    var ySize = 3;
    var battSize = paths.output.numWires * paths.output.wireSpacing;
    var geo = new THREE.CubeGeometry(battSize* 1.2, ySize , battSize * 1.2 ) 
    var battery = new THREE.Mesh( geo  , battMat );

    battery.position.copy( paths.output.points[ paths.output.points.length-1 ] );
    battery.position.y += ySize / 2.21;

    this.v1.copy( paths.output.bisectors[ paths.output.bisectors.length-1 ] );
    this.v1.multiplyScalar( battSize * .5 )
    battery.position.add( this.v1 );

    batteries.push( battery );


		//console.log( totalWires )
	}	

  var battSize = 160;
  var ySize = 10;
  var geo = new THREE.CubeGeometry(battSize* 1.2, ySize , battSize * 1.2 ) 
  var battery = new THREE.Mesh( geo  , battMat );
  battery.position.y += ySize / 2.21;

  batteries.push( battery )

  var buildings = this.createBuildingMesh( basePaths , .5 );

  var wireInfo = new Wire( finishedWires );

  return {
    wire: wireInfo.wire,
    buildings: buildings,
    batteries: batteries,
    debug: wireInfo.debug
  }



}

City.prototype.createBoquet = function( direction , endPositions ){

	var outputPath  = {

		points:[],
		wireSpacing: .05,
		rightHanded: 1,

	}

	var tan = this.getTan( direction , 1 );

  for( var i = 0; i < endPositions.length; i++ ){
	   outputPath.points.push( endPositions[i] )
  }

	var inputPaths = [];


	for( var i = 0; i < 4; i++ ){
		

		t = (-i  / 4 ) * 2 * Math.PI  * .5 - 2
		var dir = direction.clone();
		dir.applyAxisAngle( this.upVec , t );



		flowerEndPos = outputPath.points[0].clone();
		flowerEndPos.add( this.v1.copy( tan ).multiplyScalar( -10 ))
		flowerEndPos.add( this.v1.copy( dir ).multiplyScalar( 15  ) );

		var pathList = this.createMultiFlower( dir , flowerEndPos );
		//console.log( pathList )
		inputPaths.push( pathList )

	}	

	return {
		bufferSize: .5,
		output: outputPath,
		inputs: inputPaths,
	}

}

City.prototype.createMultiFlower = function( direction , endPosition ){

	var outputPath = {

		points:[],
		wireSpacing: .05,
		rightHanded: 1

	}

	var basePosition = direction.clone();
	basePosition.multiplyScalar( 3 );
	basePosition.add( endPosition )


	outputPath.points.push( basePosition );
	outputPath.points.push( endPosition );

	var inputPaths = [];
	
	for( var i  = 0; i < 2; i++ ){

		var t =(.2-( i / 4 )) * .4 * 2 * Math.PI ;
		var dir = direction.clone();
		dir.applyAxisAngle( this.upVec , t )
		dir.normalize();

		var pos = new THREE.Vector3();
		this.v1.copy( dir );
		this.v1.multiplyScalar( ( i % 2 ) * 10 + 14 );
		pos.add( this.v1 )

		pos.add( basePosition );

		//var pathList = this.createSymmetry();
		var pathList = this.createFlower( 4 , {
			basePosition: pos,
			direction: dir,
			wireSpacing: .05
		});


		inputPaths.push( pathList );



	}
	//console.log( outputPath );

	return {
		bufferSize: .5,
		output: outputPath,
		inputs: inputPaths,
	}


}

City.prototype.createFlower = function( petals , params){

	var petals = petals || 2;

	var params = _.defaults( params || {} , {

		basePosition: new THREE.Vector3(),
		//endPosition: 	new THREE.Vector3(-1 , 0 , 0 ),
		direction: 		new THREE.Vector3( 0 , 0 , 1 ).normalize(),

		rightHanded: 	1,
		wireSpacing: 	.1, 
		wireOffset: 	.4,
		output:[
			[ -4 , 0 ],
			[ -7 , 0 ]
		]

	});

	var v1  = new THREE.Vector3();
	var tan = this.getTan( params.direction , params.rightHanded );

	var outputPath = this.createOutputPath(

		params.output , 
		params.basePosition , 
		params.direction,
		tan,
		params.wireSpacing,
		params.rightHanded

	);

	var inputPaths = [];

	for( var i = 0; i < petals; i++ ){

		var t =  (( (i+1) / petals ) - .5 ) * Math.PI * 2 
		t *= -.4;


		var newDir = params.direction.clone();
		newDir.applyAxisAngle( this.upVec , t );

		var basePos = params.basePosition.clone();

		this.v1.copy( newDir );
		this.v1.multiplyScalar( 6 ); 
		basePos.add( this.v1 );

		var input = this.createSymmetry({
			basePosition: basePos,
			direction: newDir
		})

		inputPaths.push( input )

	}


	return {
		bufferSize: .5,
		output: outputPath,
		inputs: inputPaths,
	}

}

City.prototype.createSymmetryRow = function( params ){


}



City.prototype.createSymmetry = function( params ){

	var params = _.defaults( params || {} , {

		basePosition: new THREE.Vector3(),
		//endPosition: 	new THREE.Vector3(-1 , 0 , 0 ),
		direction: 		new THREE.Vector3( 1 , 0 , 1 ).normalize(),
		rightHanded: 	1,
		wireSpacing: 	.1, 
		wireOffset: 	.4,

		input: [
			[ 0   , 0 ],
			[ .8  , 0 ],
			[ 1.6 , 0 ],
			[ 2.4 , 0 ],
			[ 3.2 , 0 ],
			[ 4.0 , 0 ],
		],

		// needs to be at least length 2
		output: [
			[ -1 ,  -.1 * 3 - .3 ],
			[ -3 ,  -.1 * 3 - .3 ],
		]

	})

	var v1  = new THREE.Vector3();
	var tan = this.getTan( params.direction , params.rightHanded );

	var outputPath = this.createOutputPath(

		params.output , 
		params.basePosition , 
		params.direction,
		tan,
		params.wireSpacing,
		params.rightHanded

	);

	var basePosition = params.basePosition.clone();
	this.v1.copy( tan ).multiplyScalar( -1 );
	basePosition.add( this.v1 )
	var buildings1 = this.createPathsFromInput( 
		params.input, 
		params.direction,
		tan,
		params.wireSpacing,
		params.wireOffset,
		basePosition,
		1
	);

	var basePosition = params.basePosition.clone();
	this.v1.copy( tan ).multiplyScalar( 1 );
	basePosition.add( this.v1 )
	var buildings2 = this.createPathsFromInput( 
		params.input, 
		params.direction,
		tan.multiplyScalar( -1 ),
		params.wireSpacing,
		params.wireOffset,
		basePosition,
		-1
	);

	inputPaths = [];
	inputPaths = inputPaths.concat( buildings1 );
	inputPaths = inputPaths.concat( buildings2 );

	return {
		bufferSize: .5,
		output: outputPath,
		inputs: inputPaths,
	}

}

City.prototype.createRow = function( params ){

	var params = _.defaults( params || {} , {

		basePosition: new THREE.Vector3(),
		//endPosition: 	new THREE.Vector3(-1 , 0 , 0 ),
		direction: 		new THREE.Vector3( 1 , 0 , 0 ),
		rightHanded: 	1,
		wireSpacing: 	.2, 
		wireOffset: 	.4,

		input: [
			[ 0   , 0 ],
			[ .8  , 0 ],
			[ 1.6 , 0 ],
		],

		// needs to be at least length 2
		output: [
			[ -1 ,  .4 ],
			[ -2 ,  .4 ],
		]

	})

	var v1  = new THREE.Vector3();
	var tan = this.getTan( params.direction , params.rightHanded );

	var outputPath = this.createOutputPath(

		params.output , 
		params.basePosition , 
		params.direction,
		tan,
		params.wireSpacing,
		params.rightHanded

	);

	var inputPaths = this.createPathsFromInput( 
		params.input, 
		params.direction,
		tan,
		params.wireSpacing,
		params.wireOffset,
		params.basePosition,
		params.rightHanded
	);

	return {
		bufferSize: .6,
		output: outputPath,
		inputs: inputPaths,
	}

}


// This part is good!
City.prototype.createBuildingMesh = function( basePaths , bs ){


	var geo = new THREE.CubeGeometry( bs , bs , bs  );
	var mat = new THREE.MeshNormalMaterial();
	
	var geometry = new THREE.Geometry();

	for( var i = 0; i < basePaths.length; i++ ){
		
		var basePos = basePaths[i].points[0];

		var m = new THREE.Object3D();

		m.position.copy( basePos );
		

		var scaleBase = .4 + Math.pow( basePos.x  , 2 ) * 1.;
		scaleBase = 3.;

		m.scale.y *= (Math.random() * scaleBase * 1 + scaleBase ) 
		m.position.y +=  m.scale.y * bs/ 2;
		m.updateMatrix();

		geometry.merge( geo , m.matrix );

	}

	var vs = shaders.setValue( shaders.vs.building , 'SIZE' , G.fingers.tips.length );
	var fs = shaders.fs.building;
	var mat = new THREE.ShaderMaterial({
		uniforms:{
			touchers:{ type:"v3v", value:G.fingers.tips}
		},
		vertexShader:vs,
		fragmentShader:fs,
	})

	return  new THREE.Mesh( geometry , mat );

}


City.prototype.getTan = function( dir , rh ){

	var tan = dir.clone();

	var angle = -Math.PI / 2;
	angle *= rh
	tan.applyAxisAngle( this.upVec , angle )

	return tan;

}


City.prototype.getPointsUsingDirTan = function( points , basePos , dir , tan  ){

	var p = [];

	for( var i  = 0; i < points.length; i++ ){

			var values = points[i];

			var v = basePos.clone();

			this.v1.copy( dir ).multiplyScalar( values[0] );
			v.add( this.v1 );

			this.v1.copy( tan ).multiplyScalar( values[1] );
			v.add( this.v1 );

			p.push( v );

	}

	return p;

}

City.prototype.getInputPointsUsingTan = function( wireNumber , wireSpacing , wireOffset , basePos , tan ){

	var p = [];

	var v = basePos.clone();
	p.push( v );

	v = basePos.clone();
	this.v1.copy( tan ).multiplyScalar( wireNumber * wireSpacing + wireOffset );
	v.add( this.v1 );

	p.push( v );

	return p;

}

City.prototype.createPathsFromInput = function( input , dir , tan , wireSpacing , wireOffset , basePosition , rh ){

	var inputPaths = [];

	for( var i = 0; i < input.length; i++ ){

		var p = {
			points:[],
			numWires:1,
			wireSpacing: wireSpacing,
			rightHanded: rh
		}

		var values = input[i];

		var pathBasePos = basePosition.clone();

		this.v1.copy( dir ).multiplyScalar( values[0] );
		pathBasePos.add( this.v1 );

		this.v1.copy( tan ).multiplyScalar( values[1] );
		pathBasePos.add( this.v1 );

		p.points = this.getInputPointsUsingTan( 
			i,
			wireSpacing , 
			wireOffset , 
			pathBasePos , 
			tan  
		);

		inputPaths.push( p );
			
	}

	if( rh < 0 ) this.reverseArray( inputPaths )
	return inputPaths

}


City.prototype.createOutputPath = function( 
		output , 
		basePosition , 
		direction,
		tan,
		wireSpacing,
		rightHanded
){

	var outputPath = {
		wireSpacing: wireSpacing,
		rightHanded: rightHanded,
	}

	outputPath.points = this.getPointsUsingDirTan( 
		output , 
		basePosition , 
		direction,
		tan
	);

	return outputPath

}


City.prototype.reverseArray = function( array ){
	
	var tmpArray = [];

	for( var i = array.length-1; i >=  0; i-- ){
		tmpArray.push( array[i]);
	}

	for( var i = 0; i < array.length; i++ ){
		array[i] = tmpArray[i];
	}

}





