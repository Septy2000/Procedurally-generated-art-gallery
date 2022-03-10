export class ProgressBar {
    // Default % of the progress bar is 0
    constructor (init_value = 0) {
        // Percentage number
        this.value_elem = document.getElementById("progress__bar__percentage");
        // Green loading bar
        this.fill_elem = document.getElementById("progress__bar");

        this.setValue(init_value);
    }
    /**
     * Set the percentage to a new value
     * @param {number} new_val new value of percentage 
     */
    setValue (new_val) {
        if (new_val < 0) new_val = 0;
        if (new_val > 100) new_val = 100;

        this.value = new_val;
        this.update();
    }

    /**
     * Update the progress bar in the UI
     */
    update () {
        const percentage = this.value + '%';
        this.value_elem.textContent = percentage;
        this.fill_elem.style.width = percentage;
    }

}