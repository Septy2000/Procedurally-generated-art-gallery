// import * as THREE from './../node_modules/three/build/three.module.js';
import * as THREE from './../../../node_modules/three/build/three.module.js';

const canvas1 = document.getElementById('canvas'); 

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(72, 800 / 600, 0.1, 1000)
camera.position.z = 10;

let renderer = new THREE.WebGLRenderer({
    canvas: canvas1
})
renderer.setClearColor("#e5e5e5");
renderer.setSize(800, 600);
// document.body.appendChild(renderer.domElement);


let geometry = new THREE.SphereGeometry(1, 10, 10);
let material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);

export function generate() {
    console.log("EE");
    renderer.render(scene, camera);
}


// renderer.setPixelRatio(Math.min(wi))