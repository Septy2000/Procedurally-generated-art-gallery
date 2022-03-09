export let width = document.getElementById("res__width");
export let height = document.getElementById("res__height");

function updateResHeight() {
    height.value = parseInt(width.value * 3 / 4);
}

function updateResWidth() {
    width.value = parseInt(height.value * 4 / 3); 
}

width.onchange = updateResHeight;
height.onchange = updateResWidth;
