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

    static deserialize({position, specularIntensity, diffuseIntensity}) {
        return new Light(Vector3.deserialize(position), Color.deserialize(specularIntensity), Color.deserialize(diffuseIntensity));
    }
}
