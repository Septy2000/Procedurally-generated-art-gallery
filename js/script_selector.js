import * as frac from './scripts/scripts-2d-art/fractal_set.js';
// Extract the selected algorithm
let selection = document.getElementById('alg__select');
let selected_algorithm = selection.options[selection.selectedIndex].value;
let fractal_algorithsm = ["mandelbrot", "julia"];

const canvas = document.getElementById('canvas1'); 

// Used to update the selected algorithm whenever the user changes it
function update_selected_alg() {
    document.getElementById(`${selected_algorithm}`).classList.add("hide");
 
    selected_algorithm = selection.options[selection.selectedIndex].value; 
    if(!fractal_algorithsm.includes(selected_algorithm)) {
        document.getElementById("fractals").classList.add("hide");
    }
    else {
        document.getElementById("fractals").classList.remove("hide");

    }

    document.getElementById(`${selected_algorithm}`).classList.remove("hide");

}

// Check when the user changes the algorithm selection
selection.onchange = update_selected_alg;

// Decide what algorithm to run, depending on the user selection
document.getElementById("generator").addEventListener("click", function() {
    if(selected_algorithm === "mandelbrot") {
        frac.generate(selected_algorithm, true);
    }   
    else if(selected_algorithm === "julia") {
        frac.generate(selected_algorithm, true);
    }  
})

document.getElementById("save__button").addEventListener("click", function() {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
})

