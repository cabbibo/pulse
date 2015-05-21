function Moon(){
  
  this.body = new THREE.Mesh( new THREE.IcosahedronGeometry( 2 , 2 ), new THREE.MeshBasicMaterial({
    color: 0xffffff,
   // wireframe: true
  }))

  this.globalPos = new THREE.Vector3();

  this.depth = 32;
  this.joints = 4;
  this.jointSize = this.depth / this.joints;
  this.size = 64;
  var ss = shaders.ss.moonBeams;

  this.jointArray = [];


  this.simulation = new PhysicsArrayRenderer( this.size , this.depth , ss , renderer );

  this.simulation.setUniform( 'dT'   , G.dT    );
  this.simulation.setUniform( 'time' , G.time  );
  
  this.simulation.resetRand( .3  , true );

  for( var i = 0; i < this.joints; i++ ){

    this.jointArray.push( this.simulation.rt[i] );

  }

  this.particleGeo = createParticleGeometry( this.size );

  var vs = shaders.setValue( shaders.vs.moonBeams , 'DEPTH' , this.joints )
  this.particleMat = new THREE.ShaderMaterial({
    uniforms:{
      t_sprite: { type:"t" , value: G.t.sprite },
      t_posArray: { type:"tv" , value: this.jointArray },
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeams,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.particles = new THREE.PointCloud( this.particleGeo , this.particleMat );
  this.particles.frustumCulled = false;
  this.body.add( this.particles )


  this.lineGeo = createLineGeometry( this.size , this.joints );

  var vs = shaders.setValue( shaders.vs.moonBeamLines , 'DEPTH' , this.joints )
  this.lineMat = new THREE.ShaderMaterial({
    uniforms:{
      t_sprite: { type:"t" , value: G.t.sprite },
      t_posArray: { type:"tv" , value: this.jointArray },
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeamLines,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.lines = new THREE.Line( this.lineGeo , this.lineMat , THREE.LinePieces );
  this.lines.frustumCulled = false;
  this.body.add( this.lines )

  //this.simulation.debugScene.scale.multiplyScalar( .01 )
  //this.body.add( this.simulation.debugScene )


}

Moon.prototype.update = function(){

  this.simulation.update();

  this.body.rotation.x += .00057;
  this.body.rotation.y += .00039;
  this.body.rotation.z += .00027;

  for( var i =0; i< this.joints; i++ ){
    this.jointArray[i] = this.simulation.output[i * this.jointSize];
  }

  //this.particles.update();

  this.body.updateMatrixWorld();
  this.globalPos.set( 0 , 0 , 0 );
  this.globalPos.applyMatrix4( this.body.matrixWorld );

}