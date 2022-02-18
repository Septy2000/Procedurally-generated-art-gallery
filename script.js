const canvas = document.getElementById('canvas1');

canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

function Complex(re, im) {
    this.re = re;
    this.im = im;
}

Complex.prototype.add = function(other) {
    return new Complex(this.re + other.re, this.im + other.im);
}
// class FlowFieldEffect {
//     // Variables or methods with # are private
//     #ctx;
//     #width;
//     #height;

//     constructor(ctx, width, height) {
//         this.#ctx = ctx;
//         this.#width = width;
//         this.#height = height;
//         this.#draw(100, 100);
//     }
//     #draw(x, y) {
//         this.#ctx.beginPath();
//         this.#ctx.moveTo(x, y);
//         this.#ctx.lineTo(x + 100, y + 100);
//         this.#ctx.stroke();
//     }
// }
// const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);

