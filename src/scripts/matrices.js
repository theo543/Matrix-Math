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
    let col = Array(mat.size.cols);
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
