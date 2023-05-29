import { pushNotification } from './notifications.js';
import { Quiz } from './Quiz.js';
import * as matrices from './matrices.js';

const localStorageVersion = "1";
const exprSuffix = "-expr";
const answerSuffix = "-answer";
export class ExerciseContainer {
    $root = document.createElement("div");
    /** @type {String | null} **/
    localStorage_id = null;
    /** @type {Function | null} **/
    solvedCallback = null;
    /** @type {Function | null} **/
    resetCallback = null;

    constructor(unique_id = null) {
        this.$root.innerHTML = `<h4>Choose an exercise!</h4>`;
        this.localStorage_id = unique_id;
        if(this.localStorage_id && localStorage.getItem(this.localStorage_id) === localStorageVersion) {
            let $tmp = document.createElement("div");
            $tmp.innerHTML = localStorage.getItem(this.localStorage_id + exprSuffix);
            let $expr = $tmp.firstElementChild;
            let answer = JSON.parse(localStorage.getItem(this.localStorage_id + answerSuffix));
            this.updateExercise($expr, answer);
        }
    }

    /**
     * @callback AnswerFromExpr
     * @param $expr {HTMLElement}
     * @result {Matrix | null}
     */
    /**
     * @param $source {HTMLElement}
     * @param answerCalculator {AnswerFromExpr}
     */
    addSelectSource($source, answerCalculator) {
        $source.addEventListener("click", this.handleMissedClick);
        /** @type {HTMLElement[]} */
        let $expr_list = Array.from($source.getElementsByClassName("expr")).filter(element => element instanceof HTMLElement);
        $expr_list.forEach($expr => {
            let loadThisExpr = event => {
                event.stopPropagation();
                if(event instanceof KeyboardEvent && event.key !== "Enter") return;
                let answer = answerCalculator($expr);
                if(answer)
                    this.updateExercise($expr.cloneNode(true), answer);
            };
            $expr.tabIndex = 0;
            $expr.addEventListener("keypress", loadThisExpr);
            $expr.addEventListener("click", loadThisExpr);
        });
    }

    /**
     * @callback ExerciseFromMatrices
     * @param $expr {Matrix[]}
     * @returns {[HTMLElement, Matrix] | null}
     */
    /**
     * @param mat_number {number}
     * @param answerCalculator {ExerciseFromMatrices}
     * @param min {number}
     * @param max {number}
     * @param invertible {boolean}
     * @returns HTMLElement
     */
    addRandomGenerator(mat_number, answerCalculator, min, max, invertible = false) {
        let $rng_fieldset = document.createElement("fieldset");
        $rng_fieldset.classList.add("random_exercise_fieldset");
        $rng_fieldset.insertAdjacentHTML("beforeend", "<legend> Random Exercise Generator </legend>")
        let $rng_form = document.createElement("form");
        $rng_fieldset.appendChild($rng_form);
        for(let i = 0; i < mat_number; i++) {
            $rng_form.insertAdjacentHTML("beforeend",
                `<label>Matrix ${i}: <input value="3 X 3" type="text" pattern="\\s*\\d+\\s*X\\s*\\d+\\s*"></label>`
            );
        }
        $rng_form.classList.add("random_matrix_form");
        $rng_form.insertAdjacentHTML("beforeend", `<input type="submit" value="Generate Matrices">`)
        $rng_form.addEventListener("submit", event => {
            event.preventDefault();
            /** @type {Matrix[]} **/
            let generated = Array.from($rng_form.getElementsByTagName("input")).filter(elem => elem.type === "text").map(input => {
                let sizes = input.value.split("X");
                return matrices.random({rows: parseInt(sizes[0]), cols: parseInt(sizes[1])}, min, max, invertible);
            });
            const limit = 15;
            if(generated.some(matrix => matrix.size.rows > limit || matrix.size.cols > limit)) {
                let $notification = document.createElement("span");
                $notification.classList.add("warning_notification");
                $notification.textContent = `Very big matrices may break page styling.`;
                pushNotification($notification, 2000);
            }
            let exercise = answerCalculator(generated);
            if(exercise)
                this.updateExercise(exercise[0], exercise[1]);
        });
        return $rng_fieldset;
    }

    updateExercise($question, answer) {
        let quiz = new Quiz(answer, $question, "Can you find the answer?", true);
        quiz.addDefaultHandler();
        this.$root.childNodes.forEach(node => node.remove());
        this.$root.appendChild(quiz.$root);
        if(this.$root.isConnected) {
            this.$root.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
            quiz.flashColor('cyan');
        } else {
            let mo = new MutationObserver(() => {
                if(this.$root.isConnected) {
                    // it's null if the element is hidden via any of it's parent (aka we loaded into another tab)
                    if(this.$root.offsetParent !== null) {
                        this.$root.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
                        quiz.flashColor('cyan');
                    }
                    mo.disconnect();
                }
            });
            mo.observe(document.body, {childList: true, subtree: true});
        }
        if(this.localStorage_id) {
            localStorage.setItem(this.localStorage_id, localStorageVersion);
            localStorage.setItem(this.localStorage_id + exprSuffix, $question.outerHTML);
            localStorage.setItem(this.localStorage_id + answerSuffix, JSON.stringify(answer));
        }
        quiz.addAnswerHandler(solved => {
            if(solved && this.solvedCallback) this.solvedCallback();
        });
        if(this.resetCallback) this.resetCallback();
    }

    handleMissedClick() {
        let $message = document.createElement("span");
        $message.textContent = "Hint: click on an exercise to load it";
        $message.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        pushNotification($message, 1000);
    }

    setSolvedCallback(cb) {
        this.solvedCallback = cb;
    }

    setResetCallback(cb) {
        this.resetCallback = cb;
    }

}
