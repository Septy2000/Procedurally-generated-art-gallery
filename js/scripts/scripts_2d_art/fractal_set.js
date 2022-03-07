import * as pb from '../../progress_bar.js'

const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;


let RE_MIN = -2, RE_MAX = 1;
let IM_MIN = -1, IM_MAX = 1;

const SCALING_FACTOR = canvas.width / 1200;
let x_start, y_start;
let x_end, y_end;
let zoom_history = [];



let worker;
let algorithm;
const COLUMN_LIST = [];

// Buttons
const button_undo = document.getElementById("undo__zoom__button");
const button_reset = document.getElementById("reset__zoom__button")
const button_generate = document.getElementById("generate__button")

// Button states
button_undo.disabled = true;
button_reset.disabled = true;
button_generate.disabled = false;

// Menu inputs
let MAX_ITERATIONS;
let colormode, c_value; 
let color_intensity, red_weight, green_weight, blue_weight, colors_number;
let re_value, im_value;



// Check if the image is fully generated 
let isGenerated = false;
let isLeftClickPressed = false;

const progress_bar = new pb.ProgressBar(document.querySelector('#progress__bar__container'), 0);

let painting;
let imageData;
let colors; 

const COMPLEX_LIST = [
    {x: 0.355, y: 0.355}, 
    {x: 0, y: 0.8}, 
    {x: 0.37, y: 0.1}, 
    {x: -0.54, y: 0.54}, 
    {x: -0.4, y: -0.59}, 
    {x: 0.355534, y: -0.337292}
]

let index_julia;

canvas.addEventListener('mousedown', e => {
    if (e.button !== 0 || !isGenerated) return;
    const rect = canvas.getBoundingClientRect();
    x_start = (e.clientX - rect.left) * SCALING_FACTOR;
    y_start = (e.clientY - rect.top) * SCALING_FACTOR;


    painting = true;
    isLeftClickPressed = true;

    canvas.style.cursor = "crosshair";
    if("setLineDash" in ctx) {
        ctx.setLineDash([2,2]);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
})

canvas.addEventListener('mousemove', e => {
    if (!painting || !isLeftClickPressed) return;
    const rect = canvas.getBoundingClientRect();
    let x_mouse = (e.clientX - rect.left) * SCALING_FACTOR;
    let y_mouse = (e.clientY - rect.top) * SCALING_FACTOR;

    if(x_mouse > canvas.width - 2 || x_mouse < 2 || y_mouse > canvas.height - 2 || y_mouse < 2) {
        painting = false;
        canvas.style.cursor = "default";
        ctx.putImageData(imageData, 0, 0);
        return
    }


    ctx.putImageData(imageData, 0, 0);
    ctx.strokeRect(x_start, y_start, (x_mouse > x_start ? 1 : -1) * 4 / 3 * Math.abs((y_mouse - y_start)), y_mouse - y_start);

})

canvas.addEventListener('mouseup', e => {
    // Check if the "mouseup" event comes from left click (value 0)
    if (e.button !== 0 || !isGenerated || !isLeftClickPressed || !painting) {
        canvas.style.cursor = "default";
        return;
    }   
    zoom_history.push([RE_MIN, RE_MAX, IM_MIN, IM_MAX]);


    const rect = canvas.getBoundingClientRect();
    let x_mouse = (e.clientX - rect.left) * SCALING_FACTOR;
    let y_mouse = (e.clientY - rect.top) * SCALING_FACTOR;


    x_end = x_start + (x_mouse > x_start ? 1 : -1) * 4 / 3 * Math.abs((y_mouse - y_start));
    y_end = y_mouse;

    
    let temp_re_min = Math.min(reRelativePoint(x_start), reRelativePoint(x_end));
    let temp_re_max = Math.max(reRelativePoint(x_start), reRelativePoint(x_end));

    RE_MIN = temp_re_min;
    RE_MAX = temp_re_max;
    

    let temp_im_min = Math.min(imRelativePoint(y_start), imRelativePoint(y_end));
    let temp_im_max = Math.max(imRelativePoint(y_start), imRelativePoint(y_end));
    IM_MIN = temp_im_min;
    IM_MAX = temp_im_max;
    

    painting = false;
    isLeftClickPressed = false;

    canvas.style.cursor = "default";

    button_undo.disabled = false;
    button_reset.disabled = false;

    generate(algorithm);


})

const reRelativePoint = x => {
    x = RE_MIN + (x / canvas.width) * (RE_MAX - RE_MIN);
    return x;
}

const imRelativePoint = y => {
    y = IM_MIN + (y / canvas.height) * (IM_MAX - IM_MIN);
    return y;
}

button_reset.addEventListener("click", function() {
    RE_MIN = -2;
    RE_MAX = 2;
    IM_MIN = -1.5;
    IM_MAX = 1.5;
    
    button_reset.disabled = true;
    button_undo.disabled = true;
    zoom_history = [];
    generate(algorithm);
})

button_undo.addEventListener("click", function() {
    if (zoom_history.length === 0) return;
    const [re_min_prev, re_max_prev, im_min_prev, im_max_prev] = zoom_history.pop();
    RE_MIN = re_min_prev;
    RE_MAX = re_max_prev;
    IM_MIN = im_min_prev;
    IM_MAX = im_max_prev;

    if (zoom_history.length === 0) {
        button_undo.disabled = true;
        button_reset.disabled = true;
    }
        generate(algorithm);
})

function init() {
    for (let col = 0; col < canvas.width; col++) {
        COLUMN_LIST[col] = col;
    }
    worker.postMessage({col: COLUMN_LIST.shift()});
}


function draw(data) {
    if (COLUMN_LIST.length > 0) {
        worker.postMessage({col: COLUMN_LIST.shift()});
    }
    else {
        isGenerated = true;
        button_generate.disabled = false;
    }

    const {col, columns_values} = data;
    progress_bar.setValue((parseInt(col * 100 / (canvas.width - 1))));
    for (let i = 0; i < canvas.height; i++) {
        const iterations = columns_values[i];

        if (colormode === "smooth__colors") {
            ctx.fillStyle = color_HSL(iterations);
        }
        else if (colormode === "black__and__white") {
            ctx.fillStyle = color_RGB(iterations, red_weight, green_weight, blue_weight);
        }
        else {
            ctx.fillStyle = color_HEX(iterations, colors);
        }
        ctx.fillRect(col, i, 1, 1);
    }
}

export function generate(alg, generatedFromButton) {
    if (generatedFromButton) {
        refreshMenuInputs();
        // if (isMenuInputValid()) {

        // }
        if (isInputMenuEmpty()) {
            alert("One of the input fields is empty!");
            return;
        }
        RE_MIN = -2;
        RE_MAX = 2;
        IM_MIN = -1.5;
        IM_MAX = 1.5;
        zoom_history =[];
        button_undo.disabled = true;
        button_reset.disabled = true;
        colors = new Array(colors_number).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);
    }
    //index_julia = random(0, COMPLEX_LIST.length - 1);
    button_generate.disabled = true;
    isGenerated = false;

    MAX_ITERATIONS = parseInt(document.getElementById("max__iterations").value);

    algorithm = alg;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (worker) worker.terminate();
    worker = new Worker('../js/scripts/scripts_2d_art/fractal_worker.js');
    worker.postMessage({
        algorithm: alg,
        width: canvas.width,
        height: canvas.height,
        re_min: RE_MIN,
        re_max: RE_MAX,
        im_min: IM_MIN,
        im_max: IM_MAX,
        max_iter: MAX_ITERATIONS,
        isSettingUp: true,
        complex : (c_value !== -1) ? COMPLEX_LIST[c_value] : {x: re_value, y: im_value}
    })
    init();
    worker.onmessage = function(e) {
        draw(e.data);
    }
}

function refreshMenuInputs() {    
    let colormode_selection = document.getElementById("colormode__select");
    colormode = colormode_selection.options[colormode_selection.selectedIndex].value;
    // console.log(colormode)

    let c_value_selection = document.getElementById("c__value__select");
    c_value = parseInt(c_value_selection.options[c_value_selection.selectedIndex].value);
    // console.log(c_value + typeof c_value)

    color_intensity = parseInt(document.getElementById("color__intensity__value").value);
    // console.log(color_intensity)

    red_weight = parseInt(document.getElementById("red__value").value);
    // console.log(red_weight)

    green_weight = parseInt(document.getElementById("green__value").value);
    // console.log(green_weight)

    blue_weight = parseInt(document.getElementById("blue__value").value);
    // console.log(blue_weight)

    colors_number = parseInt(document.getElementById("colors__number__value").value);
    // console.log(colors_number)

    re_value = parseFloat(document.getElementById("c__value__re").value);
    // console.log(re_value)

    im_value = parseFloat(document.getElementById("c__value__im").value);
    // console.log(im_value)

    // console.log(MAX_ITERATIONS)
}

// Checks if any of the inputs from menu is empty
// If there is at least one that is empty, the user cannot generate a new image
function isInputMenuEmpty() {
    return (
        Number.isNaN(color_intensity) ||
        Number.isNaN(red_weight) || 
        Number.isNaN(green_weight) || 
        Number.isNaN(blue_weight) || 
        Number.isNaN(colors_number) || 
        Number.isNaN(re_value) || 
        Number.isNaN(im_value)
        );
}


// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}


// Coloring functions


function color_RGB(iterations, r_weight, g_weight, b_weight)  {
    let color = parseInt(iterations * 255 / MAX_ITERATIONS)
    return `rgb(${color * r_weight}, ${color * g_weight}, ${color * b_weight})`

}


function color_HEX(iterations, colors) {
    return colors[(iterations === MAX_ITERATIONS) ? 0 : (iterations % colors.length - 1) + 1]
}


function color_HSL(iterations) {
    if (iterations === MAX_ITERATIONS) {
        return `black`;
    }
    let hue = color_intensity * 360 * (iterations / MAX_ITERATIONS);
    return `hsl(${hue}, 100%, 50%)`

}



