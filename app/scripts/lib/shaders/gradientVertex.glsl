uniform float width;
uniform float height;
varying float x;
varying float y;
void main() {
    x = position.x / 2.0;
    y = position.y / 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
