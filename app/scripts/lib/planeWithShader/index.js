/* global THREE */
const customUniforms = {
  width: {
    type: "f",
    value: window.innerWidth
  },
  height: {
    type: "f",
    value: window.innerHeight
  },
  time: {
    type: "f",
    value: 1.0
  }
};
export default function () {
  const myOwnmaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: require('./shaders/gradientVertex.glsl')(),
    fragmentShader: require('./shaders/gradientFragment.glsl')()
  });
  var geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
  return new THREE.Mesh(geometry, myOwnmaterial);
}
export function animate (time) {
  customUniforms.time.value += time;
}
