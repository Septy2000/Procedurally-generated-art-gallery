// import './scripts/scripts-2d-art/julia_set'
import * as mb from './scripts/scripts-2d-art/mandelbrot_set.js';
import * as ju from './scripts/scripts-2d-art/julia_set.js'
let selection = document.getElementById('alg_select');
let alg;
function update_selected_alg() {
    alg = selection.options[selection.selectedIndex].value;
    console.log(alg);
     
}

document.getElementById("generator").onclick = () => {
    if(alg === "mandelbrot") {
        mb.draw();
    }   
    if(alg === "julia") {
        ju.draw();
    }  
}

selection.onchange = update_selected_alg;
update_selected_alg()
