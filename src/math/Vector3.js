class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        Vector3.prototype.isVector3 = true;
        this.x = x;
        this.y = y;
        this.z = z;

    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    
    add( v ) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

    sub( v ) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

    subVectors( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	}
    lengthSq() {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}
    
    cross( v ) {

		return this.crossVectors( this, v );

	}

    crossVectors( a, b ) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;
		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;
		return this;
	}

    negate() {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	}
    
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    clone() {
        return new this.constructor(this.x, this.y, this.z);
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }
}

export { Vector3 };
