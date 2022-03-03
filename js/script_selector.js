import * as mb from './scripts/scripts-2d-art/mandelbrot_set.js';
import * as ju from './scripts/scripts-2d-art/julia_set.js'
let selection = document.getElementById('alg__select');
let alg;

function update_selected_alg() {
    alg = selection.options[selection.selectedIndex].value;
    console.log(alg);
     
}

document.getElementById("generator").addEventListener("click", function() {
    if(alg === "mandelbrot") {
        mb.generate();
    }   
    if(alg === "julia") {
        ju.draw();
    }  
})

selection.onchange = update_selected_alg;
update_selected_alg()

