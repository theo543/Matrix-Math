import { pushNotification } from './notifications.js';
import { Quiz } from './Quiz.js';

export class ExercisePicker {
    /** @type {HTMLElement} */
    $root;

    /**
     * @callback AnswerCalculator
     * @param $expr {HTMLElement}
     * @result {Matrix}
     */
    /** @type {AnswerCalculator} **/
    answerCalculator;

    /**
     * @param $source {HTMLElement}
     * @param answerCalculator {AnswerCalculator}
     */
    constructor($source, answerCalculator) {
        this.$root = document.createElement("div");
        this.answerCalculator = answerCalculator;
        this.$root.innerHTML = `<h4>Choose an exercise!</h4>`;
        $source.addEventListener("click", this.handleMissedClick);
        /** @type {HTMLElement[]} */
        let $expr_list = Array.from($source.getElementsByClassName("expr")).filter(element => element instanceof HTMLElement);
        $expr_list.forEach($expr => {
            $expr.tabIndex = 0;
            $expr.addEventListener("keypress", event => {
                if(event.key === "Enter") {
                    this.handleExprChoice(event, $expr);
                }
            });
            $expr.addEventListener("click", event => this.handleExprChoice(event, $expr))
        });
    }

    updateExercise($question, answer) {
        let quiz = new Quiz(answer, $question, "Can you find the answer?", true);
        quiz.flashColor('cyan');
        quiz.addDefaultHandler();
        this.$root.childNodes.forEach(node => node.remove());
        this.$root.appendChild(quiz.$root);
        this.$root.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

    }

    /**
     * @param event {Event}
     * @param $expr {HTMLElement}
     */
    handleExprChoice(event, $expr) {
        event.stopPropagation();
        let $question_expr = $expr.cloneNode(true);
        this.updateExercise($question_expr, this.answerCalculator($question_expr));
    }

    handleMissedClick() {
        let $message = document.createElement("span");
        $message.textContent = "Hint: click on an exercise to load it";
        $message.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        pushNotification($message, 1000);
    }

}
