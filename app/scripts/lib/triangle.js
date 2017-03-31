/* eslint no-console:0 */
/* global THREE */

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
export default function (
    v1 = new THREE.Vector3(0, 0, 0),
    v2 = new THREE.Vector3(2, 0, 0),
    v3 = new THREE.Vector3(2, 2, 0)) {
    // Create our vertex/fragment shaders
  /*
  const myOwnmaterial = new THREE.RawShaderMaterial({
    vertexShader: require('./shaders/vert2.glsl')(),
    fragmentShader: require('./shaders/frag.glsl')()
  }); */
  var material = new THREE.MeshBasicMaterial( {
    color: 0xf0f0f0,
    shading: THREE.FlatShading,
    vertexColors: THREE.FaceColors
  });
  var verts = [];
  var holes = [];
  verts.push(v1);
  verts.push(v2);
  verts.push(v3);

  var geometry = new THREE.Geometry();
  geometry.vertices = verts;

  var triangles = THREE.ShapeUtils.triangulateShape(verts, holes);
  for( var i = 0; i < triangles.length; i++ ){
    var face = new THREE.Face3(
      triangles[i][0],
      triangles[i][1],
      triangles[i][2]
    )
    face.color.setRGB( Math.random(), Math.random(), Math.random())
    geometry.faces.push(face);
  }

  geometry.center();
  // geometry.scale(0.7, 0.7, 0.7);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}
export function animate (triangle, v1, v2, v3) {
  var needsUpdate = false;
  triangle.geometry.vertices.forEach((v, index) => {
    if (typeof v1 !== 'undefined' && index == 0) {
      needsUpdate = true;
      v.x = v1.x;
      v.y = v1.y;
    }
    if (typeof v2 !== 'undefined' && index == 1) {
      needsUpdate = true;
      v.x = v2.x;
      v.y = v2.y;
    }
    if (typeof v3 !== 'undefined' && index == 2) {
      needsUpdate = true;
      v.x = v3.x;
      v.y = v3.y;
    }
  })
  triangle.geometry.verticesNeedUpdate = needsUpdate;
}
