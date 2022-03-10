let WIDTH, HEIGHT, RE_MIN, RE_MAX, IM_MIN, IM_MAX, MAX_ITERATIONS, ALGORITHM, COMPLEX;

// When the worker receives a message
onmessage = e => {
    const { isSettingUp } = e.data;
    // Check if this is the first time this worker receives a message
    // If it is, initialise all variables
    if (isSettingUp) {
        const { algorithm, width, height, re_min, re_max, im_min, im_max, max_iter, complex } = e.data;

        ALGORITHM = algorithm;

        WIDTH = width;
        HEIGHT = height;

        RE_MIN = re_min;
        RE_MAX = re_max;
        IM_MIN = im_min;
        IM_MAX = im_max;

        MAX_ITERATIONS = max_iter;

        COMPLEX = complex;
    } 
    else {
        // Extract the column number
        const { col } = e.data;
        const columns_values = [];
        
        // Calculate values for the column
        for (let row = 0; row < HEIGHT; row++) {

            if (ALGORITHM === "mandelbrot") {
                columns_values[row] = mandelbrot(relativePoint(col, row), 2);
            } 
            else if (ALGORITHM === "julia") {
                columns_values[row] = julia(relativePoint(col, row), COMPLEX, 2);
            }
        }
        // After calculating all the values for a column, send them back to the main thread
        postMessage({ col, columns_values });
    }
}

/**
 * This function applies the Mandelbrot function using the given complex number
 * @param {object} c a complex number with attributes x and y 
 * @param {*} power the power applied to the mandelbrot function 
 * @returns the number of iterations that the function reached without going towards infinity
 */
function mandelbrot(c, power) {
    // Initialise complex number z
    let z = {x: 0, y: 0 };
    // Iteration number
    let n = 0;
    let z_powered; 
    do {
        // Complex number Z squared 
        // The minus exists because i^2 is -1
        z_powered = {
            x: Math.pow(z.x, power) - Math.pow(z.y, power),
            y: 2 * z.x * z.y
        }

        // Complex number Z with added C (i.e z^2 + c)
        z = {
            x: z_powered.x + c.x,
            y: z_powered.y + c.y
        }
        n += 1;
        // Repeat until the point passes the threshold or reaches maximum iterations
    } while ((Math.abs(z.x) + Math.abs(z.y)) <= 2 && n < MAX_ITERATIONS);
return n;
}

/**
 * This function applies the Julia function using the given complex number
 * @param {number} z a complex number with attributes x and y
 * @param {number} c a constant complex number with attributes x and y 
 * @param {number} power the power applied to the julia function
 * @returns the number of iterations that the function reached without going towards infinity
 */
function julia(z, c, power) {
    // iteration number
    let n = 0;
    let z_powered; 
    do {
        // Complex number Z squared 
        // The minus exists because i^2 is -1
        z_powered = {
            x: Math.pow(z.x, power) - Math.pow(z.y, power),
            y: 2 * z.x * z.y
        }

        // Complex number Z with added C (i.e z^2 + c)
        z = {
            x: z_powered.x + c.x,
            y: z_powered.y + c.y
        }
        n += 1;
    // Repeat until the point passes the threshold or reaches maximum iterations
    } while ((Math.abs(z.x) + Math.abs(z.y)) <= 2 && n < MAX_ITERATIONS);
return n;
}

 
/**
 * Calculate the corresponding complex plane points using the points in canvas
 * @param {number} x point on real axis
 * @param {number} y point on complex axis
 * @returns object containing x and y values on the complex plane
 */
const relativePoint = (x, y) => {
    x = RE_MIN + (x / WIDTH) * (RE_MAX - RE_MIN);
    y = IM_MIN + (y / HEIGHT) * (IM_MAX - IM_MIN);
    return { x, y }
}



