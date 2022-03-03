import * as frac from './scripts/scripts-2d-art/fractal_set.js';
let selection = document.getElementById('alg__select');
let alg;

function update_selected_alg() {
    alg = selection.options[selection.selectedIndex].value;
    console.log(alg);
     
}

selection.onchange = update_selected_alg;
update_selected_alg()

document.getElementById("generator").addEventListener("click", function() {
    if(alg === "mandelbrot") {
        frac.generate(alg);
    }   
    if(alg === "julia") {
        frac.generate(alg);
    }  
})



