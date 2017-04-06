/* eslint no-console:0 */
/* global THREE */
import Matter from 'matter-js'
import MatterAttractors from 'matter-attractors'
import Delaunay from 'delaunay-triangulation'
import {default as matterTriangle, checkStatic} from './triangle'
import {default as triangle} from '../triangle'
import {default as plane, animate as planeAnimate} from '../planeWithShader'
import setup from '../setup'
// var projector = new THREE.Projector();


if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
var { camera, scene, renderer } = setup();

const clock = new THREE.Clock();
const myPlane = plane();
scene.add(myPlane);

function toWorld(x, y) {
  var vector = new THREE.Vector3();
  vector.set(
        ( x / window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
        1 );
  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = - camera.position.z / dir.z;
  return camera.position.clone().add( dir.multiplyScalar( distance ) );
}

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
for (var k = 0; k < 30; k++) {
  points.push(
    new Delaunay.Point(
      (Math.random() * width),
      (Math.random() * height)
    )
  )
}
var triangles = Delaunay.triangulate(points);
var blobPoints = [];
var bodies = [];
var special = false;
var createB = function (x, y) {
  return Matter.Bodies.circle(x, y, 10, {
    isStatic: checkStatic(x, y, fixedW, fixedH)
  });
}

var threeTriangles = [];
triangles.forEach((tri) => {
  var pointKey1 = 'p_' + tri.p1.x + '_' + tri.p1.y;
  var pointKey2 = 'p_' + tri.p2.x + '_' + tri.p2.y;
  var pointKey3 = 'p_' + tri.p3.x + '_' + tri.p3.y;
  let p1, p2, p3;

  const ThreeTriangle = triangle(
    toWorld(tri.p1.x, tri.p1.y, 1),
    toWorld(tri.p2.x, tri.p2.y, 1),
    toWorld(tri.p3.x, tri.p3.y, 1)
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
  if (special === false && Math.random() > 0.5) {
    special = p2;
  }
  bodies = bodies.concat(matterTriangle(p1, p2, p3))
  scene.add(ThreeTriangle);
})

renderer.render(scene, camera)



// module aliases
var Engine = Matter.Engine;
// var Render = Matter.Render;
var World = Matter.World;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;
Matter.use(MatterAttractors);

// create a renderer
/*
var render = Render.create({
  element: document.body,
  engine: engine,
  gravity: 0,
  options: {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    showAngleIndicator: true,
  }
});

var body = Matter.Bodies.circle(width/2, height/2, 10, {
  isStatic: true,
  plugin: {
    attractors: [
      function(bodyA, bodyB) {
        return {
          x: (bodyA.position.x - bodyB.position.x) * 1e-6,
          y: (bodyA.position.y - bodyB.position.y) * 1e-6,
        };
      }
    ]
  }
})*/

// add all of the bodies to the world
World.add(engine.world, [].concat(bodies));
//var forceIndex = 0;
var rbodies = Matter.Composite.allBodies(engine.world);
var middleBodies = rbodies.filter((body) => {
  return body.position.y > 200 && body.position.y < 600;
})
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  // var rbodies = Matter.Composite.allBodies(engine.world);
  middleBodies.forEach((body) =>  {
    console.log('body', body.position.y);
    if (Math.random() > 0.5) {
      Matter.Body.applyForce(body, {
        x: 0.001,
        y: 0.001
      }, {
        x: 0.01,
        y: 0.001
      });
    }
  })
  // forceIndex += 1;
  return false;
})

const go = function () {
  window.requestAnimationFrame(go)
  const delta = clock.getDelta();
  planeAnimate(delta);
  var rbodies = Matter.Composite.allBodies(engine.world);
  rbodies.forEach((body) => {
    const xy = toWorld(body.position.x, body.position.y);
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
  renderer.render(scene, camera)
}
go();

// run the engine
Engine.run(engine);

// run the renderer
// Render.run(render);
