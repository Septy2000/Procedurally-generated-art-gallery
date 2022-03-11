import * as pb from '../../helper_scripts/progress_bar.js'
import * as res from  '../../helper_scripts/resolution.js'
// import * as noise from './noise.js'
// Store the canvas element adn context
const canvas_2d = document.getElementById('canvas__2d'); 
const ctx = canvas_2d.getContext("2d");

const button_generate = document.getElementById("generate__button")

let inc = 0.01;
let scaling_factor = 20;
let columns, rows;
let worker;
const COLUMN_LIST = [];

// Progress bar object
const progress_bar = new pb.ProgressBar(0);


/**
 * Initialise the column list and post the columns to the worker thread one by one
 */
function init_columns() {
    for (let col = 0; col < columns; col++) {
        COLUMN_LIST[col] = col;
    }
    // Extract the first column in the list and pass it to the worker thread
    worker.postMessage({col: COLUMN_LIST.shift()});
}

function draw(data) {
    if (COLUMN_LIST.length > 0) {
        worker.postMessage({
            col: COLUMN_LIST.shift()
        });
    }
    else {
        button_generate.disabled = false;
    }
    const {col, column_values} = data;
    // Set the progress bar percentage to the curent column index relative to the total columns
    progress_bar.setValue((parseInt(col * 100 / (columns - 1))));

    for (let row = 0; row < rows; row++) {
        // console.log(columns_values[row]);
        const [x_end, y_end]  = column_values[row];
        ctx.strokeStyle = color_HSL(1)
        ctx.moveTo(col * scaling_factor, row * scaling_factor);
        ctx.lineTo(x_end , y_end);
        ctx.stroke();
    }   
}

/**
 * Start generating the image.
 * @param {boolean} generatedFromButton true if the generation is a result of the user clicking the "Generate" button
 */
 export function generate(generatedFromButton) {
    if (generatedFromButton) {
        refreshResolution()
        columns = Math.floor(canvas_2d.width / scaling_factor);
        rows = Math.floor(canvas_2d.height / scaling_factor);
    }

    if (worker) worker.terminate();
    worker = new Worker('../js/scripts/scripts_2d_art/perlin_worker.js');
   
    worker.postMessage({
        inc_param: inc,
        scaling_factor_param: scaling_factor,
        columns_param: columns,
        rows_param: rows,
        isSettingUp: true
    })
    init_columns();

    button_generate.disabled = true;
    worker.onmessage = function(e) {
        draw(e.data);
    }
}
   




// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}

function color_HSL(number) {
    return `hsl(${number}, 100%, 50%)`

}


/**
 * Update canvas width and height with the user input from the menu
 */
function refreshResolution() {
    canvas_2d.width = res.width.value;
    canvas_2d.height = res.height.value;
}