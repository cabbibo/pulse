function Slider( size , touchers , body , bufferDistance ){

  this.body = body;

  this.linkedUniforms = [];
  this.value = 0;

  var x = 1/5;
  var y = 1;
  x *= size;
  y *= size;


  var scale = new THREE.Vector2( x , y );
  scale.multiplyScalar( 1 / y );

  this.uniforms =  {

    touchers        : { type : "v3v" , value : touchers       },
    touching        : { type : "f"   , value : 0              },
    bufferDistance  : { type : "f"   , value : bufferDistance },
    scale           : { type : "v2"  , value : scale          },
    filled          : { type : "f"   , value : 0              },
    distanceCutoff  : { type : "f"   , value : .03            },

    rainbow: G.uniforms.rainbow

  }


  this.hovering = false;
  this.isTouched = false;

  var geo = new THREE.PlaneBufferGeometry( x , y , 1 , 1 )
  var mat = new THREE.ShaderMaterial({
    uniforms      : this.uniforms,
    vertexShader  : shaders.vs.slider,
    fragmentShader: shaders.fs.slider,
    transparent: true
  });
  this.bg = new THREE.Mesh( geo , mat );
  this.bg.position.z = -bufferDistance * 1.1;

  this.body.add( this.bg );


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

	var xy = [ x , y ];

	this.touchPlane = new TouchPlane( touchers , body , xy , bufferDistance );


  this.touchPlane.addFirstTouchDownEvent( function( e ){ this._touchDown( e ); }.bind( this ));
  this.touchPlane.addLastTouchUpEvent( function( e ){ this._touchUp( e ); }.bind( this ));

  this.touchPlane.addFirstHoverDownEvent( function( e ){ this._hoverDown( e ); }.bind( this ));
  this.touchPlane.addLastHoverUpEvent( function( e ){ this._hoverUp( e ); }.bind( this ));

  this.touchPlane.addFirstTouchingEvent( function( e ){ this._touching( e ); }.bind( this ));

  this.topPlane.hoverOver = function(){ this.hovering = true; this._hoverDown(); }.bind( this );
  this.topPlane.hoverOut = function(){  this.hovering = false; this._hoverUp(); }.bind( this );
  this.topPlane.select = function(){ this.isTouched = true; }.bind( this );
  this.topPlane.deselect = function(){ this.isTouched = false; }.bind( this );


  G.objectControls.add( this.topPlane );

  this.startTouchPos = new THREE.Vector3();


}



Slider.prototype.update = function(){

	this.touchPlane.update();

  for( var i = 0; i < this.linkedUniforms.length; i++ ){
    var u = this.linkedUniforms[i];
    var cons = u.constraints;
    u.value = cons[0] + ( cons[1] - cons[0] ) * this.value;
  }

  this.uniforms.filled.value = this.value;

  if( this.hovering == true ){
   
    var raycaster = G.objectControls.raycaster;
    var i = raycaster.intersectObject( this.topPlane );
    
    if( i[0] ){
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

Slider.prototype.linkUniform = function( u ){ 
  this.linkedUniforms.push( u );
  this.value = ( u.value - u.constraints[ 0 ] ) / ( u.constraints[1] - u.constraints[0] );
}

Slider.prototype.unlinkUniform = function( u ){ 
  for( var i = 0; i < this.linkedUniforms.length; i++ ){
    if( u === this.linkedUniforms[i] ){
      this.linkedUniforms.splice( i , 0 );
    }
  }
}

Slider.prototype._touchDown = function( e ){
  this.touchDown( e ); 
}

Slider.prototype._touchUp = function( e ){
  this.touchUp( e );
}

Slider.prototype._touching = function( e ){
  this.touching(e);
}
Slider.prototype._hoverDown = function( e ){
  this.hoverDown( e );
}

Slider.prototype._hoverUp = function( e ){
  this.hoverUp( e );
}

Slider.prototype.touching = function(e){

  this.value  = ( e.XY[1] * 2 + this.touchPlane.y ) / ( 2. * this.touchPlane.y) ;

}

Slider.prototype.touchDown  = function( e ){

  this.touchID = e.id;

}

Slider.prototype.touchUp  = function( e ){


}
Slider.prototype.hoverUp    = function(){}
Slider.prototype.hoverDown  = function(){}




