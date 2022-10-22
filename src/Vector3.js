const VECTOR3_ZERO = 0;
class Vector3 {
    constructor(x = VECTOR3_ZERO, y = VECTOR3_ZERO, z = VECTOR3_ZERO) {
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
    dot(other) {
        return (
            this.x * other.x +
            this.y * other.y +
            this.z * other.z
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
        return start.scale(1 - t).plus(end.scale(t));
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
}
