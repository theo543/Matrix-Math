/**
 * @typedef {{cols: number, rows: number}} MatrixSize
 * @typedef {{size: MatrixSize, data: number[][]}} Matrix
 */

/**
 * @param mat {Matrix}
 * @returns {number[]}
 */
function columns(mat) {
    let cols = Array(mat.size.cols);
    for (let col = 0; col < mat.size.cols; col++) {
        mat.data.forEach((row, row_index) => cols[row_index] = row[col]);
    }
    return cols;
}

/**
 * @param a {Matrix}
 * @param b {Matrix}
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
    let result = Array(a.size.rows).map(() => (new Array(b.size.cols)).fill(0));
    for(let row = 0; row < a.size.rows; row++) {
        for(let col = 0; col < b.size.cols; col++) {
            result[row][col] = dot_product(a.data[row], columns(b)[col]);
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
    /** @type {number[][]} **/
    let data = [];
    for (let tr of trs) {
        let tds = Array.from(tr.getElementsByTagName("td"));
        /** @type {number[]} **/
        let row = [];
        tds.forEach((elem, index) => {
            if (elem.textContent === null || !(elem instanceof HTMLTableCellElement))
                throw ("Conversion error");
            row[index] = parseInt(elem.textContent);
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
    let elem = document.createElement("table");
    elem.classList.add("matrix");
    for (let row = 0; row < mat.size.rows; row++) {
        let row = document.createElement("tr");
        for (let col = 0; col < mat.size.cols; col++) {
            let cell = document.createElement("td");
            cell.textContent = mat.data[row][col].toString();
            row.appendChild(cell);
        }
        elem.appendChild(row);
    }
    return elem;
}
