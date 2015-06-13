function Path( points , numWires , baseID , wireSpacing , outputPath , rightHanded ){

  this.upVec = new THREE.Vector3( 0 , 1 , 0 );

  this.points = points;
  this.numWires = numWires;
  this.baseID = baseID;

  this.wireSpacing = wireSpacing;
  this.outputPath = outputPath;
  //console.log( 'right: ' + rightHanded )
  this.rightHanded = rightHanded || 1;

  // console.log( this.points );

  // The important part!
  this.directions = this.getDirections( this.points     );

  // console.log( this.directions )
  this.tangents   = this.getTangents(   this.directions );
  this.bisectors  = this.getBisectors(  this.directions );


}

Path.prototype.getTangents = function( directions ){

  var tangents = [];

  for( var i = 0; i < directions.length; i++ ){

    var dir  = directions[i].clone();
    dir.applyAxisAngle( this.upVec , -Math.PI / 2 )
    tangents.push( dir );

  }

  return tangents;

}

Path.prototype.getDirections = function( points ){

  var directions = [];

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();


  for( var i = 0; i < points.length; i++ ){

    var p = points[i];
    if( i < points.length - 1 ){

      v1.copy( points[ i + 1 ] );
      
      var dir = new THREE.Vector3();
      dir.copy( p );
      dir.sub( v1 );
      dir.normalize();
      
      directions.push( dir );

    // If we are at the end, get out direction by copying our previous direciton
    }else{

      var dir = directions[ i - 1 ]
      directions.push( dir );

    }


  }

  return directions;

}

Path.prototype.getBisectors = function( directions ){

  var bisectors = [];

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();

  for( var i = 0; i < directions.length; i++ ){

    var bi = new THREE.Vector3();

    if( i > 0 ){

      v1.copy( directions[ i - 1 ])
      v2.copy( directions[ i ] );
      bi.add( v1.normalize() );
      bi.add( v2.normalize() );
      bi.normalize();

    }else{

      bi.copy( directions[i] );

    }

    bi.applyAxisAngle( this.upVec , -Math.PI / 2 )

    bisectors.push( bi );

  }

  return bisectors

}
/*
Path.prototype.getBisectors = function( points ){

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();

  var upVec = new THREE.Vector3();

  var bisectors = [];

  for( var i = 0; i < points.length; i++ ){

    v1.copy( points[i] );
    v2.copy( points[i] );

    var p = points[i];


     
    var up = false;
    var down = false;
    if( i > 0 ){

      down = true;
      v1.copy( points[ i - 1 ] );

    }

    if( i < points.length - 1 ){

      up = true;
      v2.copy( points[ i + 1 ] );

    }


    var angle = Math.PI /2;

    upVec.set( 0 , 1 , 0 );

    var bisector = new THREE.Vector3();


    if( up == true && down == true ){

      v1.sub( p );
      v2.sub( p );

      v1.multiplyScalar( -1 );

      v1.normalize();
      v2.normalize();

      bisector.copy( v1 );
      bisector.add( v2 );
      bisector.normalize();


    }else{

      upVec.set( 0 , 1,  0 );
      
      if( up == true ){

        bisector.copy( v2 );
        bisector.sub( p );
        bisector.normalize();
        //angle = Math.PI / 2;

      }else{

        bisector.copy( v1 );
        bisector.sub( p );
        bisector.multiplyScalar( -1 );
        bisector.normalize();
        //angle = - Math.PI / 2;

      }

    }

    bisector.applyAxisAngle( upVec , Math.PI / 2 );

    bisectors.push( direction );

  }

  return bisectors;

}*/
