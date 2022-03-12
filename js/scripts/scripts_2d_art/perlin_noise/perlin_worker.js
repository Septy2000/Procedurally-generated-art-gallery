import * as noise from './../../../helper_scripts/noise.js'

let ZOOM_OUT, SCALING_FACTOR, COLUMNS, ROWS;
let yoff = 0, xoff;
onmessage = e => {
    const { isSettingUp } = e.data;
    if (isSettingUp) {
        const { zoom_out_param, scaling_factor_param, seed_param, columns_param, rows_param } = e.data;

        ZOOM_OUT = zoom_out_param;
        SCALING_FACTOR = scaling_factor_param;
        COLUMNS = columns_param,
        ROWS = rows_param;
        
        noise.seed(seed_param);
    }
    else {
        const { col } = e.data;
        const column_values = [];

        xoff = 0;
        yoff = col * ZOOM_OUT;

        for (let row = 0; row < ROWS; row++) {
            column_values[row] = compute_perlin_noise(xoff, yoff);
            xoff += ZOOM_OUT;
        }
        postMessage( {col, column_values} );
    }
}


/**
 * 
 * @param {*} xoff 
 * @param {*} yoff 
 * @returns 
 */
function compute_perlin_noise(xoff, yoff) {
    return noise.perlin2(xoff, yoff);
}