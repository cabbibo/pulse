function SpacePuppy( size ,  fingers , zPos ){

	this.repelers = [];
  this.gems = [];
  this.simSize = 128;

  this.puppyY = size * 1.5;
  this.puppyZ = -zPos;


  this.size = size;
  this.fingers = fingers;

  this.cube = new THREE.Mesh( 
    new THREE.BoxGeometry( size , size , size ) , 
    new THREE.MeshBasicMaterial({
      wireframe: true
    })
  );

  this.cube.visible = false;

  this.body = new THREE.Object3D();

  this.body.position.y = this.puppyY;
  this.body.position.z = this.puppyZ;

  this.body.add( this.cube );

  this.interface = this.createInterface();
  this.interface.position.z = .9;
  this.interface.rotation.x = -.5;
  this.interface.position.y = -this.puppyY / 2;
  this.body.add( this.interface )




  this.height = .1;
  this.radius = .4;
  this.innerRadius = .3;
  this.downInnerRadius = .2;

  this.crucible = this.createCrucible( 
    this.height,
    this.radius,
    this.innerRadius,
    this.downInnerRadius
  );

  this.crucible.position.y = - this.puppyY; //+ this.height/2;
  this.body.add( this.crucible )








 // this.cube.position.y = -10;


	this.uniforms = {

    cubeMatrix: { type:"m4" , value: this.cube.matrixWorld },
    mainBodyMatrix: { type:"m4" , value: this.body.matrixWorld },
    
    dT:   G.uniforms.dT,
    time: G.uniforms.time,

    t_matcap     : { type:"t"    , value: G.t.matcap       },
    t_normal     : { type:"t"    , value: G.t.normal       },
    t_audio	     : { type:"t"    , value: G.audio.texture  },
    fingers	     : { type:"v3"   , value: fingers          },

    repelers	   : { type:"v4v"  , value: this.repelers    },

    returnPower     : { type:"f" , value: 30. },
    repulsionPower  : { type:"f" , value: .06, constraints:[-300  , 0] },
    repulsionRadius : { type:"f" , value: 1.3 , constraints:[ 0  , 1000] },
    dampening       : { type:"f" , value: .6 , constraints:[ .8 , .999] },

      

  }



  for( var i = 0; i < 50; i++ ){

    var v = new THREE.Vector4();

    G.v1.x = Math.random() - .5;
    G.v1.y = Math.random() * .5 - .1;
    G.v1.z = Math.random() - .5;
    G.v1.normalize();

    G.v1.multiplyScalar( size  * 1.1);

    v.x = G.v1.x; v.y = G.v1.y; v.z = G.v1.z;

    v.w = 1;

   
    this.repelers.push( v );

  }

  this.lifeDisks = this.createLifeDisks( this.repelers );
  this.lifeLines = this.createLifeLines( this.repelers );
  this.lifeBases = this.createLifeBases( this.lifeLines.bases );

  this.body.add( this.lifeDisks )
  this.body.add( this.lifeLines )
  this.body.add( this.lifeBases )


  var xyz = [
    [  1 ,  0 ,  0 ],
    [  0 ,  1 ,  0 ],
    [  0 ,  0 ,  1 ],
    [ -1 ,  0 ,  0 ],
    [  0 , -1 ,  0 ],
    [  0 ,  0 , -1 ]
  ]

  var simSize = this.simSize;

  var st = this.repelers.length + "";
  var vs = shaders.setValue( shaders.vs.puppy , 'SIZE' , simSize );
  var ss = shaders.setValue( shaders.ss.puppy , 'SIZE' , st );
  var fs = shaders.fs.puppy; 


  for( var  i = 0; i < 6; i ++ ){

    t = new THREE.Mesh( new THREE.PlaneGeometry( size , size ,  simSize , simSize ) );
   
    var x = xyz[i][0];
    var y = xyz[i][1];
    var z = xyz[i][2];


    t.position.x = x;
    t.rotation.y = x * .5 * Math.PI;

    t.position.y = y;
    t.rotation.x = -y * .5 * Math.PI;
    
    t.position.z = z;

    if( z === -1 ){ t.rotation.y = Math.PI; t.rotation.x = 0; t.rotation.z = 0; }

   
    t.position.multiplyScalar( size * .5 ); 


    t.updateMatrix();

    var geometry = new THREE.Geometry();

    geometry.merge( t.geometry , t.matrix );
    console.log( geometry.vertices[0] )

    var gem = new GEM({

      vs: vs,
      fs: fs,
      ss: ss,

      geometry: geometry,

      soul: this.uniforms,
      body: this.uniforms,

      dT:   G.dT,
      time: G.time,

    });

    gem.soul.reset( gem.t_og.value );
    gem.toggle();

    this.gems.push( gem );

  }
	
}








SpacePuppy.prototype.update = function(){
 
  this.cube.rotation.x += .01;
  this.cube.rotation.y += .0073;
  this.cube.rotation.z += .0195;

  this.cube.rotation.x = .1;
  this.cube.rotation.y = .73;
  this.cube.rotation.z = .95;
  this.cube.updateMatrixWorld();
  this.body.updateMatrixWorld();

  for( var i = 0; i< this.repelers.length; i++ ){

    var ind = i / (2 *  this.repelers.length); 
    var fI = Math.floor( ind * G.audio.audioData.length );
    var p = G.audio.audioData[ fI ];
    this.repelers[i].w = p;
  //  this.repelers[i].xyz = 

  }

  for( var i = 0; i < this.gems.length; i++ ){
    this.gems[i].update();
  }


  for( var i = 0; i < this.interface.sliders.length; i++ ){
    this.interface.sliders[i].update();
  }
  for( var i = 0; i < this.interface.buttons.length; i++ ){
    this.interface.buttons[i].update();
  }


}


SpacePuppy.prototype.createCrucible = function( h , r , iR , iiR){

  var sides = 40;

  var totalVerts = sides * 3 * 2 * 2;

  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );
  
  var n = new THREE.Vector3();
  var n1 = new THREE.Vector3();
  var n2 = new THREE.Vector3();

  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();



  function getXYZ( id , whichRing ){

    var z = 0;
    if( whichRing == 1 ){
      z = h;
    }

    var rad = r;

    if( whichRing == 1 ){ rad = iR }
    if( whichRing == 2 ){ rad = iiR }

    var t = ( id / sides ) * 2 * Math.PI;

    var x = rad * Math.cos( t );
    var y = rad * Math.sin( t );

    return [ x , z , y ];


  }

  for( var i = 0; i< sides; i++ ){

    for( var j = 0; j < 2; j++ ){

      var index = ( i * 2 + j) * 3 * 2; 

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

      n.normalize().multiplyScalar( 1 );

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

      uvs[ index * 2 + 0  ] = i/sides;
      uvs[ index * 2 + 1  ] = j/2;

      uvs[ index * 2 + 2  ] = (i+1)/sides;
      uvs[ index * 2 + 3  ] = j/2;

      uvs[ index * 2 + 4  ] = i/sides;
      uvs[ index * 2 + 5  ] = (j+1)/2;

      uvs[ index * 2 + 6  ] = (i+1)/sides;
      uvs[ index * 2 + 7  ] = (j+1)/2;

      uvs[ index * 2 + 8  ] = i/sides;
      uvs[ index * 2 + 9  ] = (j+1)/2;

      uvs[ index * 2 + 10 ] = (i+1)/sides;
      uvs[ index * 2 + 11 ] = j/2;

    }


  }

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );

  var crucible = new THREE.Mesh( geo , new THREE.ShaderMaterial({
    uniforms:{
      lightPos: G.uniforms.lightPos,
      t_audio: G.uniforms.t_audio,
    },
    vertexShader: shaders.vs.crucible,
    fragmentShader: shaders.fs.crucible,
    side: THREE.BackSide
  }));

  return crucible;


}


SpacePuppy.prototype.createLifeDisks = function( repelers ){


  var sides = 15;
  var radius = .02;

  var p = new THREE.Vector3();
  var x = new THREE.Vector3();
  var y = new THREE.Vector3();


  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();

  var obj = new THREE.Object3D();

  var totalVerts = sides * 3 * repelers.length; 

  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );


  for( var i  = 0; i < repelers.length; i++ ){


    p.x = repelers[i].x;
    p.y = repelers[i].y;
    p.z = repelers[i].z;

    obj.position.copy( p );
    G.v1.set( 0 ,  0 , 0);
    obj.lookAt( G.v1 )

    obj.updateMatrix();

    x.set( 1 , 0 , 0 );
    x.applyQuaternion( obj.quaternion )

    y.set( 0 , 1 , 0 );
    y.applyQuaternion( obj.quaternion );

    for( var  j = 0; j < sides; j++ ){

      var index = (( i * sides ) + j ) * 3;
     
      uvs[ index * 2 + 0 ] = i;
      uvs[ index * 2 + 1 ] = 0;

      uvs[ index * 2 + 2 ] = i;
      uvs[ index * 2 + 3 ] = 1;

      uvs[ index * 2 + 4 ] = i;
      uvs[ index * 2 + 5 ] = 1;

      var t = j / sides;
      t *= Math.PI * 2;

      var tUp = (( j + 1 ) % sides ) / sides;
      tUp *= Math.PI * 2;

      G.v1.copy( p );
      G.v1.normalize();

      normals[ index * 3 + 0 ] = G.v1.x;
      normals[ index * 3 + 1 ] = G.v1.y;
      normals[ index * 3 + 2 ] = G.v1.z;

      normals[ index * 3 + 3 ] = G.v1.x;
      normals[ index * 3 + 4 ] = G.v1.y;
      normals[ index * 3 + 5 ] = G.v1.z;

      normals[ index * 3 + 6 ] = G.v1.x;
      normals[ index * 3 + 7 ] = G.v1.y;
      normals[ index * 3 + 8 ] = G.v1.z;


      p1.copy( p );

      positions[ index * 3 + 0 ] = p1.x;
      positions[ index * 3 + 1 ] = p1.y;
      positions[ index * 3 + 2 ] = p1.z;

      p2.copy( p );

      G.v1.copy( x );
      G.v1.multiplyScalar( Math.cos( t ) * radius );
      p2.add( G.v1 );

      G.v1.copy( y );
      G.v1.multiplyScalar( Math.sin( t ) * radius );
      p2.add( G.v1 );


      positions[ index * 3 + 3 ] = p2.x;
      positions[ index * 3 + 4 ] = p2.y;
      positions[ index * 3 + 5 ] = p2.z;


      p3.copy( p );

      G.v1.copy( x );
      G.v1.multiplyScalar( Math.cos( tUp ) * radius );
      p3.add( G.v1 );

      G.v1.copy( y );
      G.v1.multiplyScalar( Math.sin( tUp) * radius );
      p3.add( G.v1 );

      positions[ index * 3 + 6 ] = p3.x;
      positions[ index * 3 + 7 ] = p3.y;
      positions[ index * 3 + 8 ] = p3.z;


    }



  }

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );



  var vs = shaders.vs.lifeDisks;
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
  })

  var lifeDisks = new THREE.Mesh( geo , mat )

  return lifeDisks;


}

SpacePuppy.prototype.createLifeLines = function( repelers ){

  var outValue  = .05;
  var radiusValue = .4;
  var downValue = -this.puppyY;

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  var v4 = new THREE.Vector3();

  var totalVerts = 6 *  repelers.length; 
  var positions = new Float32Array( totalVerts * 3 );
  var uvs = new Float32Array( totalVerts * 2 );

  var p = new THREE.Vector3();

  var bases = [];

  for( var i = 0; i< repelers.length; i++ ){

    p.x =  repelers[i].x;
    p.y =  repelers[i].y;
    p.z =  repelers[i].z;

    var index = i * 6;

    uvs[ index * 2  + 0  ] = 0;
    uvs[ index * 2  + 1  ] = i;
    uvs[ index * 2  + 2  ] = 1/3;
    uvs[ index * 2  + 3  ] = i;
 
    uvs[ index * 2  + 4  ] = 1/3;
    uvs[ index * 2  + 5  ] = i;
    uvs[ index * 2  + 6  ] = 2/3;
    uvs[ index * 2  + 7  ] = i;

    uvs[ index * 2  + 8  ] = 2/3;
    uvs[ index * 2  + 9  ] = i;
    uvs[ index * 2  + 10 ] = 3/3;
    uvs[ index * 2  + 11 ] = i;


    // Line 1

    // V1
    v1.copy( p );

    // V2
    v2.copy(v1);
    G.v1.copy(v1);
    G.v1.normalize();
    G.v1.multiplyScalar( outValue )
    v2.add( G.v1 );

    //v3

    v3.copy( v2 );

    G.v1.copy( v3 );
    G.v1.y = 0;
    var l  = G.v1.length();
    var rand = radiusValue + (Math.random()) * .1
    var am = rand - l;
    G.v1.normalize();
    G.v1.multiplyScalar( am );

    v3.add( G.v1 );


    // v4
    v4.copy( v3 );
    v4.y = downValue;

    bases.push( v4.clone() );


    positions[ index * 3 + 0 ] = v1.x;
    positions[ index * 3 + 1 ] = v1.y;
    positions[ index * 3 + 2 ] = v1.z;


  
    positions[ index * 3 + 3 ] = v2.x;
    positions[ index * 3 + 4 ] = v2.y;
    positions[ index * 3 + 5 ] = v2.z;


    // Line 2

    positions[ index * 3 + 6  ] = v2.x;
    positions[ index * 3 + 7  ] = v2.y;
    positions[ index * 3 + 8  ] = v2.z;

    positions[ index * 3 + 9  ] = v3.x;
    positions[ index * 3 + 10 ] = v3.y;
    positions[ index * 3 + 11 ] = v3.z;


    // Line 3

    positions[ index * 3 + 12 ] = v3.x;
    positions[ index * 3 + 13 ] = v3.y;
    positions[ index * 3 + 14 ] = v3.z;



    positions[ index * 3 + 15 ] = v4.x;
    positions[ index * 3 + 16 ] = v4.y;
    positions[ index * 3 + 17 ] = v4.z;



  }

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );


  var lifeLines = new THREE.Line( geo , new THREE.LineBasicMaterial() , THREE.LinePieces  )
  lifeLines.bases = bases;
  return lifeLines;


}

SpacePuppy.prototype.createLifeBases = function( bases ){


  var sides = 4;
  var radius = .03;
  var height = .03;

  var p = new THREE.Vector3();

  var n = new THREE.Vector3();

  var x = new THREE.Vector3();
  var y = new THREE.Vector3();

  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();

  var obj = new THREE.Object3D();

  var totalVerts = sides * 3 * bases.length; 

  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );


  for( var i  = 0; i < bases.length; i++ ){

    p.copy( bases[i] );


   /* G.v1.set( 0 , 1 , 0 );
    x.set( p.x , 0 , p.z );
    x.normalize();

    y.crossVectors( G.v1 , x );
    y.normalize();*/


    x.set( 1 , 0 , 0 );
    y.set( 0 , 0 , 1 );




    for( var  j = 0; j < sides; j++ ){

      var index = (( i * sides ) + j ) * 3;
     
      uvs[ index * 2 + 0 ] = i;
      uvs[ index * 2 + 1 ] = 0;

      uvs[ index * 2 + 2 ] = i;
      uvs[ index * 2 + 3 ] = 1;

      uvs[ index * 2 + 4 ] = i;
      uvs[ index * 2 + 5 ] = 1;

      var t = j / sides;
      t *= Math.PI * 2;

      var tUp = (( j + 1 ) % sides ) / sides;
      tUp *= Math.PI * 2;




      G.v1.set( 0 , 1 , 0 );
      G.v1.multiplyScalar( height );
      p1.copy( p );
      p1.add( G.v1 );

      positions[ index * 3 + 0 ] = p1.x;
      positions[ index * 3 + 1 ] = p1.y;
      positions[ index * 3 + 2 ] = p1.z;

      p2.copy( p );

      G.v1.copy( x );
      G.v1.multiplyScalar( Math.cos( t ) * radius );
      p2.add( G.v1 );

      G.v1.copy( y );
      G.v1.multiplyScalar( Math.sin( t ) * radius );
      p2.add( G.v1 );


      positions[ index * 3 + 3 ] = p2.x;
      positions[ index * 3 + 4 ] = p2.y;
      positions[ index * 3 + 5 ] = p2.z;


      p3.copy( p );

      G.v1.copy( x );
      G.v1.multiplyScalar( Math.cos( tUp ) * radius );
      p3.add( G.v1 );

      G.v1.copy( y );
      G.v1.multiplyScalar( Math.sin( tUp) * radius );
      p3.add( G.v1 );

      positions[ index * 3 + 6 ] = p3.x;
      positions[ index * 3 + 7 ] = p3.y;
      positions[ index * 3 + 8 ] = p3.z;




      G.v1.copy( p1 );
      G.v1.sub( p2 );
      G.v2.copy( p1 );
      G.v2.sub( p3 );

      n.crossVectors( G.v1 , G.v2 );
      n.normalize();
      n.multiplyScalar( -1 );


      normals[ index * 3 + 0 ] = n.x;
      normals[ index * 3 + 1 ] = n.y;
      normals[ index * 3 + 2 ] = n.z;

      normals[ index * 3 + 3 ] = n.x;
      normals[ index * 3 + 4 ] = n.y;
      normals[ index * 3 + 5 ] = n.z;

      normals[ index * 3 + 6 ] = n.x;
      normals[ index * 3 + 7 ] = n.y;
      normals[ index * 3 + 8 ] = n.z;



    }



  }

  var geo = new THREE.BufferGeometry();

  var pos = new THREE.BufferAttribute( positions , 3 );
  var uv  = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );


  var vs = shaders.vs.lifeBases;
  var fs = shaders.setValue( shaders.fs.lifeBases , 'NUMDISKS' , bases.length )

  console.log( fs )
  var mat = new THREE.ShaderMaterial({
    uniforms:{
      t_audio: G.uniforms.t_audio
    },
    vertexShader: vs,
    fragmentShader: fs,
    side: THREE.BackSide,
    //transparent: true,
  })
  //var mat = new THREE.MeshNormalMaterial({ side: THREE.BackSide });
  var lifeBases = new THREE.Mesh( geo , mat )

  return lifeBases;


}

SpacePuppy.prototype.createInterface = function(){

  var interface = new THREE.Object3D();

  interface.buttons = [];
  interface.sliders = [];

  var indexFingers = [
    this.fingers[1],
    this.fingers[5]
  ];

  for( var  i = 0; i < 6; i++ ){

    var body = new THREE.Object3D();
    body.position.y =  .06  * Math.floor( i / 3 );
    body.position.x =  .06  * ( i % 3) ;

    var button = new ToggleButton( .05 , indexFingers , body , .01 );

    var string = 'toggle' + ( i + 1 )
    var u = G.uniforms[ string ];
    button.linkUniform( u );

    interface.add( button.body );
    interface.buttons.push( button);

  }

  for( var  i = 0; i < 3; i++ ){

    var body = new THREE.Object3D();
    body.position.x =  .06 * 3 + i * .03;
    body.position.y = .03;

    var slider = new Slider( .1 , indexFingers , body , .01 );

    var string = 'slider' + ( i+ 1 )
    var u = G.uniforms[ string ];
    slider.linkUniform( u );
 
    interface.add( slider.body )
    interface.sliders.push( slider );
   

  }

  return interface;

}







