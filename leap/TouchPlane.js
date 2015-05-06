// TODO:
// Does firstTouching get replaced when the first down gets lifted, 
// but there are still others down? If so, probably take the lowest I 
// in touching array / compare by touchStartTimes ?



function TouchPlane( touchers , body , xy , bufferDistance ){
	
  this.touchers = touchers;

  this.touchPoints          = [];
  this.oTouchPoints         = [];
  this.touchInfo            = [];


  // EVENT ARRAYS
  this.touchDownEvents      = [];
  this.touchUpEvents        = [];
  this.touchingEvents       = [];

  this.hoverDownEvents      = [];
  this.hoverUpEvents        = [];
  this.hoveringEvents       = [];

  this.firstHoverDownEvents = [];
  this.lastHoverUpEvents    = [];
  
  this.firstTouchDownEvents = [];
  this.lastTouchUpEvents    = [];

  this.firstTouchingEvents  = [];
  this.firstHoveringEvents  = [];

  this.firstTouchingID = 0;
  this.firstHoveringID = 0;

  this.touchingIDs = [];
  this.hoveringIDs = [];



  for( var i = 0; i < this.touchers.length; i++ ){

    this.touchPoints.push( this.touchers[i].clone() );
    this.oTouchPoints.push( this.touchers[i].clone() );
    this.touchInfo.push({
      hovered: false,
      touching: false,
      touchStartTime: 0
    })

  }
	

  this.body = body;

  this.x = xy[0];
  this.y = xy[1];
  this.bufferDistance = bufferDistance;

  this.body.updateMatrix();

  this.basePoint = new THREE.Vector3( 0 , 0 , -this.bufferDistance );

  this.normal = new THREE.Vector3( 0 , 0 , 1 );
  this.xVec = new THREE.Vector3( 1 , 0 , 0 );
  this.yVec = new THREE.Vector3( 0 , 1 , 0 );

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();
  this.v3 = new THREE.Vector3();


}

TouchPlane.prototype.update = function(){

  this.normal.set( 0 , 0 , 1 );
  this.xVec.set( 1 , 0 , 0 );
  this.yVec.set( 0 , 1 , 0 );

  this.basePoint.set( 0 , 0 , -this.bufferDistance );

  
  this.v1.set( 0 , 0, 0);

  // Make sure our Vectors are facing the right directions

  this.body.updateMatrixWorld();
  this.basePoint.applyMatrix4( this.body.matrixWorld );

  this.normal.applyMatrix4( this.body.matrixWorld );
  this.xVec.applyMatrix4( this.body.matrixWorld );
  this.yVec.applyMatrix4( this.body.matrixWorld );

  this.v1.applyMatrix4( this.body.matrixWorld );

  this.normal.sub( this.v1 );
  this.xVec.sub( this.v1 );
  this.yVec.sub( this.v1 );


  for( var  i = 0; i < this.touchers.length; i++ ){

    this.oTouchPoints[i].copy( this.touchPoints[i] );
    this.touchPoints[i].copy( this.touchers[i] );

    var oD = this.checkDistanceToPlane( this.oTouchPoints[i]);
    var d  = this.checkDistanceToPlane( this.touchPoints[i]);

    var dD = oD - d;

    var inBounds = this.checkInBounds( this.touchPoints[i] );

    if( inBounds ){

      if( oD > this.bufferDistance && d <= this.bufferDistance ){
        this._hoverDown( this.touchPoints[i] , i )
      }

      if( oD < this.bufferDistance && d >= this.bufferDistance ){
        this._hoverUp( this.touchPoints[i] , i )
      }

      if( oD < this.bufferDistance && d < this.bufferDistance  && d > 0 ){
        this._hovering( this.touchPoints[i] , i , d , dD )
      }

      if( oD > 0 && d <= 0 ){
        var XY = this.getXY( this.touchPoints[i] )
        this._touchDown( this.touchPoints[i] , XY , i )
      }

      if( oD < 0 && d >= 0 ){
        this._touchUp( this.touchPoints[i] , i )
      }

      if( oD < 0  && d < 0 ){

        this.v3.copy( this.touchPoints[i] );
        this.v3.sub( this.oTouchPoints[i] );


        var dXY = this.getXY( this.v3 );

        this.v3.copy( this.touchPoints[i] );
        this.v3.sub( this.basePoint );
        var XY = this.getXY( this.v3 )

        this._touching( this.touchPoints[i] , i , this.v3 , XY , dXY , dD );

      }

    // Make sure that if we are out of bounds
    // we trigger all the neccesary out events
    }else{

      if( this.touchInfo[i].hovering == true ){
        this._hoverUp( this.touchPoints[i] , i );
      }

      if( this.touchInfo[i].touching == true ){
        this._touchUp( this.touchPoints[i] , i );
      }

    }

  }

 

}



TouchPlane.prototype._touchDown = function( pos , XY , id ){

  this.touchInfo[id].touching = true;
  this.touchInfo[id].touchStartTime = Date.now();

  if( this.touchingIDs.length == 0 ){
    this._firstTouchDown( pos , XY , id );
  }

  this.touchingIDs.push( id );

 // console.log( this.touchInfo[id].touchStartTime );

  for( var i = 0; i < this.touchDownEvents.length; i++ ){

    this.touchDownEvents[i]({
      position  : pos,
      XY        : XY,
      x         : XY[0],
      y         : XY[1],
      id        : id
    });

  }



}

TouchPlane.prototype._touchUp = function( pos , id ){

  this.touchInfo[id].touching = false;
  //this.touchInfo[id].touchStartTime = Date.now();
  
  for( var i = 0; i < this.touchUpEvents.length; i++ ){

    this.touchUpEvents[i]({
      position: pos,
      id: id
    });

  }


  // Making sure we get the last touch up,
  // Incase we don't care about individual touches
  for( var i = 0; i < this.touchingIDs.length; i++ ){
    if( this.touchingIDs[i] == id ){
      this.touchingIDs.splice( i , 1 );
    }
  }

  if( this.touchingIDs.length == 0 ){
    this._lastTouchUp( pos , id );
  }

}

TouchPlane.prototype._firstTouchDown = function( pos , XY , id ){

  this.firstTouchingID = id;
  for( var i = 0; i < this.firstTouchDownEvents.length; i++ ){

    this.firstTouchDownEvents[i]({
      position  : pos,
      XY        : XY,
      x         : XY[0],
      y         : XY[1],
      id        : id
    });

  }

}

TouchPlane.prototype._lastTouchUp = function( pos , id ){

  for( var i = 0; i < this.lastTouchUpEvents.length; i++ ){

    this.lastTouchUpEvents[i]({
      position: pos,
      id: id
    });

  }

}


TouchPlane.prototype._touching = function( pos , id , dPos , XY ,  dXY  , dD ){

  var timeTouching = Date.now() - this.touchInfo[id].touchStartTime;

  for( var i = 0; i < this.touchingEvents.length; i++ ){

    this.touchingEvents[i]({

      position  : pos, 
      id        : id,
      dPosition : dPos,
      dXY       : dXY,
      dX        : dXY[0],
      dY        : dXY[1],
      XY        : XY,
      x         : XY[0],
      y         : XY[1],
      dDistance : dD,
      timeTouching: timeTouching

    });

  }

  if( id == this.firstTouchingID ){

    for( var i = 0; i < this.firstTouchingEvents.length; i++ ){

      this.firstTouchingEvents[i]({

        position  : pos, 
        id        : id,
        dPosition : dPos,
        dXY       : dXY,
        dX        : dXY[0],
        dY        : dXY[1],
        XY        : XY,
        x         : XY[0],
        y         : XY[1],
        dDistance : dD,
        timeTouching: timeTouching

      });

    }

  }

}

TouchPlane.prototype._hoverDown = function( pos , id  ){

  this.touchInfo[id].hovering = true;

  if( this.hoveringIDs.length == 0 ){
    this._firstHoverDown( pos , id );
  }

  this.hoveringIDs.push( id );

  for( var i = 0; i < this.hoverDownEvents.length; i++ ){

    this.hoverDownEvents[i]({
      position: pos,
      id: id
    });

  }

}

TouchPlane.prototype._hoverUp = function( pos ,  id   ){

  this.touchInfo[id].hovering = false;

  for( var i = 0; i < this.hoverUpEvents.length; i++ ){

    this.hoverUpEvents[i]({
      position: pos,
      id: id
    });

  }

  // Making sure we get the last hover up,
  // Incase we don't care about individual touches
  for( var i = 0; i < this.hoveringIDs.length; i++ ){
    if( this.hoveringIDs[i] == id ){
      this.hoveringIDs.splice( i , 1 );
    }
  }

  if( this.hoveringIDs.length == 0 ){
    this._lastHoverUp( pos , id );
  }

}

TouchPlane.prototype._firstHoverDown = function( pos , id ){

  this.firstHoveringID = id;

  for( var i = 0; i < this.firstHoverDownEvents.length; i++ ){

    this.firstHoverDownEvents[i]({
      position  : pos,
      id        : id
    });

  }

}

TouchPlane.prototype._lastHoverUp = function( pos , id ){

  for( var i = 0; i < this.lastHoverUpEvents.length; i++ ){

    this.lastHoverUpEvents[i]({
      position: pos,
      id: id
    });

  }

}

TouchPlane.prototype._hovering = function( pos , id , distance , dD ){

  for( var i = 0; i < this.hoveringEvents.length; i++ ){

    this.hoveringEvents[i]({
      position: pos,
      id: id,
      distance: distance,
      dDistance : dD
    });

  }

  if( id == this.firstHoveringID ){

    for( var i = 0; i < this.firstHoveringEvents.length; i++ ){

      this.firstHoveringEvents[i]({
        position: pos,
        id: id,
        distance: distance,
        dDistance : dD
      });

    }

  }


}

TouchPlane.prototype.addTouchDownEvent = function( e ){ 
  this.touchDownEvents.push( e );
}

TouchPlane.prototype.addTouchUpEvent = function( e ){ 
  this.touchUpEvents.push( e );
}

TouchPlane.prototype.addFirstTouchDownEvent = function( e ){ 
  this.firstTouchDownEvents.push( e );
}

TouchPlane.prototype.addFirstTouchingEvent = function( e ){ 
  this.firstTouchingEvents.push( e );
}

TouchPlane.prototype.addLastTouchUpEvent = function( e ){ 
  this.lastTouchUpEvents.push( e );
}

TouchPlane.prototype.addTouchingEvent = function( e ){ 
  this.touchingEvents.push( e );
}

TouchPlane.prototype.addHoverDownEvent = function( e ){ 
  this.hoverDownEvents.push( e );
}

TouchPlane.prototype.addHoverUpEvent = function( e ){ 
  this.hoverUpEvents.push( e );
}

TouchPlane.prototype.addFirstHoverDownEvent = function( e ){ 
  this.firstHoverDownEvents.push( e );
}

TouchPlane.prototype.addFirstHoveringEvent = function( e ){ 
  this.firstHoveringEvents.push( e );
}

TouchPlane.prototype.addLastHoverUpEvent = function( e ){ 
  this.lastHoverUpEvents.push( e );
}

TouchPlane.prototype.addHoveringEvent = function( e ){ 
  this.hoveringEvents.push( e );
}


TouchPlane.prototype.removeTouchDownEvent = function( e ){ 
  this.removeEvent( 'touchDownEvents' , e ); 
}

TouchPlane.prototype.removeTouchUpEvent = function( e ){ 
  this.removeEvent( 'touchUpEvents' , e );
}

TouchPlane.prototype.removeFirstTouchDownEvent = function( e ){ 
  this.removeEvent( 'firstTouchDownEvents' , e );
}

TouchPlane.prototype.removeLastTouchUpEvent = function( e ){ 
  this.removeEvent( 'lastTouchUpEvents' , e );
}

TouchPlane.prototype.removeFirstTouchingEvent = function( e ){ 
  this.removeEvent( 'firstTouchingEvents' , e );
}

TouchPlane.prototype.removeTouchingEvent = function( e ){ 
  this.removeEvent( 'touchingEvents' , e );
}

TouchPlane.prototype.removeHoverDownEvent = function( e ){ 
  this.removeEvent( 'hoverDownEvents' , e ); 
}

TouchPlane.prototype.removeHoverUpEvent = function( e ){ 
  this.removeEvent( 'hoverUpEvents' , e );
}

TouchPlane.prototype.removeFirstHoverDownEvent = function( e ){ 
  this.removeEvent( 'firstHoverDownEvents' , e );
}

TouchPlane.prototype.removeLastHoverUpEvent = function( e ){ 
  this.removeEvent( 'lastHoverUpEvents' , e );
}

TouchPlane.prototype.removeFirstHoveringEvent = function( e ){ 
  this.removeEvent( 'firstHoveringEvents' , e );
}

TouchPlane.prototype.removeHoveringEvent = function( e ){ 
  this.removeEvent( 'hoveringEvents' , e );
}

TouchPlane.prototype.removeEvent = function( array , e ){
  
  console.log( this[array] );
  
  for( var i = 0; i < this[ array ].length; i++ ){
    if( this[ array ][i] === e ){
      this[array].splice( i , 1 );
    }
  }
  
  console.log( this[array] );

}







TouchPlane.prototype.checkDistanceToPlane = function( point ){

  this.v1.copy( point );
  this.v1.sub( this.basePoint );

  var d = this.v1.dot( this.normal );

  return d;

}


// Gets the component of the vector that is in the plane
// BE CAREFUL! it returns v1, so set it out immediatly
TouchPlane.prototype.getPerpComponent = function( vec ){

  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  return this.v1;

}

// Checks to make sure that where we are touching is
// in the bounds of the plane
TouchPlane.prototype.checkInBounds = function( point ){

  this.v3.copy( point )
  this.v3.sub( this.basePoint );
  var xy = this.getXY( this.v3 );
  
  //xy[0] = abs( xy[0] );
  //xy[1] = abs( xy[1] );
  
  if( xy[0] > this.x / 2 || xy[0] < -this.x / 2  ){
    return false
  }

  if( xy[1] > this.y / 2 || xy[1] < -this.y / 2  ){
    return false
  }

  return true
  // this.v1 is now perpComponent

}

TouchPlane.prototype.getXY = function( vec ){
   
  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  this.v2.copy( this.v1 );
  this.v2.projectOnVector( this.xVec );

  var dot = this.v2.dot( this.xVec );
  var sign = dot > 0 ? 1 : -1
  var X = this.v2.length() * sign;

  this.v1.copy( vec );

  var d = this.v1.dot( this.normal );

  this.v2.copy( this.normal );
  this.v2.multiplyScalar( d );
  this.v1.sub( this.v2 );

  this.v2.copy( this.v1 );
  this.v2.projectOnVector( this.yVec );

  var dot = this.v2.dot( this.yVec );
  var sign = dot > 0 ? 1 : -1
  var Y = this.v2.length() * sign;

  return[ X , Y ];

}


