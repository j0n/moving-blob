import Matter from 'matter-js'
export default function (p1, p2, p3) {
  // var a = Matter.Bodies.circle(p1.x, p1.y, 5);
  // var b = Matter.Bodies.circle(p2.x, p2.y, 5);
  // var c = Matter.Bodies.circle(p3.x, p3.y, 5);
  var c1 = Matter.Constraint.create({
    bodyA: p1,
    bodyB: p2,
    stiffness: 0.008
  })
  var c2 = Matter.Constraint.create({
    bodyA: p2,
    bodyB: p3,
    stiffness: 0.01
  })
  var c3 = Matter.Constraint.create({
    bodyA: p1,
    bodyB: p3,
    stiffness: 0.01
  })
  return [c1, c2, c3]
}
export function checkStatic(x, y, w, h) {
  var margin = -80;
  let isStatic = (x === margin && y === margin);
  if (isStatic) {
    return isStatic;
  }
  isStatic= (x === w && y === margin);
  if (isStatic) {
    return isStatic;
  }
  isStatic = (x === w && y === h);
  if (isStatic) {
    return isStatic;
  }
  isStatic = (x === margin && y === h);
  return isStatic;
}
