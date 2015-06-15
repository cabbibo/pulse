function City( size , params , buildingUniforms , wireUniforms ){

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

  return  this.createLung( size , buildingUniforms , wireUniforms );

}


City.prototype.createLung = function( totalSize ,  buildingUniforms , wireUniforms ){


  var finishedWires = [];
  var basePaths = [];

  var totalWires = 0;

  var batteries = [];




  var vs = shaders.setValue( shaders.vs.battery , 'SIZE' , G.fingers.tips.length );
  var fs = shaders.fs.battery;

  console.log(vs)

  var battMat =  new THREE.ShaderMaterial({
    uniforms: G.uniforms,
    vertexShader : vs,
    fragmentShader : fs,
  });


	for( var i = 0; i < HARDCORD.length; i++ ){

    var side = Math.floor(  i  / 4 );

    var rowNum = i % 4;



    // The direction and tangent of out connection
    var dir = new THREE.Vector3(1 , 0 , 0);
    var tan = new THREE.Vector3( 0 ,  0 , 1 );



    //endPath = this.createLungPath( DTs , dir , tan )
    endPath = this.createLungPath( side , HARDCORD[i] , totalSize * 40 , dir , tan )
  

    var newDir = new THREE.Vector3();
    newDir.copy( endPath[ 0 ] );
    newDir.sub(  endPath[ 1 ] );
    newDir.normalize();



		var pathList = this.createBoquet( totalSize , newDir, endPath );

		var paths = RecursiveConnector( pathList , totalWires );

    finishedWires = finishedWires.concat( paths.finishedWires );
    basePaths = basePaths.concat( paths.basePaths );
    totalWires + paths.numWires;

    var ySize = 3 * totalSize;
    var battSize = paths.output.numWires * paths.output.wireSpacing ; //* totalSize;
    var geo = new THREE.BoxGeometry( battSize * 1.2, ySize , battSize * 1.2 ) 
    var battery = new THREE.Mesh( geo  , battMat );

    battery.position.copy( paths.output.points[ paths.output.points.length-1 ] );
    battery.position.y += ySize / 2.21;

    this.v1.copy( paths.output.bisectors[ paths.output.bisectors.length-1 ] );
    this.v1.multiplyScalar( battSize * .5 )
    battery.position.add( this.v1 );

    batteries.push( battery );


		//console.log( totalWires )
	}	

  var battSize = 300 * totalSize;
  var ySize = 30 * totalSize ;
  var geo = new THREE.CubeGeometry(battSize* 1.2, ySize , battSize * 1.2 ) 
  var battery = new THREE.Mesh( geo  , battMat );
  battery.position.y += ySize / 2.21;

  batteries.push( battery )

  var buildings = new BuildingMesh( basePaths , 2.5 * totalSize , buildingUniforms );

  var wireInfo = new Wire( finishedWires , wireUniforms );

  return {
    wire: wireInfo.wire,
    buildings: buildings,
    batteries: batteries,
    debug: wireInfo.debug
  }



}

City.prototype.createBoquet = function(  totalSize , direction , endPositions ){

	var outputPath  = {

		points:[],
		wireSpacing: .1 * totalSize,
		rightHanded: 1,

	}

	var tan = this.getTan( direction , 1 );

  for( var i = 0; i < endPositions.length; i++ ){
	   outputPath.points.push( endPositions[i] )
  }

	var inputPaths = [];


	for( var i = 0; i < 4; i++ ){
		

		t = ( (-(i +.5)  / 4 ) + .5 ) * 2 * Math.PI  * .5 
   // t += (Math.random() - .5 ) * .4
		var dir = direction.clone();
		dir.applyAxisAngle( this.upVec , t );



		flowerEndPos = outputPath.points[0].clone();
    this.v1.copy( direction );
    this.v1.multiplyScalar( - totalSize )
    flowerEndPos.add( this.v1 );

    var radMultiplier = 1;
    if( i == 0 ){
        radMultiplier = 3
    }else if( i == 1 ){
      radMultiplier = 5
    }else if( i == 2 ){
      radMultiplier = 5
    }else{
      radMultiplier = 3
    }

    //radMultiplier *= 1.5

		flowerEndPos.add( this.v1.copy( tan ).multiplyScalar(  30 * totalSize ));
		flowerEndPos.add( this.v1.copy( dir ).multiplyScalar( 30  * totalSize * radMultiplier ));

		var pathList = this.createMultiFlower( totalSize , dir , flowerEndPos );
		//console.log( pathList )
		inputPaths.push( pathList )

	}	

	return {
		bufferSize: .1,
		output: outputPath,
		inputs: inputPaths,
	}

}

City.prototype.createMultiFlower = function( totalSize , direction , endPosition ){

	var outputPath = {

		points:[],
		wireSpacing: .15 * totalSize,
		rightHanded: 1

	}

	var basePosition = direction.clone();
	basePosition.multiplyScalar( 3 * totalSize );
	basePosition.add( endPosition )


	outputPath.points.push( basePosition );
	outputPath.points.push( endPosition );

	var inputPaths = [];
	
	for( var i  = 0; i < 2; i++ ){

		var t =(.2-( i / 4 )) * .8 * 2 * Math.PI ;
		var dir = direction.clone();
		dir.applyAxisAngle( this.upVec , t )
		dir.normalize();

		var pos = new THREE.Vector3();
		this.v1.copy( dir );
		this.v1.multiplyScalar( 54 );
    this.v1.multiplyScalar( totalSize );
		pos.add( this.v1 )

		pos.add( basePosition );

		//var pathList = this.createSymmetry();
		var pathList = this.createFlower( totalSize , 4 , {
			basePosition: pos,
			direction: dir,
			wireSpacing: .25 * totalSize
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

City.prototype.createFlower = function( totalSize , petals , params){

	var petals = petals || 2;

	var params = _.defaults( params || {} , {

		basePosition: new THREE.Vector3(),
		//endPosition: 	new THREE.Vector3(-1 , 0 , 0 ),
		direction: 		new THREE.Vector3( 0 , 0 , 1 ).normalize(),

		rightHanded: 	1,
		wireSpacing: 	10. * totalSize, 
		wireOffset: 	.4 * totalSize,
		output:[
			[ -4 * totalSize , 0 ],
			[ -7 * totalSize , 0 ]
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
		this.v1.multiplyScalar( 50 * totalSize ); 
		basePos.add( this.v1 );


		var input = this.createSymmetry( totalSize  , {
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



City.prototype.createSymmetry = function( totalSize , params ){


	var params = _.defaults( params || {} , {

		basePosition: new THREE.Vector3(),
		//endPosition: 	new THREE.Vector3(-1 , 0 , 0 ),
		direction: 		new THREE.Vector3( 1 , 0 , 1 ).normalize(),
		rightHanded: 	1,
		wireSpacing: 	.25 * totalSize, 
		wireOffset: 	2 * totalSize,

		input: [
			[ 0   * totalSize * 5 , 0 ],
			[ .8  * totalSize * 5 , 0 ],
			[ 1.6 * totalSize * 5 , 0 ],
			[ 2.4 * totalSize * 5 , 0 ],
			[ 3.2 * totalSize * 5 , 0 ],
			[ 4.0 * totalSize * 5 , 0 ],
      [ 4.8 * totalSize * 5 , 0 ],
      [ 5.6 * totalSize * 5 , 0 ],
		],

		// needs to be at least length 2
		output: [
			[ -1 * totalSize ,  (-.1 * 3 - .3 ) * totalSize ],
			[ -3 * totalSize ,  (-.1 * 3 - .3 ) * totalSize ],
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
	this.v1.copy( tan ).multiplyScalar( -5 * totalSize );
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
	this.v1.copy( tan ).multiplyScalar(5 * totalSize );
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


City.prototype.createLungPath = function( side , DTs, size , dir , tan ){

  var path = [];
  for( var  i  =0; i < DTs.length; i++ ){
    path.push( new THREE.Vector3() );
  }

  var offset = .5 * size;
  var ofs = .6
  if( side == 0 || side == 2 ){
    offset = ofs * size;
  }else{
    offset = -ofs * size;
  }

  for( var  i = 0; i < DTs.length; i++ ){

    var v = path[ ( path.length - 1 ) - i ];
   // console.log( v );
    this.assignUsingDirTan( v , side ,  offset , DTs[i] , size  , dir , tan );


  }

  return path;

}

City.prototype.assignUsingDirTan = function( v , side , offset , dt , size  , dir , tan){

  this.v1.set( 0 , 0 , 0 );

  var dSize = dt[0] * size;
  if( side == 2 ){
    dSize += offset;
  }
  this.v2.copy( dir );
  this.v2.multiplyScalar( dSize );
  this.v1.add( this.v2 );


  var tSize = dt[1] * size;
  if( side !== 2 ){
    tSize += offset;
  }

  this.v2.copy( tan );
  this.v2.multiplyScalar( tSize );
  this.v1.add( this.v2 );
  
  v.copy( this.v1 );

}




