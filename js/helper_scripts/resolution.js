// Canvas width from user input
export let width = document.getElementById("res__width");
// Canvas height from user input
export let height = document.getElementById("res__height");

/**
 * When the width changes, the height also changes to maintain a 4:3 ratio
 */
function updateResHeight() {
    // Validate the width value from the input box
    if (width.value < 2) {
        alert("Canvas width is invalid! This input requires an integer greater than 1");
        // If the width is invalid, set it to the default
        width.value = 800;
    }
    height.value = parseInt(width.value * 3 / 4);
}

/**
 * When the height changes, the width also changes to maintain a 4:3 ratio
 */
function updateResWidth() {
    // Validate the height value from the input box
    if (height.value < 1) {
        alert("Canvas height is invalid! This input requires an integer greater than 0");
        // If the height is invalid, set it to the default
        height.value = 600;
    }
    width.value = parseInt(height.value * 4 / 3); 
}

// Constantly check for changes 
width.onchange = updateResHeight;
height.onchange = updateResWidth;
