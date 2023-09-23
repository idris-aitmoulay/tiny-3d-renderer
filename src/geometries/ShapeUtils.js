class ShapeUtils {
    static toObjects(shapes) {
        return shapes.map(shape => shape.toObject())
    }

    static fromObjects(objects) {
        return objects.map(item => {
            if (item._type === 'Sphere') {
                return Sphere.fromObject(item);
            }

            if (item._type === 'Disk') {
                return Disk.fromObject(item);
            }

            return Shape.fromObject(item);
        })
    }
}
