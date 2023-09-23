const DEFAULT_COLOR = 255;
const FLOATING_COLORS_NUMBER = -2;
function decimalAdjust(type, value, exp) {
    type = String(type);
    if (!["round", "floor", "ceil"].includes(type)) {
        throw new TypeError(
            "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'."
        );
    }
    exp = Number(exp);
    value = Number(value);
    if (exp % 1 !== 0 || Number.isNaN(value)) {
        return NaN;
    } else if (exp === 0) {
        return Math[type](value);
    }
    const [magnitude, exponent = 0] = value.toString().split("e");
    const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
    // Shift back
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
    return Number(`${newMagnitude}e${+newExponent + exp}`);
}

function decimalRound(value, exp = FLOATING_COLORS_NUMBER) {
    return decimalAdjust("round", value, exp);

}

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

    /**
     * @desc Get random color
     * @return {Color}
     */
    static random = () => new Color(
        decimalRound(Math.random()),
        decimalRound(Math.random()),
        decimalRound(Math.random())
    );

    static deserialize({r, g, b}) {
        return new Color(r, g, b);
    }
}
