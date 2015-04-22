function Path( points , numWires , baseID ){

  this.points = points;
  this.numWires = numWires;
  this.baseID = baseID;

  this.directions = this.getDirections( this.points );


}


Path.prototype.getDirections = function( points ){

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();

  var upVec = new THREE.Vector3();

  var directions = [];

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

    var direction = new THREE.Vector3();


    if( up == true && down == true ){

      v1.sub( p );
      v2.sub( p );

      v1.multiplyScalar( -1 );

      v1.normalize();
      v2.normalize();

      direction.copy( v1 );
      direction.add( v2 );
      direction.normalize();


    }else{

      upVec.set( 0 , 1,  0 );
      
      if( up == true ){

        direction.copy( v2 );
        angle = Math.PI / 2;

      }else{

        direction.copy( v1 );
        direction.multiplyScalar( -1 );
        angle = - Math.PI / 2;

      }

    }

    direction.applyAxisAngle( upVec , Math.PI / 2 );

    directions.push( direction );

  }


  return directions;


}
