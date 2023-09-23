const RANGE_X = 4;
const RANGE_Y = 4;
const WORKER_LIMIT = RANGE_X * RANGE_Y;

/**
 * should be inspired from http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool/
 */
class MultiRayTracingRenderer {
    pixelsToProcess = {};
    workers = [];
    initResults = 0;

    constructor(SCENE, WIDTH, HEIGHT) {
        this.scene = {
            ...SCENE,
            shapes: ShapeUtils.toObjects(SCENE.objects),
        };
        this.w = WIDTH;
        this.h = HEIGHT;
        this.results = [];
    }

    init() {
        this._initPixelsToProcess();
        for (let i=0; i < WORKER_LIMIT; i++) {
            this.workers.push(new PixelWorker())
        }
    }

    _initPixelsToProcess() {
        const partWidth = Math.trunc(this.w / RANGE_X);
        const partHeight = Math.trunc(this.h / RANGE_Y);
        for (let i=0; i < this.w; i++) {
            for (let j=0; j < this.h; j++) {
                const xMultiply = Math.trunc(i / partWidth);
                const yMultiply = Math.trunc(j / partHeight);
                const workerIndex = yMultiply * RANGE_Y + xMultiply;
                const MAX_INDEX = WORKER_LIMIT - 1;
                let pixelIndex = workerIndex;
                if (workerIndex >= MAX_INDEX) {
                    pixelIndex = MAX_INDEX;
                }
                if (this.pixelsToProcess[pixelIndex] === undefined) {
                    this.pixelsToProcess[pixelIndex] = [];
                }
                this.pixelsToProcess[pixelIndex].push([i, j]);
            }
        }
    }

    postMessageToWorker(index) {
        const {scene, w, h} = this;
        this.workers[index].postMessageToWorker({scene, w, h});
    }

    handleWorkerMessage(message, index) {
        this.results[index] = message;
        if (this.results.length === this.workers.length) {
            this.onAllWorkersComplete(this.results);
        }
    }


    workerMessageInitialized() {
        this.initResults++;
        if (this.initResults === (this.workers.length - 1)) {
            this.onAllWorkersInitialized(this.workers.length);
        }
    }

    onAllWorkersInitialized(count) {
        console.log('All workers have initialized:', count);
    }

    onAllWorkersComplete(results) {
        console.log('All workers have completed:', results);
    }

    initWorkers() {
        const self = this;
        this.initResults = 0;
        return new Promise((resolve, _) => {
            this.workers.forEach((worker, index) => {
                worker.initialized = () => {
                    self.workerMessageInitialized();
                }
                worker.initWorker(this.scene, this.w, this.h, self.pixelsToProcess[index]);
            });
            // Resolve the promise when all workers have initialized
            this.onAllWorkersInitialized = (results) => resolve(results);
        });
    }


    workerMessagePixelsCalculated() {
        this.calculatePixelResults++;
        if (this.calculatePixelResults < this.workers.length) {
            return;
        }
        this.onAllPixelCalculated();
    }

    onAllPixelCalculated() {

    }


    runWorkers() {
        const self = this;
        let allPixels = [];
        this.calculatePixelResults = 0
        return new Promise((resolve, _) => {
            this.workers.forEach((worker) => {
                worker.pixelsWorkerCalculated = pixels => {
                    // fixme: it should be consuming ram and time
                    allPixels = [...allPixels, ...pixels];
                    self.workerMessagePixelsCalculated();
                }
                worker.renderAllPixels();
            });

            // Resolve the promise when all workers have completed
            this.onAllPixelCalculated = () => resolve(allPixels);
        });
    }

    terminateWorkers() {
        this.workers.forEach(worker => {
            worker.terminateWorker();
        })
    }
}


