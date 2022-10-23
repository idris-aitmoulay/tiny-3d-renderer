/**
 * Sphere is like Tiny3dRender Sphere implementation
 * Every Imported Sphere (fbx, blend, obj, ...) Should have Sphere Proxy which will respect our Interface
 */
class Sphere extends Shape {
    constructor(center, material, radius = 1) {
        super(center);
        this.radius = radius;
        this.material = material;
    }

    /** @override */
    /**
     * @description Get sphere intersection through sphere math equation (x*x + y*y = R*R)
     * @param ray
     * @return {null|number}
     */
    getIntersection(ray) {
        const cp = ray.origin.minus(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2 * cp.dot(ray.direction);
        const c = cp.dot(cp) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c; /* δ = bb - 4ac */

        if (discriminant < 0) {
            // no intersection
            return null; // no solution
        }

        const sqrt = Math.sqrt(discriminant);

        const ts = [];

        const sub = (-b - sqrt) / (2 * a); // first solution
        if (sub >= 0) {
            ts.push(sub);
        }

        const add = (-b + sqrt) / (2 * a); // second solution
        if (add >= 0) {
            ts.push(add);
        }

        if (ts.length == 0) {
            return null;
        }

        return Math.min.apply(null, ts); // min solution
    }

    normalAt(point) {
        return point.minus(this.center).normalized();
    }
}
