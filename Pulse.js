function Pulse(){
  
  var citySize = .001;
  var puppySize = .3;
  var puppyPos = 30;
        
  this.city = new City( citySize , undefined , G.uniforms , G.uniforms );

  this.puppy = new SpacePuppy( puppySize , G.fingers.tips , puppyPos  );


  var mat =  new THREE.MeshPhongMaterial({
    color:0x333333,
    specular: 0xbbbbbb,
    shininess: 1000
  });

  var geo = new THREE.CylinderGeometry( .01 , .01 , puppyPos - .3 , 20 , 1)
  this.connection = new THREE.Mesh( geo , mat );
  this.connection.position.z = -puppyPos / 2  + .1;
  this.connection.rotation.x = -Math.PI / 2;
  this.connection.position.y = .012;



  this.body = new THREE.Object3D();



  this.body.position.z = -4 * 10 * citySize;
  this.body.rotation.x = Math.PI / 2;


  this.sky = new THREE.Mesh(
    new THREE.IcosahedronGeometry( 60 , 2 ),
    new THREE.ShaderMaterial({
      vertexShader: shaders.vs.sky,
      fragmentShader: shaders.fs.sky,
      uniforms: G.uniforms,
      side: THREE.BackSide
    })
  );

  this.body.add( this.sky );

  this.cliff = new Cliff();
  this.body.add( this.cliff );
  this.cliff.position.y = -.002;

  this.mountains = new Mountains();
  this.body.add( this.mountains );
  this.mountains.position.y = -1.01;
  this.mountains.position.z = -puppyPos + 10;


  this.moon = new Moon();
  this.moon.body.position.y = 10;
  this.moon.body.position.x = -10;
  this.moon.body.position.z = -puppyPos - 5;
  //this.moon.body.position.z = -15;
  this.body.add( this.moon.body );

  this.water = new THREE.Mesh( new THREE.PlaneGeometry( 400 , 400 , 20 , 20 ) , 
    new THREE.ShaderMaterial({
      uniforms:{
        rainbow      : G.uniforms.rainbow,
        lightPos     : G.uniforms.lightPos,


        t_matcap     : { type:"t"    , value: G.t.matcap       },
        t_normal     : { type:"t"    , value: G.t.normal       },
        t_audio      : { type:"t"    , value: G.audio.texture  },

      },
      vertexShader: shaders.vs.water,
      fragmentShader: shaders.fs.water,
    })
  );
  this.water.position.y = -.99;
  this.water.rotation.x = -Math.PI / 2;
  this.body.add( this.water );


  this.moonField = new MoonField( puppyPos );
  this.body.add( this.moonField.body );

  this.pedestal = new Pedestal();
  this.body.add( this.pedestal.body );
  G.v1.set( 0 , 0 , puppyPos/4 )
  this.pedestal.body.position.copy( G.v1 )

  var positions = [];
  positions.push( new THREE.Vector3( 0 , 0 , 0 ) );
  positions.push( new THREE.Vector3( 0 , 0 , -puppyPos ) );

  positions.push( new THREE.Vector3( 0 , 0 , puppyPos/4 ) );

  positions.push( new THREE.Vector3( 10 , 0 , -puppyPos/2 ) );
  positions.push( new THREE.Vector3( -10 , 0 , -puppyPos/2 ) );



  

  this.audioField = new AudioField( this.body , G.audioBuffers, positions , true );
  this.audioField.add();



  this.addCity();
  this.addPuppy();


}

Pulse.prototype.update = function(){

  this.moon.update();
  this.moonField.update();
  this.audioField.update();
  this.pedestal.update();

  this.cityButton.update();

  G.uniforms.lightPos.value.copy( this.moon.globalPos );
  G.light.position.copy( this.moon.globalPos );
  G.lightMarker.position.copy( this.moon.globalPos );

  this.puppy.update();

}

Pulse.prototype.addCity = function( fingers ){

  var body = new THREE.Object3D();
  body.position.y =  .04
  body.position.x =  .0
  body.rotation.x = -Math.PI / 2;


  var button = new ToggleButton( .3 , [
    G.fingers.tips[1],
    G.fingers.tips[6],
  ] , body , .006 );


  button.toggle = function(){ 
    this.audioField.filters[0].frequency.value = 4000;
    this.moonField.start(); 
  }.bind( this );
  button.unToggle = function(){ 
    this.moonField.stop(); 
    this.audioField.filters[0].frequency.value = 40;
  }.bind( this );

  var string = 'cityButton'
  var u = G.uniforms[ string ];
  button.linkUniform( u );

  this.body.add( button.body );
  this.cityButton = button; 

  this.body.add( this.city.buildings );
  this.body.add( this.city.wire );
  this.body.add( this.connection );

  for( var i = 0; i < this.city.batteries.length; i++ ){
    this.body.add( this.city.batteries[i] );
  }
        
}

Pulse.prototype.addPuppy = function(){
  
  this.body.add( this.puppy.body );

}

Pulse.prototype.enlighten = function(){
 

  var s ={ 
    v: 0
  }
  var e ={ v: 1 }
  var self = this;
  new TWEEN.Tween( s )
      .to( e , 2000. )
      .easing( TWEEN.Easing.Exponential.In)
      .onUpdate(function(e){ 
        G.uniforms.rainbow.value = this.v;
      })
      .onComplete(function(e){
        console.log('YAAA')
        //self.body.add( self.sky );
      })
      .start();


}

Pulse.prototype.unenlighten = function(){
 
  var s ={ 
    v: 1
  }
  var e ={ v: 0 }
  var self = this;
  new TWEEN.Tween( s )
      .to( e , 2000. )
      .easing( TWEEN.Easing.Exponential.Out )
      .onUpdate(function(e){ 
        G.uniforms.rainbow.value = this.v;
      })
      .onComplete(function(e){
        console.log('YAAA')
        //self.body.remove( self.sky );
      })
      .start();


}
