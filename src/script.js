import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';
import { IcosahedronGeometry } from './geom/IcosahedronGeometry';
import { Matrix4 } from './math/Matrix4';
import { Vector3 } from './math/Vector3';

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL не поддерживается');
}


// Создание Икосаэдра
const icosahedron = new IcosahedronGeometry();
const vertices = icosahedron.vertexBuffer;
const indices = icosahedron.indiceBuffer;
const normals = icosahedron.normalBuffer;


// Создание MVP матрицы
const modelMatrix = new Matrix4();

const eye = new Vector3( 0, 0, 5);
const center = new Vector3( 0, 0, 0);
const up = new Vector3( 0, 1, 0);
const viewMatrix = createViewMatrix( eye, center, up);

const aspect = gl.canvas.width / gl.canvas.height;
const projectionMatrix = createPerspectiveProjectionMatrix( Math.PI / 4, aspect, 0.1, 100);
const mvpMatrix = new Matrix4();

mvpMatrix.multiplyMatrices( modelMatrix,viewMatrix  ).multiply(projectionMatrix);
console.log('pro',projectionMatrix.elements);
console.log('mvp',mvpMatrix.elements);
// projectionMatrix.set(
//     1.3570, 0,      0,      0,
//     0,      2.4142, 0,      0,
//     0,      0,     -1.0020, -1,
//     0,      0,     -0.2002,  0
// )


// Создание буфера вершины и индекса 
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indiceBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


// Шейдеры
const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = createShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
);


// Создание программы
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


// Привязка атрибута позиции
const coord = gl.getAttribLocation(shaderProgram, 'a_position');
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

// Создание буфера нормали
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

// Привязка атрибута нормали
const normalLoc = gl.getAttribLocation(shaderProgram, 'a_normal');
gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalLoc);

// Создаем униформу для шейдера
const mvpLocation = gl.getUniformLocation(shaderProgram, 'u_modelViewProjection');
gl.uniformMatrix4fv( mvpLocation, false, mvpMatrix.toArray());


// Очистка и отрисовка
gl.clearColor(0.5, 0.5, 0.5, 1.0); // Серый фон
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    return shader;
}

function createPerspectiveProjectionMatrix( fov, aspect, near, far){
    const matrix = new Matrix4();
    const f = 1.0 / Math.tan(fov/2);
    const nf = 1 / (near - far);
    matrix.set( 
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
    );
     return matrix;
}

function createViewMatrix( eye, target, up){
    const matrix = new Matrix4();
    matrix.lookAt( eye, target, up);
    matrix.setPosition(eye.negate());
    matrix.transpose();
    return matrix;
}
    
