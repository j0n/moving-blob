/* eslint no-console:0 */
/* global THREE */

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
export default function (x = 0, y = 0, size = 2) {
    // Create our vertex/fragment shaders
  const myOwnmaterial = new THREE.RawShaderMaterial({
    vertexShader: require('./shaders/vert2.glsl')(),
    fragmentShader: require('./shaders/frag.glsl')()
  });
  var verts = [];
  var holes = [];
  verts.push(new THREE.Vector3(x, y, 0));
  verts.push(new THREE.Vector3(x + size, y, 0));
  verts.push(new THREE.Vector3(x + size, y + size, 0));
  verts.push(new THREE.Vector3(x, y + size, 0));
  verts.push(new THREE.Vector3(x, y, 0));

  var geometry = new THREE.Geometry();
  geometry.vertices = verts;

  var triangles = THREE.ShapeUtils.triangulateShape(verts, holes);
  for( var i = 0; i < triangles.length; i++ ){
    geometry.faces.push(
      new THREE.Face3(
        triangles[i][0],
        triangles[i][1],
        triangles[i][2]
      )
    );
  }

  geometry.center();
  // geometry.scale(0.7, 0.7, 0.7);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, myOwnmaterial);
}
export function animate () {
  console.log('anim');
}
