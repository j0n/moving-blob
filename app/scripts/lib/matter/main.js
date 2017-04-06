/* eslint no-console:0 */
import Matter from 'matter-js'
import Delaunay from 'delaunay-triangulation'
// import {default as matterTriangle, checkStatic} from './triangle'
// import {default as triangle} from '../triangle'
import {generateTriangles, update as UtilRender, getPoints } from './utils'
import {default as setupThree} from '../setup'

var { camera, scene, renderer } = setupThree();

var points, triangles, bodies, threeTriangles;

var engine;

var Engine = Matter.Engine;
var World = Matter.World;


/*
var rbodies = Matter.Composite.allBodies(engine.world);
var middleBodies = rbodies.filter((body) => {
  return body.position.y > 200 && body.position.y < 600;
}) */
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  World.clear(engine.world, false);
  threeTriangles.forEach((obj) => {
    scene.remove(obj.triangle);
  })
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  var newPoint =
    new Delaunay.Point(
      (Math.random() * width),
      (Math.random() * height)
    )
  points.push(newPoint)
  triangles = Delaunay.triangulate(points);
  threeTriangles = [];
  const newObjects = generateTriangles(triangles, camera, scene);
  // for (
  bodies = newObjects.bodies;
  threeTriangles = [];
  threeTriangles = newObjects.threeTriangles;

  World.add(engine.world, [].concat(bodies));

  // console.log('r', rbodies);
  var rbodies = Matter.Composite.allBodies(engine.world);
  for (var i = 0, ii = rbodies.length; i < ii; i++) {
    const body = rbodies[i];
    if (body.position.x === newPoint.x && body.position.y === newPoint.y) {
      setTimeout(function () {
        Matter.Body.applyForce(body, {
          x: 0.001,
          y: 0.001
        }, {
          x: 0.03,
          y: 0.01
        });
      }, 100)
      i = ii;
    }
  }

  /*
  middleBodies.forEach((body) =>  {
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
  */

  return false;
}.bind(null))

// Render function
const go = function () {
  window.requestAnimationFrame(go)
  UtilRender(camera, Matter.Composite.allBodies(engine.world), threeTriangles);
  renderer.render(scene, camera)
}
export function update(camera, threeTriangles) {
  UtilRender(camera, Matter.Composite.allBodies(engine.world), threeTriangles);
}
export default function setup (camera, scene) {
  points = getPoints();
  triangles = Delaunay.triangulate(points);

  const result = generateTriangles(triangles, camera, scene)
  bodies = result.bodies;
  threeTriangles = result.threeTriangles;

  engine = Engine.create();
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  World.add(engine.world, [].concat(bodies));
  // run the engine
  Engine.run(engine);
  go();
  return {threeTriangles}
}
setup(camera, scene);
