class Light {
    /**
     *
     * @param Vector3 position
     * @param Color diffuseIntensity
     * @param Color specularIntensity
     */
    constructor(position, specularIntensity, diffuseIntensity) {
        this.position = position;
        this.specularIntensity = specularIntensity;
        this.diffuseIntensity = diffuseIntensity;
    }
}
