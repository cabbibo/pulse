function PanPlane( plane , touchPlane , forceBased ){

  this.body = touchPlane.body;

  this.panPlane   = plane;
  this.position   = plane.position;
	this.velocity   = new THREE.Vector3();
  this.force      = new THREE.Vector3();
  this.v1         = new THREE.Vector3();

  this.forceBasedInteraction = forceBased || false;

  this.touching = false;

  this.body.add( plane );

  this.x = 0;
  this.y = 0; 

  this.dX = 0;
  this.dY = 0;

  this.maxX  = 5;
  this.maxY  = 5;

  this.forceMultiplier = 1.;


  touchPlane.addFirstTouchingEvent( function( e ){

    //console.log( tou)
    this.dX = e.dX;
    this.dY = e.dY;

    this.touching = true;

  }.bind( this ))

  touchPlane.addLastTouchUpEvent( function( e ){

    this.dX = 0;
    this.dY = 0;

    this.touching = false;

  }.bind( this ))

  touchPlane.addFirstTouchDownEvent( function( e ){


  }.bind( this ))

}

PanPlane.prototype.update = function(){

  if( this.forceBasedInteraction ){
  
    this.force.set( 0 , 0 , 0 );

    this.force.x = this.dX * this.forceMultiplier;
    this.force.y = this.dY * this.forceMultiplier;

    this.velocity.add( this.force );
    this.position.add( this.velocity );

    if( this.touching ){
      this.velocity.multiplyScalar( .8 );
    }else{
      this.velocity.multiplyScalar( .95 );
    } 

  }else{
    if( this.touching ){

      this.velocity.copy( this.position );
      
      this.v1.set( 1 , 0 , 0 );
      this.v1.multiplyScalar( this.dX );
      this.position.add( this.v1 );

      this.v1.set( 0 , 1 , 0 );
      this.v1.multiplyScalar( this.dY );
      this.position.add( this.v1 );

      this.velocity.sub( this.position );
      this.velocity.multiplyScalar( -1 );

    }else{
      this.position.add( this.velocity );
      this.velocity.multiplyScalar( .95 );
    }
  }



  if( this.position.x > this.maxX ){
    this.position.x = this.maxX;
  }

  if( this.position.x < -this.maxX ){
    this.position.x = -this.maxX;
  }

  if( this.position.y > this.maxY ){
    this.position.y = this.maxY;
  }

  if( this.position.y < -this.maxY ){
    this.position.y = -this.maxY;
  }



}