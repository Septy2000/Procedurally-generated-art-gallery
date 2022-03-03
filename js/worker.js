let WIDTH, HEIGHT, RE_MIN, RE_MAX, IM_MIN, IM_MAX, MAX_ITERATIONS;

onmessage = e => {
    const { isSettingUp } = e.data;
    if (isSettingUp) {
        const { width, height, re_min, re_max, im_min, im_max, max_iter} = e.data;

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
        const mandelbrotSets = [];
        
        for (let row = 0; row < HEIGHT; row++) {
            mandelbrotSets[row] = calculate(col, row);
        }

        postMessage({ col, mandelbrotSets });
    }
}

function calculate(i, j) {
    return mandelbrot(relativePoint(i, j), 2);
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
        // z_next = 0.0000001 * (Math.pow(z.x, power) + Math.pow(z.y, power));
        n += 1;
    } while ((Math.abs(z.x) + Math.abs(z.y)) <= 2 && n < MAX_ITERATIONS);
return n;
}