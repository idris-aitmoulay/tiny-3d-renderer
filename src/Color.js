const DEFAULT_COLOR = 255;
class Color {
    /**
     *
     * @param r
     * @param g
     * @param b
     */
    constructor(r = DEFAULT_COLOR, g = DEFAULT_COLOR, b = DEFAULT_COLOR) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     *
     * @param Color other
     * @returns {Color}
     */
    times(other) {
        return new Color(
            this.r * other.r,
            this.g * other.g,
            this.b * other.b
        );
    }

    /**
     *
     * @param Int scalar
     * @returns {Color}
     */
    scale(scalar) {
        return new Color(
            this.r * scalar,
            this.g * scalar,
            this.b * scalar
        );
    }

    /**
     *
     * @param Color other
     */
    addInPlace(other) {
        this.r += other.r;
        this.g += other.g;
        this.b += other.b;
    }

    clampInPlace() {
        this.r = this.r < 0 ? 0 : this.r > 1 ? 1 : this.r;
        this.g = this.g < 0 ? 0 : this.g > 1 ? 1 : this.g;
        this.b = this.b < 0 ? 0 : this.b > 1 ? 1 : this.b;
    }

    /**
     *
     * @param normalizedColor
     * @return {Color}
     */
    static imageColorFromNormalizedColor = normalizedColor => new Color(
        Math.floor(normalizedColor.r * 255),
        Math.floor(normalizedColor.g * 255),
        Math.floor(normalizedColor.b * 255)
    );
}
