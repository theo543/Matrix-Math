import * as matrices from './matrices.js';
import * as picker from "./exercise_picker.js";

window.matrices = matrices; // for debugging

let $exercise_examples = document.querySelector("#tab3 .col");
picker.attachPicker($exercise_examples);
document.getElementById("interactive_exercise_location").replaceWith(picker.getInteractiveExercise());
