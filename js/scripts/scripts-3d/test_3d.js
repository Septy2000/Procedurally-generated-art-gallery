import * as THREE from 'three';

const canvas = document.getElementById('canvas'); 

const scene = new THREE.Scene();

const geometry = new THREE.TorusGeometry( .7, .2, 16, 100);

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);
// renderer.setPixelRatio(Math.min(wi))