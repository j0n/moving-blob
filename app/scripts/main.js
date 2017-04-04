/* eslint no-console:0 */
/* global THREE */

import fps from 'fps'
import setup from './lib/setup'
import createRomb from './lib/createRomb'
import sphere from './lib/colorSphere'
import {default as triangle} from './lib/triangle'
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
      (Math.random() * 45)-22.5,
      (Math.random() * 30)-15
    )
  )
}
const myPlane = plane();
// scene.add(myPlane);
var dtri = Delaunay.triangulate(points);

// console.log(dtri);
// var dtris = [];
var blobPoints = {};
for (var i = 0, ii = dtri.length; i < ii; i++) {
  var blobPointKey1 = 'p_' + dtri[i].p1.x + '_' + dtri[i].p1.y;
  var blobPointKey2 = 'p_' + dtri[i].p2.x + '_' + dtri[i].p2.y;
  var blobPointKey3 = 'p_' + dtri[i].p3.x + '_' + dtri[i].p3.y;

  const tri = triangle(
    new THREE.Vector3(dtri[i].p1.x, dtri[i].p1.y, 1),
    new THREE.Vector3(dtri[i].p2.x, dtri[i].p2.y, 1),
    new THREE.Vector3(dtri[i].p3.x, dtri[i].p3.y, 1)
  )
  if (typeof blobPoints[blobPointKey1] === 'undefined') {
    console.log(tri);
    blobPoints[blobPointKey1] = {
      triangles: [tri],
      point: {
        x: dtri[i].p1.x,
        y: dtri[i].p1.y
      }
    }
  } else {
    blobPoints[blobPointKey1].triangles.push(tri)
  }
  if (typeof blobPoints[blobPointKey2] === 'undefined') {
    blobPoints[blobPointKey2] = {
      triangles: [tri],
      point: {
        x: dtri[i].p2.x,
        y: dtri[i].p2.y
      }
    }
  } else {
    blobPoints[blobPointKey2].triangles.push(tri)
  }
  if (typeof blobPoints[blobPointKey3] === 'undefined') {
    blobPoints[blobPointKey3] = {
      triangles: [tri],
      point: {
        x: dtri[i].p3.x,
        y: dtri[i].p3.y
      }
    }
  } else {
    blobPoints[blobPointKey3].triangles.push(tri)
  }

  scene.add(tri);
}
console.log('blobPoints', blobPoints);
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
  for (var key in blobPoints) {
    if (Math.random() > 0.5) {
      var obj = blobPoints[key];
      obj.newX = blobPoints[key].point.x + ((Math.random() - 0.5)/10);
      obj.newY = blobPoints[key].point.y + ((Math.random() - 0.5)/10);
      blobPoints[key].triangles.forEach((tri) => {
        tri.geometry.vertices.forEach((vert) => {
          // console.log(vert.x, obj.point.x);
          if (vert.x === blobPoints[key].point.x && vert.y === blobPoints[key].point.y) {
            // console.log('YO');
            vert.x = obj.newX;
            vert.y = obj.newY;
          }
        })

        tri.geometry.colorsNeedUpdate = true;
        tri.geometry.verticesNeedUpdate = true;
      })
      blobPoints[key].point = {
        x: obj.newX,
        y: obj.newY
      }
    }
  }

  /*
  points = points.map((p) => {
    return new Delaunay.Point(
      p.x + ((Math.random() - 0.5)/30),
      p.y + ((Math.random() - 0.5)/30)
    )
  }) */

  // var newTriangles = Delaunay.triangulate(points);

  /*
  var dtri2 = Delaunay.triangulate(points);
  dtri.forEach((t) => {
    dtri2.forEach((t2) => {
      if (JSON.stringify(t) !== JSON.stringify(t2)) {
        console.log('ident');
      }
    })
  }) */

  planeAnimate(delta);

  /*
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
  }) */
  // controls.update();
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// Start animating
animate()
