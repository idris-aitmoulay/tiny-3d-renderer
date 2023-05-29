/**
 * Material.fromJs({
 *         ka: new Color(0.1, 0.1, 0.1),
 *         kd: new Color(0.9, 0.5, 0.5),
 *         ks: new Color(0.7, 0.7, 0.7),
 *         alpha: 20,
 *         kr: new Color(0.2, 0.1, 0.1)
 *     }),
 * @type {Material[]}
 */
const Materials = [
    Material.random(),
    Material.random(),
    Material.random(),
    Material.random(),
    Material.random(),
];


const SCENE = {
    planProjection: { // ImageProjection with grid system
        topLeft: new Vector3(-1.28, 0.86, -0.5),
        topRight: new Vector3(1.28, 0.86, -0.5),
        bottomLeft: new Vector3(-1.28, -0.86, -0.5),
        bottomRight: new Vector3(1.28, -0.86, -0.5)
    },
    camera: new Vector3(0, 0, 2), // camera: add camera (type, position, direction)
    ia: new Color(0.5, 0.5, 0.5), // todo: ??
    objects: [ // objects: 3d objects (type = Sphere|Cube|Plan|..., position)
        new Sphere(
            new Vector3(-1.1, 0.6, -1),
            Materials[0],
        0.2
        ),
        new Sphere(
            new Vector3(0.2, -0.1, -1),
            Materials[1],
            0.5
        ),
        new Sphere(
            new Vector3(1.2, -0.5, -1.75),
            Materials[2],
            0.4
        ),
        new Sphere(
            new Vector3(1.4, 0.5, -0.75),
            Materials[3],
            0.2
        ),
        new Disk(
            new Vector3(1, 1, -2.8),
            new Vector3(0, -1, -1),
            0.3,
            Materials[4],
        )
    ],
    lights: [ // lights: add lights (type, position, direction)
        new Light(
            new Vector3(-3, -0.5, 1),
            new Color(0.8, 0.3, 0.3),
            new Color(0.8, 0.8, 0.8),
        ),
        new Light(
            new Vector3(3, 2, 1),
            new Color(0.4, 0.4, 0.9),
            new Color(0.8, 0.8, 0.8)
        ),
    ]
};

let rayTracer, projectionImage;
const WIDTH = 800;
const HEIGHT = 800;
function init() {
    rayTracer = new RayTracer(SCENE, WIDTH, HEIGHT);
    projectionImage = new ImageProjection(WIDTH, HEIGHT);
    document.image = projectionImage;
}

function preRender() {
    // pre-rendering process
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            projectionImage.putPixel(
                x,
                y,
                Color.imageColorFromNormalizedColor(rayTracer.tracedValueAtPixel(x, y))
            );
        }
    }
}

function render() {
    // rendering process
    projectionImage.render(document.querySelector('body'));
}

function mounted() {
    init();
    preRender();
    render();
}

mounted();

