import * as pb from './../../../helper_scripts/progress_bar.js'
import * as res from  './../../../helper_scripts/resolution.js'

// Store the canvas element and context
const canvas_2d = document.getElementById('canvas__2d'); 
const ctx = canvas_2d.getContext("2d");

// Buttons
const button_generate = document.getElementById("generate__button")

// Menu inputs
let colormode, red_weight, green_weight, blue_weight;
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
        let [x_end, y_end, perlin_noise]  = column_values[row];
       
        if (colormode === "smooth__colors") {
            // Get the absolute value of perlin noise and multiply by 360 the number is in hue range
            ctx.strokeStyle = color_HSL(Math.abs(perlin_noise) * 360 * intensity)
        }
        else {
            ctx.strokeStyle = `rgb(${perlin_noise * red_weight * 100},${perlin_noise * green_weight * 100},${perlin_noise * blue_weight * 100})`
        }

        ctx.beginPath();
        ctx.moveTo(col * scaling_factor, row * scaling_factor);
        ctx.lineTo(x_end, y_end);
        ctx.stroke();

    }   
}

/**
 * Start generating the image.
 * @param {boolean} generatedFromButton true if the generation is a result of the user clicking the "Generate" button
 */
 export function generate(generatedFromButton) {
    // Check if the generation if from user action
    if (generatedFromButton) {
        // Update the parameters with the user input from the menu
        refreshMenuInputs();

        // If the parameters are not valid, cancel the generation of a new image
        if (!isMenuInputValid()) return;

        // If there is no seed input by the user, generate a random one
        if (Number.isNaN(seed)) {
            seed = random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        }

        document.getElementById("perlin__current__seed").innerHTML = seed;

        // Calculate the new column and row sizes according to the scaling factor 
        columns = Math.floor(canvas_2d.width / scaling_factor);
        rows = Math.floor(canvas_2d.height / scaling_factor);
    }

    // Start a new worker and end a previous one
    if (worker) worker.terminate();
    worker = new Worker('./js/scripts/scripts_2d_art/perlin_noise/perlin_worker.js', {type: "module"});
   
    // Pass parameters to the worker thread
    worker.postMessage({
        zoom_out_param: zoom_out,
        scaling_factor_param: scaling_factor,
        seed_param: seed,
        columns_param: columns,
        rows_param: rows,
        isInitialising: true
    })
    // Create columns list
    init_columns();

    // Start a new worker and end a previous one
    button_generate.disabled = true;
    
    // When worker returns a message, draw on the canvas
    worker.onmessage = function(e) {
        draw(e.data);
    }
}


/**
 * Update the parameters with the user inputs from the menu
 */
function refreshMenuInputs() {
    canvas_2d.width = res.width.value;
    canvas_2d.height = res.height.value;

    let colormode_selection = document.getElementById("colormode__select__perlin");
    colormode = colormode_selection.options[colormode_selection.selectedIndex].value;

    red_weight = parseInt(document.getElementById("red__value__perlin").value);

    green_weight = parseInt(document.getElementById("green__value__perlin").value);

    blue_weight = parseInt(document.getElementById("blue__value__perlin").value);

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
    if (Number.isNaN(red_weight) || red_weight < 0) {
        alert("Weight of red color (R) is invalid! This input requires an integer greater than or equal to 0");
        return false;
    }
    if (Number.isNaN(green_weight) || green_weight < 0) {
        alert("Weight of green color (G) is invalid! This input requires an integer greater than or equal to 0");
        return false;
    }
    if (Number.isNaN(blue_weight) || blue_weight < 0) {
        alert("Weight of blue color (B) is invalid! This input requires an integer greater than or equal to 0");
        return false;
    }
    if (Number.isNaN(scaling_factor) || scaling_factor <= 0) {
        alert("Scaling factor is invalid! This input requires an integer bigger than 0");
        return false;
    }
    if (Number.isNaN(intensity) || intensity <= 0) {
        alert("Intensity value is invalid! This input requires a number bigger than 0");
        return false;
    }
    if (Number.isNaN(zoom_out) || zoom_out <= 0) {
        alert("Zoom out value is invalid! This input requires a number bigger than 0");
        return false;
    }

    return true;
}


/**
 * Generate a random integer between the lower and upper bound (inclusive)
 * @param {number} lower_bound 
 * @param {number} upper_bound 
 * @returns random number 
 */
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