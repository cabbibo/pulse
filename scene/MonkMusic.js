function MonkMusic( buffers , notes ){
	
  this.buffers = buffers;
  this.filters = [];
  this.sources = [];
  this.notes   = [];


	for( var i = 0; i < this.buffers.length; i++ ){

    var filter = G.audio.ctx.createBiquadFilter();
    filter.type = 'hipass';
    filter.frequency.value = 40;

    filter.connect( G.audio.gain );

    this.filters.push( filter );

    var source = new BufferedAudio( buffers[i].buffer , G.audio.ctx , filter , false );
    this.sources.push( source )

  }

  for( var i = 0; i < notes.length; i++ ){

    var source = new BufferedAudio( notes[i].buffer , G.audio.ctx , G.audio.gain , false );
    this.notes.push( source )

  }


  G.looper.everyLoop( function(){

    for( var i = 0; i < this.sources.length; i++ ){
      this.sources[i].play();
    }

  }.bind( this ));


}