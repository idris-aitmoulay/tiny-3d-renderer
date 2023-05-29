class Vector3Utils {

    /**
     *
     * @param {Vector3} pointA
     * @param {Vector3} pointB
     * @param {Vector3} pointC
     */
    static isCollinear(pointA, pointB, pointC) {
        const e = pointA.minus(pointB);
        const v = pointA.minus(pointC);
        return e.dot(v);
    }
}
