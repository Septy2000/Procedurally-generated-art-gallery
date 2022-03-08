import * as frac from './scripts/scripts_2d_art/fractal_set.js';
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

// Store a list of the fractals algorithms
let fractal_algorithms = ["mandelbrot", "julia"];

const canvas = document.getElementById('canvas1'); 

// Decide what algorithm to run, depending on the user selection
document.getElementById("generate__button").addEventListener("click", e => {
    if(selected_algorithm === "mandelbrot") {
        frac.generate(selected_algorithm, true);
    }   
    else if(selected_algorithm === "julia") {
        frac.generate(selected_algorithm, true);
    }  
    else {
        console.log("Not functioning yet");
    }
})

// Used to update the selected algorithm whenever the user changes it
function update_selected_alg() {
    document.getElementById(`${selected_algorithm}`).classList.add("hide");
 
    selected_algorithm = algorithm_selection.options[algorithm_selection.selectedIndex].value; 

    if(!fractal_algorithms.includes(selected_algorithm)) {
        document.getElementById("fractals").classList.add("hide");
    }
    else {
        document.getElementById("fractals").classList.remove("hide");

    }

    document.getElementById(`${selected_algorithm}`).classList.remove("hide");

}

function update_selected_colormode() {
    document.getElementById(`${current_colormode_menu}`).classList.add("hide");
    selected_colormode = colormode_selection.options[colormode_selection.selectedIndex].value;
    setCurrentColormodeMenu(selected_colormode);
    document.getElementById(`${current_colormode_menu}`).classList.remove("hide");
}

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


function update_selected_c_value() {
    if (selected_c_value === "-1") document.getElementById("c__value__custom").classList.add("hide");
    
    selected_c_value = c_value_selection.options[c_value_selection.selectedIndex].value;

    if (selected_c_value === "-1") document.getElementById("c__value__custom").classList.remove("hide");
}

// Check when the user changes the algorithm selection
algorithm_selection.onchange = update_selected_alg;
update_selected_alg();

// Check when the user changes the colormode
colormode_selection.onchange = update_selected_colormode;
update_selected_colormode();

// Check when the user changes the c value
c_value_selection.onchange = update_selected_c_value;
update_selected_c_value();

document.getElementById("save__button").addEventListener("click", function() {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
})