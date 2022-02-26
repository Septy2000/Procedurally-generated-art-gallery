const canvas = document.getElementById('canvas1');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext("2d");

const MAX_ITERATIONS = random(255,255);

const REAL_MIN = -2, REAL_MAX = 1;
const IMAGINARY_MIN = -1, IMAGINARY_MAX = 1;

const COLORS_NUMBER = 5;


// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}

// function mapToReal(x) {
//     let range = REAL_MAX - REAL_MIN;
//     return x * (range / canvas.width) + REAL_MIN;
// }

// function mapToImaginary(y) {
//     let range = IMAGINARY_MAX - IMAGINARY_MIN;
//     return y * (range / canvas.height) + IMAGINARY_MIN
// }

// function mandelbrot(cr, ci) {
//     let iteration = 0;
//     let zr = 0, zi = 0;
//     while (iteration < MAX_ITERATIONS || (zr * zr + zi * zi < 4)) {
//         let temp = zr * zr - zi * zi + cr;
//         zi = 2 * zr * zi + ci;
//         iteration++;
//     }

//     return iteration; 
// }

// function draw() {
//     for (let i = 0; i < canvas.height; ++i) {
//         for (let j = 0; j < canvas.width; ++i) {
//             let cr = mapToReal(j);
//             let ci = mapToImaginary(i);
            
//             let n = mandelbrot(cr, ci);

            // let r = (n % 256)
            // let g = (n % 256)
            // let b = (n % 256)

            // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            // ctx.beginPath();
            // ctx.fillRect(i, j, 1, 1);
            // ctx.fillRect(i, canvas.height - j - 1, 1, 1);
//         }
//     }
// }

// function mandelbrot(c) {
//     let z = {x: 0, y: 0 };
//     let iteration = 0;
//     let p; 
//     let d;
//     do {
//         p = {
//             x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
//             y: 2 * z.x * z.y
//         }

//         z = {
//             x: p.x + c.x,
//             y: p.y + c.y
//         }

//         d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
//         iteration += 1;
//     } while (d <= 20 && iteration < MAX_ITERATIONS);
//     return [iteration, d <= 20];
// }

// function draw() {
//     const colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
//     for (let i = 0; i < canvas.width; i++) {
//         for (let j = 0; j < canvas.height / 2; j++) {
//             complex = {
//                 x: REAL_MIN + (i / canvas.width) * (REAL_MAX - REAL_MIN),
//                 y: IMAGINARY_MIN + (j / canvas.height) * (IMAGINARY_MAX - IMAGINARY_MIN)
//             }

//             const [iterations, isMandelbrotSet] = mandelbrot(complex)
            
//             ctx.fillStyle = color_HEX(isMandelbrotSet, iterations, colors, )
//             ctx.beginPath();
//             ctx.fillRect(i, j, 1, 1);
//             ctx.fillRect(i, canvas.height - j - 1, 1, 1);
//         }
//     }
// }

function mandelbrot(c) {
    let z = {x: 0, y: 0 };
    let iteration = 0;
    let p; 
    let d;
    do {
        p = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }

        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }

        d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
        iteration += 1;
    } while (d <= 20 && iteration < MAX_ITERATIONS);
    return [iteration, d <= 20];
}

// function mapToReal(x) {
//     let range = REAL_MAX - REAL_MIN;
//     return x * (range / canvas.width) + REAL_MIN;
// }

function draw() {
    const colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height / 2; j++) {
            complex = {
                x: i * ((REAL_MAX - REAL_MIN) / canvas.width) + REAL_MIN,
                y: j * ((IMAGINARY_MAX - IMAGINARY_MIN) / canvas.height) + IMAGINARY_MIN
            }
            const [iterations, isMandelbrotSet] = mandelbrot(complex)
            
            ctx.fillStyle = color_HEX(isMandelbrotSet, iterations, colors, )
            ctx.beginPath();
            ctx.fillRect(i, j, 1, 1);
            ctx.fillRect(i, canvas.height - j - 1, 1, 1);
        }
    }
}

function color_RGB(isMandelbrotSet, iterations, inside_color, outside_color)  {
    if (isMandelbrotSet) {
        return 'rgb(0, 0, 0)'
    }
    let r = (iterations % (255 * inside_color)) * outside_color
    let g = (iterations % (255 * inside_color)) * outside_color
    let b = (iterations % (255 * inside_color)) * outside_color
    return `rgb(${r}, ${g}, ${b})`
}

function color_HEX(isMandelbrotSet, iterations, colors ) {
    return colors[isMandelbrotSet ? 0 : (iterations % colors.length - 1) + 1]
}

draw();
document.getElementById("generator").onclick = () => {
    draw();
}
