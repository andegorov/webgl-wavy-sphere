precision mediump float;

varying vec3 v_normal;

void main(void) {
    vec3 color = (v_normal + 1.0) * 0.5;
    gl_FragColor = vec4(color, 1.0);
}