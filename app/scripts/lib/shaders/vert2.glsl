attribute vec4 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vNormal;
varying vec2 uv;

void main () {
    vNormal = normal;

    vec4 offset = position;
    float dist = 0.25;
    offset.xyz += normal * dist;
    uv = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * offset;
}
