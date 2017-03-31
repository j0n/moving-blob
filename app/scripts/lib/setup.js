/* global THREE */

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
// var OrbitControls = require('three-orbit-controls')(THREE);
const createControls = require('orbit-controls');

module.exports = setup

function setup (opt = {}) {
  // Scale for retina
  const dpr = window.devicePixelRatio
  // Our WebGL renderer with alpha and device-scaled
  const renderer = new THREE.WebGLRenderer(Object.assign({
    antialias: true // default enabled
  }, opt))
  renderer.setClearColor(0xf0f0f0)
  renderer.setPixelRatio(dpr)

  // Add the <canvas> to DOM body
  const canvas = renderer.domElement
  // const base = document.getElementById(opt.div)
  document.body.appendChild(canvas)

  // perspective camera
  const near = 1
  const far = 3000
  const fieldOfView = 65

  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height
  const camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far)
  const target = new THREE.Vector3()
  camera.position.z = 3

  renderer.setClearColor(0xf0f0f0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // var controls = OrbitControls(camera, renderer.domElement);

  // 3D scene
  const scene = new THREE.Scene()
    /*
  var light = new THREE.PointLight(0xffffff, 10)
  light.position.set(10, 10, 30)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0xacacac))
  */

  // slick 3D orbit controller with damping
  const controls = createControls({
    canvas,
    distanceBounds: [ 1, 10 ],
    distance: 1502.5,
    phi: 90 * Math.PI / 180
  }, opt);

  // Update renderer size
  window.addEventListener('resize', resize)

  // Setup initial size & aspect ratio
  resize()
  updateControls();

  return {
    camera,
    scene,
    renderer,
    canvas,
    controls
  }

  function updateControls () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    // update camera controls
    controls.update();
    camera.position.fromArray(controls.position);
    camera.up.fromArray(controls.up);
    target.fromArray(controls.direction).add(camera.position);
    camera.lookAt(target);

    // Update camera matrices
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }


  function resize () {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    // Update camera matrices
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    updateControls();
  }
}
