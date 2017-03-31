uniform float width;
uniform float height;
uniform float time;
varying float x;
varying float y;
varying vec2 vUv;
void main() {
    x = position.x / 10.0;
    y = position.y / 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
