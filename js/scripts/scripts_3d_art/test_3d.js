// import * as THREE from './../node_modules/three/build/three.module.js';
import * as THREE from './../../../node_modules/three/build/three.module.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(72, 1200 / 900, 0.1, 1000)
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("canvas__3d") 
});
renderer.setPixelRatio(1200 / 900);
renderer.setClearColor("#e5e5e5");
renderer.setSize(1200, 900);

let geometry = new THREE.SphereGeometry(1, 10, 10);
let material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);

export function generate() {
    renderer.render(scene, camera);
}