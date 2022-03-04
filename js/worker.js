let WIDTH, HEIGHT, RE_MIN, RE_MAX, IM_MIN, IM_MAX, MAX_ITERATIONS, ALGORITHM;

const COMPLEX = {
    x: 0.355,
    y: 0.355
}

onmessage = e => {
    const { isSettingUp } = e.data;
    if (isSettingUp) {
        const { algorithm, width, height, re_min, re_max, im_min, im_max, max_iter } = e.data;

        ALGORITHM = algorithm;

        WIDTH = width;
        HEIGHT = height;

        RE_MIN = re_min;
        RE_MAX = re_max;
        IM_MIN = im_min;
        IM_MAX = im_max;

        MAX_ITERATIONS = max_iter;
    } 
    else {
        const { col } = e.data;
        const columns_values = [];
        
        for (let row = 0; row < HEIGHT; row++) {
            columns_values[row] = calculate(col, row);
        }

        postMessage({ col, columns_values });
    }
}

function calculate(i, j) {
    if (ALGORITHM === "mandelbrot") return mandelbrot(relativePoint(i, j), 2);
    else if (ALGORITHM === "julia") return julia(relativePoint(i, j), COMPLEX, 2);
}
 

const relativePoint = (x, y) => {
    x = RE_MIN + (x / WIDTH) * (RE_MAX - RE_MIN);
    y = IM_MIN + (y / HEIGHT) * (IM_MAX - IM_MIN);
    return { x, y }
}

function mandelbrot(c, power) {
    let z = {x: 0, y: 0 };
    let n = 0;
    let z_powered, z_next; 
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
    } while ((Math.abs(z.x) + Math.abs(z.y)) <= 2 && n < MAX_ITERATIONS);
return n;
}


function julia(z, c, power) {
    let n = 0;
    let z_powered, z_next; 
    do {
        z_powered = {
            x: Math.pow(z.x, power) - Math.pow(z.y, power),
            y: 2 * z.x * z.y
        }

        z = {
            x: z_powered.x + c.x,
            y: z_powered.y + c.y
        }
        z_next = Math.pow(z.x, power) + Math.pow(z.y, power) + c.x + c.y;
        n += 1;
    } while (Math.abs(z_next) <= 2 && n < MAX_ITERATIONS);
return n;
}