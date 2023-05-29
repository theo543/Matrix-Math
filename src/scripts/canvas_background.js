/** @type {HTMLCanvasElement} **/
let canvas = document.getElementsByClassName("canvas_background")[0];

function draw() {
    let new_canvas = document.createElement("canvas");
    new_canvas.classList.add("canvas_background");
    requestAnimationFrame(() => new_canvas.classList.add("canvas_background_fadein"));
    canvas.classList.add("canvas_vanishing");
    canvas.insertAdjacentElement("afterend", new_canvas);
    (function(element) {
        setTimeout(() => element.remove(), 2000);
    })(canvas);
    canvas = new_canvas;
    let ctx = canvas.getContext("2d");
    ctx.font = "10px monospace";
    const width = canvas.getBoundingClientRect().width, height = canvas.getBoundingClientRect().height;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    const area = width * height;
    const numbers = (area / 1000) * (1 + Math.random());
    for(let i = 0;i<numbers;i++) {
        const x = random_range(0, width), y = random_range(0, height);
        ctx.fillText(Math.round(random_range(0, 9)).toString(), x, y);
    }
}

draw();
setInterval(draw, 5000);

/**
 * @param min {number}
 * @param max {number}
 */
function random_range(min, max) {
    const len = (max - min);
    return Math.random() * len + min;
}
