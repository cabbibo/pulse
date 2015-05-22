function Pulse(){
  
  var citySize = .001;
  var puppySize = .3;
  var puppyPos = 30;
        
  //this.city = new City( citySize , undefined , G.uniforms , G.uniforms );

  //this.puppy = new SpacePuppy( puppySize , G.fingers.tips , puppyPos  );


  var mat = new THREE.MeshNormalMaterial();
  var geo = new THREE.CylinderGeometry( .01 , .01 , puppyPos - .3 , 20 , 1)
  this.connection = new THREE.Mesh( geo , mat );
  this.connection.position.z = -puppyPos / 2  + .1;
  this.connection.rotation.x = -Math.PI / 2;
  this.connection.position.y = .012;

  this.body = new THREE.Object3D();



  this.body.position.z = -4 * 10 * citySize;
  this.body.rotation.x = Math.PI / 2;

  /*this.cliff = new Cliff();
  this.body.add( this.cliff );
  this.cliff.position.y = -.002;

  this.mountains = new Mountains();
  this.body.add( this.mountains );
  this.mountains.position.y = -1.01;
  this.mountains.position.z = -puppyPos + 10;*/


  this.moon = new Moon();
  this.moon.body.position.y = 10;
  this.moon.body.position.x = -10;
  this.moon.body.position.z = -puppyPos - 5;
  //this.moon.body.position.z = -15;
  this.body.add( this.moon.body );

  this.water = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000 , 1000  ) , new THREE.MeshPhongMaterial(0xffffff) );
  this.water.position.y = -.9;
  this.water.rotation.x = -Math.PI / 2;
  this.body.add( this.water );


  this.moonField = new MoonField( puppyPos );
  this.body.add( this.moonField.body );


}

Pulse.prototype.update = function(){

  this.moon.update();
  this.moonField.update();

  G.uniforms.lightPos.value.copy( this.moon.globalPos );
  G.light.position.copy( this.moon.globalPos );
  G.lightMarker.position.copy( this.moon.globalPos );

  //this.puppy.update();

}

Pulse.prototype.addCity = function(){

  this.body.add( this.city.buildings );
  this.body.add( this.city.wire );
  //this.body.add( this.connection );

  for( var i = 0; i < this.city.batteries.length; i++ ){
    this.body.add( this.city.batteries[i] );
  }
        
}

Pulse.prototype.addPuppy = function(){
  
  this.body.add( this.puppy.body );

}