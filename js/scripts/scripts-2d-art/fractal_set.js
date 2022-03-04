import * as pb from '../../progress_bar.js'

const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const MAX_ITERATIONS = random(1000, 1000);
let RE_MIN = -2, RE_MAX = 1;
let IM_MIN = -1, IM_MAX = 1;

let x_start, y_start;
let x_end, y_end;
const COLORS_NUMBER = 16;

let worker;
let algorithm;
const COLUMN_LIST = [];

const progress_bar = new pb.ProgressBar(document.querySelector('#progress__bar__container'), 0);

let painting;
let imageData;
let colors; 

canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const rect = canvas.getBoundingClientRect();
    x_start = e.clientX - rect.left;
    y_start = e.clientY - rect.top;


    painting = true;
    canvas.style.cursor = "crosshair";
    if("setLineDash" in ctx) {
        ctx.setLineDash([2,2]);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
})

canvas.addEventListener('mousemove', e => {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    let x_mouse = e.clientX - rect.left;
    let y_mouse = e.clientY - rect.top;


    ctx.putImageData(imageData, 0, 0);
    ctx.strokeRect(x_start, y_start, (x_mouse > x_start ? 1 : -1) * 4 / 3 * Math.abs((y_mouse - y_start)), y_mouse - y_start);

})

canvas.addEventListener('mouseup', e => {
    // Check if the "mouseup" event comes from left click
    if (e.button !== 0) return;

    const rect = canvas.getBoundingClientRect();
    let x_mouse = e.clientX - rect.left;
    let y_mouse = e.clientY - rect.top;


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
    canvas.style.cursor = "default";

    generate(algorithm);


})

function diagonal(x, y) {
    return Math.sqrt(x * x + y * y);
}

const reRelativePoint = x => {
    x = RE_MIN + (x / canvas.width) * (RE_MAX - RE_MIN);
    return x;
}

const imRelativePoint = y => {
    y = IM_MIN + (y / canvas.height) * (IM_MAX - IM_MIN);
    return y;
}

document.getElementById("reset__zoom__button").addEventListener("click", function() {
    RE_MIN = -2;
    RE_MAX = 2;
    IM_MIN = -1.5;
    IM_MAX = 1.5;

    generate(algorithm);
})

function init() {
    for (let col = 0; col < canvas.width; col++) {
        COLUMN_LIST[col] = col;
    }
    worker.postMessage({col: COLUMN_LIST.shift()});
}


const draw = data => {
    if (COLUMN_LIST.length > 0) {
        worker.postMessage({col: COLUMN_LIST.shift()});
    }

    const {col, columns_values} = data;
    progress_bar.setValue(parseInt((col + 1) * 100 / canvas.width));
    for (let i = 0; i < canvas.height; i++) {
        const iterations = columns_values[i];
        ctx.fillStyle = color_HSL(iterations);
        // ctx.fillStyle = color_HEX(iterations, colors);
        ctx.beginPath();
        ctx.fillRect(col, i, 1, 1);
        ctx.closePath();
    }
}

export function generate(alg = "mandelbrot") {
    colors = new Array(COLORS_NUMBER).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);
    algorithm = alg;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (worker) worker.terminate();
    worker = new Worker('../js/worker.js');
    worker.postMessage({
        algorithm: alg,
        width: canvas.width,
        height: canvas.height,
        re_min: RE_MIN,
        re_max: RE_MAX,
        im_min: IM_MIN,
        im_max: IM_MAX,
        max_iter: MAX_ITERATIONS,
        isSettingUp: true
    })
    init();
    worker.onmessage = function(e) {
        draw(e.data);
    }
}


function color_RGB(iterations, r_weight, g_weight, b_weight)  {
    let color = 255 - parseInt(iterations * 255 / MAX_ITERATIONS)
    return `rgb(${color * r_weight}, ${color * g_weight}, ${color * b_weight})`

}


function color_HEX(iterations, colors) {
    return colors[(iterations === MAX_ITERATIONS) ? 0 : (iterations % colors.length - 1) + 1]
}


function color_HSL(iterations) {
    if (iterations === MAX_ITERATIONS) {
        return `black`;
    }
    let h = 360 * iterations / MAX_ITERATIONS;
    return `hsl(${h},100%,50%)`

}

// Generate a random integer between a lower and an upper bound (inclusive)
function random(lower_bound, upper_bound) {
    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}



