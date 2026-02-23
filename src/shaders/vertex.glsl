
attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying vec3 v_normal;  
    void main(void) {
        v_normal = aPosition;
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    }