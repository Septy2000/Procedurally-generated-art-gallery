export class ProgressBar {
    constructor (element, initialValue = 0) {
        this.valueElem = document.getElementById("progress__bar__percentage");
        this.fillElem = document.getElementById("progress__bar");

        this.setValue(initialValue);

        console.log(this.valueElem);
        console.log(this.fillElem);
    }

    setValue (newValue) {
        if (newValue < 0) newValue = 0;
        if (newValue > 100) newValue = 100;

        this.value = newValue;
        this.update();
    }

    update () {
        const percentage = this.value + '%';
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }

}