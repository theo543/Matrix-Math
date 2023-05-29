import * as matrices from './matrices.js';
import { ExerciseContainer } from "./ExerciseContainer.js";
import * as version from './version.js';
import {pushNotification} from "./notifications.js";

/**
 * @param $question_expr {HTMLElement}
 * @returns {Matrix}
 */
function multiplyExerciseAnswer($question_expr) {
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    return matrices.multiply(mat_a, mat_b);
}

/**
 * @param generated {Matrix[]}
 * @returns {[HTMLElement, Matrix] | null}
 */
function multiplyExerciseFromRNG(generated) {
    let [mat_a, mat_b] = generated;
    let $expr = document.createElement("div");
    $expr.classList.add("expr");
    $expr.appendChild(matrices.toHTML(mat_a));
    $expr.insertAdjacentHTML("beforeend", `<span>*</span>`);
    $expr.appendChild(matrices.toHTML(mat_b));
    if(mat_a.size.cols !== mat_b.size.rows) {
        let $notification = document.createElement("span");
        $notification.classList.add("warning_notification");
        $notification.textContent = `Matrices cannot be multiplied. ${generated[0].size.cols} columns do not match ${generated[1].size.rows} rows.`;
        pushNotification($notification, 3000);
        return null;
    }
    return [$expr, matrices.multiply(mat_a, mat_b)];
}

let multiplyExerciseContainer = new ExerciseContainer("exercise_container_multiply");
multiplyExerciseContainer.addSelectSource(document.querySelector("#tab3 .col"), multiplyExerciseAnswer);
document.getElementById("interactive_exercise_location").replaceWith(multiplyExerciseContainer.$root);
let $randomGen = multiplyExerciseContainer.addRandomGenerator(2, multiplyExerciseFromRNG, -3, 3)
multiplyExerciseContainer.$root.insertAdjacentElement("beforebegin", $randomGen);

let { current, latest } = await version.fetchVersion();
version.notifyVersion(current, latest);

let inversionExerciseContainer = new ExerciseContainer();
/** @type {Matrix} **/
let mat_to_invert, transposed_mat, adj_mat;
let det = 0;
let $random_det = inversionExerciseContainer.addRandomGenerator(1, generated => {
    mat_to_invert = generated[0];
    transposed_mat = matrices.transpose(mat_to_invert);
    adj_mat = matrices.cofactors(transposed_mat);
    det = matrices.determinant(generated[0]);
    let $question = document.createElement("div");
    $question.classList.add("expr");
    $question.innerHTML = `<span>Step 1: det(</span><div></div><span>)</span>`;
    $question.getElementsByTagName("div")[0].replaceWith(matrices.toHTML(generated[0]));
    return [$question, {size: {rows: 1, cols: 1}, data: [[det]]}];
}, -5, 5, true);
document.getElementById("inversion_exercise_location").replaceWith(inversionExerciseContainer.$root);
inversionExerciseContainer.$root.insertAdjacentElement("beforebegin", $random_det);

/** @type {HTMLElement[]} **/
let chainedElements = [];

async function startExerciseChain() {
    await inversionExerciseContainer.promisify();
    let transposeExerciseContainer = new ExerciseContainer();
    chainedElements.push(transposeExerciseContainer.$root);
    let $transpose_question = document.createElement("div");
    $transpose_question.classList.add("expr");
    $transpose_question.innerHTML = `<span>Step 2. (</span><div></div><span>)<sup>T</sup></span>`;
    $transpose_question.getElementsByTagName("div")[0].replaceWith(matrices.toHTML(mat_to_invert));
    transposeExerciseContainer.updateExercise($transpose_question, transposed_mat);
    inversionExerciseContainer.$root.insertAdjacentElement("afterend", transposeExerciseContainer.$root);
    await transposeExerciseContainer.promisify();
    let adjugateExerciseContainer = new ExerciseContainer();
    let $adjugate_question = document.createElement("div");
    $adjugate_question.classList.add("expr");
    $adjugate_question.innerHTML = `<span>Step 3. Cof(</span><div></div><span>)</span>`;
    $adjugate_question.getElementsByTagName("div")[0].replaceWith(matrices.toHTML(transposed_mat));
    $adjugate_question.getElementsByTagName("table")[0].classList.add("checkerboard");
    adjugateExerciseContainer.updateExercise($adjugate_question, adj_mat);
    transposeExerciseContainer.$root.insertAdjacentElement("afterend", adjugateExerciseContainer.$root);
    await adjugateExerciseContainer.promisify();
    chainedElements.push(adjugateExerciseContainer.$root);
    let $response = document.createElement("div");
    $response.classList.add("expr");
    $response.innerHTML = `(<div></div>)<sup>-1</sup> = 1/${det} * <div></div>`;
    let [$orig_mat, $result_mat] = Array.from($response.getElementsByTagName("div"));
    $orig_mat.replaceWith(matrices.toHTML(mat_to_invert));
    $result_mat.replaceWith(matrices.toHTML(adj_mat));
    adjugateExerciseContainer.$root.insertAdjacentElement("afterend", $response);
    let $congrats = document.createElement("p");
    $congrats.textContent = "You did it! Thanks for using my website! You don't need to do the division.";
    $response.insertAdjacentElement("afterend", $congrats);
    chainedElements.push($response);
    chainedElements.push($congrats);
    document.body.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

inversionExerciseContainer.setResetCallback(() => {
    chainedElements.forEach(e => e.remove());
    chainedElements = [];
    inversionExerciseContainer.setSolvedCallback(null);
    startExerciseChain().then(_ => console.log("Success!"));
});
