function LeapFingers(){

  this.v1 = new THREE.Vector3();

  this.VR = false;
  this.fingers = [];
  this.positions = [];
  this.tips = [];

  var geo = new THREE.IcosahedronGeometry( .005 , 1 )
  var mat = new THREE.MeshNormalMaterial();

  for( var i = 0; i < 50; i++ ){
    var mesh = new THREE.Mesh( geo , mat );
    this.fingers.push( mesh );
    this.positions.push( mesh.position );
    mesh.position.set(  1000000  ,  1000000  , 1000000 );
    if( i % 5 == 4 ){ this.tips.push( mesh.position ); }
  }


}

LeapFingers.prototype.addToScene = function( scene ){

  for( var i = 0; i < this.fingers.length; i++ ){
    scene.add( this.fingers[i] );
  }

}

LeapFingers.prototype.update = function( frame ){

  this.updateFingers( this.positions , frame , this.VR )

}
LeapFingers.prototype.updateFingers = function( fingerArray , frame , VR ){


  if( frame.hands[0] ){


   //console.
    for( var i = 0; i < 25; i++ ){

      var r = fingerArray[i];
      var bI =  i % 5 ;                     // Bone index
      var fI = Math.floor( i / 5 );     // finger index

      var p = this.leapToScene( frame , frame.hands[0].fingers[fI].positions[bI] );

      if( VR == true ){
        
        // z is y || x is x ||  y is -z
        this.v1.set( -p[0] , -p[2] , -p[1] );
        r.copy( camera.position );
        this.v1.applyQuaternion( camera.quaternion );
        r.add( this.v1 );

      }else{ 

        r.copy( camera.position );
        this.v1.set( p[0] , p[1] -.3 , p[2] - .3 );
        r.add( this.v1 );

      }
      

    }

  }else{
     //console.
    for( var i = 0; i < 25; i++ ){

       var r = fingerArray[i];

       r.set( 0 , 0 , 10000 )

    }
  }



  if( frame.hands[1] ){

    for( var i = 0; i < 25; i++ ){

        var r = fingerArray[i+25];
        var bI =  i % 5 ;                   // Bone index
        var fI = Math.floor( i / 5 );       // finger index

        var p = this.leapToScene( frame , frame.hands[1].fingers[fI].positions[bI] );

      if( VR == true ){
        
        // z is y || x is x ||  y is -z
        this.v1.set( -p[0] , -p[2] , -p[1] );
        r.copy( camera.position );
        this.v1.applyQuaternion( camera.quaternion );
        r.add( this.v1 );

      }else{ 

        r.copy( camera.position );
        this.v1.set( p[0] , p[1] -.3 , p[2] - .3 );
        r.add( this.v1 );

      }

    }

  }else{
       //console.
     for( var i = 0; i < 25; i++ ){

       var r = fingerArray[i+25];

       r.set(  1000000  ,  1000000  , 10000 )

     }

  }

}

LeapFingers.prototype.leapToScene = function( frame , position  ){


  var p =  position;  
  return [ 
    p[0] * .001,
    p[1] * .001,
    p[2] * .001
  ]

}

LeapFingers.prototype.normalizePosition = function( frame , position  ){


  var p =  position;  
  return frame.interactionBox.normalizePoint( position );
 /* return [ 
    p[0] * .001,
    p[1] * .001,
    p[2] * .001
  ]*/

}