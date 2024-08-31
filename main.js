
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Create the scene and set up the camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 50, 100 ); 

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: {
       
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        #define TAU 6.2831853071

        uniform float time;
        uniform vec2 resolution;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            float o = random(uv * 0.25 + vec2(0.0, time * 0.025));
            float d = (random(uv * 0.25 - vec2(0.0, time * 0.02 + o * 0.02)) * 2.0 - 1.0);

            float v = uv.y + d * 0.1;
            v = 1.0 - abs(v * 2.0 - 1.0);
            v = pow(v, 2.0 + sin((time * 0.2 + d * 0.25) * TAU) * 1.0);

            vec3 color = vec3(0.0);

            float x = (2.0 - uv.x * 0.1);
            float y = 0.1 - abs(uv.y * 0. - 1.0);
            color += vec3(x * 0.3, y, x) * v;

            vec2 seed = gl_FragCoord.xy;
            vec2 r;
            r.x = random(seed);
            r.y = random(seed.yx + vec2(53.7842, 47.5134));

            float s = mix(r.x, (sin((time * 1.5 + 60.0) * r.y) * 0.5 + 0.5) * pow(r.y, 4.0), 0.04); 
            color += pow(s, 999.0) * (1.0 - v);

            gl_FragColor.rgb = color;
            gl_FragColor.a = 4.0;
        }
    `,
    side: THREE.DoubleSide,
    depthTest: false // Disable depth test for the background
});

// Create the background mesh with full-screen quad geometry
const backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    backgroundMaterial
);

// Create an orthographic camera for the background rendering
const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
scene.add(backgroundMesh);


// Load the GLTF model
let model;
const loader = new GLTFLoader();
loader.load( 'models/tardis/scene.gltf', function ( gltf ) {
    model = gltf.scene;
    model.position.set(0, 0, 0);

    scene.add( model );
}, undefined, function ( error ) {
    console.error( error );
} );


// Add the background mesh to the scene
scene.add(backgroundMesh);
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
    if (model) {
        const t = (time / 2000 % 1); // Ensure t stays between 0 and 1
        const position = path.getPointAt(t);
        if (position) {
            model.position.copy(position);
        }
            renderer.clearDepth();  // Clear the depth buffer

        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

animate();
