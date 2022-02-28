const canvas = document.getElementById('canvas1');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext("2d");

const MAX_ITERATIONS = random(100,100);

const RE_MIN = -2, RE_MAX = 1;
const IM_MIN = -1, IM_MAX = 1;

const COLORS_NUMBER = 5;


// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}


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
//     } while (Math.abs(d) <= 2 && iteration < MAX_ITERATIONS);
//     return [iteration, Math.abs(d) <= 2];
// }

// function draw() {
//     const colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
//     for (let i = 0; i < canvas.width; i++) {
//         for (let j = 0; j < canvas.height / 2; j++) {
//             complex = {
//                 x: i * ((REAL_MAX - REAL_MIN) / canvas.width) + REAL_MIN,
//                 y: j * ((IMAGINARY_MAX - IMAGINARY_MIN) / canvas.height) + IMAGINARY_MIN
//             }
//             const [iterations, isMandelbrotSet] = mandelbrot(complex)
            
//             ctx.fillStyle = color_RGB(isMandelbrotSet, iterations, 1, 1)
//             // ctx.fillStyle = color_HEX(isMandelbrotSet, iterations, colors)
//             ctx.beginPath();
//             ctx.fillRect(i, j, 1, 1);
//             ctx.fillRect(i, canvas.height - j - 1, 1, 1);
//             ctx.closePath();
//         }
//     }
// }

// function formula(z) 

function mandelbrot(c) {
    let z = {x: 0, y: 0 };
    let iteration = 0;
    let z_powered; 
    do {
        z_powered = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }

        z = {
            x: z_powered.x + c.x,
            y: z_powered.y + c.y
        }
        iteration += 1;
    } while (Math.abs(z.x + z.y) <= 2 && iteration < MAX_ITERATIONS);
    return [iteration, Math.abs(z.x + z.y) <= 2];
}

function draw() {
    const colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height / 2; j++) {
            complex = {
                x: RE_MIN + (i / canvas.width) * (RE_MAX - RE_MIN),
                y: IM_MIN + (j / canvas.height) * (IM_MAX - IM_MIN)
            }
            const [iterations, isMandelbrotSet] = mandelbrot(complex)
            
            ctx.fillStyle = color_RGB(isMandelbrotSet, iterations, 1, 1)
            // ctx.fillStyle = color_HEX(isMandelbrotSet, iterations, colors)
            ctx.beginPath();
            ctx.fillRect(i, j, 1, 1);
            ctx.fillRect(i, canvas.height - j - 1, 1, 1);
            ctx.closePath();
        }
    }
}

function color_RGB(isMandelbrotSet, iterations, inside_color, outside_color)  {
    if (isMandelbrotSet) {
        return 'rgb(255, 255, 255)'
    }
    let color = (iterations % (255 * inside_color)) * outside_color
    return `rgb(${color}, ${color}, ${color})`
}

function color_HEX(isMandelbrotSet, iterations, colors ) {
    return colors[isMandelbrotSet ? 0 : (iterations % colors.length - 1) + 1]
}

draw();
document.getElementById("generator").onclick = () => {
    draw();
}
