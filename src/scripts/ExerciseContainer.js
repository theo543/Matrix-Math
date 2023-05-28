import { pushNotification } from './notifications.js';
import { Quiz } from './Quiz.js';

export class ExerciseContainer {
    /** @type {HTMLElement} */
    $root;

    constructor() {
        this.$root = document.createElement("div");
        this.$root.innerHTML = `<h4>Choose an exercise!</h4>`;
    }

    /**
     * @callback AnswerCalculator
     * @param $expr {HTMLElement}
     * @result {Matrix}
     */
    /**
     * @param $source {HTMLElement}
     * @param answerCalculator {AnswerCalculator}
     */
    addSelectSource($source, answerCalculator) {
        $source.addEventListener("click", this.handleMissedClick);
        /** @type {HTMLElement[]} */
        let $expr_list = Array.from($source.getElementsByClassName("expr")).filter(element => element instanceof HTMLElement);
        $expr_list.forEach($expr => {
            let loadThisExpr = event => {
                event.stopPropagation();
                if(event instanceof KeyboardEvent && event.key !== "Enter") return;
                this.updateExercise($expr.cloneNode(true), answerCalculator($expr));
            };
            $expr.tabIndex = 0;
            $expr.addEventListener("keypress", loadThisExpr);
            $expr.addEventListener("click", loadThisExpr);
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

    handleMissedClick() {
        let $message = document.createElement("span");
        $message.textContent = "Hint: click on an exercise to load it";
        $message.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        pushNotification($message, 1000);
    }

}
