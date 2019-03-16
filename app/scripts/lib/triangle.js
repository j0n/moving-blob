/* eslint no-console:0 */
/* global THREE */
import colorMix from 'color-mix'
import Please from 'pleasejs'
import {distance} from './utils'


const redColors = Please.make_scheme(
  {
    h: 220,
    s: .7,
    v: .75
  },
  {
    scheme: 'tri',
    format: 'rgb'
  });

if (typeof global.THREE === 'undefined') {
  window.THREE = require('three')
}
export default function (
    v1 = new THREE.Vector3(0, 0, 0),
    v2 = new THREE.Vector3(2, 0, 0),
    v3 = new THREE.Vector3(2, 2, 0)) {
    // Create our vertex/fragment shaders

  /*
  const material = new THREE.RawShaderMaterial({
    vertexShader: require('./shaders/vert2.glsl')(),
    fragmentShader: require('./shaders/frag.glsl')()
  });
  */
  var material = new THREE.MeshPhongMaterial( {
    color: 0xffffff,
    vertexColors: THREE.VertexColors,
    shininess: 0
  });
  var verts = [v1, v2, v3];
  var holes = [];

  var geometry = new THREE.Geometry();
  geometry.vertices = verts;

  var triangles = THREE.ShapeUtils.triangulateShape(verts, holes);
  for( var m = 0; m < triangles.length; m++ ){
    var face = new THREE.Face3(
      triangles[m][0],
      triangles[m][1],
      triangles[m][2]
    )
    geometry.faces.push(face);
  }
  geometry.computeVertexNormals();
  // let radius = 2;
  // var faceIndices = [ 'a', 'b', 'c' ];
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
    var f = geometry.faces[ i ];
    for( var j = 0; j < 3; j++ ) {
      var v = distance(verts[j], {x: 0, y: 0})/10;
      const color = redColors[
        Math.floor(Math.random() * redColors.length)
      ];
      // vertexIndex = f[ faceIndices[ j ] ];
      // p = geometry.vertices[ vertexIndex ];
      const setColor = new THREE.Color();
      setColor.setRGB((color.r/255) + v, color.g/255 + v, color.b/255 + v);
      f.vertexColors[ j ] = setColor;
    }
  }
  material.transparent = true;
  if (v1.y < 0.3) {
    material.opacity = 1;// - (v1.y / 1);//(Math.random()/50);//1 - ((v1.x*105)/60);
  } else {
    // material.opacity = 0;
  }
  material.opacity = 1;

  return new THREE.Mesh(geometry, material);
}
export function animate (triangle, v1, v2, v3, index) {
  var needsUpdate = false;
  var vs = [v1, v2, v3];
  vs.sort((a, b) => {
    return a.y - b.y;
  })
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
  // var radius = 10;
  // var color, p, vertexIndex;
  if (index === 20) {
      // console.log(v1.y, v2.y, v3.y);
  }

  /*
  var faceIndices = [ 'a', 'b', 'c' ];
  for ( var i = 0; i < triangle.geometry.faces.length; i ++ ) {
    var f = triangle.geometry.faces[i];
    for(var j = 0; j < 3; j++) {
      vertexIndex = f[faceIndices[j]];
      p = triangle.geometry.vertices[vertexIndex];
      color = new THREE.Color( 0xffffff );
      color.setHSL( ( vs[0].y / 20) / 10, 1.0, 0.5 );
      f.vertexColors[ j ] = color;
    }
  } */
  triangle.geometry.colorsNeedUpdate = true;
  triangle.geometry.verticesNeedUpdate = needsUpdate;
}
export function changeColor (triangle, goalColors) {
  var geometry = triangle.geometry;
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
    var f = geometry.faces[ i ];
    f.vertexColors.forEach((col, index) => {
      if (index === 0) {
        const value = col.r > 0.9 ? -0.005 : 0.005;
        col.setRGB(
          col.r + value,
          col.g + value,
          col.b + value)
      }
    })
    triangle.geometry.colorsNeedUpdate = true;
  }
}
