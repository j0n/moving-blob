/* global THREE */
export default function () {
  var geometry = new THREE.IcosahedronGeometry(4, 1);
  var color, p, vertexIndex;
  var radius = 4;

  var faceIndices = [ 'a', 'b', 'c' ];
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
    var f = geometry.faces[ i ];
    for( var j = 0; j < 3; j++ ) {
      vertexIndex = f[ faceIndices[ j ] ];
      p = geometry.vertices[ vertexIndex ];
      color = new THREE.Color( 0xffffff );
      color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );
      f.vertexColors[ j ] = color;
    }
  }
  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    shininess: 0
  });
  return new THREE.Mesh( geometry, mat );
}
