function initDemoPath(){
	

        var xWidth = .07;    

        var allPaths = []; 

        var inputPaths = []

        var points = [];
        points.push( new THREE.Vector3( -3 , 0 , -4 ));
        points.push( new THREE.Vector3( -3 , 0 , -1 - ( xWidth * 9 ) ));
        points.push( new THREE.Vector3( -8 , 0 , -1 ));
        points.push( new THREE.Vector3( -8 , 0 , 0 ));
        points.push( new THREE.Vector3( -3 , 0 , 0 ));
        points.push( new THREE.Vector3( -3 , 0 , 1 ));
        points.push( new THREE.Vector3( -8 , 0 , 1 ));
        points.push( new THREE.Vector3( -8 , 0 , 2 ));
        points.push( new THREE.Vector3( -6 , 0 , 4 ));
        points.push( new THREE.Vector3( -2 , 0 , 2 ));
        points.push( new THREE.Vector3( -2 , 0 , -1 ));
        points.push( new THREE.Vector3( -1 , 0 , -1 ));




        inputPaths.push({

          points: points,
          numWires: 3

        });



        var points = [];
        points.push( new THREE.Vector3(  3 , 0 , -9 ));
        points.push( new THREE.Vector3(  3 , 0 , -9 ));

        

        //points.push( new THREE.Vector3(  0 , 0 , -2 ));

        inputPaths.push({
          points: points,
          numWires: 4
        });



        var points = [];
        points.push( new THREE.Vector3(  5 , 0 , -9 ));
        points.push( new THREE.Vector3(  5 , 0 , -6 ));
        

        inputPaths.push({
          points: points,
          numWires: 4
        });


        var points = [];
        points.push( new THREE.Vector3(  10 , 0 , -9 ));
        points.push( new THREE.Vector3(  10 , 0 , -3 ));
        

        //points.push( new THREE.Vector3(  0 , 0 , -2 ));

        inputPaths.push({
          points: points,
          numWires: 4
        });



        // Output PAth
        var points = [];

        points.push( new THREE.Vector3( 0 , 0 , 0 ));
        points.push( new THREE.Vector3( 2 , 0 , 4 ));
        points.push( new THREE.Vector3( 2 , 0 , 6 ));
        points.push( new THREE.Vector3( 2 , 0 , 7 ));
        points.push( new THREE.Vector3( 2 , 0 , 8 ));
        points.push( new THREE.Vector3( 0 , 0 , 9 ));
        points.push( new THREE.Vector3( 0 , 0 , 11 ));

        var output = {
          points: points,
          numWires:0
        }


        var paths = new PathConnector( inputPaths , output , xWidth , 1 , 0 );


        for( var  i = 0; i < paths.inputPaths.length; i++ ){
          allPaths.push( paths.inputPaths[i] )
        }


        inputPaths = [];
        inputPaths.push( paths.outputPath );



        // Output PAth
        var points = [];

        points.push( new THREE.Vector3( 6 , 0 , 0 ));
        points.push( new THREE.Vector3( 6 , 0 , 4 ));
        points.push( new THREE.Vector3( 6 , 0 , 6 ));
        points.push( new THREE.Vector3( 8 , 0 , 7 ));
        points.push( new THREE.Vector3( 8 , 0 , 8 ));
        points.push( new THREE.Vector3( 6 , 0 , 9 ));
        points.push( new THREE.Vector3( 6 , 0 , 11 ));

        inputPaths.push({
          points: points,
          numWires:8
        });


        // Output PAth
        var points = [];

        points.push( new THREE.Vector3( 3 , 0 , 14 ));
        points.push( new THREE.Vector3( 3 , 0 , 16 ));
        points.push( new THREE.Vector3( 3 , 0 , 18 ));
        points.push( new THREE.Vector3( 6 , 0 , 20 ));
        points.push( new THREE.Vector3( 6 , 0 , 22 ));
        points.push( new THREE.Vector3( 3 , 0 , 24 ));
        points.push( new THREE.Vector3( 3 , 0 , 26 ));

        output =  {
          points: points,
          numWires:8
        };

        var paths = new PathConnector( inputPaths , output , xWidth , 1 , 0 );

        for( var  i = 0; i < paths.inputPaths.length; i++ ){
          allPaths.push( paths.inputPaths[i] )
        }

        allPaths.push( paths.outputPath )

        console.log( allPaths )

        var wireInfo = new Wire( allPaths , xWidth );
        wireInfo.wire.position.y = -.5;
        console.log( wireInfo.wire );
        scene.add( wireInfo.wire );

}