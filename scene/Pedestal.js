function Pedestal(){

  var geo = this.createGeometry();
  var mat = new THREE.ShaderMaterial({
    uniforms: G.uniforms,
    vertexShader: shaders.vs.pedestal,
    fragmentShader: shaders.fs.pedestal,
  });

  this.body = new THREE.Mesh( geo , mat );

 
}

Pedestal.prototype.prepare = function(){

  this.prepared = true;


  var body = new THREE.Object3D();
  body.position.y =  .04
  body.position.x =  .0
  body.rotation.x = -Math.PI / 2;

  var button = new ToggleButton( .1 , [
    G.fingers.tips[1],
    G.fingers.tips[6],
  ] , body , .006 );


  button.toggle = function(){ 
    pulse.enlighten();
  }.bind( this );

  button.unToggle = function(){ 
    pulse.unenlighten(); 
  }.bind( this );

  var string = 'cityButton'
  var u = G.uniforms[ string ];
  button.linkUniform( u );
  this.button = button; 
  this.body.add( this.button.body );

}

Pedestal.prototype.update = function(){

  if( this.button ){
    this.button.update();
  }

}

Pedestal.prototype.createGeometry = function(){

  var height = 1;
  var numCrystals = 50;
  var baseVerts = 6 * (3 * 2);
  var headVerts = 6 * 3;
  var vertsPerCrystal = ( baseVerts + headVerts );
  var totalVerts = vertsPerCrystal  * numCrystals;

  // Get base position in shader by looking up into 
  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );
  var ids       = new Float32Array( totalVerts     );

  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();

  var u1 = new THREE.Vector2();
  var u2 = new THREE.Vector2();
  var u3 = new THREE.Vector2();
  var u4 = new THREE.Vector2();

  var basePos = new THREE.Vector3();
  var height = 0;
  var baseRad = 0; 
  var r = .2;
  var t = 0;
  var tU = 0;

  for( var  i = 0; i < numCrystals; i++ ){

    height = Math.random() * .75 + .2; 

    r = .1 + Math.random() *  .1 / height;
    baseRad = r - .1;

    t = Math.random() * 2 * Math.PI;

    if( i == 0 ){
      height = 1;
      r = 0;
      baseRad = .1;
    }

    basePos.x = Math.sin( t ) * r ;
    basePos.z = Math.cos( t ) * r ;
    basePos.y = -1 + height;

    var baseIndex = i * vertsPerCrystal;

    for( var j = 0; j < 6; j++ ){

      var index = baseIndex + ((3 * 2)+3) * j;

      r = baseRad;
      t = (j / 6) * 2 * Math.PI; 
      tU = (((j+1)%6) / 6) * 2 * Math.PI; 

      p1.x = Math.sin( t ) * r ;
      p1.z = Math.cos( t ) * r ; 
      p1.y = 0;

      p2.x = Math.sin( tU ) * r ;
      p2.z = Math.cos( tU ) * r ; 
      p2.y = 0;

      p3.x = Math.sin( t ) * r ;
      p3.z = Math.cos( t ) * r ; 
      p3.y = -height;

      p4.x = Math.sin( tU ) * r ;
      p4.z = Math.cos( tU ) * r ; 
      p4.y = -height;

      p1.add( basePos );
      p2.add( basePos );
      p3.add( basePos );
      p4.add( basePos );

      u1.set( j / 6 ,  1 );
      u2.set( (((j+1)%6) / 6) , 1 );

      u3.set( j / 6 , 1 );
      u4.set( (((j+1)%6) / 6) , 1 );


      G.setQuadValue3( positions , index , p1 , p2 , p3 , p4 );
      G.setQuadNormals( normals , index , p1 , p2 , p3 , p4 );
      G.setQuadValue2( uvs , index , u1 , u2 , u3 , u4 );
      G.setQuadValue1( ids , index , i , i , i , i );


      index += 3 * 2 

      p1.x = Math.sin( t ) * r ;
      p1.z = Math.cos( t ) * r ; 
      p1.y = 0;

      p3.x = Math.sin( tU ) * r ;
      p3.z = Math.cos( tU ) * r ; 
      p3.y = 0;

      p2.x = 0;
      p2.z = 0; 
      p2.y = 0;

      p1.add( basePos );
      p2.add( basePos );
      p3.add( basePos );

      u1.set( j / 6 , 1 );
      u2.set( (((j+1)%6) / 6) , 1 );
      u3.set( (j+.5) / 6 , 0 );

      G.setTriValue3( positions , index , p1 , p2 , p3  );
      G.setTriNormal( normals , index , p1 , p2 , p3 );
      G.setTriValue2( uvs , index , u1 , u2 , u3  );
      G.setTriValue1( ids , index , i , i , i );

    }

  }

  var geo = new THREE.BufferGeometry();

  var pos     = new THREE.BufferAttribute( positions , 3 );
  var uv      = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );
  var id      = new THREE.BufferAttribute( ids , 1 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );
  geo.addAttribute( 'id' , id);

  return geo;

}