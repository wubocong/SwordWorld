var renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 640);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  35, // Field of view
  800 / 640, // Aspect ratio
  0.1, // Near
  10000 // Far
);
camera.position.set(-15, 10, 15);
camera.lookAt(scene.position);
var geometry = new THREE.BoxGeometry(5, 5, 5);
var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);