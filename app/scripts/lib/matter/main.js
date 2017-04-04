import Matter from 'matter-js'
import MatterAttractors from 'matter-attractors'

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;
Matter.use(MatterAttractors);

// create a renderer
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
var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var bodies = [boxB];
for (var i = 0, ii = 40; i < ii; i++) {
  bodies.push(Bodies.circle((Math.random() * w), (Math.random() * h), 10))
}


var body = Matter.Bodies.circle(w/2, h/2, 20, {
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
})
bodies.push(body);

// add all of the bodies to the world
World.add(engine.world, bodies);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
