import * as matrices from './matrices.js';
import { ExercisePicker } from "./ExercisePicker.js";
import * as version from './version.js';

/**
 * @param $question_expr {HTMLElement}
 */
function multiplyExerciseAnswer($question_expr) {
    let [$mat_a, $mat_b] = $question_expr.getElementsByClassName("matrix");
    let [ mat_a, mat_b ] = [matrices.fromHTML($mat_a), matrices.fromHTML($mat_b)];
    return matrices.multiply(mat_a, mat_b);
}

let $multiply_exercises = document.querySelector("#tab3 .col");
document.getElementById("interactive_exercise_location").replaceWith(new ExercisePicker($multiply_exercises, multiplyExerciseAnswer).$root);

let { current, latest } = await version.fetchVersion();
version.notifyVersion(current, latest);
