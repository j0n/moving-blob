/* eslint no-console:0 */
/* global THREE */
import Delaunay from 'delaunay-triangulation'

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}

export function distance (point1, point2) {
  return Math.sqrt(
          Math.pow(point1.x - point2.x, 2) +
          Math.pow(point1.y - point2.y, 2));
}

export function getTriangles(points = []) {
  for (var k = 0, kk = points.length; k < kk; k++) {
    points.push(
      new Delaunay.Point(
          points[k].x,
          points[k].y
      )
    )
  }
  return Delaunay.triangulate(points);
}
export function getVectors(amountOfPoints = 50) {
  let vectors = [];
  for (var k = 0; k < amountOfPoints; k++) {
    vectors.push(new THREE.Vector3((Math.random() * 40) - 20, (Math.random() * 20) - 10, 1))
  }
  return vectors;
}
export function convertPoint (camera, x, y) {
  var vector = new THREE.Vector3();
  vector.set(
        (x / window.innerWidth) * 2 - 1,
        - (y / window.innerHeight) * 2 + 1,
        1);
  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = - camera.position.z / dir.z;
  return camera.position.clone().add(dir.multiplyScalar(distance));
}
