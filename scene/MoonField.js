function MoonField( puppyPos ){
  

  var loops = [
    G.audioBuffers.ride,
  ];
  var notes = [
   // G.audioBuffers.monk1,
    G.audioBuffers.monk2,
    G.audioBuffers.monk3,
    G.audioBuffers.monk4,
    G.audioBuffers.monk5,
    G.audioBuffers.monk6,
   // G.audioBuffers.monk7,
    G.audioBuffers.monk8,
    G.audioBuffers.monk9,
    G.audioBuffers.monk10,
    G.audioBuffers.monk11,
    G.audioBuffers.monk12,
    G.audioBuffers.monk13,
    G.audioBuffers.monk14,
    G.audioBuffers.monk15,
    G.audioBuffers.monk16,
    G.audioBuffers.monk17,
    G.audioBuffers.monk18,
  ]



  this.music = new MonkMusic( loops , notes );
  this.body = new THREE.Object3D();

  this.lookPos = new THREE.Vector3();

  this.depth = 8;
  this.joints = 4;
  this.jointSize = this.depth / this.joints;
  this.size = 16;
  var ss = shaders.ss.moonBeams;

  this.puppyPos = puppyPos;

  this.jointArray = [];

  this.t_monk = { type:"t" , value: null }
  this.t_oMonk = { type:"t" , value: null }
  this.t_lock = { type:"t" , value: null }
  this.monks = this.createMonks();
  this.t_monk.value= this.monks.texture;
  this.t_oMonk.value= this.monks.oTexture;
  this.t_lock.value= this.monks.lockTexture;

  this.toggled = [];
  this.locked  = [];
  this.toggledNum = 0;
  this.lockedNum = 0;

  for( var i = 0; i < this.size; i++ ){ 
    this.toggled.push( false ); 
    this.locked.push( false ); 
  }

  this.ringRadius = { type:"f" , value: .005 }

 

  for( var i = 0; i< this.monks.markers.length; i++ ){
    this.body.add( this.monks.markers[i] );
  }

  this.soulDirection = new THREE.Vector3(0 , .5 , -puppyPos);
  this.soul = new PhysicsArrayRenderer( this.size , this.depth , ss , renderer );

  this.soul.setUniform( 'dT'   , G.dT    );
  this.soul.setUniform( 'time' , G.time  );
  this.soul.setUniform( 't_audio' , G.uniforms.t_audio );
  this.soul.setUniform( 'toPos' , { type:"v3", value:this.soulDirection })
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
      t_lock: this.t_lock,
      t_audio: G.uniforms.t_audio,
      rainbow: G.uniforms.rainbow
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeams,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.particles = new THREE.PointCloud( this.particleGeo , this.particleMat );
  this.particles.frustumCulled = false;


  this.lineGeo = createLineGeometry( this.size , this.joints );

  var vs = shaders.setValue( shaders.vs.moonBeamLines , 'DEPTH' , this.joints )
  this.lineMat = new THREE.ShaderMaterial({
    uniforms:{
      t_sprite: { type:"t" , value: G.t.sprite },
      t_posArray: { type:"tv" , value: this.jointArray },
      t_monk: this.t_monk,
      t_lock: this.t_lock,
      t_audio: G.uniforms.t_audio,
      rainbow: G.uniforms.rainbow
    },
    vertexShader: vs,
    fragmentShader: shaders.fs.moonBeamLines,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })


  this.lines = new THREE.Line( this.lineGeo , this.lineMat , THREE.LinePieces );
  this.lines.frustumCulled = false;

  this.toggleAllMonks();


}


MoonField.prototype.start = function(){
  this.started = true;
  this.body.add( this.monks.body );
  this.body.add( this.lines );
  this.body.add( this.particles );
}

MoonField.prototype.stop = function(){
  this.started = false;
  this.body.remove( this.monks.body );
  this.body.remove( this.lines );
  this.body.remove( this.particles );
}
MoonField.prototype.update = function(){

 
    this.soul.update();

    // Makes sure the joints of the ribbons 
    // are properly dun
    for( var i =0; i< this.joints; i++ ){
      this.jointArray[i] = this.soul.output[i * this.jointSize];
    }

  if( this.started == true ){

    this.updateMonkPositions();

    this.checkMonks([ G.fingers.tips[1] ]);

  }

}

MoonField.prototype.checkMonks = function( tips ){

  for( var i = 0; i < this.monks.positions.length; i++ ){
    
    G.v1.copy( this.monks.positions[i] );
    G.v2.set( 0 , .1 , 0. );
    G.v1.add( G.v2 )
    G.v1.applyMatrix4( this.body.matrixWorld );
    G.v1.sub( tips[0] )



    var l = G.v1.length();

    //console.log( l );
    if( l < .1 && this.monks.distancesToFinger[i] > .1 ){ 
      this.toggleMonk( i );
      //console.log( 'dammm') 
    }

    this.monks.distancesToFinger[ i ] = l;

  }

}

MoonField.prototype.resetSingleMonk = function( id ){

  var data = new Float32Array( this.size * this.size * 4 );

  console.log( this.soul )
  var replaceData = this.soul.textureReplacePassProgram.uniforms.replace.value.image.data;
  for( var i = 0; i < this.size; i++ ){
    for( var j = 0; j < this.size; j++ ){
      var index = (i * this.size) + j;

      if( j == id ){


        console.log( 'hello')
        data[ index + 0 ] = this.monks.data[ id * 4 + 0 ];
        data[ index + 1 ] = this.monks.data[ id * 4 + 1 ];
        data[ index + 2 ] = this.monks.data[ id * 4 + 2 ];
        data[ index + 3 ] = 1;


        replaceData[ index + 0 ] = this.monks.data[ id * 4 + 0 ];
        replaceData[ index + 1 ] = this.monks.data[ id * 4 + 1 ];
        replaceData[ index + 2 ] = this.monks.data[ id * 4 + 2 ];
        replaceData[ index + 3 ] = 1;


       // this.textureReplacePassProgram.uniforms.replace.value = texture;

      }else{

        replaceData[ index + 0 ] = 3;
        replaceData[ index + 1 ] = 3;
        replaceData[ index + 2 ] = 3;
        replaceData[ index + 3 ] = 10;

      }



    }
  }


  this.soul.textureReplacePassProgram.uniforms.replace.value.needsUpdate = true

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

  this.soul.replace( texture );

}

MoonField.prototype.updateMonkPositions = function(){

  var a = G.uniforms.t_audio.value.image.data;
  for( var i = 0; i < this.monks.data.length; i ++ ){

    // first see if monk is toggled
    var active = this.monks.data[ i  * 4 + 3 ];

    if( active > 0. ){
      var t = [
        this.monks.target[ i * 4 + 0 ],
        this.monks.target[ i * 4 + 1 ],
        this.monks.target[ i * 4 + 2 ]
      ];

      var p = [
        this.monks.data[ i * 4 + 0 ],
        this.monks.data[ i * 4 + 1 ],
        this.monks.data[ i * 4 + 2 ]
      ]

      var dif = [
        p[0] - t[0],
        p[1] - t[1],
        p[2] - t[2]
      ]

      var l = Math.sqrt( dif[0] * dif[0] + dif[1] * dif[1] + dif[2] * dif[2] );

      if( l > .01 ){

        this.monks.oData[ i * 4 + 0 ] = this.monks.data[ i * 4 + 0 ];
        this.monks.oData[ i * 4 + 1 ] = this.monks.data[ i * 4 + 1 ];
        this.monks.oData[ i * 4 + 2 ] = this.monks.data[ i * 4 + 2 ];

        this.monks.oPositions[ i ].x = this.monks.data[ i * 4 + 0 ];
        this.monks.oPositions[ i ].y = this.monks.data[ i * 4 + 1 ];
        this.monks.oPositions[ i ].z = this.monks.data[ i * 4 + 2 ];

        this.monks.data[ i * 4 + 0 ] -= (dif[0]/l) * .003 * Math.pow( a[ i * 4 + 0 ] , 2. );
        this.monks.data[ i * 4 + 1 ] -= (dif[1]/l) * .003 * Math.pow( a[ i * 4 + 1 ] , 2. );
        this.monks.data[ i * 4 + 2 ] -= (dif[2]/l) * .003 * Math.pow( a[ i * 4 + 2 ] , 2. );

        this.monks.positions[ i ].x = this.monks.data[ i * 4 + 0 ];
        this.monks.positions[ i ].y = this.monks.data[ i * 4 + 1 ];
        this.monks.positions[ i ].z = this.monks.data[ i * 4 + 2 ];
        
      }else{

        if( this.locked[i] == false ){
          this.lockMonk( i );
        }

      }

    }


  }

  this.monks.texture.needsUpdate = true;
  this.monks.oTexture.needsUpdate = true;

}

MoonField.prototype.toggleAllMonks = function(){

  for( var i = 0; i < this.monks.positions.length; i++ ){

    var id = i;

    var index = id * 4;
    var value = this.monks.texture.image.data[ index + 3 ] ;

    var val = 0;// Math.abs( value - 1 );
    this.monks.data[ index + 3 ] = val;
  }

}


MoonField.prototype.toggleMonk = function(id){

  this.music.notes[ id ].play();
  if( this.toggled[id] == false ){
    this.toggled[id] = true;

    var index = id * 4;
    var value = this.monks.texture.image.data[ index + 3 ] ;

    var val = 1;// Math.abs( value - 1 );
    this.monks.data[ index + 3 ] = val;


    var randID = Math.floor( Math.random() * this.music.notes.length);
    

    for( var i = 0; i < this.music.filters.length; i++ ){
      this.music.filters[i].frequency.value += 1000
    }

    //this.music.notes[ randID ].play();

    /*if( val == 1 ){
      this.resetSingleMonk( id );
    }*/


    this.monks.texture.needsUpdate = true;

    this.toggledNum ++;

    console.log( 'tN : ' +this.toggledNum )
    if( this.toggledNum == this.size ){
      this.allToggled();
    }
  }


}

MoonField.prototype.lockMonk = function(id){

  this.locked[id] = true;

  var index = id * 4;
  this.monks.lockData[ index ] = 1;
  this.monks.lockTexture.needsUpdate = true;
  console.log( 'LOCKES : ' + id )
  this.lockedNum ++;

  if( this.lockedNum == this.size ){
    this.allLocked();
  }
}

MoonField.prototype.allToggled = function(){
  pulse.pedestal.prepare();
  this.soulDirection.set( 0 , 0 , 7.5 );
}

MoonField.prototype.allLocked = function(){

}

MoonField.prototype.createMonks = function(){

  var data    = new Float32Array( this.size * 4 );
  var oData   = new Float32Array( this.size * 4 );
  var target  = new Float32Array( this.size * 4 );
  var lockData  = new Float32Array( this.size * 4 );



  var monks = {};

  monks.positions = [];
  monks.oPositions = [];

  // TODO: this *needs* to be 1 geo
  monks.markers = [];
  monks.data = data;
  monks.oData = oData;
  monks.lockData = lockData;
  monks.target = target;
  monks.distancesToFinger = [];


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

    var t = uv.x * 1 *  Math.PI;

    var r = (.5 - (Math.abs((t - (Math.PI/2)) )/ Math.PI)) * 10. + 4.;// (uv.y + .5) * 10. * (Math.random() + 5.)/5.;

    r *= .8 + Math.random() * .4;
    z = -this.puppyPos;

    x += Math.cos( t ) * r;
    z += Math.sin( t ) * r;


    var a = 1;

    data[ i * 4 + 0 ] = x;
    data[ i * 4 + 1 ] = 0;
    data[ i * 4 + 2 ] = z;
    data[ i * 4 + 3 ] = a;

    oData[ i * 4 + 0 ] = x;
    oData[ i * 4 + 1 ] = 0;
    oData[ i * 4 + 2 ] = z;
    oData[ i * 4 + 3 ] = a;


    lockData[ i * 4 + 0 ] = 0;
    lockData[ i * 4 + 1 ] = 0;
    lockData[ i * 4 + 2 ] = 0;
    lockData[ i * 4 + 3 ] = 0;



    var position =new THREE.Vector3( x , y , z )

    var oPos = new THREE.Vector3( x , y , z );

    
    monks.positions.push( position );
    monks.oPositions.push( position );
    monks.distancesToFinger.push(  100000 );

    var x = 0;
    var y = 0;
    var z = 0;

    z = -this.puppyPos;

    x += Math.cos( t ) * 1. ;
    z += Math.sin( t ) * 1. ;

    target[ i * 4 + 0 ] = x;
    target[ i * 4 + 1 ] = 0;
    target[ i * 4 + 2 ] = z;
    target[ i * 4 + 3 ] = a;


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

  var oTexture = new THREE.DataTexture( 
    oData,
    this.size,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );


  oTexture.needsUpdate = true;

  monks.oTexture = oTexture;

  var lockTexture = new THREE.DataTexture( 
    oData,
    this.size,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );


  lockTexture.needsUpdate = true;

  monks.lockTexture = lockTexture;



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

MoonField.prototype.createMonkGeo = function( sides , height , baseRadius , faceSize ){


  var baseVerts = sides * (( 3 * 2 * 3 ) + 3);
  var headVerts = 3 * 6;
  var vertsPerMonk = ( baseVerts + headVerts );
  var totalVerts = vertsPerMonk * this.size;


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



  for( var i = 0; i < this.size; i++){


    var monkBaseIndex = vertsPerMonk * i;

    var id = (i + .5 ) / this.size;

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

        G.v1.set( 0 , 0 , 0 )

        p1.add( G.v1 );
        p2.add( G.v1 );
        p3.add( G.v1 );
        p4.add( G.v1 );

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

        G.setQuadPositions( positions , index , p1 , p2 , p3 , p4 );
        G.setQuadNormals( normals , index , p1 , p2 , p3 , p4 );
        G.setQuadUVs( uvs , index , u1 , u2 , u3 , u4 )

        G.setTriValue1( lookAts , index     , 0 , 0 , 0 );
        G.setTriValue1( lookAts , index + 3 , 0 , 0 , 0 );

        G.setTriValue1( ids , index     , id , id , id );
        G.setTriValue1( ids , index + 3 , id , id , id );


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

      G.v1.set( 0 , 0 ,0.)// baseRadius * .5  )

      p1.add( G.v1 );
      p2.add( G.v1 );
      p3.add( G.v1 );
      //p4.add( G.v1 );

      u1.x = j / sides;
      u2.x = (( j+1 )) / sides
      u3.x = (( j+.5 )) / sides

      u1.y = 1/4;
      u2.y = 1/4;
      u3.y = 0;


      // TIP

      // monk id        // Side id             // slice id
      index = monkBaseIndex + ( j * (( 3* 2*3) + 3) ) + ( 3 * 3 * 2)

      G.setTriValue3( positions , index , p1 , p2 , p3 );
      G.setTriNormal( normals   , index , p1 , p2 , p3 );
      
      G.setTriValue2( uvs , index , u1 , u2 , u3 );

      G.setTriValue1( ids ,  index , id , id , id );
      G.setTriValue1( lookAts ,  index  , 0 , 0 , 0  );

      


    }



    //Second off create head

             // monk id       // Side id       
    index = monkBaseIndex + baseVerts;


    p1.x = -faceSize;  p1.y = -faceSize * 1.618;  p1.z = baseRadius * -.3;
    p2.x =  faceSize;  p2.y = -faceSize * 1.618;  p2.z = baseRadius * -.3;
    p3.x = -faceSize;  p3.y =  faceSize * 1.618;  p3.z = baseRadius * -.3;
    p4.x =  faceSize;  p4.y =  faceSize * 1.618;  p4.z = baseRadius * -.3;

    u1.x = 0; u1.y = 0;
    u2.x = 1; u2.y = 0;
    u3.x = 0; u3.y = 1;
    u4.x = 1; u4.y = 1;

    G.setQuadPositions( positions , index , p1 , p2 , p3 , p4 )
    G.setQuadNormals( normals , index , p1 , p2 , p3 , p4 )
    G.setQuadUVs( uvs , index , u1 , u2 , u3 , u4 )

    G.setTriValue1( lookAts , index      , 1 , 1 , 1 );
    G.setTriValue1( lookAts , index + 3  , 1 , 1 , 1 );

    G.setTriValue1( ids , index      , id , id , id ); 
    G.setTriValue1( ids , index + 3  , id , id , id );

    p1.x = -faceSize;  p1.y = -faceSize * 1.618;  p1.z = baseRadius * -.3;
    p2.x =  faceSize;  p2.y = -faceSize * 1.618;  p2.z = baseRadius * -.3;
    p3.x = -faceSize;  p3.y =  faceSize * 1.618;  p3.z = baseRadius * -.3;
    p4.x =  faceSize;  p4.y =  faceSize * 1.618;  p4.z = baseRadius * -.3;



    G.v1.set( 0,0,baseRadius )
    G.setTriValue3( positions , index + 6 , p1 , G.v1 , p2 );
    G.setTriNormal( normals , index + 6 , p1 , G.v1 , p2 );
    G.setTriValue2( uvs , index + 6 , u1 , u2 , u3 );
    G.setTriValue1( lookAts , index  + 6  , 1 , 1 , 1 );
    G.setTriValue1( ids , index + 6  , id , id , id ); 
    G.v1.set( 0,0,baseRadius )
    G.setTriValue3( positions , index + 9 , p2 ,  G.v1,p4 );
    G.setTriNormal( normals , index + 9 , p2 ,  G.v1,p4  );
    G.setTriValue2( uvs , index + 9 , u1 , u2 , u3 );
    G.setTriValue1( lookAts , index  + 9  , 1 , 1 , 1 );
    G.setTriValue1( ids , index + 9  , id , id , id ); 
    G.v1.set( 0,0,baseRadius )
    G.setTriValue3( positions , index + 12 , p4 ,  G.v1,p3 );
    G.setTriNormal( normals , index + 12 , p4 ,  G.v1,p3 );
    G.setTriValue2( uvs , index + 12 , u1 , u2 , u3 );
    G.setTriValue1( lookAts , index  + 12  , 1 , 1 , 1 );
    G.setTriValue1( ids , index + 12  , id , id , id ); 
    G.v1.set( 0,0,baseRadius )
    G.setTriValue3( positions , index + 15, p3 , G.v1,p1 );
    G.setTriNormal( normals , index + 15, p3 , G.v1,p1 );
    G.setTriValue2( uvs , index + 15, u1 , u2 , u3 );
    G.setTriValue1( lookAts , index  + 15 , 1 , 1 , 1 );
    G.setTriValue1( ids , index + 15 , id , id , id ); 
/*


    // Create an extra back face
    G.setQuadPositions( positions , index + 6 , p4 , p2 , p3 , p1 )
    G.setQuadNormals( normals , index+ 6 , p1 , p2 , p3 , p4 )
    G.setQuadUVs( uvs , index , u4 , u2 , u3 , u1 )

    G.setTriValue1( lookAts , index + 6     , 1 , 1 , 1 );
    G.setTriValue1( lookAts , index + 6 + 3  , 1 , 1 , 1 );

    G.setTriValue1( ids , index + 6    , id , id , id ); 
    G.setTriValue1( ids , index + 6 + 3  , id , id , id );*/

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



MoonField.prototype.createMonkBody = function(){



  var height = .09;
  var baseRadius = .03;
  var faceSize = .01;
  var sides = 6;

  var geo = this.createMonkGeo( sides , height , baseRadius , faceSize );
  var mat = new THREE.ShaderMaterial({ 
    attributes:{
      id:{ type:"f", value:null},
      lookAt:{ type:"f", value:null},

    },
    uniforms:{
      t_audio:G.uniforms.t_audio,
      t_monk:this.t_monk,
      t_oMonk:this.t_oMonk,
      height:{ type:"f", value: height },
      lookPos: { type:"v3" , value: G.uniforms.tips.value[1] },
      rainbow: G.uniforms.rainbow
    },
    vertexShader: shaders.vs.monk,
    fragmentShader: shaders.fs.monk,
    //side: THREE.DoubleSide 
  });



  var mesh = new THREE.Mesh( geo , mat );
  mesh.frustumCulled = false;

  return mesh;


}


MoonField.prototype.createMonkNotes = function( buffers ){

  var sources = [];

  for( var i = 0; i < buffers.length; i++ ){

    var source = new BufferedAudio( buffers[i].buffer , G.audio.ctx , G.audio.gain , false );
    sources.push( source )

  }

  return sources;


}


