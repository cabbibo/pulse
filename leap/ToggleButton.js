function ToggleButton( size , touchers , body , bufferDistance ){


  this.touching = false;
  this.hovering = false;

  this.body = body;
  this.linkedUniforms = [];
  
  this.toggled = false;


  var x = size;
  var y = size;

  var scale = new THREE.Vector2( x , y );
  scale.multiplyScalar( 1 / y );

  this.uniforms =  {

    touchers:{ type:"v3v" , value: touchers },
    touching:{ type: "f" , value: 0 },
    bufferDistance: { type:"f" , value: bufferDistance },
    scale: { type:"v2" , value: scale },
    distanceCutoff: { type:"f", value: .1 },
    rainbow: G.uniforms.rainbow,
    cityButton : G.uniforms.cityButton,
    t_audio : G.uniforms.t_audio

  }

  var vs = shaders.setValue( shaders.vs.button , 'SIZE' , touchers.length );
  var fs = shaders.setValue( shaders.fs.button , 'SIZE' , touchers.length );

  var geo = new THREE.PlaneBufferGeometry( x , y , 30 , 30 );
  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });

  this.topPlane = new THREE.Mesh( geo , mat );
  this.body.add( this.topPlane );

  var mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  mat.color.setRGB( .1 , .1 , .1 );
  this.backPlane = new THREE.Mesh( geo , mat );
  this.backPlane.position.z = - bufferDistance;
  this.body.add( this.backPlane )

  var xy = [ x , y ];

  this.touchPlane = new TouchPlane( touchers , body , xy , bufferDistance );


  this.touchPlane.addFirstTouchDownEvent( function( e ){ this._touchDown( e ); }.bind( this ));
  this.touchPlane.addLastTouchUpEvent( function( e ){ this._touchUp( e ); }.bind( this ));

  this.touchPlane.addFirstHoverDownEvent( function( e ){ this._hoverDown( e ); }.bind( this ));
  this.touchPlane.addLastHoverUpEvent( function( e ){ this._hoverUp( e ); }.bind( this ));

  this.topPlane.hoverOver = function(){ this.hovering = true; this._hoverDown(); }.bind( this );
  this.topPlane.hoverOut = function(){  this.hovering = false; this._hoverUp(); }.bind( this );
  this.topPlane.select = function(){ this.isTouched = true; }.bind( this );
  this.topPlane.deselect = function(){ this.isTouched = false; }.bind( this );


  G.objectControls.add( this.topPlane );

}

ToggleButton.prototype.update = function(){

  this.touchPlane.update();

  for( var i = 0; i < this.linkedUniforms.length; i++ ){
    var u = this.linkedUniforms[i];
    u.value = ( this.toggled == false ) ? 0 : 1
  }

  if( this.hovering == true ){

    var raycaster = G.objectControls.raycaster;
    var i = raycaster.intersectObject( this.topPlane );
    
    if( i[0]){

      G.v1.copy( i[0].point );
      G.v2.copy( this.touchPlane.normal );

      if( this.isTouched == true ){
        G.v2.multiplyScalar( this.touchPlane.bufferDistance * - 1.2 );
      }else{
        G.v2.multiplyScalar( this.touchPlane.bufferDistance * - .5 );
      }
      G.v1.add( G.v2 )

      G.uniforms.vels.value[1].copy( G.uniforms.tips.value[1] );
      G.uniforms.tips.value[1].copy( G.v1 );
      G.uniforms.vels.value[1].sub( G.uniforms.tips.value[1] );

      G.intersectionMarker.position.copy( G.v1 );

    }

  }


}

// TODO: Make sure we inherit from this uniform
// our toggled value
ToggleButton.prototype.linkUniform = function( uniform ){

  this.linkedUniforms.push( uniform )

}


ToggleButton.prototype.unlinkUniform = function( u ){

  for( var i = 0; i < this.linkedUniforms.length; i++ ){
    if( u === this.linkedUniforms[i] ){
      this.linkedUniforms.splice( i , 0 );
    }
  }



}

ToggleButton.prototype._touchDown = function( e ){

  this.touchDown( e );
  this.touching = true; 

  if( this.toggled == false ){
    this.backPlane.material.color.setRGB( .8 , .8 , .8 );
    this.toggled = true;
    this.toggle();
  }else{
    this.backPlane.material.color.setRGB( .5 , .5 , .5 );
    this.toggled = false;
    this.unToggle();
  }

 
}

ToggleButton.prototype._touchUp = function( e ){

  this.touchUp( e );
  this.touching = false;
  if( this.toggled == false ){
    this.backPlane.material.color.setRGB( .5 , .5 , .5 );
  }

}
ToggleButton.prototype._hoverDown = function( e ){

  this.hovering = true;
  this.hoverDown( e );

  if( this.toggled == false ){
    this.backPlane.material.color.setRGB( .5 , .5 , .5 );
  }

}

ToggleButton.prototype._hoverUp = function( e ){
  
  this.hovering = false;
  this.hoverUp( e );

  if( this.toggled == false ){
    this.backPlane.material.color.setRGB( .1 , .1 , .1 );
  }
  
}

ToggleButton.prototype.toggle     = function(){}
ToggleButton.prototype.unToggle   = function(){}
ToggleButton.prototype.touchUp    = function(){}
ToggleButton.prototype.touchDown  = function(){}
ToggleButton.prototype.hoverUp    = function(){}
ToggleButton.prototype.hoverDown  = function(){}

