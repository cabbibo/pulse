function Moon(){
  
  var mat = new THREE.ShaderMaterial({
    uniforms:G.uniforms,
    vertexShader: shaders.vs.moon,
    fragmentShader: shaders.fs.moon,
  });

  this.body = new THREE.Mesh( new THREE.IcosahedronGeometry( 2 , 2 ), mat );

  this.globalPos = new THREE.Vector3();

  var geo = new THREE.Geometry();
  

  

  //this.simulation.debugScene.scale.multiplyScalar( .01 )
  //this.body.add( this.simulation.debugScene )


}

Moon.prototype.update = function(){

 
  //this.particles.update();

  this.body.updateMatrixWorld();
  this.globalPos.set( 0 , 0 , 0 );
  this.globalPos.applyMatrix4( this.body.matrixWorld );

}