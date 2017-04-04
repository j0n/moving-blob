/* eslint no-console:0 */
/* global THREE */

import fps from 'fps'
import setup from './lib/setup'
import createRomb from './lib/createRomb'
import sphere from './lib/colorSphere'
import {default as triangle, animate as triangleAnimate} from './lib/triangle'
import {default as plane, animate as planeAnimate} from './lib/planeWithShader'
import blob from './lib/theGradientBlob'

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
var ticker = fps({
  every: 10   // update every 10 frames
})
import Delaunay from 'delaunay-triangulation'

var { camera, scene, renderer } = setup();

var points  = [];
console.time();
for (var k = 0; k < 50; k++) {
  points.push(
    new Delaunay.Point(
      (Math.random() * 40)-20,
      (Math.random() * 20)-10
    )
  )
}
const myPlane = plane();
// scene.add(myPlane);
var dtri = Delaunay.triangulate(points);

console.log(dtri[0]);
var dtris = [];
for (var i = 0, ii = dtri.length; i < ii; i++) {
  const tri = triangle(
    new THREE.Vector3(dtri[i].p1.x, dtri[i].p1.y, 1),
    new THREE.Vector3(dtri[i].p2.x, dtri[i].p2.y, 1),
    new THREE.Vector3(dtri[i].p3.x, dtri[i].p3.y, 1)
  )
  dtris.push(tri);
  scene.add(tri);
}
console.timeEnd();



const clock = new THREE.Clock();


var light = new THREE.DirectionalLight(0xffffff );
light.position.set(0, 0, 1 );
scene.add(light);

// plane.position.x = -400;
//
const sphereObj = sphere();
// scene.add(sphereObj);
const romb = createRomb(0, 0, 4)
// scene.add(romb);
const myBlob = blob();
scene.add(myBlob);

function animate () {
  ticker.tick()
  const delta = clock.getDelta();
  sphereObj.rotation.x += 0.01;
  sphereObj.rotation.z += 0.01;
  romb.rotation.z += 0.01;
  myPlane.rotation.z += 0.001;

  /*
  points = points.map((p) => {
    return new Delaunay.Point(
      p.x + ((Math.random() - 0.5)/30),
      p.y + ((Math.random() - 0.5)/30)
    )
  }) */
  var newTriangles = Delaunay.triangulate(points);

  planeAnimate(delta);

  dtris.forEach((tri, index) => {
    if (newTriangles[index]) {
      triangleAnimate(tri, {
        x: newTriangles[index].p1.x,
        y: newTriangles[index].p1.y
      },{
        x: newTriangles[index].p2.x,
        y: newTriangles[index].p2.y
      },{
        x: newTriangles[index].p3.x,
        y: newTriangles[index].p3.y
      }, index);
    }
  })
  // controls.update();
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// Start animating
animate()
