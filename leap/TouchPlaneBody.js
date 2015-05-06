function TouchPlaneBody( touchPlane ){
	
  this.touchPlane = touchPlane;

  var tp = this.touchPlane;

  this.body = tp.body;

  var touchers = touchPlane.touchers;
  this.uniforms =  {
    touchers:{ type:"v3v" , value: touchers },
    touching:{ type: "f" , value: 0 },
    bufferDistance: { type:"f" , value: tp.bufferDistance },
    distanceCutoff: { type:"f", value: .2 },
    scale: { type:"v2" , value: new THREE.Vector2( tp.x , tp.y ) }
  }

  var vs = shaders.setValue( shaders.vs.topPlane , 'SIZE' , touchers.length );
  var fs = shaders.setValue( shaders.fs.topPlane , 'SIZE' , touchers.length );

	var geo = new THREE.PlaneBufferGeometry( tp.x , tp.y , tp.x * 100 , tp.y * 100 );
	var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
		vertexShader: vs,
    fragmentShader: fs,
    transparent: true
	});

	this.topPlane = new THREE.Mesh( geo , mat )


	var geo = new THREE.PlaneBufferGeometry( tp.x , tp.y , 1 , 1 );
	var mat = new THREE.MeshBasicMaterial({
		color: 0xffaa66
	});
	
	this.basePlane = new THREE.Mesh( geo , mat );
  this.basePlane.position.z = -tp.bufferDistance;

  //this.body.add( this.basePlane );
  this.body.add( this.topPlane );

  tp.addTouchDownEvent( function(){
    this.basePlane.material.color.setRGB( 1 , 0 , 0 );
  }.bind( this ));

  tp.addTouchUpEvent( function(){
    this.basePlane.material.color.setRGB( .7 , 0 , 0 );
  }.bind( this ));


}