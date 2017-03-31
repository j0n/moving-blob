varying float x;
varying float y;
uniform float time;
varying vec2 vUv;
void main() {
    vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * 0.1;
    // -- gl_FragColor = vec4(uvTimeShift[0], uvTimeShift[1], time, 1);
    gl_FragColor = vec4(x*0.5, y * (time * 0.40), 0.5, 0.4);
}
