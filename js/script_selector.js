import * as frac from './scripts/scripts-2d-art/fractal_set.js';

const canvas = document.getElementById('canvas1');
// Extract the selected algorithm
let selection = document.getElementById('alg__select');
let selected_algorithm;

// Used to update the selected algorithm whenever the user changes it
function update_selected_alg() {
    selected_algorithm = selection.options[selection.selectedIndex].value;
    console.log(selected_algorithm);
     
}

// Check when the user changes the algorithm selection
selection.onchange = update_selected_alg;
update_selected_alg()

// Decide what algorithm to run, depending on the user selection
document.getElementById("generator").addEventListener("click", function() {
    if(selected_algorithm === "mandelbrot") {
        frac.generate(selected_algorithm, canvas);
    }   
    else if(selected_algorithm === "julia") {
        frac.generate(selected_algorithm, canvas);
    }  
})

document.getElementById("save__button").addEventListener("click", function() {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
    

})


// function download_img(el) {
//     var imageURI = canvas.toDataURL("image/jpeg");
//     el.href = imageURI;
// }

