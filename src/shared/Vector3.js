const ZERO = 0;
const ONE = 0;

class Vector3 {
    static VECTOR3_ZERO = new Vector3(ZERO, ZERO, ZERO);
    static VECTOR3_ONE = new Vector3(ONE, ONE, ONE);

    constructor(x = ZERO, y = ZERO, z = ZERO) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     *
     * @param Int scalar
     * @returns {Vector3}
     */
    scale(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    static scale(vector, scalar) {
        return new Vector3(vector.x * scalar, vector.y * scalar, vector.z * scalar)
    }

    /**
     *
     * @param Vector3 other
     * @returns {Vector3}
     */
    plus(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    /**
     *
     * @param Vector3 other
     * @returns {Vector3}
     */
    minus(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    /**
     *
     * @returns {Vector3}
     */
    normalized() {
        const mag = Math.sqrt(this.dot(this));
        return new Vector3(
            this.x / mag,
            this.y / mag,
            this.z / mag
        );
    }

    /**
     * @description dot((x1, y1, z1), (x2, y2, z2)) = x1x2 + y1y2 + z1z2
     * @param Vector3 other
     * @returns {number}
     */
    dot(other = this) {
        return (
            this.x * other.x +
            this.y * other.y +
            this.z * other.z
        );
    }

    static dot(self, other) {
        return (
            self.x * other.x +
            self.y * other.y +
            self.z * other.z
        );
    }

    /**
     *
     * @param Vector3 start
     * @param Vector3 end
     * @param Int t (should be between 0 and 1)
     * @returns {Vector3}
     */
    static lerp(start, end, t) {
        return this.scale(start, 1 - t).plus(this.scale(end, t));
    }

    /**
     *
     * @param Vector3 end
     * @param Int t (should be between 0 and 1)
     * @returns {Vector3}
     */
    lerp(end, t) {
        return this.scale(1 - t).plus(end.scale(t));
    }

    dist(other = this) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        const z = this.z - other.z;
        return Math.hypot(x, y, z);
    }

    static dist(self, other) {
        const x = self.x - other.x;
        const y = self.y - other.y;
        const z = self.z - other.z;
        return Math.hypot(x, y, z);
    }

    static deserialize({x, y, z}) {
        return new Vector3(x, y, z)
    }
}
