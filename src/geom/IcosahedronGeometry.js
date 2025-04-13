import { Vector3 } from '../math/Vector3';
class IcosahedronGeometry {
    constructor(radius = 0.5, detail = 0) {
        const t = (1 + Math.sqrt(5)) / 2;
        const vertices = [
            -1,t,0,   1,t,0,   -1,-t,0,   1,-t,0,   0,-1,t,   0,1,t,
            0,-1,-t,  0,1,-t,  t,0,-1,     t,0,1,  -t,0,-1,  -t,0,1
        ];

        const indices = [
            0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4,
            11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3,
            8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
        ];
        const vertexArray = [];
        const indiceArray = [];
        const vertexMap = new Map();

        subdivide(detail);
        applyRadius(radius);

        const vertexBuffer = new Float32Array(vertexArray);
        const indiceBuffer = new Uint16Array(indiceArray);

        this.parameters = {
            radius,
            detail,
            indices,
            vertices
        };
        this.vertexBuffer = vertexBuffer;
        this.indiceBuffer = indiceBuffer;

        function applyRadius(radius) {
            const vertex = new Vector3();

            for (let i = 0; i < vertexArray.length; i += 3) {
                vertex.x = vertexArray[i + 0];
                vertex.y = vertexArray[i + 1];
                vertex.z = vertexArray[i + 2];
                vertex.normalize().multiplyScalar(radius);
                vertexArray[i + 0] = vertex.x;
                vertexArray[i + 1] = vertex.y;
                vertexArray[i + 2] = vertex.z;
            }
        }

        function subdivide(detail) {
            const a = new Vector3();
            const b = new Vector3();
            const c = new Vector3();

            for (let i = 0; i < indices.length; i += 3) {
                getVertexByIndex(indices[i + 0], a);
                getVertexByIndex(indices[i + 1], b);
                getVertexByIndex(indices[i + 2], c);

                subdivideFace(a, b, c, detail);
            }

            pushVertexMap(vertexMap);
        }

        function subdivideFace(a, b, c, detail) {
            const cols = detail + 1;
            const v = [];

            for (let i = 0; i <= cols; i++) {
                v[i] = [];
                const aj = a.clone().lerp(c, i / cols);
                const bj = b.clone().lerp(c, i / cols);
                const rows = cols - i;

                for (let j = 0; j <= rows; j++) {
                    if (j === 0 && i === cols) {
                        v[i][j] = getIndice(aj);
                    } else {
                        v[i][j] = getIndice(aj.clone().lerp(bj, j / rows));
                    }
                }
            }

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < 2 * (cols - i) - 1; j++) {
                    const k = Math.floor(j / 2);
                    if (j % 2 === 0) {
                        pushIndice(v[i][k + 1]);
                        pushIndice(v[i + 1][k]);
                        pushIndice(v[i][k]);
                    } else {
                        pushIndice(v[i][k + 1]);
                        pushIndice(v[i + 1][k + 1]);
                        pushIndice(v[i + 1][k]);
                    }
                }
            }
        }

        function getIndice(vertex) {
            if (!vertexMap.has(`${vertex.x}_${vertex.y}_${vertex.z}`)) {
                vertexMap.set(
                    `${vertex.x}_${vertex.y}_${vertex.z}`,
                    vertexMap.size
                );
            }

            return vertexMap.get(`${vertex.x}_${vertex.y}_${vertex.z}`);
        }

        function pushIndice(indice) {
            indiceArray.push(indice);
        }

        function pushVertexMap(map) {
            map.forEach((value, key) => {
                vertexArray.push(...key.split('_'));
            });
        }

        function getVertexByIndex(index, vertex) {
            const stride = index * 3;
            vertex.x = vertices[stride + 0];
            vertex.y = vertices[stride + 1];
            vertex.z = vertices[stride + 2];
        }
    }
}

export { IcosahedronGeometry };
