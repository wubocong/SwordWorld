// instantiate a loader
const loader = new THREE.JSONLoader();

// load a resource
loader.load(
	// resource URL
	'models/animated/monster/monster.js',
	// Function when resource is loaded
	function ( geometry, materials ) {
		const material = new THREE.MultiMaterial( materials );
		const object = new THREE.Mesh( geometry, material );
    object.position.set( 0, 0, 0 );
    object.scale.set( 3, 3, 3 );
		scene.add( object );
	}
);