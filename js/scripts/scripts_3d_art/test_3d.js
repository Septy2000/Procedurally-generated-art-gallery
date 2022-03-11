import * as THREE from './../../../node_modules/three/build/three.module.js';
import * as res from '../../helper_scripts/resolution.js'

let scene, camera, renderer, plane, geometry, material, mesh, light;

// Canvas
let canvas_3d = document.getElementById("canvas__3d");
canvas_3d.width = 800;
canvas_3d.height = 600;


// Texture loader
const loader = new THREE.TextureLoader();
// const texture = loader.load('textures/texture.jpg');

// Scene
scene = new THREE.Scene();
    

// Camera
camera = new THREE.PerspectiveCamera(72, 4 / 3, 0.1, 1000);
camera.position.z = 2;


// Renderer
renderer = new THREE.WebGLRenderer({

    canvas: document.getElementById("canvas__3d") 
});
renderer.setPixelRatio(4 / 3);
renderer.setClearColor("#e5e5e5");


// Geometry 
geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64)
material = new THREE.MeshStandardMaterial({
    color: 'green'
    // map: texture
});


// Mesh
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light
light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);


// Animate
export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
canvas_3d.addEventListener('mousewheel', e => {
    if (e.deltaY > 0) {
        camera.position.z += 1;
    }
    else {
        camera.position.z -= 1;
    }
    renderer.render(scene, camera);


});