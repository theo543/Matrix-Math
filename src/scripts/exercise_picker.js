import * as matrices from './matrices.js';

let $interactive = document.createElement("div");
$interactive.classList.add("interactive_exercise");

/**
 * @param event {MouseEvent}
 * @param $expr {HTMLElement}
 */
function handleExprChoice(event, $expr) {
    event.stopPropagation();
    $interactive.innerHTML = "";
    let $question = $expr.cloneNode(true);
    $question.insertAdjacentHTML("beforeend", "<span>= ?</span>");
    $interactive.appendChild($question);
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
    $expr_list.forEach($expr => $expr.addEventListener("click", event => handleExprChoice(event, $expr)));
}

/**
 * @returns {HTMLElement}
 */
export function getInteractiveExercise() {
    return $interactive;
}
