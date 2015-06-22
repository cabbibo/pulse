function Social(){

	var body = new THREE.Object3D();
	
	var text = G.textCreator.createMesh( 'AUDIO : @JJ_VERNE' , {
      size: 1.1,
      crispness: 3
    });


  text.material.side = THREE.FrontSide;
  text.materialNeedsUpdate = true;


	text.material.opacity = .6
	text.hoverOver = function(){
   		this.material.opacity = 1
   	}.bind( text );
   	text.hoverOut = function(){
   		this.material.opacity = .6
   	}.bind( text );

   	text.select = function(){
   		window.open( "https://twitter.com/jj_verne" );

   		  // Making it so that object gets hovered out, so interrstections
  // dont break
  G.v1.set( -1 , 0 , 0 );
  G.v1.applyQuaternion( camera.quaternion );
  G.v1.add( camera.position );
  G.objectControls.checkForIntersections( G.v1 )

   	}


    G.objectControls.add( text );
    body.add( text );


	var text = G.textCreator.createMesh( 'CODE :  @CABBIBO' , {
      size: 1.1,
      crispness: 3
    });

 text.material.side = THREE.FrontSide;
  text.materialNeedsUpdate = true;


    text.position.y = -.35;
    text.material.opacity = .6

   	text.hoverOver = function(){
   		this.material.opacity = 1
   	}.bind( text );
   	text.hoverOut = function(){
   		this.material.opacity = .6
   	}.bind( text );

   	text.select = function(){
   		window.open( "https://twitter.com/Cabbibo" )

   		  G.v1.set( -1 , 0 , 0 );
  G.v1.applyQuaternion( camera.quaternion );
  G.v1.add( camera.position );
  G.objectControls.checkForIntersections( G.v1 )
   	}
    
    G.objectControls.add( text );
    body.add( text );

    body.position.z = -30;
    body.rotation.y = -Math.PI / 2.2;
    body.position.y = -.2;
    body.position.x = -10.2;

    return body;

}