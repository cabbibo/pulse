function Cliff( size ){
  
  var sides = 90;
  var radius = .02;

  var p = new THREE.Vector3();
  var x = new THREE.Vector3();
  var y = new THREE.Vector3();
  var n = new THREE.Vector3();

  var n1 = new THREE.Vector3();
  var n2 = new THREE.Vector3();


  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();

  var obj = new THREE.Object3D();

  // Gets all our triangles for top
  var totalVerts = (sides) * 3 * 3; 

  totalVerts += 3;



  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );

  function getXY( id ){

    var x = id / 4;
    var y = -( id * id ) / 50 + 2;



    var n = noise.perlin2( x , y  );

    var xU = (id+.1) / 4;
    var yU = -( (id+.1) * (id+.1) ) / 50 + 2;

    var v = new THREE.Vector2( x , y );
    var v2 = new THREE.Vector2( xU , yU );

    v.sub( v2 );

    var nor = new THREE.Vector3( v.x , 0 , v.y );
    nor.normalize();
    nor.applyAxisAngle( new THREE.Vector3( 0 , 1 , 0 ), -Math.PI / 2 );
  
    var multiplier = Math.max( -1. , (1/(y-3)) * 4.);
    var multiplier = -1;//Math.max( -1. , (1/(y-3)) * 4.);
    x += nor.x * n * multiplier;
    y += nor.z * n * multiplier;

    return [ x , y ];
  }


  for( var i = 0; i < sides; i++ ){

    var id = (i - sides / 2);
    var idUp = ((i+1) - sides / 2);

    var xy = getXY( id );
    var xyUp = getXY( idUp ); 


    var m = .9 + Math.abs(( id / (sides/2))) * .1;
    var mU = .9 + Math.abs(( idUp / (sides/2) )) * .1;
    p1.set( xy[0] , 0 , xy[1] );
    p2.set( xy[0] * m , -1 , xy[1] * m );
    p3.set( xyUp[0] , 0 , xyUp[1] );
    p4.set( xyUp[0] * mU , -1 , xyUp[1] *  mU );


    var index = i * 3 * 3;



    positions[ index * 3 + 0 ] = p1.x;
    positions[ index * 3 + 1 ] = p1.y;
    positions[ index * 3 + 2 ] = p1.z;

    positions[ index * 3 + 3 ] = p3.x;
    positions[ index * 3 + 4 ] = p3.y;
    positions[ index * 3 + 5 ] = p3.z;

    positions[ index * 3 + 6 ] = 0;
    positions[ index * 3 + 7 ] = 0;
    positions[ index * 3 + 8 ] = 0;



    // Cliff Side
    positions[ index * 3 + 9 ] = p1.x;
    positions[ index * 3 + 10 ] = p1.y;
    positions[ index * 3 + 11 ] = p1.z;

    positions[ index * 3 + 12 ] = p2.x;
    positions[ index * 3 + 13 ] = p2.y;
    positions[ index * 3 + 14 ] = p2.z;

    positions[ index * 3 + 15 ] = p3.x;
    positions[ index * 3 + 16 ] = p3.y;
    positions[ index * 3 + 17 ] = p3.z;

    positions[ index * 3 + 18 ] = p4.x;
    positions[ index * 3 + 19 ] = p4.y;
    positions[ index * 3 + 20 ] = p4.z;

    positions[ index * 3 + 21 ] = p3.x;
    positions[ index * 3 + 22 ] = p3.y;
    positions[ index * 3 + 23 ] = p3.z;

    positions[ index * 3 + 24 ] = p2.x;
    positions[ index * 3 + 25 ] = p2.y;
    positions[ index * 3 + 26 ] = p2.z;



    // Top one is up 
    normals[ index * 3 + 0 ] = 0;
    normals[ index * 3 + 1 ] = 1;
    normals[ index * 3 + 2 ] = 0;

    normals[ index * 3 + 3 ] = 0;
    normals[ index * 3 + 4 ] = 1;
    normals[ index * 3 + 5 ] = 0;

    normals[ index * 3 + 6 ] = 0;
    normals[ index * 3 + 7 ] = 1;
    normals[ index * 3 + 8 ] = 0;

    n1.copy( p1 );
    n1.sub( p2 );

    n2.copy( p1 );
    n2.sub( p3 );

    n2.normalize();
    n1.normalize();

    n.crossVectors( n1 , n2 );

    n.normalize();

        // Cliff Side
    normals[ index * 3 + 9 ]  = n.x;
    normals[ index * 3 + 10 ] = n.y;
    normals[ index * 3 + 11 ] = n.z;
    normals[ index * 3 + 12 ] = n.x;
    normals[ index * 3 + 13 ] = n.y;
    normals[ index * 3 + 14 ] = n.z;
    normals[ index * 3 + 15 ] = n.x;
    normals[ index * 3 + 16 ] = n.y;
    normals[ index * 3 + 17 ] = n.z;
    normals[ index * 3 + 18 ] = n.x;
    normals[ index * 3 + 19 ] = n.y;
    normals[ index * 3 + 20 ] = n.z;
    normals[ index * 3 + 21 ] = n.x;
    normals[ index * 3 + 22 ] = n.y;
    normals[ index * 3 + 23 ] = n.z;
    normals[ index * 3 + 24 ] = n.x;
    normals[ index * 3 + 25 ] = n.y;
    normals[ index * 3 + 26 ] = n.z;



  }

  // connection Triangle 
  var index = sides * 3 * 3;

  var id = (0 - sides / 2);
  var idUp = (sides - sides / 2);

  var xy = getXY( id );
  var xyUp = getXY( idUp ); 

  positions[ index * 3 + 0 ] = xy[0];
  positions[ index * 3 + 1 ] = 0;
  positions[ index * 3 + 2 ] = xy[1];

  positions[ index * 3 + 3 ] = 0;
  positions[ index * 3 + 4 ] = 0;
  positions[ index * 3 + 5 ] = 0;

  positions[ index * 3 + 6 ] = xyUp[0];
  positions[ index * 3 + 7 ] = 0;
  positions[ index * 3 + 8 ] = xyUp[1];

  normals[ index * 3 + 0 ] = 0;
  normals[ index * 3 + 1 ] = 1;
  normals[ index * 3 + 2 ] = 0;

  normals[ index * 3 + 3 ] = 0;
  normals[ index * 3 + 4 ] = 1;
  normals[ index * 3 + 5 ] = 0;

  normals[ index * 3 + 6 ] = 0;
  normals[ index * 3 + 7 ] = 1;
  normals[ index * 3 + 8 ] = 0;




 

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );



  var mat = new THREE.ShaderMaterial({
    uniforms:{
      rainbow      : G.uniforms.rainbow,
      lightPos     : G.uniforms.lightPos,


      t_matcap     : { type:"t"    , value: G.t.matcap       },
      t_normal     : { type:"t"    , value: G.t.normal       },
      t_audio      : { type:"t"    , value: G.audio.texture  },

    },
    vertexShader: shaders.vs.cliff,
    fragmentShader: shaders.fs.cliff,
  });



  var cliff = new THREE.Mesh( geo , mat )

  return cliff;


}