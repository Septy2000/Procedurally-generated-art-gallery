import * as pb from '../../progress_bar.js'

let canvas, ctx;


const MAX_ITERATIONS = random(200, 200);

const RE_MIN = -2, RE_MAX = 2;
const IM_MIN = -1.5, IM_MAX = 1.5;

const COLORS_NUMBER = 5;

let worker;
const COLUMN_LIST = [];

const progress_bar = new pb.ProgressBar(document.querySelector('#progress__bar__container'), 0);


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
        ctx.beginPath();
        ctx.fillRect(col, i, 1, 1);
        ctx.closePath();
    }
}

export function generate(alg, canvas_param) {
    canvas = canvas_param;
    canvas.width = 1440;
    canvas.height = 1080;
    ctx = canvas.getContext("2d");

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
    console.log("finished");
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



