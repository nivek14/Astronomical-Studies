import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Load solar system textures
const TextureLoader     = new THREE.TextureLoader();
const sunTexture        = TextureLoader.load('/textures/SunT.jpeg');
const mercuryTexture    = TextureLoader.load('/textures/MercuryT.jpeg');
const venusTexture      = TextureLoader.load('/textures/VenusT.jpeg');
const earthTexture      = TextureLoader.load('/textures/EarthT.png');
const marsTexture       = TextureLoader.load('/textures/MarsT.jpeg');
const jupiterTexture    = TextureLoader.load('/textures/JupiterT.jpeg');
const saturnTexture     = TextureLoader.load('/textures/SaturnT.jpeg');
const uranusTexture     = TextureLoader.load('/textures/UranusT.jpeg');
const nepturneTexture   = TextureLoader.load('/textures/NeptuneT.jpeg');

// Load the background texture
const loader = new THREE.TextureLoader();
loader.load( '/textures/Environment_baseColor.jpeg' , function(texture){
    scene.background = texture;  
});


function creatingPivots(){
    var referencePoint = new THREE.Object3D();
    return referencePoint;
}

// pivot
const pivotPoint = [
    creatingPivots(), // mercury orbit
    creatingPivots(), // venus orbit
    creatingPivots(), // earth orbit
    creatingPivots(), // mars orbit
    creatingPivots(), // jupiter orbit
    creatingPivots(), // saturn orbit
    creatingPivots(), // uranus orbit
    creatingPivots() // nepturne orbit
]

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Light
const light = new THREE.PointLight(0xFFFFFF, 1.0);
light.position.set(-30,0,0);
scene.add(light);

// Light
const light2 = new THREE.PointLight(0xFFFFFF, 1.0);
light2.position.set(-90,0,0);
scene.add(light2);

// GUI lights setup
const UILight = gui.addFolder('Ambient');
UILight.add(light, "visible");
UILight.add(light, "intensity", 0.0, 1.0);
UILight.add(light.color, "r", 0.0, 1.0);
UILight.add(light.color, "g", 0.0, 1.0);
UILight.add(light.color, "b", 0.0, 1.0);
UILight.add(light2, "visible");
UILight.add(light2, "intensity", 0.0, 1.0);
UILight.add(light2.color, "r", 0.0, 1.0);
UILight.add(light2.color, "g", 0.0, 1.0);
UILight.add(light2.color, "b", 0.0, 1.0);

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

function makeSolarSystemObjects(radius, texture, position){

    // Objects
    const SphereGeometry = new THREE.SphereBufferGeometry(radius,64,64);

    // Materials
    const material = new THREE.MeshStandardMaterial({map: texture});

    // Mesh
    const solarObject = new THREE.Mesh(SphereGeometry,material);
    scene.add(solarObject);

    // position of object x axis
    solarObject.position.set(position, 0, position);

    return solarObject;

}

const solarSystem = [
    // creating solar system objects
    makeSolarSystemObjects(3, sunTexture, -60),
    makeSolarSystemObjects(.5, mercuryTexture, 4),
    makeSolarSystemObjects(.7, venusTexture, 8),
    makeSolarSystemObjects(.9, earthTexture, 16),
    makeSolarSystemObjects(.5, marsTexture, 32),
    makeSolarSystemObjects(2, jupiterTexture, 64),
    makeSolarSystemObjects(1.5, saturnTexture, 80),
    makeSolarSystemObjects(1.2, uranusTexture, 96),
    makeSolarSystemObjects(1, nepturneTexture, 110)
];


const addPivot = () => {
    for(var i=0;i<pivotPoint.length; i++){
        solarSystem[0].add(pivotPoint[i]);
    }
    rotateAroundSun(solarSystem, pivotPoint);
}

function rotateAroundSun(planet, pivots){
    for(var i=1;i<planet.length; i++){
        pivots[i-1].add(planet[i]);
    }
}

addPivot();

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();
const tick = () =>
{   
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    for(var i=1;i<solarSystem.length;i++){
        solarSystem[i].rotation.y = .2 * elapsedTime;
        solarSystem[i].rotation.y += 0.2 * (solarSystem[i].rotation.y);
        solarSystem[i].rotation.x += 0.2 * (solarSystem[i].rotation.x);
        solarSystem[i].position.z += 0.2 * (solarSystem[i].rotation.x);
    }

    pivotPoint[0].rotation.y += 0.05;
    pivotPoint[1].rotation.y += 0.03;
    pivotPoint[2].rotation.y += 0.009;
    pivotPoint[3].rotation.y += 0.007;
    pivotPoint[4].rotation.y += 0.005;
    pivotPoint[5].rotation.y += 0.002;
    pivotPoint[6].rotation.y += 0.0009;
    pivotPoint[7].rotation.y += 0.0006;


    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();
