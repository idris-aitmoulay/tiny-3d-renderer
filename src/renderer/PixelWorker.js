const RAY_TRACING_JOB_WORKER_SCRIPT_PATH = 'src/renderer/RayTracingJob.js';
class PixelWorker {
    constructor() {
        this.workerId = Math.random().toString(36).substr(2, 9);
        this.worker = new Worker(RAY_TRACING_JOB_WORKER_SCRIPT_PATH);
        this.worker.onmessage = ({data}) => {
            this.handleWorkerMessage(data);
        };
    }

    initWorker(scene, w, h, pixelsToProcess) {
        this.worker.postMessage({
            payload: {scene, w, h, pixelsToProcess},
            id: this.workerId,
            action: '@worker/init'
        });
    }
    postMessageToWorker(message) {
        const {x, y} = this;
        this.worker.postMessage({payload: {...message, pixel: {x, y}}, id: this.workerId, action: '@ray-tracer/trace-ray'});
    }

    renderAllPixels() {
        this.worker.postMessage({action: '@ray-tracer/trace-rays'});
    }
    initialized() {
        console.warn('pixel worker initialized');
    }

    pixelsWorkerCalculated() {
        console.warn('pixels worker calculated');
    }

    handleWorkerMessage({action, payload}) {
        switch (action) {
            case '@worker/initialized':
                this.initialized();
                break;
            case '@ray-tracer/rays-traced':
                this.pixelsWorkerCalculated(payload)
                break;
        }
    }

    terminateWorker() {
        this.worker.terminate();
    }
}
