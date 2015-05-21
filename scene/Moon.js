function Moon(){
  
  this.body = new THREE.Mesh( new THREE.IcosahedronGeometry( 2 , 2 ), new THREE.MeshBasicMaterial({
    color: 0xffffff,
   // wireframe: true
  }))

  this.globalPos = new THREE.Vector3();

  

  //this.simulation.debugScene.scale.multiplyScalar( .01 )
  //this.body.add( this.simulation.debugScene )


}

Moon.prototype.update = function(){

 
  //this.particles.update();

  this.body.updateMatrixWorld();
  this.globalPos.set( 0 , 0 , 0 );
  this.globalPos.applyMatrix4( this.body.matrixWorld );

}