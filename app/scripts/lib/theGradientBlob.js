/* eslint no-console:0 */
/* global THREE */
import {getVectors, getTriangles} from './utils';
// import deu from 'delaunay-triangulate';


if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
export default function () {
    // Create our vertex/fragment shaders
  const material = new THREE.MeshNormalMaterial( {
    color: 0xffffff,
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    shininess: 0
  });
  // var holes = [];

  const verts = getVectors(100)
  var geometry = new THREE.Geometry();

  var triangles = getTriangles(verts)
  // console.log(triangles);
  var f = 0;
  for(var j = 0; j < triangles.length; j++){
    geometry.vertices.push(
      new THREE.Vector3(triangles[j].p3.x, triangles[j].p3.y, 1),
      new THREE.Vector3(triangles[j].p2.x, triangles[j].p2.y, 1),
      new THREE.Vector3(triangles[j].p1.x, triangles[j].p1.y, 1)
    )
    geometry.faces.push(new THREE.Face3(f, f+1, f+2));
    f+=3;
  }
  var radius = 14;
  var color, p, vertexIndex;
  var faceIndices = [ 'a', 'b', 'c' ];
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
    let f = geometry.faces[ i ];
    for( var k = 0; k < 3; k++ ) {
      vertexIndex = f[ faceIndices[ k ] ];
      p = geometry.vertices[ vertexIndex ];
      color = new THREE.Color( 0xffffff );
      color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );
      f.vertexColors[ k ] = color;
    }
  }

  geometry.center();
  // geometry.scale(0.7, 0.7, 0.7);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}
export function animate () {
  console.log('anim');
}
