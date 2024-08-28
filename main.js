
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Create the scene and set up the camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 200, 400, 600 ); 

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// Load the GLTF model
const loader = new GLTFLoader();
loader.load( 'models/tardis/scene.gltf', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(5, 5, 5);
    scene.add( model );
}, undefined, function ( error ) {
    console.error( error );
} );

const pointLight1 = new THREE.PointLight( 0xffffff, 70, 1000 ); 
pointLight1.position.set( 0, 800, 200 ); 
scene.add( pointLight1 );

const pointLight2 = new THREE.PointLight( 0xffffff, 70, 1000 ); 
pointLight1.position.set( 600, 800, 0 ); 
scene.add( pointLight2 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    controls.update(); 
    renderer.render( scene, camera );
}