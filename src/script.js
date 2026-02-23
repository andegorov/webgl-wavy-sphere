import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';
import { IcosahedronGeometry } from './geom/IcosahedronGeometry';
import { Clock } from './core/Clock';
import { Matrix4 } from './math/Matrix4';
import { Vector3 } from './math/Vector3';

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');
const clock = new Clock();

if (!gl) {
    console.error('WebGL не поддерживается');
}

// Создание Икосаэдра
const icosahedron = new IcosahedronGeometry();
const vertices = icosahedron.vertexBuffer;
const indices = icosahedron.indiceBuffer;

// Создание  матрицы модели, вида и проекции
const modelMatrix = new Matrix4();

const eye = new Vector3(0, 0, 2);
const target = new Vector3(0, 0, 0);
const up = new Vector3(0, 1, 0);
const viewMatrix = createViewMatrix(eye, target, up);

const aspect = gl.canvas.width / gl.canvas.height;
const projectionMatrix = createPerspectiveProjectionMatrix(
    Math.PI / 4,
    aspect,
    0.1,
    100
);

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
const coord = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

// Создаем униформы для шейдера
const modelLocation = gl.getUniformLocation(shaderProgram, 'uModel');
const viewLocation = gl.getUniformLocation(shaderProgram, 'uView');
const projectionLocation = gl.getUniformLocation(shaderProgram, 'uProjection');

init();
animate();

function init() {
    // Устанавливаем начальные значения униформ
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix.toFloat32Array());
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix.toFloat32Array());
    gl.uniformMatrix4fv(
        projectionLocation,
        false,
        projectionMatrix.toFloat32Array()
    );
    // Настройка WebGL
    gl.clearColor(0.5, 0.5, 0.5, 1.0); // Серый фон
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1.0);
    gl.depthFunc(gl.LESS);
}

function animate() {
    const elapsedTime = clock.getElapsedTime();
    const speed = 0.4; // Скорость вращения

    // Обновляем модельную матрицу для анимации
    const q = elapsedTime * speed; // Угол вращения зависит от времени
    // prettier-ignore
    modelMatrix.set(
        Math.cos(q),        0,        Math.sin(q),        0,  
        0,                  1,        0,                  0,
        -Math.sin(q),       0,        Math.cos(q),        0, 
        0,                  0,        0,                   1
    );

    gl.uniformMatrix4fv(modelLocation, false, modelMatrix.toFloat32Array());

    // Рендерим сцену
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    //gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(animate);
}

function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    return shader;
}

function createPerspectiveProjectionMatrix(fov, aspect, near, far) {
    const matrix = new Matrix4();
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    // строчный вид матрицы
    // prettier-ignore
    matrix.set(
        f / aspect,        0,        0,        0,
        0,                 f,        0,        0,      
        0,                 0,        (far + near) * nf,   2 * far * near * nf,
        0,                 0,        -1,       0
    );
    return matrix;
}

function createViewMatrix(eye, target, up) {
    const matrix = new Matrix4();
    matrix.lookAt(eye, target, up);
    return matrix;
}
