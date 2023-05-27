import * as matrices from './matrices.js';

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
        });
    });
}

/**
 * @param size {MatrixSize}
 * @returns {HTMLFormElement}
 */
function makeMatrixForm(size) {
    let $form = document.createElement("form");
    let $table = document.createElement("table");
    $table.classList.add("matrix");
    $form.appendChild($table);
    for(let row = 0;row<size.rows;row++) {
        let $tr = document.createElement("tr");
        for(let col = 0;col<size.cols;col++) {
            $tr.insertAdjacentHTML('beforeend', `<td><input type="number" required alt="row ${row}, column ${col}"></td>`);
        }
        $table.appendChild($tr);
    }
    $form.insertAdjacentHTML('beforeend', `<input type='submit' value="Check answer!">`)
    return $form;
}

/**
 * @param event {MouseEvent}
 * @param $expr {HTMLElement}
 */
function handleExprChoice(event, $expr) {
    event.stopPropagation();
    clearInteractive();
    $interactive.insertAdjacentHTML("beforeend", `<h4>Can you find the answer?</h4>`);
    let $prompt = $interactive.lastElementChild;
    let $question_expr = $expr.cloneNode(true);
    $interactive.appendChild($question_expr);
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    let result = matrices.multiply(mat_a, mat_b);
    let $form = makeMatrixForm(result.size);
    flashColor('cyan');
    $form.classList.add("interactive_form");
    /** @type {HTMLInputElement} **/
    let $submit = $form.querySelector("input[type='submit']");
    $form.insertAdjacentHTML('beforeend', `<button>Reveal Answer</button>`);
    /** @type {HTMLButtonElement} **/
    let $reveal = $form.lastElementChild;
    $form.addEventListener("submit", event => {
        event.preventDefault();
        let answer = matrices.fromHTML($form.querySelector("table"));
        if(matrices.equal(result, answer)) {
            $submit.disabled = true;
            $reveal.disabled = true;
            $prompt.textContent = "Congrats!";
            flashColor('lime');
        } else {
            $prompt.textContent = "Try again...";
            flashColor('red', true);
        }
    });
    $reveal.addEventListener("click", event => {
        event.preventDefault();
        let row = 0;
        for(let $tr of $form.getElementsByTagName("tr")) {
            let col = 0;
            for(let $input of $tr.getElementsByTagName("input")) {
                $input.value = result.data[row][col].toString();
                col++;
            }
            row++;
        }
    });
    $interactive.appendChild($form);
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
    $expr_list.forEach($expr => $expr.addEventListener("click", event => handleExprChoice(event, $expr)));
}

/**
 * @returns {HTMLElement}
 */
export function getInteractiveExercise() {
    return $interactive;
}
