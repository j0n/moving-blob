/* eslint no-console:0 */
import Matter from 'matter-js'
import Delaunay from 'delaunay-triangulation'
// import {default as matterTriangle, checkStatic} from './triangle'
// import {default as triangle} from '../triangle'
import {generateTriangles, update as UtilRender, getPoints } from './utils'
import {default as setupThree} from '../setup'
// import {changeColor} from '../triangle'
import TWEEN from 'tween.js'

var { camera, scene, renderer } = setupThree();

var points, triangles, bodies, threeTriangles;

var engine;

var Engine = Matter.Engine;
var World = Matter.World;


document.addEventListener('keydown', function (e) {
  var rbodies = Matter.Composite.allBodies(engine.world);
  var middleBodies = rbodies.filter((body) => {
    return body.position.y > 200 && body.position.y < 600;
  })
  // World.clear(engine.world, false);
  // threeTriangles.forEach((obj) => {
    // scene.remove(obj.triangle);
  // })
  // var width = document.documentElement.clientWidth;
  // var height = document.documentElement.clientHeight;

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
  e.preventDefault();
  return false;
}.bind(null))

// var rmapped = 0;
// Render function
//
var coords = { x: 0, y: 0 };
new TWEEN.Tween(coords)
  .to({ x: 100, y: 100 }, 1000)
  .onUpdate(function() {
    console.log(this.x, this.y);
  })
  .start();
const go = function (time) {
  window.requestAnimationFrame(go)
  TWEEN.update(time);
  UtilRender(camera, Matter.Composite.allBodies(engine.world), threeTriangles);
  /*
  var h = rmapped * 0.01 % 1;
  var s = 0.5;
  var l = 0.5;
  light.color.setHSL ( h, s, l );
  rmapped += 0.5;
  */
  // threeTriangles.forEach((tri) => {
    // console.log(tri.triangle);
    // changeColor(tri.triangle)
  // })
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
