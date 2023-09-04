class Shape {
    constructor(center = Vector3.VECTOR3_ZERO) {
        this.center = center;
    }

    /**
     * @description Function which return intersection of ray by object.
     * @param {Ray} ray
     * @return {null|number}
     */
    getIntersection(ray) {
        throw new Error('To be implemented by subclass')
    }

    /**
     * @description
     * @param {Vector3} point
     * @return {Vector3} normalVector3
     */
    normalAt(point) {
        throw new Error('To be implemented by subclass')
    }

    toObject() {
        return {
          center: this.center,
          _type: 'Shape',
        }
    }

    static fromObject({center}) {
        return new Shape(center);
    }
}
