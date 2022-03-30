import * as pb from './../../../helper_scripts/progress_bar.js'
import * as res from  './../../../helper_scripts/resolution.js'

// Store the canvas element and context
const canvas_2d = document.getElementById('canvas__2d'); 
const ctx = canvas_2d.getContext("2d");

// Default values for the real and imaginary sets
let RE_MIN_default = -2, RE_MAX_default = 2;
let IM_MIN_default = -1.5, IM_MAX_default = 1.5;

// Current real and imaginary sets values
let RE_MIN, RE_MAX;
let IM_MIN, IM_MAX;

// Scaling factor for taking into account resolution difference between the actual canvas
// and the displayed canvas
let scaling_factor;

// x and y positions of the mouse pointer when left clicking on the canvas 
let x_start, y_start;

// Stores the real and imaginary set history for each zoom;
let zoom_history = [];

// Worker for generating images on the worker thread
let worker;

// Get the selected algorithm
let algorithm_selection = document.getElementById("alg__select");
let algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value;


// List of canvas columns
const COLUMN_LIST = [];

// Buttons
const button_undo = document.getElementById("undo__zoom__button");
const button_reset = document.getElementById("reset__zoom__button")
const button_generate = document.getElementById("generate__button")

// Initial button states
button_undo.disabled = true;
button_reset.disabled = true;
button_generate.disabled = false;

// Menu inputs
let max_iterations;
let colormode, c_value; 
let color_intensity, red_weight, green_weight, blue_weight, colors_number;
let re_value, im_value;

// Check if the image is fully generated 
let isGenerated = false;

// Check if te image can generate, based on current algorithm
let canGenerate = true;

// Progress bar object
const progress_bar = new pb.ProgressBar(0);

// Check if the user is selecting the zooming area
let isZooming;

// Store the data of the canvas
let canvas_data;

// Store the color palette for "Random colors" coloring mode
let colors; 

// List of predefined complex numbers used to generate interesting Julia sets
const COMPLEX_LIST = [
    {x: 0.355, y: 0.355}, 
    {x: 0, y: 0.8}, 
    {x: 0.37, y: 0.1}, 
    {x: -0.54, y: 0.54}, 
    {x: -0.4, y: -0.59}, 
    {x: 0.355534, y: -0.337292}
]


/**
 * Used to update the selected algorithm whenever the user changes it
 */
algorithm_selection.addEventListener('change', () => {
    algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 
    canGenerate = (["mandelbrot", "julia"].includes(algorithm)) ? true : false; 
})

// Event for mouse click on canvas
canvas_2d.addEventListener('mousedown', e => {
    // Check if other button than left click was pressed or the image has not finished generating yet
    if (e.button !== 0 || !isGenerated || !canGenerate) return;
    
    // Returns a DOMRect object with information about the canvas position relative to the window
    const rect = canvas_2d.getBoundingClientRect();

    // Set the x and y positions of the mouse pointer when the user used left click
    // e.clientX and e.clientY refer to the position of the mouse pointer on the browser window
    // x and y values are multiplied by the scaling factor to give the x and y relative to the true canvas resolution
    x_start = (e.clientX - rect.left) * scaling_factor;
    y_start = (e.clientY - rect.top) * scaling_factor;

    // Start the zooming action
    isZooming = true;

    canvas_2d.style.cursor = "crosshair";

    // set how frequent the dashes are
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 3;
    // set the color of the dashed lines
    ctx.strokeStyle = "white";

    // store the canvas data before drawing the rectangles
    canvas_data = ctx.getImageData(0, 0, canvas_2d.width, canvas_2d.height);
    
});

// Event for moving mouse on canvas
canvas_2d.addEventListener('mousemove', e => {
    // Only continue if the user has pressed left click first (i.e. if zooming)
    if (!isZooming) {
        canvas_2d.style.cursor = "default";
        return;
    }

    // Change the current canvas to the saved canvas
    // This makes the zooming area rectangle change size without cluttering the canvas with artifacts
    // After every drawn rectangle, the image is set back to the original and so on, achieving an animation-like effect
    ctx.putImageData(canvas_data, 0, 0);

    // Get x and y positions of the mouse cursor at every "tick" that the mouse moves
    const rect = canvas_2d.getBoundingClientRect();
    let x_mouse = (e.clientX - rect.left) * scaling_factor;
    let y_mouse = (e.clientY - rect.top) * scaling_factor;

    // Draw the rectangle, but with a fixed ratio of 4 / 3 (canvas width / height ratio)
    // so it does not distort the image after zooming
    // Also consider changing directions of the rectangle based on mouse position relative to the starting point of zooming
    ctx.strokeRect(x_start, y_start, (x_mouse > x_start ? 1 : -1) * 4 / 3 * Math.abs((y_mouse - y_start)), y_mouse - y_start);

});

// Event for moving the cursor out of the canvas area
canvas_2d.addEventListener("mouseout", e => {
    // Only continue if the user is in the process of zooming
    if (!isZooming) return;

    // Erase any rectangle and cancel zooming when the user moves the mouse out of the canvas
    isZooming = false;
    ctx.putImageData(canvas_data, 0, 0);

});

// Event for releasing left click button
canvas_2d.addEventListener('mouseup', e => { 
    // Only continue if the user is in the process of zooming
    if (!isZooming) {
        return;
    }

    isZooming = false;

    // Record the real and imaginary sets values right before zooming
    zoom_history.push([RE_MIN, RE_MAX, IM_MIN, IM_MAX]);

    // Get x and y positions of the mouse cursor
    const rect = canvas_2d.getBoundingClientRect();
    let x_mouse = (e.clientX - rect.left) * scaling_factor;
    let y_mouse = (e.clientY - rect.top) * scaling_factor;

    // Get the x and y positions of opposite corner of the zooming rectangle
    let x_end = x_start + (x_mouse > x_start ? 1 : -1) * 4 / 3 * Math.abs((y_mouse - y_start));
    let y_end = y_mouse;

    // Update the real set values
    let temp_re_min = Math.min(reComplexPlanePoint(x_start), reComplexPlanePoint(x_end));
    let temp_re_max = Math.max(reComplexPlanePoint(x_start), reComplexPlanePoint(x_end));

    RE_MIN = temp_re_min;
    RE_MAX = temp_re_max;
    
    // Update the imaginary set values
    let temp_im_min = Math.min(imComplexPlanePoint(y_start), imComplexPlanePoint(y_end));
    let temp_im_max = Math.max(imComplexPlanePoint(y_start), imComplexPlanePoint(y_end));
    IM_MIN = temp_im_min;
    IM_MAX = temp_im_max;

    canvas_2d.style.cursor = "default";

    // Disable undo and reset zoom buttons right before starting to generate the new zoomed image
    button_undo.disabled = false;
    button_reset.disabled = false;

    generate();


});


/**
 * Returns the position on real axis based on where it is on the canvas
 * @param {number} x a point on canvas
 * @returns {number} The point on real axis relative to the canvas 
 */
function reComplexPlanePoint(x) {
    x = RE_MIN + (x / canvas_2d.width) * (RE_MAX - RE_MIN);
    return x;
}

/**
 * Returns the position on imaginary axis based on where it is on the canvas
 * @param {number} y a point on canvas
 * @returns {number} The point on imaginary axis relative to the canvas 
 */
function imComplexPlanePoint(y) {
    y = IM_MIN + (y / canvas_2d.height) * (IM_MAX - IM_MIN);
    return y;
}

// Event for clicking the "Reset Zoom" button
button_reset.addEventListener("click", function() {
    // Set the real and imaginary sets to the default values
    RE_MIN = RE_MIN_default;
    RE_MAX = RE_MAX_default;
    IM_MIN = IM_MIN_default;
    IM_MAX = IM_MAX_default;
    
    
    // Empty the zoom_history
    zoom_history = [];

    // Disable "Reset Zoom" and "Unde Zoom" buttons, since there is no previous zoom. 
    button_reset.disabled = true;
    button_undo.disabled = true;

    generate();
})

// Event for clicking the "Undo Zoom" button
button_undo.addEventListener("click", function() {
    // Extract the last zoom real and imaginary sets values and make them current values
    const [re_min_prev, re_max_prev, im_min_prev, im_max_prev] = zoom_history.pop();
    RE_MIN = re_min_prev;
    RE_MAX = re_max_prev;
    IM_MIN = im_min_prev;
    IM_MAX = im_max_prev;

    // Disable the two zooming buttons if the zoom history is empty
    if (zoom_history.length === 0) {
        button_undo.disabled = true;
        button_reset.disabled = true;
    }
    generate();
})

/**
 * Initialise the column list and post the columns to the worker thread one by one
 */
function init_columns() {
    for (let col = 0; col < canvas_2d.width; col++) {
        COLUMN_LIST[col] = col;
    }
    // Extract the first column in the list and pass it to the worker thread
    worker.postMessage({col: COLUMN_LIST.shift()});
}

// Variables used to store the start and end time of an image generation
let startTime, endTime;

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
        // If the column list is empty, mark the image as generated
        isGenerated = true;
        button_generate.disabled = false;
        // Register the end time of generation
        endTime = performance.now();
        // console.log(endTime - startTime);
    }
    // Extract the column index and its values
    const {col, columns_values} = data;

    // Set the progress bar percentage to the curent column index relative to the total columns
    progress_bar.setValue((parseInt(col * 100 / (canvas_2d.width - 1))));
    
    // Iterate through each point on the column to draw on
    for (let i = 0; i < canvas_2d.height; i++) {
        // Extract the iterations number of each point
        const iterations = columns_values[i];

        // Select the coloring mode based on the user selection
        if (colormode === "smooth__colors") {
            ctx.fillStyle = color_HSL(iterations);
        }
        else if (colormode === "black__and__white") {
            ctx.fillStyle = color_RGB(iterations, red_weight, green_weight, blue_weight);
        }
        else {
            ctx.fillStyle = color_HEX(iterations, colors);
        }
        let rect_width = (scaling_factor < 1) ? (1 / scaling_factor) : 1;
        let rect_height = (scaling_factor < 1) ? (1 / scaling_factor) : 1;

        ctx.fillRect(col, i, rect_width, rect_height);
    }
}

/**
 * Start generating the image.
 * @param {boolean} generatedFromButton true if the generation is a result of the user clicking the "Generate" button
 */
export function generate(generatedFromButton = false) {
    // Check if the generation can start
    if (!canGenerate) return;

    // Check if the generation if from user action
    if (generatedFromButton) {
        // Update the parameters with the user input from the menu
        refreshMenuInputs();
        
        // If the parameters are not valid, cancel the generation of a new image
        if (!isMenuInputValid()) return;

        // Set current real and imaginary sets to the default values
        RE_MIN = RE_MIN_default;
        RE_MAX = RE_MAX_default;
        IM_MIN = IM_MIN_default;
        IM_MAX = IM_MAX_default;

        // Reset zoom history and disable zooming buttons
        zoom_history =[];
        button_undo.disabled = true;
        button_reset.disabled = true;

        // Create the color palette
        colors = new Array(colors_number).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);
    }
    // Disable the "Generate" button while generating 
    button_generate.disabled = true;
    isGenerated = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas_2d.width, canvas_2d.height);

    // Start a new worker and end a previous one
    if (worker) worker.terminate();
    worker = new Worker('./js/scripts/scripts_2d_art/fractals/fractal_worker.js');
   
    // Pass parameters to the worker thread
    worker.postMessage({
        algorithm: algorithm,
        width: canvas_2d.width,
        height: canvas_2d.height,
        re_min: RE_MIN,
        re_max: RE_MAX,
        im_min: IM_MIN,
        im_max: IM_MAX,
        max_iter: max_iterations,
        isInitialising: true,
        // If the user selected the "Custom" complex number option for Julia sets, get those values instead
        complex : (c_value !== -1) ? COMPLEX_LIST[c_value] : {x: re_value, y: im_value}
    })
    // Create columns list
    init_columns();

    // Register the start time of the generation
    startTime = performance.now();
  
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
    // Update the scaling factor 
    scaling_factor = canvas_2d.width / 1200;
    
    let colormode_selection = document.getElementById("colormode__select");
    colormode = colormode_selection.options[colormode_selection.selectedIndex].value;

    let c_value_selection = document.getElementById("c__value__select");
    c_value = parseInt(c_value_selection.options[c_value_selection.selectedIndex].value);

    color_intensity = parseInt(document.getElementById("color__intensity__value").value);

    red_weight = parseInt(document.getElementById("red__value").value);

    green_weight = parseInt(document.getElementById("green__value").value);

    blue_weight = parseInt(document.getElementById("blue__value").value);

    colors_number = parseInt(document.getElementById("colors__number__value").value);

    re_value = parseFloat(document.getElementById("c__value__re").value);

    im_value = parseFloat(document.getElementById("c__value__im").value);

    max_iterations = parseInt(document.getElementById("max__iterations").value);
}


/**
 * Check if the input boxes from the menu UI are valid
 * Valid means not empty or within the valid range
 * @returns true if all the inputs are valid
 */
function isMenuInputValid() {

    // Check, for each input, if it's empty or if it's within limits
    // Canvas width and height are validated in resolution.js script

    if (Number.isNaN(color_intensity) || color_intensity === 0) {
        alert("Color intensity is invalid! This input requires an integer different than 0");
        return false;
    }
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
    if (Number.isNaN(colors_number) || colors_number < 2) {
        alert("Number of colors is invalid! This input requires an integer greater than 1");
        return false;
    }
    if (Number.isNaN(max_iterations) || max_iterations < 0) {
        alert("Number of iterations is invalid! This input requires an integer greater than or equal to 0");
        return false;
    }
    return true;
}


/**
 * Generate a random integer between a lower and an upper bound (inclusive)
 * @param {number} lower_bound 
 * @param {number} upper_bound 
 * @returns generated number
 */
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}


// Coloring functions

/**
 * Return a RGB color based on the number of iterations and the user RGB weights.
 * @param {number} iterations 
 * @param {number} r_weight 
 * @param {number} g_weight 
 * @param {number} b_weight 
 * @returns RGB color
 */
function color_RGB(iterations, r_weight, g_weight, b_weight)  {
    // Represent the number of iterations as a value 0 - 255 
    let color = parseInt(iterations * 255 / max_iterations)
    return `rgb(${color * r_weight}, ${color * g_weight}, ${color * b_weight})`;

}

/**
 * Return a HEX color based on iterations and color palette
 * @param {number} iterations 
 * @param {Array} colors 
 * @returns HEX color
 */
function color_HEX(iterations, colors) {
    return colors[(iterations === max_iterations) ? 0 : (iterations % colors.length - 1) + 1]
}

/**
 * Return an HSL color based on iterations
 * @param {number} iterations 
 * @returns HSL color
 */
function color_HSL(iterations) {
    // If the point reached max iterations, this means it's part of Mandelbrot / Julia set and is colored in black
    if (iterations === max_iterations) {
        return `black`;
    }
    // Set the hue of the color based on the iterations number
    // Increasing the color intensity makes the colors pop more and adds more colors overall
    let hue = color_intensity * 360 * (iterations / max_iterations);
    return `hsl(${parseInt(hue)}, 100%, 50%)`

}



