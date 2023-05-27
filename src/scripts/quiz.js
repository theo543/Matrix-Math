import * as matrices from './matrices.js';

export class Quiz {
    /** @type {HTMLDivElement} **/
    $root;
    /** @type {HTMLHeadingElement} **/
    $prompt;
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
        this.handler = undefined;
        this.$root = document.createElement("div");
        this.$root.classList.add("matrix_quiz");
        this.$prompt = document.createElement("h4");
        this.$root.appendChild(this.$prompt);
        this.$prompt.textContent = initial_prompt;
        this.$root.appendChild(this.$prompt);
        this.$root.appendChild($question);
        this.answer = answer;
        this.$form = matrices.makeMatrixForm(this.answer.size);
        this.$root.appendChild(this.$form);
        this.$form.classList.add("interactive_form");
        this.$form.insertAdjacentHTML("beforeend", `<input type='submit' value='Check answer!'>`);
        this.$form.insertAdjacentHTML('beforeend', `<button>Reveal Answer</button>`);
        /** @type {HTMLButtonElement} **/
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

    /**
     * @param enabled {boolean}
     */
    setEnabled(enabled) {
        for(let elem of this.$form.querySelectorAll("input[type='submit'], button")) {
            elem.disabled = !enabled;
        }
    }

    /**
     * @param prompt {String}
     */
    setPrompt(prompt) {
        this.$prompt.textContent = prompt;
    }
}
