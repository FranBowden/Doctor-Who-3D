
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Create the scene and set up the camera
const scene = new THREE.Scene();
let model;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 50, 100 ); 

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
// Load the GLTF model
const loader = new GLTFLoader();
loader.load( 'models/tardis/scene.gltf', function ( gltf ) {
    model = gltf.scene;
    model.position.set(0, 0, 0);

    scene.add( model );
}, undefined, function ( error ) {
    console.error( error );
} );

//Lighting
const ambientLight = new THREE.AmbientLight( 0x404040, 5 ); // Soft white light
scene.add( ambientLight );

// Light above the model
const pointLight1 = new THREE.PointLight( 0xffffff, 2, 2000 );
pointLight1.position.set( 0, 800, 200 );
scene.add( pointLight1 );

// Light to the right of the model
const pointLight2 = new THREE.PointLight( 0xffffff, 2, 2000 );
pointLight2.position.set( 600, 400, 200 );
scene.add( pointLight2 );

// Light to the left of the model
const pointLight3 = new THREE.PointLight( 0xffffff, 2, 2000 );
pointLight3.position.set( -600, 400, 200 );
scene.add( pointLight3 );

// Light in front of the model
const pointLight4 = new THREE.PointLight( 0xffffff, 2, 200 );
pointLight4.position.set( 0, 400, 600 );
scene.add( pointLight4 );

// Light behind the model
const pointLight5 = new THREE.PointLight( 0xffffff, 2, 2000 );
pointLight5.position.set( 0, 400, -600 );
scene.add( pointLight5 );


const starCount = 10000;
const starsGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;  // X 
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;  // Y 
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;  // Z 
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,          
    sizeAttenuation: true,
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

const points = [
    new THREE.Vector3(-100,0,100),
    new THREE.Vector3(-50,5,50),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(50,-5,50),
    new THREE.Vector3(100,0,100),
    new THREE.Vector3(75,0,75),
    new THREE.Vector3(-100,0,100),
    
]

const path = new THREE.CatmullRomCurve3(points);

const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000})
const pathObject = new THREE.Line(pathGeometry,pathMaterial)

scene.add(pathObject)

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate(time) {
    const t = (time/2000 % 6) / 6;
    const position = path.getPointAt(t);
    model.position.copy(position)
    renderer.render(scene, camera);
}

animate();