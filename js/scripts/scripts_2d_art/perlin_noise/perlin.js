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
       
        // Color the image based on the user selection
        if (colormode === "smooth__colors") {
            // Get the absolute value of perlin noise and multiply by 360 the number is in hue range
            ctx.strokeStyle = `hsl(${Math.abs(perlin_noise) * 360 * intensity}, 100%, 50%)`;
        }
        else {
            // Multiply each value by 255 to get a value in RGB range
            let abs_noise = Math.abs(perlin_noise);
            ctx.strokeStyle = `rgb(${abs_noise * red_weight * 255},${abs_noise * green_weight * 255},${abs_noise * blue_weight * 255})`
        }

        // Draw the line
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

    green_weight = parseFloat(document.getElementById("green__value__perlin").value);

    blue_weight = parseFloat(document.getElementById("blue__value__perlin").value);

    scaling_factor = parseFloat(document.getElementById("perlin__scale").value);

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
    if (Number.isNaN(intensity) || intensity === 0) {
        alert("Intensity value is invalid! This input requires a number different than 0");
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



// The part below handles the gallery

// Get the Perlin noise canvas element from the gallery
let canvas_perlin_gallery = document.getElementById('gallery__perlin__canvas'); 
let ctx_perlin_gallery = canvas_perlin_gallery.getContext("2d");
canvas_perlin_gallery.width = 600;
canvas_perlin_gallery.height = 450;

// Array to store the images, for easier access
let perlin_images_list = [];

// Number of images with Perlin noise
let perlin_images_number = 15;


/**
 * Initialise the list with Perlin noise images
 */
export function initialiseImagesPerlin() {
    for (let i = 0; i < perlin_images_number; i++) {
        let perlin_image = new Image();
        perlin_image.src = `images/perlin_images/image${i}.png`;
        perlin_images_list.push(perlin_image);
    }
}

/**
 * Place a random image on the corresponding canvas
 */
export function drawGallery() {  
    ctx_perlin_gallery.clearRect(0, 0, canvas_perlin_gallery.width, canvas_perlin_gallery.height)

    let number = random(0, perlin_images_number - 1);
    ctx_perlin_gallery.drawImage(perlin_images_list[number], 0, 0);
}


// When the "Change Image" button is pressed, change the image on the Perlin noise canvas on the gallery page
document.getElementById("change__image__perlin").addEventListener("click", () => {
    drawGallery();
});


// Save the Perlin noise canvas image as a PNG file when pressing the "Save Image" button
document.getElementById("save__image__perlin").addEventListener("click", () => {
    // Extract the canvas data and convert it into a png file
    // Octet stream type represents a binary file
    let image = canvas_perlin_gallery.toDataURL("image/png", 1.0);
    // Create a hyperlink that acts as a download link
    let download_elem = document.createElement("a");
    download_elem.download = `perlin_image.png`;
    download_elem.href = image;
    download_elem.click();
});

