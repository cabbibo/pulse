function Interface( fingers , puppy){

  this.body = new THREE.Object3D();
  this.puppy = puppy;

  this.buttons = [];
  this.sliders = [];
  this.textMeshes = [];



  for( var  i = 0; i < 6; i++ ){

    var body = new THREE.Object3D();
    body.position.y =  .06  * Math.floor( i / 3 );
    body.position.x =  .06  * ( i % 3) ;

    var button = new ToggleButton( .05 , fingers , body , .01 );

    var interfaceString = "UNTITLED"
    if( i == 0 ){ 

      interfaceString = "Toggle Lifelines"
      button.toggle = function(){ this.interface.puppy.turnOnLifelines(); }.bind( button );
      button.unToggle = function(){ this.interface.puppy.turnOffLifelines(); }.bind( button );
      
    }else if( i == 1 ){

      interfaceString = "Toggle Normal Map"

    }else if( i == 2 ){

      interfaceString = "Heighten Normal Map"

    }

    button.hoverDown = function(){ this.interface.showText( this ); }.bind( button );
    button.hoverUp   = function(){ this.interface.clearText(); }.bind( button );

    button.interface = this;

    var string = 'toggle' + ( i + 1 );
    var u = G.uniforms[ string ];
    button.linkUniform( u );

    var text = G.textCreator.createMesh( interfaceString , {
      size: .03
    });
    text.position.y = .1;
    text.position.x = .06 * 2;
    //text.position.x -= text.totalWidth;
    console.log( 's' )
    console.log( text );

    this.textMeshes.push( text );

    //this.body.add( text );
    this.body.add( button.body );
    this.buttons.push( button);

  }

  for( var  i = 0; i < 3; i++ ){

    var body = new THREE.Object3D();
    body.position.x =  .06 * 3 + i * .03;
    body.position.y = .03;

    var slider = new Slider( .1 , fingers , body , .01 );

    var interfaceString = "UNTITLED"
    if( i == 0 ){ 

      interfaceString = "Toggle Lifelines"
     // button.toggle = function(){ this.interface.puppy.turnOnLifelines(); }.bind( button );
     // button.unToggle = function(){ this.interface.puppy.turnOffLifelines(); }.bind( button );
      
    }else if( i == 1 ){

      interfaceString = "Toggle Normal Map"

    }else if( i == 2 ){

      interfaceString = "Heighten Normal Map"

    }

    slider.hoverDown = function(){ console.log('ADADDAAD' ); this.interface.showText( this ); }.bind( slider );
    slider.hoverUp   = function(){ this.interface.clearText(); }.bind( slider );


    slider.interface = this;

    var string = 'slider' + ( i+ 1 )
    var u = G.uniforms[ string ];
    slider.linkUniform( u );


    var text = G.textCreator.createMesh( interfaceString , {
      size: .03
    });
    text.position.y = .1;
    text.position.x = .06 * 2;

    //text.position.x -= text.totalWidth;
    console.log( 's' )
    console.log( text );

    this.textMeshes.push( text );
 
    this.body.add( slider.body )
    this.sliders.push( slider );
   

  }


}

Interface.prototype.showText = function( button ){

  console.log( this );
  for( var i = 0; i < this.buttons.length; i++ ){
    if( this.buttons[ i ] != button ){
      this.body.remove( this.textMeshes[i] );
    }else{
      this.body.add( this.textMeshes[i] );
    }
  }

  for( var i = 0; i < this.sliders.length; i++ ){
    if( this.sliders[ i ] != button ){
      this.body.remove( this.textMeshes[i + this.buttons.length ] );
    }else{
      this.body.add( this.textMeshes[i + this.buttons.length] );
    }
  }

}

Interface.prototype.clearText = function(){

  for( var i = 0; i < this.textMeshes.length; i++ ){
    this.body.remove( this.textMeshes[i] );
  }

}

Interface.prototype.update = function(){

  for( var i = 0; i < this.sliders.length; i++ ){
    this.sliders[i].update();
  }
  for( var i = 0; i < this.buttons.length; i++ ){
    this.buttons[i].update();
  }

}
