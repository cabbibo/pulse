function Slider( size , touchers , body , bufferDistance ){

  this.body = body;

  var x = 1/5;
  var y = 1;
  x *= size;
  y *= size;


  var scale = new THREE.Vector2( x , y );
  scale.multiplyScalar( 1 / y );
  console.log( scale );

  var touchers = touchPlane.touchers;
  this.uniforms =  {

    touchers        : { type : "v3v" , value : touchers       },
    touching        : { type : "f"   , value : 0              },
    bufferDistance  : { type : "f"   , value : bufferDistance },
    scale           : { type : "v2"  , value : scale          },
    filled          : { type : "f"   , value : 0              },
    distanceCutoff  : { type : "f"   , value : .03            }

  }


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

  this.startTouchPos = new THREE.Vector3();


}

Slider.prototype.update = function(){

	this.touchPlane.update();

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

  this.uniforms.filled.value = ( e.XY[1] * 2 + this.touchPlane.y ) / ( 2. * this.touchPlane.y) ;

}

Slider.prototype.touchDown  = function( e ){

  this.touchID = e.id;

}

Slider.prototype.touchUp  = function( e ){


}
Slider.prototype.hoverUp    = function(){}
Slider.prototype.hoverDown  = function(){}




