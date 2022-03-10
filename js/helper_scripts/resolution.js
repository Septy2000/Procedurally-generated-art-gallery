export let width = document.getElementById("res__width");
export let height = document.getElementById("res__height");

function updateResHeight() {
    if (width.value < 2) {
        alert("Canvas width is invalid! This input requires an integer greater than 1");
        width.value = 800;
    }
    height.value = parseInt(width.value * 3 / 4);
}

function updateResWidth() {
    if (height.value < 1) {
        alert("Canvas height is invalid! This input requires an integer greater than 0");
        height.value = 600;
    }
    width.value = parseInt(height.value * 4 / 3); 
}

width.onchange = updateResHeight;
height.onchange = updateResWidth;
