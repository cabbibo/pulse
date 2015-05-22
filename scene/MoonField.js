function MoonField(puppyPos){
  
  this.body = new THREE.Object3D();

  this.depth = 64;
  this.joints = 8;
  this.jointSize = this.depth / this.joints;
  this.size = 128;
  var ss = shaders.ss.moonBeams;

  this.puppyPos = puppyPos;

  this.jointArray = [];

  this.t_monk = { type:"t" , value: null }
  this.monks = this.createMonks();
  this.t_monk.value= this.monks.texture;

  this.ringRadius = { type:"f" , value: .05 }

  this.body.add( this.monks.body );

  for( var i = 0; i< this.monks.markers.length; i++ ){
    this.body.add( this.monks.markers[i] );
  }

  this.soul = new PhysicsArrayRenderer( this.size , this.depth , ss , renderer );

  this.soul.setUniform( 'dT'   , G.dT    );
  this.soul.setUniform( 'time' , G.time  );
  this.soul.setUniform( 't_audio' , G.uniforms.t_audio );
  this.soul.setUniform( 'puppyPos' , { type:"f", value:puppyPos })
  this.soul.setUniform( 't_monk' , this.t_monk )
  this.soul.setUniform( 'ringRadius' , this.ringRadius )
  
  this.resetSoul();

  for( var i = 0; i < this.joints; i++ ){

    this.jointArray.push( this.soul.rt[i] );

  }

  this.particleGeo = createParticleGeometry( this.size );

  var vs = shaders.setValue( shaders.vs.moonBeams , 'DEPTH' , this.joints )
  this.particleMat = new THREE.ShaderMaterial({
    uniforms:{
      t_sprite: { type:"t" , value: G.t.sprite },
      t_posArray: { type:"tv" , value: this.jointArray },
      t_monk: this.t_monk,
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeams,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.particles = new THREE.PointCloud( this.particleGeo , this.particleMat );
  this.particles.frustumCulled = false;
  this.body.add( this.particles )


  this.lineGeo = createLineGeometry( this.size , this.joints );

  var vs = shaders.setValue( shaders.vs.moonBeamLines , 'DEPTH' , this.joints )
  this.lineMat = new THREE.ShaderMaterial({
    uniforms:{
      t_sprite: { type:"t" , value: G.t.sprite },
      t_posArray: { type:"tv" , value: this.jointArray },
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeamLines,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.lines = new THREE.Line( this.lineGeo , this.lineMat , THREE.LinePieces );
  this.lines.frustumCulled = false;
  this.body.add( this.lines )
}

MoonField.prototype.update = function(){

 this.soul.update();


  for( var i =0; i< this.joints; i++ ){
    this.jointArray[i] = this.soul.output[i * this.jointSize];
  }



}


MoonField.prototype.toggleAllMonks = function(){

  for( var i = 0; i < this.monks.positions.length; i++ ){

    this.toggleMonk( i );
  }

}


MoonField.prototype.toggleMonk = function(id){

  var index = id * 4;
  var value = this.monks.texture.image.data[ index + 3 ] ;
  this.monks.texture.image.data[ index + 3 ] = Math.abs( value - 1 );


  this.monks.texture.needsUpdate = true;


}

MoonField.prototype.createMonks = function(){

  var data = new Float32Array( this.size * 4 );

  var monks = {};

  monks.positions = [];
  // TODO: this *needs* to be 1 geo
  monks.markers = [];


  var geo = new THREE.CylinderGeometry( 0 , 0.2 , .4 , 3 , 1 );
  var mat = new THREE.MeshNormalMaterial();

  for( var  i = 0; i < this.size; i++ ){

    var base = i ;
   
    var uv = {};
   
    uv.y = Math.floor( base / this.size ) / this.size;
    uv.x = (base/this.size - Math.floor( base / this.size ));

    var x = 0;
    var y = 0;
    var z = 0;

    x += ((i /this.size - .5 ) * 20.)  * Math.random();
    z -= -1. + ( Math.pow( (i/this.size)-.5 , 2.) + .04) * 120. ;

    var a = 1;
    data[ i * 4 + 0 ] = x;
    data[ i * 4 + 1 ] = 0;
    data[ i * 4 + 2 ] = z;
    data[ i * 4 + 3 ] = a;

    var position =new THREE.Vector3( x , y , z )

   /* var marker = new THREE.Mesh( geo , mat );
    marker.position.copy( position );
    G.v1.set( 0 , .2 , 0 );
    marker.position.add( G.v1 )
    G.v1.set( 0 , 0 , -this.puppyPos );
    marker.lookAt( G.v1 )*/
    
    monks.positions.push( position );
    //monks.markers.push(  marker );
    //x = 

  }


  var texture = new THREE.DataTexture( 
    data,
    this.size,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );


  texture.needsUpdate = true;

  monks.texture = texture;


  monks.body = this.createMonkBody();

  return monks;


}



MoonField.prototype.resetSoul = function(){

  var s2 = this.size * this.size;
  var data = new Float32Array( s2 * 4 );


  for( var i =0; i < data.length; i+=4 ){

    var base = i / 4;
   
    var uv = {};
   
    uv.y = Math.floor( base / this.size ) / this.size;
    uv.x = (base/this.size - Math.floor( base / this.size ));

    var id = uv.x * this.size;

    var pos = this.monks.positions[ id ];
 
    var t = uv.y * 2 * Math.PI;


    data[ i + 0 ] = pos.x + Math.cos( t ) * this.ringRadius.value;
    data[ i + 1 ] = pos.y;
    data[ i + 2 ] = pos.z + Math.sin( t ) * this.ringRadius.value;
    data[ i + 3 ] = 1;


  }

  var texture = new THREE.DataTexture( 
    data,
    this.size,
    this.size,
    THREE.RGBAFormat,
    THREE.FloatType
  );

  texture.minFilter =  THREE.NearestFilter,
  texture.magFilter = THREE.NearestFilter,

  texture.needsUpdate = true;

  this.soul.reset( texture );
    //x = 

}

MoonField.prototype.createMonkGeo = function(){

  var sides = 10
  var baseVerts = sides * (( 3 * 2 * 3 ) + 3);
  var headVerts = 3 * 2 * 2;
  var vertsPerMonk = ( baseVerts + headVerts );
  var totalVerts = vertsPerMonk * this.size;

  var height = 1;
  var baseRadius = .5;

  // Get base position in shader by looking up into 
  var positions = new Float32Array( totalVerts * 3 );
  var uvs       = new Float32Array( totalVerts * 2 );
  var normals   = new Float32Array( totalVerts * 3 );
  var lookAts   = new Float32Array( totalVerts     );
  var ids       = new Float32Array( totalVerts     );

  var p1 = new THREE.Vector3();
  var p2 = new THREE.Vector3();
  var p3 = new THREE.Vector3();
  var p4 = new THREE.Vector3();

  var u1 = new THREE.Vector2();
  var u2 = new THREE.Vector2();
  var u3 = new THREE.Vector2();
  var u4 = new THREE.Vector2();

  // Base Position
  var bp = new THREE.Vector3();


  console.log( 'TOTAL VERTS  : '+ totalVerts)

  for( var i = 0; i < this.size; i++){


    var monkBaseIndex = vertsPerMonk * i;

    var id = i / this.size;

    //First off create base
    for( var j = 0; j < sides; j++ ){

      // QUADS
      for( var k = 0; k < 3; k++ ){

        var v = ((4-k) / 4);
        var vU = ((4-(k+1)) / 4);
        var r = baseRadius * Math.sqrt(v);
        var rU = baseRadius * Math.sqrt(vU);
        var t = ( j / sides) * 2 * Math.PI;
        var tU = ( ((j+1)%sides) / sides) * 2 * Math.PI;

        var h = Math.sqrt( k / 4) * height;
        var hU = Math.sqrt( (k+1) / 4) * height;

        p1.x = r * Math.cos( t );
        p1.y = h;
        p1.z = r * Math.sin( t );

        p2.x = r * Math.cos( tU );
        p2.y = h;
        p2.z = r * Math.sin( tU );

        p3.x = rU * Math.cos( t );
        p3.y = hU;
        p3.z = rU * Math.sin( t );

        p4.x = rU * Math.cos( tU );
        p4.y = hU;
        p4.z = rU * Math.sin( tU );

        u1.x = j / sides;
        u2.x = ((j+1) / sides);
        u3.x = j / sides;
        u4.x =  ((j+1) / sides);

        u1.y = v;
        u2.y = v;
        u3.y = vU;
        u4.y = vU;
                // monk id        // Side id               // slice id
        index = monkBaseIndex + ( j * (( 3* 2*3) + 3) ) + ( k * 3 * 2)

        this.setQuadPositions( positions , index , p1 , p2 , p3 , p4 );
        this.setQuadNormals( normals , index , p1 , p2 , p3 , p4 );
        this.setQuadUVs( uvs , index , u1 , u2 , u3 , u4 )

        this.setTriValue1( lookAts , index     , 0 , 0 , 0 );
        this.setTriValue1( lookAts , index + 3 , 0 , 0 , 0 );

        this.setTriValue1( ids , index     , id , id , id );
        this.setTriValue1( ids , index + 3 , id , id , id );


      }

      var v = (1 / 4);
      var r = baseRadius * Math.sqrt( v );
      var t = ( j / sides) * 2 * Math.PI;
      var tU = ( ((j+1)%sides) / sides) * 2 * Math.PI;
      var h = Math.sqrt( 3/4 )*height;

      p1.x = r * Math.cos( t );
      p1.y = h;
      p1.z = r * Math.sin( t );

      p2.x = r * Math.cos( tU );
      p2.y = h;
      p2.z = r * Math.sin( tU );

      p3.x = 0;
      p3.y = height;
      p3.z = 0;

      u1.x = j / sides;
      u2.x = (( j+1 )) / sides
      u3.x = (( j+1. )) / sides

      u1.y = 1/4;
      u2.y = 0;
      u3.y = 0;


      // TIP

      // monk id        // Side id             // slice id
      index = monkBaseIndex + ( j * (( 3* 2*3) + 3) ) + ( 3 * 3 * 2)

      this.setTriValue3( positions , index , p1 , p2 , p3 );
      this.setTriNormal( normals   , index , p1 , p2 , p3 );
      
      this.setTriValue2( uvs , index , u1 , u2 , u3 );

      this.setTriValue1( ids ,  index , id , id , id );
      this.setTriValue1( lookAts ,  index  , 0 , 0 , 0  );

      


    }



    //Second off create head

             // monk id       // Side id       
    index = monkBaseIndex + baseVerts;


    p1.x = -.2;  p1.y = -.35;  p1.z = .2;
    p2.x =  .2;  p2.y = -.35;  p2.z = .2;
    p3.x = -.2;  p3.y =  .35;  p3.z = .2;
    p4.x =  .2;  p4.y =  .35;  p4.z = .2;

    u1.x = 0; u1.y = 0;
    u2.x = 1; u2.y = 0;
    u3.x = 0; u3.y = 1;
    u4.x = 1; u4.y = 1;

    this.setQuadPositions( positions , index , p1 , p2 , p3 , p4 )
    this.setQuadNormals( normals , index , p1 , p2 , p3 , p4 )
    this.setQuadUVs( uvs , index , u1 , u2 , u3 , u4 )

    this.setTriValue1( lookAts , index      , 1 , 1 , 1 );
    this.setTriValue1( lookAts , index + 3  , 1 , 1 , 1 );

    this.setTriValue1( ids , index      , id , id , id ); 
    this.setTriValue1( ids , index + 3  , id , id , id );

    // Create an extra back face
    this.setQuadPositions( positions , index + 6 , p4 , p2 , p3 , p1 )
    this.setQuadNormals( normals , index+ 6 , p1 , p2 , p3 , p4 )
    this.setQuadUVs( uvs , index , u4 , u2 , u3 , u1 )

    this.setTriValue1( lookAts , index + 6     , 1 , 1 , 1 );
    this.setTriValue1( lookAts , index + 6 + 3  , 1 , 1 , 1 );

    this.setTriValue1( ids , index + 6    , id , id , id ); 
    this.setTriValue1( ids , index + 6 + 3  , id , id , id );

  }



  var geo = new THREE.BufferGeometry();

  var pos     = new THREE.BufferAttribute( positions , 3 );
  var uv      = new THREE.BufferAttribute( uvs , 2 );
  var normal  = new THREE.BufferAttribute( normals , 3 );
  var id      = new THREE.BufferAttribute( ids , 1 );
  var lookAt  = new THREE.BufferAttribute( lookAts , 1 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );
  geo.addAttribute( 'normal' , normal );
  geo.addAttribute( 'id' , id);
  geo.addAttribute( 'lookAt' , lookAt );

  return geo;
}


MoonField.prototype.setTriValue3 = function( values , index , p1 , p2 , p3 ){

  values[ index * 3 + 0  ] = p1.x;
  values[ index * 3 + 1  ] = p1.y;
  values[ index * 3 + 2  ] = p1.z;

  values[ index * 3 + 3  ] = p3.x;
  values[ index * 3 + 4  ] = p3.y;
  values[ index * 3 + 5  ] = p3.z;

  values[ index * 3 + 6  ] = p2.x;
  values[ index * 3 + 7  ] = p2.y;
  values[ index * 3 + 8  ] = p2.z;

}

MoonField.prototype.setTriValue2 = function( values , index , p1 , p2 , p3 ){

  values[ index * 2 + 0  ] = p1.x;
  values[ index * 2 + 1  ] = p1.y;

  values[ index * 2 + 2  ] = p3.x;
  values[ index * 2 + 3  ] = p3.y;

  values[ index * 2 + 4  ] = p2.x;
  values[ index * 2 + 5  ] = p2.y;

}

MoonField.prototype.setTriValue1 = function( values , index , p1 , p2 , p3 ){

  values[ index + 0  ] = p1;
  values[ index + 1  ] = p3;
  values[ index + 2  ] = p3;

}

MoonField.prototype.setTriNormal = function( normals , index , p1 , p2 , p3 ){

  G.v3.copy( p1 );
  G.v3.sub( p2 );

  G.v2.copy( p1 );
  G.v2.sub( p3 );

  G.v1.crossVectors( G.v3 , G.v2 );
  G.v1.normalize();

  this.setTriValue3( normals , index , G.v1 , G.v1 , G.v1 );

}

MoonField.prototype.setQuadPositions = function( positions , index , p1 , p2 , p3 , p4 ){

  this.setTriValue3( positions , index , p1 , p2 , p3 );
  this.setTriValue3( positions , index + 3 , p4 , p3 , p2 );

}

MoonField.prototype.setQuadUVs = function( uvs , index , p1 , p2 , p3 , p4 ){

  this.setTriValue2( uvs , index , p1 , p2 , p3);
  this.setTriValue2( uvs , index + 3 , p4 , p3 , p2 );
}


MoonField.prototype.setQuadNormals = function( normals , index , p1 , p2 , p3 , p4 ){

  this.setTriNormal( normals , index , p1 , p2 , p3 );
  this.setTriNormal( normals , index + 3  , p4 , p3 , p2 );


}

MoonField.prototype.createMonkBody = function(){

  var geo = this.createMonkGeo();
  var mat = new THREE.ShaderMaterial({ 
    attributes:{
      id:{ type:"f", value:null},
      lookAt:{ type:"f", value:null},
    },
    uniforms:{
      t_audio:G.t_audio,
      t_monk:this.t_monk
    },
    vertexShader: shaders.vs.monk,
    fragmentShader: shaders.fs.monk,
    //side: THREE.DoubleSide 
  });



  var mesh = new THREE.Mesh( geo , mat );
  mesh.frustumCulled = false;

  return mesh;


}





