export class ProgressBar {
    constructor (init_value = 0) {
        this.value_elem = document.getElementById("progress__bar__percentage");
        this.fill_elem = document.getElementById("progress__bar");

        this.setValue(init_value);
    }

    setValue (new_val) {
        if (new_val < 0) new_val = 0;
        if (new_val > 100) new_val = 100;

        this.value = new_val;
        this.update();
    }

    update () {
        const percentage = this.value + '%';
        this.value_elem.textContent = percentage;
        this.fill_elem.style.width = percentage;
    }

}