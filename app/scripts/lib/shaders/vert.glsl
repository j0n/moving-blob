attribute vec4 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying float distFromCenter;
varying vec3 posFromCenter;
varying vec3 vNormal;

void main () {
    vNormal = normal;
    distFromCenter = distance(position.xyz, vec3(0.0));
    posFromCenter = position.xyz * 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * position;
}
