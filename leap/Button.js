function Button( string , size , touchers , body , bufferDistance ){


  this.touching = false;
  this.hovering = false;

  this.body = body;

	this.title = textCreator.createMesh( string );
  this.title.scale.multiplyScalar( .001 );
  this.title.material.opacity = .5;

  this.body.add( this.title );
  this.title.position.z = -bufferDistance * 1.1;

  var x = this.title.scaledWidth  * this.title.scale.x;
  var y = this.title.scaledHeight * this.title.scale.y;

  var scale = new THREE.Vector2( x , y );
  scale.multiplyScalar( 1 / y );

  var touchers = touchPlane.touchers;
  this.uniforms =  {

    touchers:{ type:"v3v" , value: touchers },
    touching:{ type: "f" , value: 0 },
    bufferDistance: { type:"f" , value: bufferDistance },
    scale: { type:"v2" , value: scale },
    distanceCutoff: { type:"f", value: .1 }

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

	var xy = [ x , y ];

	this.touchPlane = new TouchPlane( touchers , body , xy , bufferDistance );


  this.touchPlane.addFirstTouchDownEvent( function( e ){ this._touchDown( e ); }.bind( this ));
  this.touchPlane.addLastTouchUpEvent( function( e ){ this._touchUp( e ); }.bind( this ));

  this.touchPlane.addFirstHoverDownEvent( function( e ){ this._hoverDown( e ); }.bind( this ));
  this.touchPlane.addLastHoverUpEvent( function( e ){ this._hoverUp( e ); }.bind( this ));


}

Button.prototype.update = function(){

	this.touchPlane.update();

}

Button.prototype._touchDown = function( e ){

  this.touchDown( e );

  this.title.material.color.setRGB( .4 , 1. , .6 )
  this.touching = true;
 
}

Button.prototype._touchUp = function( e ){

  this.title.material.color.setRGB( 1. , 1. , 1. )
  this.touchUp( e );
  this.touching = false;

}
Button.prototype._hoverDown = function( e ){

  this.hovering = true;
  this.title.material.opacity = 1.;
  this.hoverDown( e );

}

Button.prototype._hoverUp = function( e ){
  
  this.hovering = false;
  this.title.material.opacity = .5;
  this.hoverUp( e );
  
}

Button.prototype.touchUp    = function(){}
Button.prototype.touchDown  = function(){}
Button.prototype.hoverUp    = function(){}
Button.prototype.hoverDown  = function(){}



