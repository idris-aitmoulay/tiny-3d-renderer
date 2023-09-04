const DEFAULT_NUM_SAMPLES_PER_DIRECTION = 2; // todo: ???
const DEFAULT_MAX_BOUNCES = 3; // is used to only found reflected color in a pixel {this.MAX_BOUNCES} time
const DEFAULT_NUM_SAMPLES_PER_PIXEL = DEFAULT_NUM_SAMPLES_PER_DIRECTION * DEFAULT_NUM_SAMPLES_PER_DIRECTION; // todo: ??
class RayTracer {
    constructor(scene, w, h) {
        this.scene = scene;
        this.w = w;
        this.h = h;
        this.NUM_SAMPLES_PER_DIRECTION = DEFAULT_NUM_SAMPLES_PER_DIRECTION;
        this.MAX_BOUNCES = DEFAULT_MAX_BOUNCES;
        this.NUM_SAMPLES_PER_PIXEL = DEFAULT_NUM_SAMPLES_PER_PIXEL;
    }

    /**
     * @description get Ray from camera origin to PixelPoint(x, y) as Ray(origin, direction)
     * @param Int x
     * @param Int y
     * @return {Ray} ray
     * @private
     */
    _rayFromPixel(x, y) {
        const xt = x / this.w;
        const yt = (this.h - y - 1) / this.h;
        const {topLeft, topRight, bottomLeft, bottomRight} = this.scene.planProjection
        const top = Vector3.lerp(topLeft, topRight, xt);
        const bottom = Vector3.lerp(bottomLeft, bottomRight, xt);
        const point = Vector3.lerp(bottom, top, yt);
        return new Ray(point, point.minus(this.scene.camera));
    }

    /**
     *
     * @param Int x
     * @param Int y
     * @return {Color}
     */
    tracedValueAtPixel(x, y) {
        const color = new Color(0, 0, 0);
        for (let dx = 0; dx < this.NUM_SAMPLES_PER_DIRECTION; dx++) {
            for (let dy = 0; dy < this.NUM_SAMPLES_PER_DIRECTION; dy++) {
                const ray = this._rayFromPixel(
                    x + dx / this.NUM_SAMPLES_PER_DIRECTION,
                    y + dy / this.NUM_SAMPLES_PER_DIRECTION
                );
                const sample = this._tracedValueForRay(ray, this.MAX_BOUNCES);
                color.addInPlace(sample.scale(1 / this.NUM_SAMPLES_PER_PIXEL));
            }
        }
        return color;
    }


    /**
     * @description
     * @param {Ray} ray
     * @param {Int} depth
     * @return {Color|*}
     * @private
     */
    _tracedValueForRay(ray, depth) {
        // todo: having UV Map<Ray, Intersection> to optimize job
        const intersection = this._getNearestNeighborIntersectionWithRay(ray);

        if (!intersection) return new Color(0, 0, 0);

        // todo: having UV Map<Point, IntersectionColor> to optimize job
        const color = this._colorAtIntersection(intersection); // get all colors into intersection point.

        if (depth > 0) {
            const reflectionRay = this._getReflectionRay(ray, intersection); // get reflection ray
            const reflected = this._tracedValueForRay(reflectionRay, depth - 1);
            color.addInPlace(reflected.times(intersection.object.material.kr));
        }

        return color;
    }

    /**
     * @description Get Reflection Ray from ray into an intersection point
     * @param {Ray} ray
     * @param {Intersection} intersection
     * @return {Ray}
     * @private
     */
    _getReflectionRay(ray, intersection) {
        const v = ray.direction.scale(-1).normalized();
        const r = intersection
            .normal
            .scale(2)
            .scale(intersection.normal.dot(v))
            .minus(v);
        return new Ray(intersection.point.plus(intersection.normal.scale(0.01)), r);
    }

    /**
     *
     * @param {{object: Object, t: Int, point: Vector3, normal: Vector3}} intersection
     * @return {Color}
     * @private
     */
    _colorAtIntersection(intersection) {
        let color = new Color(0, 0, 0);
        const material = intersection.object.material;

        // add all specular and diffuse color for ray
        const specularAndDiffuse = this._getDiffuseAndSpecularColorForIntersection(intersection);
        color.addInPlace(specularAndDiffuse)

        // add ambient color
        const ambient = material.ka.times(this.scene.ia);
        color.addInPlace(ambient);

        color.clampInPlace();
        return color;
    }


    /**
     *
     * @param {Ray} ray
     * @return {{object: Shape, t: Int, point: Vector3, normal: Vector3}|null}
     * @private
     */
    _getNearestNeighborIntersectionWithRay(ray) {
        const {objects} = this.scene;
        // get intersections points of ray
        const intersections = objects
            .map(obj => {
                const t = obj.getIntersection(ray);
                if (!t) { return null; }

                let point = ray.at(t);

                // if (t < 0) means we change direction of light
                return {
                    object: obj,
                    t: t,
                    point: point,
                    normal: obj.normalAt(point)
                };
            })
            .filter(intersection => intersection);

        return min(intersections, intersection => intersection.t); // nearest neighbor intersection;

        function min(xs, f) {
            if (xs.length == 0) {
                return null;
            }

            let minValue = Infinity;
            let minElement = null;
            for (let x of xs) {
                const value = f(x);
                if (value < minValue) {
                    minValue = value;
                    minElement = x;
                }
            }

            return minElement;
        }
    }

    /**
     * @description detect that point is shadowed by object from source light
     * @param {Vector3} point
     * @param {Shape} objectToExclude
     * @param {Light} light
     * @return {boolean}
     * */
    _isPointInShadowFromLight(point, objectToExclude, light) {
        const shadowRay = new Ray(
            point,
            light.position.minus(point)
        );

        for (let i in this.scene.objects) {
            const obj = this.scene.objects[i];
            if (obj === objectToExclude) {
                continue;
            }

            const t = obj.getIntersection(shadowRay);
            if (t && t <= 1) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @param intersection
     * @return {Color} specularAndDiffuseColor
     * @private
     */
    _getDiffuseAndSpecularColorForIntersection(intersection) {
        let initColor = new Color(0, 0, 0);
        const material = intersection.object.material;
        const v = this.scene
            .camera
            .minus(intersection.point)
            .normalized();

        this.scene
            .lights
            .forEach(light => {
                // adding diffuse and specular intensity properties to point color
                const l = light.position.minus(intersection.point).normalized();

                const lightInNormalDirection = intersection.normal.dot(l);
                if (lightInNormalDirection < 0) {
                    return;
                }

                const isShadowed = this._isPointInShadowFromLight(intersection.point, intersection.object, light);
                if (isShadowed) return; // it's means intersection.point is hidden from ray light because of same objects between them

                // calculate diffuse color (diffuse = (kd * light.diffuseIntensity) * lightInNormalDirection)
                const diffuse = material.kd.times(light.diffuseIntensity).scale(lightInNormalDirection);
                initColor.addInPlace(diffuse);

                // calculate specular color
                const r = intersection.normal.scale(2).scale(lightInNormalDirection).minus(l);
                const amountReflectedAtViewer = v.dot(r);
                const specular = material.ks.times(light.specularIntensity).scale(Math.pow(amountReflectedAtViewer, material.alpha));
                initColor.addInPlace(specular);
            });
        return initColor;
    }
}

