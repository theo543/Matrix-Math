import * as matrices from './matrices.js';
import { Quiz } from './quiz.js';

let $interactive = document.createElement("div");
$interactive.classList.add("interactive_exercise");
$interactive.innerHTML = "<div class='interactive_background'></div><p>No exercise selected.</p>"
/** @type {HTMLDivElement} **/
let $background = $interactive.firstElementChild;

function clearInteractive() {
    $interactive.innerHTML = "";
    $interactive.appendChild($background);
}

const animation_class = "interactive_flash";
const shake_class = "interactive_shake";
/**
 * @param color {string}
 * @param shake {boolean}
 */
function flashColor(color, shake = false) {
    requestAnimationFrame(() => {
        $background.classList.remove(animation_class);
        if(shake) $interactive.classList.remove(shake_class);
        $background.style.backgroundColor = color;
        requestAnimationFrame(() => {
            $background.classList.add(animation_class);
            if(shake) $interactive.classList.add(shake_class);
            setTimeout(() => {
                /*
                 these cause the animation to replay when returning to the tab if left on the element (apparently this is intended?)
                 */
                $background.classList.remove(animation_class);
                $interactive.classList.remove(shake_class);
            }, 600);
        });
    });
}

/**
 * @param event {Event}
 * @param $expr {HTMLElement}
 */
function handleExprChoice(event, $expr) {
    event.stopPropagation();
    clearInteractive();
    let $question_expr = $expr.cloneNode(true);
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    let result = matrices.multiply(mat_a, mat_b);
    let quiz = new Quiz(result, $question_expr, "Can you find the answer?", true);
    flashColor('cyan');
    quiz.addAnswerHandler(success => {
        if(success) {
            quiz.setPrompt("Congrats!");
            quiz.setEnabled(false);
            flashColor('lime');
        } else {
            quiz.setPrompt("Try again...");
            flashColor('red', true);
        }
    });
    $interactive.appendChild(quiz.$root);
    $interactive.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
}

/**
 * @param event {MouseEvent}
 * @param $col {HTMLElement}
 */
function handleMissedClick(event, $col) {
    alert("Missed click!"); /// TODO make this a notification on-screen
}

/**
 * @param $col {HTMLElement}
 */
export function attachPicker($col) {
    $col.addEventListener("click", event => handleMissedClick(event, $col));
    /** @type {HTMLElement[]} */
    let $expr_list = Array.from($col.getElementsByClassName("expr")).filter(element => element instanceof HTMLElement);
    $expr_list.forEach($expr => {
        $expr.tabIndex = 0;
        $expr.addEventListener("keypress", event => {
            if(event.key === "Enter") {
                handleExprChoice(event, $expr);
            }
        });
        $expr.addEventListener("click", event => handleExprChoice(event, $expr))
    });
}

/**
 * @returns {HTMLElement}
 */
export function getInteractiveExercise() {
    return $interactive;
}
