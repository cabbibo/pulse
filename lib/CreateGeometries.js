 function createParticleGeometry( size ){

  var s2 = size * size;
  var geo = new THREE.BufferGeometry();

  var aPos= new THREE.BufferAttribute( new Float32Array( s2 * 3 ), 3 );
  geo.addAttribute( 'position', aPos );
 
  var positions = geo.attributes.position.array;

  for( var i = 0; i < size; i++ ){

    for( var j = 0; j < size; j++ ){

      var index = (( i * size ) + j ) * 3;

      positions[ index + 0 ] = i / size;
      positions[ index + 1 ] = j / size;

    }

  }

  return geo;

}

function createLineGeometry( size , depth ){

  var s2 = size * size;
  var geo = new THREE.BufferGeometry();

  var aPos= new THREE.BufferAttribute( new Float32Array( s2 * 2 * (depth-1) * 3 ), 3 );
  geo.addAttribute( 'position', aPos );
 
  var positions = geo.attributes.position.array;

  for( var i = 0; i < size; i++ ){

    for( var j = 0; j < size; j++ ){

      for( var k = 0; k < depth-1; k++ ){ 
       
        var index = (( i * size*(depth-1) ) + j*(depth-1)  ) * 2  * 3;

        index += k * 2 * 3;
        //console.log( k+1 );

        positions[ index + 0 ] = i / size;
        positions[ index + 1 ] = j / size;
        positions[ index + 2 ] = k;

        positions[ index + 3 ] = i / size;
        positions[ index + 4 ] = j / size;
        positions[ index + 5 ] = k+1;

        //console.log( positions[ index + 0] );
      }

    }

  }

  return geo;

}


// Don't need UV because can use info to easily calculate
function createRibbonGeometry( size , depth ){

  var s2 = size * size;
  var geo = new THREE.BufferGeometry();

  var totalVerts =  s2 * 2 * (depth-1) * 6;
  console.log( 'Total Verts: ' + totalVerts );
  var aPos  = new THREE.BufferAttribute( new Float32Array( totalVerts * 3 ), 3 );
  var aUV   = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
  //var aInfo = new THREE.BufferAttribute( new Float32Array( totalVerts * 2 ), 2 );
 
  geo.addAttribute( 'position', aPos );
  geo.addAttribute( 'uv', aUV );
  //geo.addAttribute( 'info', aInfo );
 
  var positions = geo.attributes.position.array;
  var uvs       = geo.attributes.uv.array;
  //var info      = geo.attributes.info.array;


  //
  for( var i = 0; i < size; i++ ){
    for( var j = 0; j < size; j++ ){

      for( var k = 0; k < depth-1; k++ ){

        var whichRibbon = (( i * size ) + j );
        var index = (( i * size ) + j ) * ( depth - 1);;

        index += k;

        var vertIndex = index * 6;

        var pIndex = vertIndex * 3;
        var iIndex = vertIndex * 2;
        //console.log( k+1 );

        var newK = k + .5;

        // TRIANGLE 1

        positions[ pIndex + 0   ] = i / size;
        positions[ pIndex + 1   ] = j / size;
        positions[ pIndex + 2   ] = whichRibbon;

        uvs[ iIndex + 0 ]        = newK/(depth+1); 
        uvs[ iIndex + 1 ]        = 1;

        positions[ pIndex + 3   ] = i / size;
        positions[ pIndex + 4   ] = j / size;
        positions[ pIndex + 5   ] = whichRibbon;

        uvs[ iIndex + 2 ]        = newK/(depth+1); 
        uvs[ iIndex + 3 ]        = -1;


        positions[ pIndex + 6   ] = i / size;
        positions[ pIndex + 7   ] = j / size;
        positions[ pIndex + 8   ] = whichRibbon;

        uvs[ iIndex + 4 ]        = (newK+1)/(depth+1); 
        uvs[ iIndex + 5 ]        = 1;

         // TRIANGLE 2

        positions[ pIndex + 9   ] = i / size;
        positions[ pIndex + 10  ] = j / size;
        positions[ pIndex + 11  ] = whichRibbon;
  
        uvs[ iIndex + 6 ]        = (newK+1)/(depth+1); 
        uvs[ iIndex + 7 ]        = 1;

        positions[ pIndex + 12  ] = i / size;
        positions[ pIndex + 13  ] = j / size;
        positions[ pIndex + 14  ] =whichRibbon;

        uvs[ iIndex + 8 ]        = newK/(depth+1); 
        uvs[ iIndex + 9 ]        = -1;

        positions[ pIndex + 15  ] = i / size;
        positions[ pIndex + 16  ] = j / size;
        positions[ pIndex + 17  ] = whichRibbon;

        uvs[ iIndex + 10 ]       = (newK+1)/(depth+1); 
        uvs[ iIndex + 11 ]       = -1;

      }

    }

  }

  return geo;

}
