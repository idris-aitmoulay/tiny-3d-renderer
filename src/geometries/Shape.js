class Shape {
    constructor(center = 0) {
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
}
