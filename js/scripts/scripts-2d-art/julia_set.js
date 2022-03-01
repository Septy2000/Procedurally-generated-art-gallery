const canvas = document.getElementById('canvas1');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext("2d");

const MAX_ITERATIONS = random(50, 50);

const RE_MIN = -2, RE_MAX = 1;
const IM_MIN = -1, IM_MAX = 1;

const COLORS_NUMBER = 5;


// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}


function julia(z, c, power) {
    // let z = {x: 0.3, y: 0.01 };
    let n = 0;
    let z_powered; 
    do {
        z_powered = {
            x: Math.pow(z.x, power) - Math.pow(z.y, power),
            y: 2 * z.x * z.y
        }

        z = {
            x: z_powered.x + c.x,
            y: z_powered.y + c.y
        }
        n += 1;
    } while (Math.abs(z.x + z.y) <= 2 && n < MAX_ITERATIONS);
    return n;
}

export function draw() {
    const colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let z = {
                x: RE_MIN + (i / canvas.width) * (RE_MAX - RE_MIN),
                y: IM_MIN + (j / canvas.height) * (IM_MAX - IM_MIN)
            }
            let complex = {
                x: 0.285,
                y: 0.01
            }

            const iterations = julia(z, complex, 2)
            
            // ctx.fillStyle = color_RGB(iterations, 1, 1, 1)
            // ctx.fillStyle = color_HEX(iterations, colors)
            // ctx.fillStyle = console.log(color_HSL(iterations));
            ctx.fillStyle = color_HSL(iterations);
            ctx.beginPath();
            ctx.fillRect(i, j, 1, 1);
            // ctx.fillRect(i, canvas.height - j - 1, 1, 1);
            ctx.closePath();
        }
    }
}

function color_RGB(iterations, r_weight, g_weight, b_weight)  {
    // if (iterations === MAX_ITERATIONS) return `black`
    let color = 255 - parseInt(iterations * 255 / MAX_ITERATIONS)
    return `rgb(${color * r_weight}, ${color * g_weight}, ${color * b_weight})`

}

function color_HEX(iterations, colors) {
    return colors[(iterations === MAX_ITERATIONS) ? 0 : (iterations % colors.length - 1) + 1]
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }


  function color_HSL(iterations) {
    if (iterations === MAX_ITERATIONS) {
        return `black`;
    }
    let h = parseInt(360 * iterations / MAX_ITERATIONS);
    return `hsl(${h},100%,50%)`
}

