/**
 * @description basic implementation of materials
 */
class Material {
    /**
     *
     * @param {Color} ka: Ambient constant
     * @param {Color} kd: Diffuse constant, This is the percentage of diffuse light the material reflects.
     * @param {Color} ks: Specular constant, This is the percentage of diffuse light the material reflects.
     * @param {Color} kr
     * @param {Int} alpha: Shininess factor, 'alpha' This is a scalar. The higher the value, the shinier the material.
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
}
