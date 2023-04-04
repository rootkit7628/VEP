import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Image
import nebula from '../img/nebula.jpg';


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
// renderer.setClearColor( 0xF04938 );
// const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const orbit = new OrbitControls( camera, renderer.domElement );
// scene.background = textureLoader.load( nebula );
scene.background = cubeTextureLoader.load( [
    nebula,
    nebula,
    nebula,
    nebula,
    nebula,
    nebula
] );

camera.position.set( -10, 30, 30 );
orbit.update();

// Helpers (axis and grid)
// const axeHelper = new THREE.AxesHelper( 2 );
// scene.add( axeHelper );
// const gridHelper = new THREE.GridHelper( 30 );
// scene.add( gridHelper );

// Box
const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxMaterial = new THREE.MeshStandardMaterial( { color: 0x51a7d6 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
box.position.set( 0, -3, 0 );
box.castShadow = true;
scene.add( box );

// White Plane
const planeGeometry = new THREE.PlaneGeometry( 30, 30 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( plane );
plane.receiveShadow = true;
plane.rotation.x = Math.PI / 2;

// Sphere
const sphereGeometry = new THREE.SphereGeometry( 3 , 50 , 50);
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x135c7a , wireframe: false} );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set( 0, 4, 0 );
scene.add( sphere );
sphere.castShadow = true;
let step = 0;

// GUI to change config of the sphere (color, wireframe, speed)
const gui = new dat.GUI();
options = {
    sphereColor : 0x135c7a ,
    sphereWireframe: false,
    sphereSpeed: 0.01,

    slAngle: 0.1,
    slIntensity: 0.4,
    slColor: 0xffffff,
    slPenumbra: 0.1,
};
gui.addColor( options, 'sphereColor' ).onChange( (e) => {
    sphere.material.color.set( options.sphereColor );
});
gui.add( options, 'sphereWireframe' ).onChange( (e) => {
    sphere.material.wireframe = e;
});
gui.add( options, 'sphereSpeed', 0, 0.1 );

gui.add( options, 'slAngle', 0, 1 );
gui.add( options, 'slIntensity', 0, 1 );
gui.addColor( options, 'slColor' );
gui.add( options, 'slPenumbra', 0, 1 );

// Light 
const ambiantLight = new THREE.AmbientLight( 0xffffff, 0.3 );
scene.add( ambiantLight );

const dLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
dLight.position.set( 0, 30, 0 );
scene.add( dLight );
dLight.castShadow = true;
dLight.shadow.camera.bottom = -15;
dLight.shadow.camera.top = 15;
dLight.shadow.camera.left = -15;
dLight.shadow.camera.right = 15;

const spotLight = new THREE.SpotLight( 0xffffff, 0.4 );
spotLight.position.set( 0, -40, 0 );
scene.add( spotLight );
spotLight.castShadow = true;
spotLight.angle = 0.1;

// Light helper
// const dLightHelper = new THREE.DirectionalLightHelper( dLight, 1 );
// scene.add( dLightHelper );

// const dLightShadowHelper = new THREE.CameraHelper( dLight.shadow.camera );
// scene.add( dLightShadowHelper );

// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );



// Animation of box and sphere
function animate() {
    box.rotation.x += 0.03;
    box.rotation.y += 0.01;

    sphere.position.x = 10 * Math.cos( step );
    sphere.position.z = 10 * Math.sin( step );
    step += options.sphereSpeed;

    spotLight.angle = options.slAngle;
    spotLight.intensity = options.slIntensity;
    spotLight.color.set( options.slColor );
    spotLight.penumbra = options.slPenumbra;

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );