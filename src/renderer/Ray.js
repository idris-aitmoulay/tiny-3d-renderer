/**
 * Ray is like à vector with fixed origin
 */
class Ray {
    /**
     *
     * @param Vector3 origin
     * @param Vector3 direction
     */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     *
     * @param Int t
     * @return {Vector3}
     */
    at(t) {
        return this.origin.plus(this.direction.scale(t));
    }
}
