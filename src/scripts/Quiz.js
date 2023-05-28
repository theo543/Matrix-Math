import * as matrices from './matrices.js';

export class Quiz {
    $root = document.createElement("div");
    $background = document.createElement("div");
    $prompt = document.createElement("h4");
    /** @type {HTMLFormElement} **/
    $form;
    /** @type {Matrix} **/
    answer;
    /**
     * @param answer {Matrix}
     * @param $question {HTMLElement}
     * @param initial_prompt {String}
     * @param reveal {boolean}
     */
    constructor(answer, $question, initial_prompt, reveal) {
        this.$root.classList.add("interactive_exercise");
        this.$root.appendChild(this.$prompt);
        this.$background.classList.add("interactive_background");
        this.$root.appendChild(this.$background);
        this.$prompt.textContent = initial_prompt;
        this.$root.appendChild(this.$prompt);
        this.$root.appendChild($question);
        this.answer = answer;
        this.$form = matrices.makeMatrixForm(this.answer.size);
        this.$root.appendChild(this.$form);
        this.$form.classList.add("interactive_form");
        this.$form.insertAdjacentHTML("beforeend", `<input type='submit' value='Check answer!'>`);
        this.$form.insertAdjacentHTML('beforeend', `<button>Reveal Answer</button>`);
        let $reveal = this.$form.getElementsByTagName("button")[0];
        $reveal.addEventListener("click", event => {
            event.preventDefault();
            let row = 0;
            for(let $tr of this.$form.getElementsByTagName("tr")) {
                let col = 0;
                for(let $input of $tr.getElementsByTagName("input")) {
                    $input.value = this.answer.data[row][col].toString();
                    col++;
                }
                row++;
            }
        });
        if(!reveal) $reveal.style.display = 'none';
        this.$form.addEventListener("submit", event => event.preventDefault());
    }

    /**
     * @callback quizAnswerHandler
     * @param success {boolean}
     */
    /**
     * @param callback {quizAnswerHandler}
     */
    addAnswerHandler(callback) {
        this.$form.addEventListener("submit", () => {
            let input = matrices.fromHTML(this.$form.getElementsByTagName("table")[0]);
            let valid = this.$form.checkValidity();
            callback(!valid || matrices.equal(input, this.answer));
        });
    }

    addDefaultHandler() {
        this.addAnswerHandler(success => {
            if(success) {
                this.setPrompt("Congrats!");
                this.setEnabled(false);
                this.permanentColor('lightgreen');
            } else {
                this.setPrompt("Try again...");
                this.flashColor('red', true);
            }
        });
    }

    /**
     * @param enabled {boolean}
     */
    setEnabled(enabled) {
        for(let elem of this.$form.querySelectorAll("input, button")) {
            elem.disabled = !enabled;
        }
    }

    /**
     * @param prompt {String}
     */
    setPrompt(prompt) {
        this.$prompt.textContent = prompt;
    }

    /**
     * @param color {string}
     * @param shake {boolean}
     */
    flashColor(color, shake = false) {
        const animation_class = "interactive_flash";
        const shake_class = "interactive_shake";
        requestAnimationFrame(() => {
            this.$background.classList.remove(animation_class);
            if(shake) this.$root.classList.remove(shake_class);
            this.$background.style.backgroundColor = color;
            requestAnimationFrame(() => {
                this.$background.classList.add(animation_class);
                if(shake) this.$root.classList.add(shake_class);
                setTimeout(() => {
                    /*
                     these cause the animation to replay when returning to the tab if left on the element (apparently this is intended?)
                     */
                    this.$background.classList.remove(animation_class);
                    this.$root.classList.remove(shake_class);
                }, 600);
            });
        });
    }

    /**
     * @param color {string}
    */
    permanentColor(color) {
        const transition_class = "permanent_flash";
        this.$background.style.backgroundColor = color;
        this.$background.classList.add(transition_class);
    }
}
