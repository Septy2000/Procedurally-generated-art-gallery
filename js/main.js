import * as frac from './scripts/scripts_2d_art/fractal_set.js';
import * as lines from './scripts/scripts_2d_art/lines.js'; 
import * as THREE from './scripts/scripts_3d_art/test_3d.js';

// Get the selected algorithm
let algorithm_selection = document.getElementById("alg__select");
let selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value;

// Get the color mode for fractals
let colormode_selection = document.getElementById("colormode__select");
let selected_colormode = colormode_selection.options[colormode_selection.selectedIndex].value;
let current_colormode_menu;
setCurrentColormodeMenu(selected_colormode);

// Get the selected C value for Julia sets
let c_value_selection = document.getElementById("c__value__select");
let selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;

// Group algorithms by type
let aglorithms_2d = ["mandelbrot", "julia", "lines"];
let fractal_algorithms = ["mandelbrot", "julia"];

// Get both canvas elements
const canvas_2d = document.getElementById("canvas__2d"); 
const canvas_3d = document.getElementById("canvas__3d");

// Decide what algorithm to run, based on user selection
document.getElementById("generate__button").addEventListener("click", e => {
    if(aglorithms_2d.includes(selected_algorithm)) {
        // If the algorithm is 2D, hide the 3D canvas and reveal the 2D one
        canvas_2d.classList.remove("hide");
        canvas_3d.classList.add("hide");
        if(fractal_algorithms.includes(selected_algorithm)) {
            frac.generate(selected_algorithm, true);
        }
        else {
            lines.generate(true);
        }
    }
    else {
        // If the algorithm is 3D, hide the 2D canvas and reveal the 3D one
        canvas_2d.classList.add("hide");
        canvas_3d.classList.remove("hide");
        THREE.animate();
    }

});


/**
 * Used to update the selected algorithm whenever the user changes it
 */
function update_selected_alg() {
    // Hide the specific algorithm menu upon changing it
    document.getElementById(`${selected_algorithm}`).classList.add("hide");
    // Hide the fractals menu
    document.getElementById("fractals").classList.add("hide");
    selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 

    // If the algorithm is Mandelbrot / Julia, show fractals menu
    if(fractal_algorithms.includes(selected_algorithm)) {
        document.getElementById("fractals").classList.remove("hide");
    }  

    // Show algorithm specific menu
    document.getElementById(`${selected_algorithm}`).classList.remove("hide");
}

/**
 * Update the colormode 
 */
function update_selected_colormode() {
    // Hide previous colormode menu
    document.getElementById(`${current_colormode_menu}`).classList.add("hide");
    selected_colormode = colormode_selection.options[colormode_selection.selectedIndex].value;
    setCurrentColormodeMenu(selected_colormode);
    // Show current colormode menu
    document.getElementById(`${current_colormode_menu}`).classList.remove("hide");
}

/**
 * Store the current colormode for easier access
 * @param {string} colorMode 
 */

function setCurrentColormodeMenu(colorMode) {
    if (colorMode === "smooth__colors") {
        current_colormode_menu = "colors__intensity";
    }
    else if (colorMode === "black__and__white") {
        current_colormode_menu = "colors__weight";
    }
    else {
        current_colormode_menu = "colors__number";
    }
}

/**
 * Update the menu for complex numbers on Julia set
 */
function update_selected_c_value() {
    if (selected_c_value === "-1") document.getElementById("c__value__custom").classList.add("hide");
    
    selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;

    if (selected_c_value === "-1") document.getElementById("c__value__custom").classList.remove("hide");
}

// Always check if the user changes the algorithm, colormode or complex value
algorithm_selection.onchange = update_selected_alg;
colormode_selection.onchange = update_selected_colormode;
c_value_selection.onchange = update_selected_c_value;
update_selected_alg();
update_selected_colormode();
update_selected_c_value();

// Save the canvas as an JPG file when pressing the "Save Image" button
document.getElementById("save__button").addEventListener("click", function() {
    // Extract the canvas data and convert it into a png file
    // Octet stream type represents a binary file
    let image = canvas_2d.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    // Create a hyperlink that acts as a download link
    let download_elem = document.createElement("a");
    download_elem.download = "image.png";
    download_elem.href = image;
    download_elem.click();
})
