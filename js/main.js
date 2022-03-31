import * as frac from './scripts/scripts_2d_art/fractals/fractal_set.js';
import * as perlin from './scripts/scripts_2d_art/perlin_noise/perlin.js'; 

// Get the selected algorithm
let algorithm_selection = document.getElementById("alg__select");
let selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value;

// Get the color mode for fractals
let colormode_selection_fractals = document.getElementById("colormode__select__fractals");
let selected_colormode__fractals = colormode_selection_fractals.options[colormode_selection_fractals.selectedIndex].value;
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

// Decide what algorithm to run, based on user selection
document.getElementById("generate__button").addEventListener("click", () => {
    if(fractal_algorithms.includes(selected_algorithm)) {
        frac.generate(true);
    }
    else if (selected_algorithm === "perlin") {
        perlin.generate(true);
    }
});

initialiseSelections();
updateMenu();

function updateMenu() {
    hideAllMenuElements();
    if (selected_algorithm === "mandelbrot") {
        document.getElementById("fractals__buttons__container").classList.remove("hide"); 
        document.getElementById("fractals__colormode__select__container").classList.remove("hide"); 
        document.getElementById("fractals__iterations__container").classList.remove("hide");
        document.getElementById(`${current_colormode_menu_fractals}`).classList.remove("hide");
    }
    else if (selected_algorithm === "julia") {
        document.getElementById("fractals__buttons__container").classList.remove("hide"); 
        document.getElementById("fractals__colormode__select__container").classList.remove("hide"); 
        document.getElementById("fractals__iterations__container").classList.remove("hide");
        document.getElementById(`${current_colormode_menu_fractals}`).classList.remove("hide");
        document.getElementById("fractals__cvalue__select__container").classList.remove("hide");
        if (selected_c_value === "-1") {
            document.getElementById("fractals__cvalue__input__container").classList.remove("hide");
        }
    }
    else if (selected_algorithm === "perlin") {
        document.getElementById("perlin__colormode__select__container").classList.remove("hide");
        document.getElementById(`${current_colormode_menu_perlin}`).classList.remove("hide");
        document.getElementById("perlin__scale__container").classList.remove("hide"); 
        document.getElementById("perlin__zoomout__container").classList.remove("hide");
        document.getElementById("perlin__seed__input__container").classList.remove("hide"); 
        document.getElementById("perlin__seed__output__container").classList.remove("hide");
    }
}

function initialiseSelections() {
    selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 
    selected_colormode__fractals = colormode_selection_fractals.options[colormode_selection_fractals.selectedIndex].value;
    setColormodeMenuFractals(selected_colormode__fractals);
    selected_colormode_perlin = colormode_selection_perlin.options[colormode_selection_perlin.selectedIndex].value;
    setColormodeMenuPerlin(selected_colormode_perlin);
    selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;
}

function hideAllMenuElements() {
    document.getElementById("fractals__buttons__container").classList.add("hide"); 
    document.getElementById("fractals__colormode__select__container").classList.add("hide"); 
    document.getElementById("fractals__colors__intensity__container").classList.add("hide"); 
    document.getElementById("fractals__colors__weight__container").classList.add("hide"); 
    document.getElementById("fractals__colors__number__container").classList.add("hide");
    document.getElementById("fractals__iterations__container").classList.add("hide"); 
    document.getElementById("fractals__cvalue__select__container").classList.add("hide");
    document.getElementById("fractals__cvalue__input__container").classList.add("hide"); 
    
    document.getElementById("perlin__colormode__select__container").classList.add("hide");
    document.getElementById("perlin__colors__intensity__container").classList.add("hide"); 
    document.getElementById("perlin__colors__weight__container").classList.add("hide");
    document.getElementById("perlin__scale__container").classList.add("hide"); 
    document.getElementById("perlin__zoomout__container").classList.add("hide");
    document.getElementById("perlin__seed__input__container").classList.add("hide"); 
    document.getElementById("perlin__seed__output__container").classList.add("hide");
}

/**
 * Used to update the selected algorithm and menu whenever the user changes it
 */
 function updateSelectedAlgorithm() {
    selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 
    updateMenu();
}

/**
 * Update the colormode and the menu for fractals
 */
 function updateSelectedColormodeFractals() {
    selected_colormode__fractals = colormode_selection_fractals.options[colormode_selection_fractals.selectedIndex].value;
    setColormodeMenuFractals(selected_colormode__fractals);
    updateMenu();
}

/**
 * Update the colormode and the menu for perlin noise
 */
 function updateSelectedColormodePerlin() {
    selected_colormode_perlin = colormode_selection_perlin.options[colormode_selection_perlin.selectedIndex].value;
    setColormodeMenuPerlin(selected_colormode_perlin);
    updateMenu();
}

/**
 * Update the menu for complex numbers on Julia set
 */
 function updateSelectedCValue() {
    selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;
    updateMenu();
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


// Always check if the user changes the algorithm, colormode or complex value
algorithm_selection.onchange = updateSelectedAlgorithm;
colormode_selection_fractals.onchange = updateSelectedColormodeFractals;
colormode_selection_perlin.onchange = updateSelectedColormodePerlin;
c_value_selection.onchange = updateSelectedCValue;
updateSelectedAlgorithm();
updateSelectedColormodeFractals();
updateSelectedColormodePerlin();
updateSelectedCValue();


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
