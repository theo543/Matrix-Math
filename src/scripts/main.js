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

let multiplyExerciseContainer = new ExerciseContainer();
multiplyExerciseContainer.addSelectSource(document.querySelector("#tab3 .col"), multiplyExerciseAnswer);
document.getElementById("interactive_exercise_location").replaceWith(multiplyExerciseContainer.$root);
let $randomGen = multiplyExerciseContainer.addRandomGenerator(2, multiplyExerciseFromRNG, -3, 3)
multiplyExerciseContainer.$root.insertAdjacentElement("beforebegin", $randomGen);

let { current, latest } = await version.fetchVersion();
version.notifyVersion(current, latest);
