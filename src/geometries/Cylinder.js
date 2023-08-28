const CYLINDER_HEIGHT = 2;
/**
 * Sphere is like Tiny3dRender Sphere implementation
 * Every Imported Sphere (fbx, blend, obj, ...) Should have Sphere Proxy which will respect our Interface
 */
class Cylinder extends Shape {
    constructor(center, material, radius = Disk.DEFAULT_DISK_SIZE, height = CYLINDER_HEIGHT, normal = Vector3.VECTOR3_ONE) {
        super(center);
        this.radius = radius;
        this.height = height;
        this.material = material;
        this.normal = normal;
    }

    /**
     * @override
     * @description Get sphere intersection through sphere math equation (x*x + y*y = R*R)
     * here we need to find {Tx} to have Point = rayOrigin + Tx * rayDirection
     * @param ray
     * @return {null|number}
     */
    getIntersection(ray) {

    }
}
