import * as fractal from './scripts/scripts_2d_art/fractals/fractal_set.js';
import * as perlin from './scripts/scripts_2d_art/perlin_noise/perlin.js'; 

// Get the selected algorithm
let algorithm_selection = document.getElementById("alg__select");
let selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value;

// Get the color mode for fractals
let colormode_selection_fractals = document.getElementById("colormode__select__fractals");
let selected_colormode_fractals = colormode_selection_fractals.options[colormode_selection_fractals.selectedIndex].value;
let current_colormode_menu_fractals;

// Get the color mode for perlin
let colormode_selection_perlin = document.getElementById("colormode__select__perlin");
let selected_colormode_perlin = colormode_selection_perlin.options[colormode_selection_perlin.selectedIndex].value;
let current_colormode_menu_perlin;

// Get the selected C value for Julia sets
let c_value_selection = document.getElementById("c__value__select");
let selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;

// Group fractal algorithms
let fractal_algorithms = ["mandelbrot", "julia"];

// Get the canvas element
const canvas_2d = document.getElementById("canvas__2d"); 

let selected_page = "generator";

document.getElementById("generator__anchor").addEventListener("click", () => {
    selected_page = "generator";
    document.getElementById("container").classList.remove("hide");
    document.getElementById("gallery__container").classList.add("hide");

    console.log(selected_page);
})

document.getElementById("gallery__anchor").addEventListener("click", () => {
    selected_page = "gallery";
    document.getElementById("gallery__container").classList.remove("hide");
    document.getElementById("container").classList.add("hide");
    console.log(selected_page);

})




// Initialise the variables connected to the drop-down menus.
updateSelections();

// Start generating the image when the "Generate" button is pressed, based on the selected algorithm
document.getElementById("generate__button").addEventListener("click", () => {
    if(fractal_algorithms.includes(selected_algorithm)) {
        fractal.generate(true);
    }
    else if (selected_algorithm === "perlin") {
        perlin.generate(true);
    }
});

/**
 * Update the menu so that it shows the correct elements based on the user selections
 */
function updateMenu() {
    // Hide all menu elements
    hideAllMenuElements();

    // Show all menu elements related to the selected algorithm
    if (fractal_algorithms.includes(selected_algorithm)) {
        document.getElementById("fractals__buttons__container").classList.remove("hide"); 
        document.getElementById("fractals__colormode__select__container").classList.remove("hide"); 
        document.getElementById("fractals__iterations__container").classList.remove("hide");
        if (selected_algorithm === "mandelbrot") {
            // Show the menu element that corresponds to the selected color mode
            document.getElementById(`${current_colormode_menu_fractals}`).classList.remove("hide");
        }
        else if (selected_algorithm === "julia") {
            document.getElementById(`${current_colormode_menu_fractals}`).classList.remove("hide");
            document.getElementById("fractals__cvalue__select__container").classList.remove("hide");
            if (selected_c_value === "-1") {
                document.getElementById("fractals__cvalue__input__container").classList.remove("hide");
            }
        }
    }
    else if (selected_algorithm === "perlin") {
        document.getElementById("perlin__colormode__select__container").classList.remove("hide");
            // Show the menu element that corresponds to the selected color mode
        document.getElementById(`${current_colormode_menu_perlin}`).classList.remove("hide");
        document.getElementById("perlin__scale__container").classList.remove("hide"); 
        document.getElementById("perlin__zoomout__container").classList.remove("hide");
        document.getElementById("perlin__seed__input__container").classList.remove("hide"); 
        document.getElementById("perlin__seed__output__container").classList.remove("hide");
    }
}

/**
 * When a drop-down menu selection changes, this function is called to update any related variables
 * After selection variables are updated, also update the menu interface
 */
function updateSelections() {
    // Update selected algorithm
    selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 

    // Update selected fractal algorithm colormode
    selected_colormode_fractals = colormode_selection_fractals.options[colormode_selection_fractals.selectedIndex].value;
    setColormodeMenuFractals(selected_colormode_fractals);

    // Update selected perlin noise algorithm colormode
    selected_colormode_perlin = colormode_selection_perlin.options[colormode_selection_perlin.selectedIndex].value;
    setColormodeMenuPerlin(selected_colormode_perlin);

    // Update the c value 
    selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;
 
    updateMenu();
}

function hideAllMenuElements() {
    // Menu elements related to fractal algorithms
    document.getElementById("fractals__buttons__container").classList.add("hide"); 
    document.getElementById("fractals__colormode__select__container").classList.add("hide"); 
    document.getElementById("fractals__colors__intensity__container").classList.add("hide"); 
    document.getElementById("fractals__colors__weight__container").classList.add("hide"); 
    document.getElementById("fractals__colors__number__container").classList.add("hide");
    document.getElementById("fractals__iterations__container").classList.add("hide"); 
    document.getElementById("fractals__cvalue__select__container").classList.add("hide");
    document.getElementById("fractals__cvalue__input__container").classList.add("hide"); 
    
    // Menu elements related to perlin noise algorithm 
    document.getElementById("perlin__colormode__select__container").classList.add("hide");
    document.getElementById("perlin__colors__intensity__container").classList.add("hide"); 
    document.getElementById("perlin__colors__weight__container").classList.add("hide");
    document.getElementById("perlin__scale__container").classList.add("hide"); 
    document.getElementById("perlin__zoomout__container").classList.add("hide");
    document.getElementById("perlin__seed__input__container").classList.add("hide"); 
    document.getElementById("perlin__seed__output__container").classList.add("hide");
}


/**
 * Set the current colormode for fractals art
 * @param {string} colorMode 
 */
function setColormodeMenuFractals(colormode) {
    if (colormode === "smooth__colors") {
        current_colormode_menu_fractals = "fractals__colors__intensity__container";
    }
    else if (colormode === "black__and__white") {
        current_colormode_menu_fractals = "fractals__colors__weight__container";
    }
    else if (colormode === "rand__colors") {
        current_colormode_menu_fractals = "fractals__colors__number__container";
    }
}


/**
 * Set the current colormode for perlin noise art
 * @param {string} colorMode 
 */
 function setColormodeMenuPerlin(colormode) {
    if (colormode === "smooth__colors") {
        current_colormode_menu_perlin = "perlin__colors__intensity__container";
    }
    else if (colormode === "black__and__white") {
        current_colormode_menu_perlin = "perlin__colors__weight__container";
    }
}


// Check if the user changes the algorithm, colormode or complex value
algorithm_selection.onchange = updateSelections;
colormode_selection_fractals.onchange = updateSelections;
colormode_selection_perlin.onchange = updateSelections;
c_value_selection.onchange = updateSelections;


// Save the canvas as an JPG file when pressing the "Save Image" button
document.getElementById("save__button").addEventListener("click", () => {
    // Extract the canvas data and convert it into a png file
    // Octet stream type represents a binary file
    let image = canvas_2d.toDataURL("image/png", 1.0);
    // Create a hyperlink that acts as a download link
    let download_elem = document.createElement("a");
    download_elem.download = "image.png";
    download_elem.href = image;
    download_elem.click();
})
