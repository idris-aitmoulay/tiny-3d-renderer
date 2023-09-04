// worker job
function isRunningInWorker() {
    try {
        // Attempt to access a property that is specific to workers
        return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
    } catch (e) {
        // An error will be thrown if this code is running in the main thread
        return false;
    }
}


if (isRunningInWorker()) {
    const SHARED_SCRIPTS_PATH = [
        '../shared/Light.js',
        '../shared/Vector3.js',
        '../shared/Vector3Utils.js',
        '../shared/Color.js',
        '../shared/Material.js',
        '../shared/Projection.js',
        '../geometries/Shape.js',
        '../geometries/Sphere.js',
        '../geometries/Disk.js',
        '../geometries/ShapeUtils.js',
        './Ray.js',
        './RayTracer.js',
    ];
    importScripts(...SHARED_SCRIPTS_PATH);
    addEventListener('message', onMessage);
    let workerId;
    let myRayTracingInstance;
    let pixelsToProcessInWorker = [];

    function onMessage(e) {
        switch(e.data.action) {
            case '@worker/init': // to init worker with same scene
                workerId = e.data.id;
                const {scene, w, h, pixelsToProcess} = e.data.payload;
                pixelsToProcessInWorker = pixelsToProcess;
                scene.objects = ShapeUtils.fromObjects(scene.shapes);
                scene.camera = Vector3.deserialize(scene.camera);
                scene.lights = scene.lights.map(source => Light.deserialize(source));
                myRayTracingInstance = new RayTracer(scene, w, h);
                postMessage({action:  '@worker/initialized'});
                break;
            case '@ray-tracer/trace-ray': // to trace ray
                const {pixel: {x, y}} = e.data.payload;
                const payload = myRayTracingInstance.tracedValueAtPixel(x, y);
                postMessage({payload, action: '@ray-tracer/ray-traced'});
                break;
            case '@ray-tracer/trace-rays':
                const pixels = pixelsToProcessInWorker.map(value => {
                    const [x, y] = value;
                    return [x, y, myRayTracingInstance.tracedValueAtPixel(x, y)]
                });
                postMessage({payload: pixels, action: '@ray-tracer/rays-traced'});
                break;
        }
    }
} else {
    console.warn("Running in the main thread");
}
