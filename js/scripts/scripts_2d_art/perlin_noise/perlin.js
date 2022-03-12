import * as pb from './../../../helper_scripts/progress_bar.js'
import * as res from  './../../../helper_scripts/resolution.js'

// Store the canvas element and context
const canvas_2d = document.getElementById('canvas__2d'); 
const ctx = canvas_2d.getContext("2d");

// Buttons
const button_generate = document.getElementById("generate__button")

// Menu inputs
let zoom_out, scaling_factor, intensity, seed;

// Number of columns and rows after scale
let columns, rows;

// Worker for generating images on the worker thread
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

/**
 * Apply colors on the canvas to the corresponding column, based on the column values
 * @param {object} data 
 */
function draw(data) {
    // If the column list is not empty, send the next column to the worker
    if (COLUMN_LIST.length > 0) {
        worker.postMessage({
            col: COLUMN_LIST.shift()
        });
    }
    else {
        button_generate.disabled = false;
    }
    // Extract the column index and its values
    const {col, column_values} = data;

    // Set the progress bar percentage to the curent column index relative to the total columns
    progress_bar.setValue((parseInt(col * 100 / (columns - 1))));

    // Iterate through each point on the column to draw on
    for (let row = 0; row < rows; row++) {
        const perlin_noise  = column_values[row];
        // Get the absolute value of perlin noise and multiply by 360 so have a number in hue range,
        // because the value is too low to make a difference in color
        ctx.fillStyle = color_HSL(Math.abs(perlin_noise) * 360 * intensity)
        ctx.fillRect(col * scaling_factor, row * scaling_factor, scaling_factor, scaling_factor);

    }   
}

/**
 * Start generating the image.
 * @param {boolean} generatedFromButton true if the generation is a result of the user clicking the "Generate" button
 */
 export function generate(generatedFromButton) {
    
    if (generatedFromButton) {
        refreshMenuInputs();
        if (!isMenuInputValid()) return;
        if (Number.isNaN(seed)) {
            seed = random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        }

        document.getElementById("perlin__current__seed").innerHTML = seed;

        columns = Math.floor(canvas_2d.width / scaling_factor);
        rows = Math.floor(canvas_2d.height / scaling_factor);
    }

    if (worker) worker.terminate();
    worker = new Worker('./js/scripts/scripts_2d_art/perlin_noise/perlin_worker.js', {type: "module"});
   
    worker.postMessage({
        zoom_out_param: zoom_out,
        scaling_factor_param: scaling_factor,
        seed_param: seed,
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

/**
 * Creates and returns a HSL color based on the given input
 * @param {number} number 
 * @returns HSL color
 */
function color_HSL(number) {
    return `hsl(${number}, 100%, 50%)`

}


/**
 * Update the parameters with the user inputs from the menu
 */
function refreshMenuInputs() {
    canvas_2d.width = res.width.value;
    canvas_2d.height = res.height.value;

    scaling_factor = parseInt(document.getElementById("perlin__scale").value);

    intensity = parseFloat(document.getElementById("perlin__intensity").value);

    zoom_out = parseFloat(document.getElementById("perlin__zoomout").value) / 100;

    seed = parseInt(document.getElementById("perlin__seed").value);
}


/**
 * Check if the input boxes from the menu UI are valid
 * Valid means not empty or within the valid range
 * @returns true if all the inputs are valid
 */
function isMenuInputValid() {
    if (Number.isNaN(scaling_factor) || scaling_factor <= 0) {
        alert("Scaling factor is invalid! This input requires an integer bigger than 0");
        return false;
    }
    if (Number.isNaN(intensity) || intensity <= 0) {
        alert("Intensity is invalid! This input requires a number bigger than to 0");
        return false;
    }
    if (Number.isNaN(zoom_out) || zoom_out <= 0) {
        alert("Zoom out value is invalid! This input requires a number bigger than 0");
        return false;
    }

    return true;
}