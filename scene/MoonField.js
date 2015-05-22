function MoonField(puppyPos){
  
  this.body = new THREE.Object3D();

  this.depth = 64;
  this.joints = 8;
  this.jointSize = this.depth / this.joints;
  this.size = 128;
  var ss = shaders.ss.moonBeams;

  this.jointArray = [];


  this.simulation = new PhysicsArrayRenderer( this.size , this.depth , ss , renderer );

  this.simulation.setUniform( 'dT'   , G.dT    );
  this.simulation.setUniform( 'time' , G.time  );
  this.simulation.setUniform( 't_audio' , G.uniforms.t_audio );
  this.simulation.setUniform( 'puppyPos' , { type:"f", value:puppyPos})
  
  this.simulation.resetRand( .3  , false);

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
}

MoonField.prototype.update = function(){

 this.simulation.update();


  for( var i =0; i< this.joints; i++ ){
    this.jointArray[i] = this.simulation.output[i * this.jointSize];
  }



}