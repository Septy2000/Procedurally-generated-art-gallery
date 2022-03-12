import * as noise from './../../../helper_scripts/noise.js'

let INC, SCALING_FACTOR, COLUMNS, ROWS;
let yoff = 0, xoff;
let seed = random(1, 10000);
noise.seed(seed);
onmessage = e => {
    const { isSettingUp } = e.data;
    if (isSettingUp) {
        const { inc_param, scaling_factor_param, columns_param, rows_param } = e.data;

        INC = inc_param;
        SCALING_FACTOR = scaling_factor_param;
        COLUMNS = columns_param,
        ROWS = rows_param;

        
    }
    else {
        const { col } = e.data;
        const column_values = [];

        xoff = 0;
        yoff = col * INC;

        for (let row = 0; row < ROWS; row++) {
            column_values[row] = compute_end_point(col, row, xoff, yoff);
            xoff += INC;
        }
        postMessage( {col, column_values} );
    }
}

function compute_end_point(col, row, xoff, yoff) {
    let angle = noise.perlin2(xoff, yoff) // * Math.PI / 180 ;
    // let x_end = col * SCALING_FACTOR + SCALING_FACTOR * Math.cos(angle);
    // let y_end = row * SCALING_FACTOR + SCALING_FACTOR * Math.sin(angle)
    // return [x_end, y_end];
    return angle;
}

function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}