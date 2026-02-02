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
        const vertexArray = new Array();
        const indiceArray = new Array();
        const normalsArray = new Array();
        const vertexMap = new Map();

        subdivide(detail);
        applyRadius(radius);
        computeAveragedNormals(indiceArray, vertexArray);
        computeRadialNormals(vertexArray);
        computeNormals();
        this.parameters = {
            radius,
            detail,
        };
        this.vertexBuffer = new Float32Array(vertexArray);
        this.indiceBuffer = new Uint16Array(indiceArray);
        this.normalBuffer = new Float32Array(normalsArray);
        //!console.log('vert',vertexArray);
        //!console.log('ind',indiceArray);
        //!console.log('norm',normalsArray);
        
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
                getVertexByIndex(indices[i + 0], a, vertices);
                getVertexByIndex(indices[i + 1], b, vertices);
                getVertexByIndex(indices[i + 2], c, vertices);

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

        function computeAveragedNormals( indices, vertices ){
            const normalVectors = new Array(vertices.length/3).fill(new Vector3(0,0,0));         
            for(let i = 0; i <indices.length; i += 3){
                const v0 = new Vector3();
                const v1 = new Vector3();
                const v2 = new Vector3();
                const i0 = indices[i + 0]
                const i1 = indices[i + 1]
                const i2 = indices[i + 2]

                getVertexByIndex(i0, v0, vertexArray);
                getVertexByIndex(i1, v1, vertexArray);
                getVertexByIndex(i2, v2, vertexArray);

                const edge1 = v1.sub(v0);
                const edge2 = v2.sub(v0);
                const faceNormal = new Vector3().crossVectors( edge1, edge2).normalize();
;
                normalVectors[i0] = normalVectors[i0].add(faceNormal);
                normalVectors[i1] = normalVectors[i1].add(faceNormal);
                normalVectors[i2] = normalVectors[i2].add(faceNormal);
            }

            normalVectors.forEach((vector)=> {
                vector.normalize();
                normalsArray.push(vector.x, vector.y, vector.z);
            });
        }
        function computeNormals(){          
            
                const v0 = new Vector3(-0.2628,0.42,0);
                const v1 = new Vector3(-0.42,0,0.26);
                const v2 = new Vector3(0,0.26,0.42);
                
                const edge1 = v1.sub(v0);
                const edge2 = v2.sub(v0);
                const faceNormal = new Vector3().crossVectors( edge2, edge1).normalize();
                console.log('-- faceNormal = ',faceNormal);
        }
        function computeRadialNormals(vertices){
            const normalsArray = new Array();
            let vertex = new Vector3();
            for(let i = 0; i < vertices.length; i+=3){
                vertex.x = vertices[i];
                vertex.y = vertices[i + 1];
                vertex.z = vertices[i + 2];
                vertex.normalize();
                normalsArray.push( vertex.x, vertex.y, vertex.z);
            }
            console.log('rnom',normalsArray);
        }
        
        function getVertexByIndex(index, vertex, vertices) {
            const stride = index * 3;
            vertex.x = vertices[stride + 0];
            vertex.y = vertices[stride + 1];
            vertex.z = vertices[stride + 2];
        }
    }
}

export { IcosahedronGeometry };
