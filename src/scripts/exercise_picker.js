import * as matrices from './matrices.js';

let $interactive = document.createElement("div");
$interactive.classList.add("interactive_exercise");
$interactive.innerHTML = "<p>No exercise selected.</p>"

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
    $interactive.innerHTML = "";
    let $question_expr = $expr.cloneNode(true);
    $interactive.appendChild($question_expr);
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    let result = matrices.multiply(mat_a, mat_b);
    let $form = makeMatrixForm(result.size);
    $form.classList.add("interactive_form");
    $form.addEventListener("submit", event => {
        event.preventDefault();
        let answer = matrices.fromHTML($form.querySelector("table"));
        if(matrices.equal(result, answer))
            alert("Congrats!");
        else {
            alert("Try again... check console if you want the answer")
            console.log("Your answer: ", answer);
            console.log("Calculated answer: ", result);
        }
    });
    $interactive.appendChild($form);
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
