import * as matrices from './matrices.js';
import { ExerciseContainer } from "./ExerciseContainer.js";
import * as version from './version.js';

/**
 * @param $question_expr {HTMLElement}
 */
function multiplyExerciseAnswer($question_expr) {
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    return matrices.multiply(mat_a, mat_b);
}

let multiplyExerciseContainer = new ExerciseContainer();
multiplyExerciseContainer.addSelectSource(document.querySelector("#tab3 .col"), multiplyExerciseAnswer);
document.getElementById("interactive_exercise_location").replaceWith(multiplyExerciseContainer.$root);

let { current, latest } = await version.fetchVersion();
version.notifyVersion(current, latest);
