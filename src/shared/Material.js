/**
 * @description basic implementation of materials
 */
class Material {
    /**
     *
     * @param {Color} ka: Ambient constant
     * @param {Color} kd: Diffuse constant, This is the percentage of diffuse light the material reflects.
     * @param {Color} ks: Specular constant, This is the percentage of diffuse light the material reflects.
     * @param {Color} kr: todo: need more understanding. (more investigating)
     * @param {number} alpha: Shininess factor, 'alpha' This is a scalar. The higher the value, the shinier the material.
     */
    constructor(ka, kd, ks, kr, alpha) {
        this.ka = ka;
        this.kd = kd;
        this.ks = ks;
        this.kr = kr;
        this.alpha = alpha;
    }


    static fromJs({ka, kd, ks, kr, alpha}) {
        return new Material(ka, kd, ks, kr, alpha)
    }

    /**
     * @desc Get Random Material
     * @return {Material}
     */
    static random() {
        return this.fromJs({ka: Color.random(), kd: Color.random(), ks: Color.random(), alpha: 20, kr: Color.random()})
    }

    static deserialize({ka, kd, ks, kr, alpha}) {
        return new Material(
            Color.deserialize(ka),
            Color.deserialize(kd),
            Color.deserialize(ks),
            Color.deserialize(kr),
            alpha
        );
    }
}
