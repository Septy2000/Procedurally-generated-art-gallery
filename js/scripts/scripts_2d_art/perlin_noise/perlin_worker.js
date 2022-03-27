import * as noise from './../../../helper_scripts/noise.js'

let ZOOM_OUT, SCALING_FACTOR, COLUMNS, ROWS;
let y_off, x_off;

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
        x_off = 0;
        y_off = (col - 1) * ZOOM_OUT;

        for (let row = 0; row < ROWS; row++) {
            column_values[row] = noise.perlin2(x_off, y_off);
            x_off += ZOOM_OUT;
        }
        postMessage( {col, column_values} );
    }
}