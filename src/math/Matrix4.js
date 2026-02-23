class Matrix4 {
    constructor(
        n11, n12, n13, n14,
        n21, n22, n23, n24,
        n31, n32, n33, n34,
        n41, n42, n43, n44
    ) {
        this.elements = new Float32Array([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]);

        if (n11 !== undefined) {
            this.set(
                n11, n12, n13, n14,
                n21, n22, n23, n24,
                n31, n32, n33, n34,
                n41, n42, n43, n44
            );
        }
    }

    set(
        n11, n12, n13, n14,   
        n21, n22, n23, n24, 
        n31, n32, n33, n34,
        n41, n42, n43, n44
    ) {
        const te = this.elements;

        te[0] = n11;        te[4] = n12;        te[8] = n13;        te[12] = n14;
        te[1] = n21;        te[5] = n22;        te[9] = n23;        te[13] = n24;
        te[2] = n31;        te[6] = n32;        te[10] = n33;        te[14] = n34;
        te[3] = n41;        te[7] = n42;        te[11] = n43;        te[15] = n44;
        return this;
    }
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }

    multiplyMatrices( a, b ) {

		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	}

    lookAt(eye, target, up) {
        const zAxis = eye.clone().sub(target).normalize();
        const xAxis = up.clone().cross(zAxis).normalize();
        const yAxis = zAxis.clone().cross(xAxis);

        return this.set(
            xAxis.x,            yAxis.x,            zAxis.x,            -xAxis.dot(eye),
            xAxis.y,            yAxis.y,            zAxis.y,            -yAxis.dot(eye),
            xAxis.z,            yAxis.z,            zAxis.z,            -zAxis.dot(eye),
            0,            0,            0,            1
        );
    }

    invert() {

		const te = this.elements,

			n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
			n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
			n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
			n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

			t1 = n11 * n22 - n21 * n12,
			t2 = n11 * n32 - n31 * n12,
			t3 = n11 * n42 - n41 * n12,
			t4 = n21 * n32 - n31 * n22,
			t5 = n21 * n42 - n41 * n22,
			t6 = n31 * n42 - n41 * n32,
			t7 = n13 * n24 - n23 * n14,
			t8 = n13 * n34 - n33 * n14,
			t9 = n13 * n44 - n43 * n14,
			t10 = n23 * n34 - n33 * n24,
			t11 = n23 * n44 - n43 * n24,
			t12 = n33 * n44 - n43 * n34;

		const det = t1 * t12 - t2 * t11 + t3 * t10 + t4 * t9 - t5 * t8 + t6 * t7;

		if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

		const detInv = 1 / det;

		te[ 0 ] = ( n22 * t12 - n32 * t11 + n42 * t10 ) * detInv;
		te[ 1 ] = ( n31 * t11 - n21 * t12 - n41 * t10 ) * detInv;
		te[ 2 ] = ( n24 * t6 - n34 * t5 + n44 * t4 ) * detInv;
		te[ 3 ] = ( n33 * t5 - n23 * t6 - n43 * t4 ) * detInv;

		te[ 4 ] = ( n32 * t9 - n12 * t12 - n42 * t8 ) * detInv;
		te[ 5 ] = ( n11 * t12 - n31 * t9 + n41 * t8 ) * detInv;
		te[ 6 ] = ( n34 * t3 - n14 * t6 - n44 * t2 ) * detInv;
		te[ 7 ] = ( n13 * t6 - n33 * t3 + n43 * t2 ) * detInv;

		te[ 8 ] = ( n12 * t11 - n22 * t9 + n42 * t7 ) * detInv;
		te[ 9 ] = ( n21 * t9 - n11 * t11 - n41 * t7 ) * detInv;
		te[ 10 ] = ( n14 * t5 - n24 * t3 + n44 * t1 ) * detInv;
		te[ 11 ] = ( n23 * t3 - n13 * t5 - n43 * t1 ) * detInv;

		te[ 12 ] = ( n22 * t8 - n12 * t10 - n32 * t7 ) * detInv;
		te[ 13 ] = ( n11 * t10 - n21 * t8 + n31 * t7 ) * detInv;
		te[ 14 ] = ( n24 * t2 - n14 * t4 - n34 * t1 ) * detInv;
		te[ 15 ] = ( n13 * t4 - n23 * t2 + n33 * t1 ) * detInv;

		return this;

	}
    transpose() {

		const te = this.elements;
		let tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	}

    setPosition(x, y, z) {
        const te = this.elements;

        if (x.isVector3) {
            te[12] = x.x;
            te[13] = x.y;
            te[14] = x.z;
        } else {
            te[12] = x;
            te[13] = y;
            te[14] = z;
        }

        return this;
    }

    toFloat32Array() {
        return this.elements;
    }

    toArray(array = [], offset = 0) {
        const te = this.elements;

        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];

        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];

        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];

        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];

        return array;
    }
}

export { Matrix4 };
