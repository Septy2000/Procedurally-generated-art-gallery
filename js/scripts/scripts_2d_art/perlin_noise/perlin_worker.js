import * as noise from './../../../helper_scripts/noise.js'

let ZOOM_OUT, SCALING_FACTOR, COLUMNS, ROWS;
let y_change, x_change;

// When the worker receives a message
onmessage = e => {
    const { isInitialising } = e.data;
    // Check if this is the first time this worker receives a message
    // If it is, initialise all variables
    if (isInitialising) {
        const { zoom_out_param, scaling_factor_param, seed_param, columns_param, rows_param } = e.data;

        ZOOM_OUT = zoom_out_param;
        SCALING_FACTOR = scaling_factor_param;
        COLUMNS = columns_param,
        ROWS = rows_param;
        
        // Set the seed of perlin noise
        noise.seed(seed_param);
    }
    else {
        // Extract the column number
        const { col } = e.data;
        const column_values = [];

        // Add variance on x and y axes, so the perlin noise is different
        x_change = 0;
        y_change = col * ZOOM_OUT;

        for (let row = 0; row < ROWS; row++) {
            column_values[row] = computeEndPoints(col, row);
            x_change += ZOOM_OUT;
        }
        postMessage( {col, column_values} );
    }
}

/**
 * Calculate the perlin noise and return the end point for the line based on noise
 * @param {number} col column number
 * @param {number} row row number
 * @returns a list containing end points x and y and the perlin noise
 */
function computeEndPoints(col, row) {
    let perlin_noise = noise.perlin2(y_change, x_change);
    // console.log(perlin_noise)
    let angle = perlin_noise * 2 * Math.PI;
    // let x_end = col * SCALING_FACTOR + SCALING_FACTOR * Math.cos(angle); 
    let x_end = SCALING_FACTOR * (col + Math.cos(angle));
    // let y_end = row * SCALING_FACTOR + SCALING_FACTOR * Math.sin(angle); 
    let y_end = SCALING_FACTOR * (row + Math.sin(angle)); 

    
    return [x_end, y_end, perlin_noise];
}