import * as THREE from './../../../node_modules/three/build/three.module.js';
import * as res from '../../helper_scripts/resolution.js'

let canvas_3d = document.getElementById("canvas__3d");
canvas_3d.width = 800;
canvas_3d.height = 600;

let scene, camera, renderer, geometry, material, mesh, light;

scene = new THREE.Scene();
    
camera = new THREE.PerspectiveCamera(72, 4 / 3, 0.1, 1000);
// camera.position.z = 10;

renderer = new THREE.WebGLRenderer({

    canvas: document.getElementById("canvas__3d") 
});
renderer.setPixelRatio(4 / 3);
renderer.setClearColor("#e5e5e5");

geometry = new THREE.SphereGeometry(1, 10, 10);
material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 25);

scene.add(light);

let animation;
export function animate() {
    console.log(res.width.value);
    console.log(res.height.value);
    requestAnimationFrame(animate);
    geometry.rotateX(0.01);
    geometry.rotateZ(0.01);

    renderer.render(scene, camera);
}

export function stopAnimate() {
    cancelAnimationFrame(animation);
}

canvas_3d.addEventListener('mousewheel', e => {

    console.log(e.deltaY);
    if (e.deltaY > 0) {
        camera.position.z += 1;
    }
    else {
        camera.position.z -= 1;
    }
    renderer.render(scene, camera);


});