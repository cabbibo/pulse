function AudioField( body , buffers , positions , looping ){

  this.body = body;
  this.buffers = buffers;
  this.gainNodes = [];
  this.filters = [];
  this.sources = [];

  var geo = new THREE.IcosahedronGeometry( .01 , 1);
  var mat = new THREE.MeshNormalMaterial();

  this.markers = [];

  for( var i = 0; i < this.buffers.length; i++ ){

    var m = new THREE.Mesh( geo , mat );
    m.position.copy( positions[i] );
    this.markers.push( m );
    

    var g = G.audio.ctx.createGain();
    g.gain.value = 0;

    this.gainNodes.push( g )

    
    var filter = G.audio.ctx.createBiquadFilter();
    filter.type = 'hipass';

    if( i == 0 ){
      filter.frequency.value = 40;
    }else{
      filter.frequency.value = 4000;
    }

    g.connect( filter );
    filter.connect( G.audio.gain );

    this.filters.push( filter );

    var source = new BufferedAudio( buffers[i].buffer , G.audio.ctx , g , false );
    this.sources.push( source )

  }

  this.add();

  G.sadLooper.everyLoop( function(){

    for( var i = 0; i < this.sources.length; i++ ){
      this.sources[i].play();
    }

  }.bind( this ));

}

AudioField.prototype.add = function(){

  for( var i = 0; i < this.buffers.length; i++ ){
    this.body.add( this.markers[i] );
    //this.sources[i].play();
  }

}

AudioField.prototype.update = function(){

  for( var i  = 0; i< this.buffers.length; i++ ){
    
    var m = this.markers[i]
   
    G.v1.copy( m.position );
    G.v1.applyMatrix4( this.body.matrixWorld );
    G.v1.sub( camera.position );
    
    var l = G.v1.length();

    var v = Math.min( 1. , 1 / l );
    this.gainNodes[i].gain.value = v;

  }

}




