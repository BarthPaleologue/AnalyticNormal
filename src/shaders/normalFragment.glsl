precision mediump float;

varying vec3 vNormal;

void main() {
    gl_FragColor = vec4((vNormal + 1.0) / 2.0, 1.0);
}