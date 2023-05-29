/**
 * @typedef {{cols: number, rows: number}} MatrixSize
 * @typedef {number[][]} MatrixData
 * @typedef {{size: MatrixSize, data: MatrixData}} Matrix
 */

/**
 * @param mat {Matrix}
 * @param col_index {number}
 * @returns {number[]}
 */
function getColumn(mat, col_index) {
    /** @type {number[]} **/
    let col = Array(mat.size.rows);
    mat.data.forEach((row, row_index) => col[row_index] = row[col_index]);
    return col;
}

/**
 * @param a {number[]}
 * @param b {number[]}
 * @returns {number}
 */
export function dot_product(a, b) {
    if (a.length !== b.length)
        throw ("Array sizes don't match");
    let result = 0;
    a.forEach((number, index) => { result += number * b[index]; });
    return result;
}

/**
 * @param a {Matrix}
 * @param b {Matrix}
 * @returns {Matrix}
 */
export function multiply(a, b) {
    if (a.size.cols !== b.size.rows)
        throw ("Incompatible matrices");
    /** @type {MatrixData} **/
    let result = Array.from({length: a.size.rows}, () => Array(b.size.cols));
    for(let row = 0; row < a.size.rows; row++) {
        for(let col = 0; col < b.size.cols; col++) {
            result[row][col] = dot_product(a.data[row], getColumn(b, col));
        }
    }
    return { size: { rows: a.size.rows, cols: b.size.cols }, data: result };
}

/**
 * @param table {HTMLTableElement}
 * @returns {Matrix}
 */
export function fromHTML(table) {
    if(!table.classList.contains("matrix"))
        throw ("Missing matrix class");
    let trs = Array.from(table.getElementsByTagName("tr"));
    let rows = trs.length;
    /** @type {MatrixData} **/
    let data = [];
    for (let tr of trs) {
        let tds = Array.from(tr.getElementsByTagName("td"));
        /** @type {number[]} **/
        let row = [];
        tds.forEach((elem, index) => {
            if (!(elem instanceof HTMLTableCellElement))
                throw "Conversion error";
            if(elem.textContent === null || elem.textContent === "") {
                /** @type {HTMLInputElement} **/
                let $input = elem.querySelector("input[type='number']");
                if($input)
                    row[index] = parseInt($input.value);
                else throw "Conversion error";
            } else row[index] = parseInt(elem.textContent);
        });
        data.push(row);
    }
    let cols = data[0].length;
    data.forEach(row => {
        if (row.length !== cols)
            throw ("Mismatched lengths");
    });
    return { size: { rows: rows, cols: cols }, data: data };
}

/**
 * @param mat {Matrix}
 * @returns {HTMLTableElement}
 */
export function toHTML(mat) {
    let $table = document.createElement("table");
    $table.classList.add("matrix");
    for (let row = 0; row < mat.size.rows; row++) {
        let $tr = document.createElement("tr");
        for (let col = 0; col < mat.size.cols; col++) {
            let $td = document.createElement("td");
            $td.textContent = mat.data[row][col].toString();
            $tr.appendChild($td);
        }
        $table.appendChild($tr);
    }
    return $table;
}

/**
 * @param mat_a {Matrix}
 * @param mat_b {Matrix}
 * @returns {boolean}
 */
export function equal(mat_a, mat_b) {
    if(mat_a.size.rows !== mat_b.size.rows || mat_b.size.cols !== mat_b.size.cols)
        return false;
    for(let row = 0;row<mat_a.size.rows;row++) {
        for(let col = 0;col<mat_a.size.cols;col++) {
            if(mat_a.data[row][col] !== mat_b.data[row][col])
                return false;
        }
    }
    return true;
}

/**
 * @param size {MatrixSize}
 * @returns {HTMLFormElement}
 */
export function makeMatrixForm(size) {
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
    return $form;
}

/**
 * @param size {MatrixSize}
 * @param min {number}
 * @param max {number}
 * @param invertible {boolean}
 * @returns {Matrix}
 */
export function random(size, min, max, invertible = false) {
    while(1) {
        /** @type {MatrixData} **/
        let matrix_data = Array.from({length: size.rows},
            () => Array.from({length: size.cols}, () => Math.round(Math.random() * (max - min) + min))
        );
        let matrix = {size: size, data: matrix_data};
        if(invertible && (determinant(matrix) === 0)) {
            continue;
        }
        return matrix;
    }
}

/**
 * @param matrix {Matrix}
 * @param row {number}
 * @param column {number}
 * @returns {Matrix}
 */
export function crossOut(matrix, row, column) {
    /** @type {MatrixData} **/
    let result = Array.from({length: matrix.size.rows - 1}, () => Array(matrix.size.cols - 1));
    let output_row_i = 0;
    matrix.data.forEach((original_row, row_index) => {
        if(row_index === row) return;
        let output_col_i = 0;
        original_row.forEach((cell, col_index) => {
            if(col_index === column) return;
            result[output_row_i][output_col_i] = cell;
            output_col_i++;
        });
        output_row_i++;
    });
    return {size: {rows: result.length, cols: result[0].length}, data: result};
}

/**
 * @param matrix {Matrix}
 */
export function determinant(matrix) {
    if(matrix.size.rows !== matrix.size.cols) throw "Matrix must be square";
    let size = matrix.size.rows;
    if(size === 2) {
        return matrix.data[0][0] * matrix.data[1][1] - matrix.data[0][1] * matrix.data[1][0];
    } else if(size === 1) {
        return matrix.data[0][0];
    } else {
        let sum = 0;
        let sign = 1;
        for(let row_index = 0;row_index < size;row_index++) {
            let minor_matrix = crossOut(matrix, row_index, 0);
            sum += sign * matrix.data[row_index][0] * determinant(minor_matrix);
        }
        sign *= -1;
        return sum;
    }
}
