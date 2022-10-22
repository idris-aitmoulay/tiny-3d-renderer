/**
 * @description Matrice where all 3d model are projected and displayed
 * @param Int w: width
 * @param Int h: height
 */
class ImageProjection {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.canvas = this.createCanvas();
    }

    /**
     * @description It create HtmlCanvasElement
     * @returns {{canvas: HTMLCanvasElement, pixels: Uint8ClampedArray, imageData: ImageData, context: CanvasRenderingContext2D}}
     */
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.w);
        canvas.setAttribute('height', this.h);
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, this.w, this.h);
        const pixels = imageData.data;
        return {
            canvas,
            context,
            imageData,
            pixels,
        }
    }

    /**
     *
     * @param Int x
     * @param Int y
     * @param Color color
     */
    putPixel(x, y, color) {
        const offset = (y * this.w + x) * 4;
        this.canvas.pixels[offset] = color.r | 0; // Red
        this.canvas.pixels[offset + 1] = color.g | 0; // Green
        this.canvas.pixels[offset + 2] = color.b | 0; // Blue
        this.canvas.pixels[offset + 3] = 255; // Alpha > to make RGB displayed without transparency
    }

    /**
     *
     * @param Element element
     */
    render(element) {
        this
            .canvas
            .context
            .putImageData(
                this.canvas.imageData,
                0,
                0
            );

        element.appendChild(this.canvas.canvas);
    }
}
