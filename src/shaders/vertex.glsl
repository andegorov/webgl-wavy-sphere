
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_modelViewProjection;

varying vec3 v_normal;  
    void main(void) {
        v_normal = normalize(a_normal);
        gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
    }