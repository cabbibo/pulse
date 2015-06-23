function Pulse(){
  
  var citySize = .001;
  var puppySize = .3;
  var puppyPos = 30;
        
  this.city = new City( citySize , undefined , G.uniforms , G.uniforms );

  this.puppy = new SpacePuppy( puppySize , G.fingers.tips , puppyPos  );
  this.puppyPos = puppyPos;

  this.flowDirection = { type:"f" }
  var mat =  new THREE.ShaderMaterial({
    uniforms: G.uniforms,
    vertexShader: shaders.vs.energyFlow,
    fragmentShader: shaders.fs.energyFlow,
  });

  var geo = new THREE.CylinderGeometry( .01 , .01 , puppyPos - .3 , 20 , 1)
  this.energyFlow = new THREE.Mesh( geo , mat );
  this.energyFlow.position.z = -puppyPos / 2  + .1;
  this.energyFlow.rotation.x = -Math.PI / 2;
  this.energyFlow.position.y = .012;


  var geo = new THREE.CylinderGeometry( .015, .015 , puppyPos - .3 ,8 , 200 )
  this.pipeline = new THREE.Mesh( geo , new THREE.MeshNormalMaterial({
    wireframe:true,
    //blending: THREE.AdditiveBlending,
    transparent: true,
    frustumCulled: false
  }));
  this.pipeline.position.z = -puppyPos / 2  + .1;
  this.pipeline.rotation.x = -Math.PI / 2;
  this.pipeline.position.y = .012;



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
  this.pedestal.body.position.copy( G.v1 );



  var social = new Social();
  this.body.add( social );


/*
  var positions = [];
  positions.push( new THREE.Vector3( 0 , 0 , 0 ) );
  positions.push( new THREE.Vector3( 0 , 0 , puppyPos/4 ) );

  var loops = [ G.audioBuffers.sadChords , G.audioBuffers.sadLead  ];
  this.sadAudioField = new AudioField( this.body , loops , positions , G.sadLooper );
  this.sadAudioField.add();*/


  var positions = [];
  positions.push( new THREE.Vector3( 0 , 0 , 0 ) );
  positions.push( new THREE.Vector3( 0 , 0 , 7.5 ) );
  positions.push( new THREE.Vector3( 0 , 0 , 0 ) );
  positions.push( new THREE.Vector3( 0 , 0 , -puppyPos ) );
  positions.push( new THREE.Vector3( 0 , 0 , 7.5 ) );
  positions.push( new THREE.Vector3( 0 , 0 , 0 ) );
  positions.push( new THREE.Vector3( 0 , 0 , -puppyPos ) );
  positions.push( new THREE.Vector3( 0 , 0 , -puppyPos ) );

  var radii = [
    20,
    5,
    15,
    10,
    5,
    10,
    10,
    5
  ]

  var ab = G.audioBuffers

  var loops = [ 
    ab.chords , 
    ab.noise,
    ab.drums ,  
    ab.choir ,
    ab.bells ,
    ab.bass , 
    ab.lead , 
    ab.monkSounds,
  ];

  this.audioField = new AudioField( this.body , loops , positions , radii , G.looper );
  this.audioField.add();

  for( var i = 0; i < this.audioField.filters.length; i++ ){
    this.audioField.filters[i].frequency.value = 10;
  }


  this.audioField.filters[0].frequency.value = 100;
  this.audioField.filters[1].frequency.value = 500;

  var b = G.audioBuffers.startClick.buffer;

  this.startClick = new BufferedAudio( b , G.audio.ctx , G.audio.gain , false );



  this.addCity();
  this.addPuppy();


}

Pulse.prototype.update = function(){

  this.moon.update();
  this.moonField.update();
  this.audioField.update();
  this.pedestal.update();

  if( this.cityButton ){
    this.cityButton.update();
  }

  G.uniforms.lightPos.value.copy( this.moon.globalPos );
  G.light.position.copy( this.moon.globalPos );
  G.lightMarker.position.copy( this.moon.globalPos );

  this.puppy.update();

  if( this.enlightened ){
    this.moonField.soulDirection.copy( camera.position )
    this.moonField.soulDirection.sub( G.panPlane.body.position )
    G.v1.set( 0 , 0 , -7.5 )
    this.moonField.soulDirection.sub( G.v1 )
  }

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
   // this.audioField.filters[0].frequency.value = 10000;
    //this.audioField.filters[1].frequency.value = 4000;
    this.moonField.start(); 
    this.startClick.play();

    G.objectControls.remove( this.cityButton.topPlane );
    this.body.remove( this.cityButton.body );
    this.cityButton = undefined;


    var callback = function( value ){

      this.audioField.filters[0].frequency.value = value * 10000 + 200;
      this.audioField.filters[1].frequency.value = value * 10000 + 1000;

    }.bind( this );


    G.looper.tweenToEnd( callback , 0 , 1 )

  }.bind( this );
  button.unToggle = function(){ 
    var callback = function( value ){

      this.audioField.filters[0].frequency.value = value * 10000 + 200;
      this.audioField.filters[1].frequency.value = value * 10000 + 1000;

    }.bind( this );


    G.looper.tweenToEnd( callback , 1 , 0 )
  }.bind( this );

  var string = 'cityButton'
  var u = G.uniforms[ string ];
  button.linkUniform( u );

  this.body.add( button.body );
  this.cityButton = button; 

  this.body.add( this.city.buildings );
  this.body.add( this.city.wire );
  this.body.add( this.energyFlow );
  //this.body.add( this.pipeline );

  for( var i = 0; i < this.city.batteries.length; i++ ){
    this.body.add( this.city.batteries[i] );
  }
        
}

Pulse.prototype.addPuppy = function(){
  
  this.body.add( this.puppy.body );

}

Pulse.prototype.enlighten = function(){
 

  /*var s ={ 
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

         G.uniforms.flowDirection.value = -1;

        for(var i = 0; i < this.audioField.filters.length; i++){
          this.audioField.filters[i].frequency.value = 10000;
        }

      }.bind( this ))
      .start();
*/

  this.enlightened = true;

  var callback = function( value ){

    G.uniforms.rainbow.value = value;
    G.uniforms.flowDirection.value = -value;

    for(var i = 0; i < this.audioField.filters.length; i++){
      this.audioField.filters[i].frequency.value = value * 10000 + 40;
    }

    for( var i = 0; i < this.moonField.music.filters.length; i++ ){
      this.moonField.music.filters[i].frequency.value = value * 10000 + 100;
    }
  

    //this.moonField.soulDirection.set( 0 , .5 , 7.5 - value * ( this.puppyPos + 7.5 ) );

  }.bind( this );


  G.looper.tweenToEnd( callback , 0 , 1 )




}

/*Pulse.prototype.unenlighten = function(){
 
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


}*/
