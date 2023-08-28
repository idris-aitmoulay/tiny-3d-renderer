const DEFAULT_SIZE = 0.4;
class Disk extends Shape {
    static DEFAULT_DISK_SIZE = DEFAULT_SIZE;
    constructor(
        center = Vector3.VECTOR3_ZERO,
        normal = Vector3.VECTOR3_ONE,
        radius = DEFAULT_SIZE,
        material
    ) {
        super(center);
        this.normal = normal;
        this.radius = radius;
        this.material = material;
    }

    /**
     * @override
     * @description Function which return intersection of ray by object ((x - x0)*An + (y -y0)*Bn + (z - z0)*Cn = 0)
     *      normal = (An, Bn, Cn), p0 = (x0, y0, z0).
     * @param {Ray} ray
     * @return {null|number}
     */
    getIntersection(ray) {
        const {origin, direction} = ray;
        const delta = Vector3.dot(this.normal, direction);
        if (delta === 0) return null; // means {ray} and {Plan} are paralleled
        const centerToOrigin = origin.minus(this.center);
        const alpha = -1 * Vector3.dot(centerToOrigin, this.normal) / delta;

        if (alpha < 0) {
            return null;
        }

        const intersection = ray.origin.plus(direction.scale(alpha));
        const dist = this.center.dist(intersection);
        if (dist > this.radius) return null;
        return alpha;
    }

    normalAt(point) {
        return this.normal.normalized();
    }
}
