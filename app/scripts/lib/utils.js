/* eslint no-console:0 */
/* global THREE */
import Delaunay from 'delaunay-triangulation'

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
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
