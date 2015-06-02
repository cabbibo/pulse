function Interface( fingers ){

  this.body = new THREE.Object3D();

  this.buttons = [];
  this.sliders = [];



  for( var  i = 0; i < 6; i++ ){

    var body = new THREE.Object3D();
    body.position.y =  .06  * Math.floor( i / 3 );
    body.position.x =  .06  * ( i % 3) ;

    var button = new ToggleButton( .05 , fingers , body , .01 );

    var string = 'toggle' + ( i + 1 )
    var u = G.uniforms[ string ];
    button.linkUniform( u );

    this.body.add( button.body );
    this.buttons.push( button);

  }

  for( var  i = 0; i < 3; i++ ){

    var body = new THREE.Object3D();
    body.position.x =  .06 * 3 + i * .03;
    body.position.y = .03;

    var slider = new Slider( .1 , fingers , body , .01 );

    var string = 'slider' + ( i+ 1 )
    var u = G.uniforms[ string ];
    slider.linkUniform( u );
 
    this.body.add( slider.body )
    this.sliders.push( slider );
   

  }


}

Interface.prototype.update = function(){

  for( var i = 0; i < this.sliders.length; i++ ){
    this.sliders[i].update();
  }
  for( var i = 0; i < this.buttons.length; i++ ){
    this.buttons[i].update();
  }

}
