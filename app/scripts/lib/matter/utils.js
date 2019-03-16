/* eslint no-console:0 */

import Matter from 'matter-js'
import {default as matterTriangle, checkStatic} from './triangle'
import {default as triangle} from '../triangle'
import Delaunay from 'delaunay-triangulation'
import {convertPoint} from '../utils';

export function toWorld(camera, x, y) {
  return convertPoint(camera, x, y);
}


var createBody = function (w, h, x, y) {
  return Matter.Bodies.circle(x, y, 10, {
    isStatic: checkStatic(x, y, w, h)
  });
}

export function generateTriangles (triangles, camera, scene) {
  var blobPoints = [];
  var threeTriangles = [];
  var bodies = [];

  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;

  var fixedW  = width + 160
  var fixedH  = height + 160
  var createB = createBody.bind(null, fixedW, fixedH);
  triangles.forEach((tri) => {
    var pointKey1 = 'p_' + tri.p1.x + '_' + tri.p1.y;
    var pointKey2 = 'p_' + tri.p2.x + '_' + tri.p2.y;
    var pointKey3 = 'p_' + tri.p3.x + '_' + tri.p3.y;
    let p1, p2, p3;

    const ThreeTriangle = triangle(
      toWorld(camera, tri.p1.x, tri.p1.y),
      toWorld(camera, tri.p2.x, tri.p2.y),
      toWorld(camera, tri.p3.x, tri.p3.y)
    )

    if (typeof blobPoints[pointKey1] === 'undefined') {
      p1 = createB(tri.p1.x, tri.p1.y)
      bodies.push(p1);
      blobPoints[pointKey1] = {
        point: p1,
      }
    } else {
      p1 = blobPoints[pointKey1].point;
    }
    if (typeof blobPoints[pointKey2] === 'undefined') {
      p2 = createB(tri.p2.x, tri.p2.y);
      bodies.push(p2);
      blobPoints[pointKey2] = {
        point: p2,
      }
    } else {
      p2 = blobPoints[pointKey2].point;
    }
    if (typeof blobPoints[pointKey3] === 'undefined') {
      p3 = createB(tri.p3.x, tri.p3.y);
      bodies.push(p3);
      blobPoints[pointKey3] = {
        point: p3,
      }
    } else {
      p3 = blobPoints[pointKey3].point;
    }

    threeTriangles.push({
      triangle: ThreeTriangle,
      p1: p1.id,
      p2: p2.id,
      p3: p3.id
    })
    bodies = bodies.concat(matterTriangle(p1, p2, p3))
    scene.add(ThreeTriangle);
  })
  return {bodies, threeTriangles}
}

export function update (camera, bodies, threeTriangles) {
  bodies.forEach((body) => {
    const xy = toWorld(camera, body.position.x, body.position.y);
    threeTriangles.forEach((obj) => {
      var toUpdate = false;
      if (obj.p1 === body.id) {
        if (obj.triangle.geometry.vertices[0].x !== xy.x) {
          toUpdate = true;
          obj.triangle.geometry.vertices[0].x = xy.x
        }
        if (obj.triangle.geometry.vertices[0].y !== xy.y) {
          obj.triangle.geometry.vertices[0].y = xy.y
          toUpdate = true;
        }
      }
      else if (obj.p2 === body.id) {
        if (obj.triangle.geometry.vertices[1].x !== xy.x) {
          toUpdate = true;
          obj.triangle.geometry.vertices[1].x = xy.x
        }
        if (obj.triangle.geometry.vertices[1].y !== xy.y) {
          obj.triangle.geometry.vertices[1].y = xy.y
          toUpdate = true;
        }
      }
      else if (obj.p3 === body.id) {
        if (obj.triangle.geometry.vertices[2].x !== xy.x) {
          toUpdate = true;
          obj.triangle.geometry.vertices[2].x = xy.x
        }
        if (obj.triangle.geometry.vertices[2].y !== xy.y) {
          obj.triangle.geometry.vertices[2].y = xy.y
          toUpdate = true;
        }
      }
      if (toUpdate) {
        obj.triangle.geometry.colorsNeedUpdate = true;
        obj.triangle.geometry.verticesNeedUpdate = true;
      }
    })
  })
}

export function getPoints () {
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  var fixedW  = width + 160
  var fixedH  = height + 160
  var margin = -80;
  var points = [
    new Delaunay.Point(margin, margin),
    new Delaunay.Point(fixedW/2, margin),
    new Delaunay.Point(fixedW, margin),
    new Delaunay.Point(fixedW, fixedH ),
    new Delaunay.Point(fixedW, fixedH /2),
    new Delaunay.Point(fixedW/2, fixedH),
    new Delaunay.Point(margin, fixedH),
    new Delaunay.Point(margin, fixedH/2)
  ]
  for (var k = 0; k < 10; k++) {
    points.push(
      new Delaunay.Point(
        (Math.random() * width),
        (Math.random() * height)
      )
    )
  }
  return points;
}

// addNewPoint x, y, newTrianels
// get all new triangels

