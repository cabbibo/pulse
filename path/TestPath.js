TestPath = function(){

	var path = 	{ output : { points: 	[ new THREE.Vector3(  20, 0 , 4 )
																		,	new THREE.Vector3(  21 , 0 , 7 ) ] }

							,	inputs:	[	{	output : { points:	[ new THREE.Vector3(  7 , 0 , 3 )
																		  					,	new THREE.Vector3(  7 , 0 , 5 )
																		  					,	new THREE.Vector3(  9 , 0 , 5 ) ] }

													,	inputs : 	[ { points: [ new THREE.Vector3(  7 , 0 , 0 )
																				  				,	new THREE.Vector3(  7.5 , 0 , 0 )
																				  				,	new THREE.Vector3(  7.5 , 0 , 1 ) ]
																				, numWires: 3
																				}

																			, { points: [	new THREE.Vector3(  8 , 0 , 0 )
																									,	new THREE.Vector3(  8.5 , 0 , 0 )
																									,	new THREE.Vector3(  8.5 , 0 , 1 ) ]
																			  , numWires: 3
																			  } 																						] } 


												,	{	output : 	{ points: [ new THREE.Vector3(  9 , 0 , 3 )
																			  				,	new THREE.Vector3(  9 , 0 , 4 )
																			  				,	new THREE.Vector3( 10 , 0 , 4 ) ] }

													,	inputs : 	[ { points: [ new THREE.Vector3(  9 , 0 , 0 )
																				  				,	new THREE.Vector3( 9.5 , 0 , 0 )
																				  				,	new THREE.Vector3( 9.5 , 0 , 1 ) ]
																				, numWires: 3
																				}

																			, { points: [	new THREE.Vector3( 10, 0 , 0 )
																									,	new THREE.Vector3( 10.5 , 0 , 0 )
																									,	new THREE.Vector3( 10.5 , 0 , 1 ) ]
																			  , numWires: 3
																			  } 																						 ]  
													} 	
												]  
							} 

	return path
}