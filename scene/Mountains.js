function Mountains(){
  
  
  var sides = 80;
  var radius = .02;

  var n = new THREE.Vector3();
  var n1 = new THREE.Vector3();
  var n2 = new THREE.Vector3();


  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();

  var obj = new THREE.Object3D();

  // Gets all our triangles for top
  var totalVerts = ( sides * sides ) * 3 * 2; 




  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );

  var curve = .3;
  function getXYZ( id1 , id2  ){

    var t = id1 / sides;
    t *= Math.PI * 2;
    t *= curve;
    t -= (.25 + curve/ 2)  * Math.PI * 2;

    var xDir = Math.cos( t );
    var zDir = Math.sin( t );

    var x = xDir * (id2 * .5 + 10);
    var z = zDir * (id2 * .5 + 10);

    var y = noise.perlin2( x , z );

    var yMultiplier = ( .25 - (Math.abs(id1 - (sides / 2 ))/ sides/2)) * (.5 - Math.abs(((id2 / sides) - .5)));
    yMultiplier *= 40;



    return [ x ,  (y+1) * yMultiplier, z ];
  }


  for( var i = 0; i < sides; i++ ){
    for( var j = 0; j < sides; j++ ){


    var index = (i * sides + j) * 3 * 2;

    var xyz = getXYZ( i , j );
    p1.set( xyz[0] , xyz[1] , xyz[2] )

    var xyz = getXYZ( i+1 , j );
    p2.set( xyz[0] , xyz[1] , xyz[2] )

    var xyz = getXYZ( i , j+1 );
    p3.set( xyz[0] , xyz[1] , xyz[2] )

    var xyz = getXYZ( i+1 , j+1 );
    p4.set( xyz[0] , xyz[1] , xyz[2] )

    // Cliff Side
    positions[ index * 3 + 0  ] = p1.x;
    positions[ index * 3 + 1  ] = p1.y;
    positions[ index * 3 + 2  ] = p1.z;

    positions[ index * 3 + 3  ] = p2.x;
    positions[ index * 3 + 4  ] = p2.y;
    positions[ index * 3 + 5  ] = p2.z;

    positions[ index * 3 + 6  ] = p3.x;
    positions[ index * 3 + 7  ] = p3.y;
    positions[ index * 3 + 8  ] = p3.z;


    positions[ index * 3 + 9  ] = p4.x;
    positions[ index * 3 + 10 ] = p4.y;
    positions[ index * 3 + 11 ] = p4.z;
    
    positions[ index * 3 + 12 ] = p3.x;
    positions[ index * 3 + 13 ] = p3.y;
    positions[ index * 3 + 14 ] = p3.z;


    positions[ index * 3 + 15 ] = p2.x;
    positions[ index * 3 + 16 ] = p2.y;
    positions[ index * 3 + 17 ] = p2.z;




    n1.copy( p1 );
    n1.sub( p2 );

    n2.copy( p1 );
    n2.sub( p3 );

    n2.normalize();
    n1.normalize();

    n.crossVectors( n1 , n2 );

    n.normalize();

        // Cliff Side
    normals[ index * 3 + 0  ]  = n.x;
    normals[ index * 3 + 1  ] = n.y;
    normals[ index * 3 + 2  ] = n.z;

    normals[ index * 3 + 3  ] = n.x;
    normals[ index * 3 + 4  ] = n.y;
    normals[ index * 3 + 5  ] = n.z;

    normals[ index * 3 + 6  ] = n.x;
    normals[ index * 3 + 7  ] = n.y;
    normals[ index * 3 + 8  ] = n.z;


    n1.copy( p4 );
    n1.sub( p2 );

    n2.copy( p4 );
    n2.sub( p3 );

    n2.normalize();
    n1.normalize();

    n.crossVectors( n1 , n2 );

    n.normalize().multiplyScalar( -1 );


    normals[ index * 3 + 9 ] = n.x;
    normals[ index * 3 + 10 ] = n.y;
    normals[ index * 3 + 11 ] = n.z;

    normals[ index * 3 + 12 ] = n.x;
    normals[ index * 3 + 13 ] = n.y;
    normals[ index * 3 + 14 ] = n.z;

    normals[ index * 3 + 15 ] = n.x;
    normals[ index * 3 + 16 ] = n.y;
    normals[ index * 3 + 17 ] = n.z;

    }

  }





 

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );



 /* var vs = shaders.vs.lifeDisks;
  var fs = shaders.setValue( shaders.fs.lifeDisks , 'NUMDISKS' , repelers.length )

  console.log( fs )
  var mat = new THREE.ShaderMaterial({
    uniforms:{
      t_audio: G.uniforms.t_audio
    },
    vertexShader: vs,
    fragmentShader: fs,
    side: THREE.DoubleSide,
    transparent: true
  })*/

  var mat = new THREE.MeshPhongMaterial(0xfffffff)
  var lifeDisks = new THREE.Mesh( geo , mat )

  return lifeDisks;


}