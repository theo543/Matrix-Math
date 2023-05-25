function columns(mat) {
    let cols = Array(mat.size.cols);
    for (let col = 0; col < mat.size.cols; col++) {
        mat.data.forEach((row, row_index) => cols[row_index] = row[col]);
    }
    return cols;
}
export function dot_product(a, b) {
    if (a.length != b.length)
        throw ("Array sizes don't match");
    let result = 0;
    a.forEach((number, index) => { result += number * b[index]; });
    return result;
}
export function multiply(a, b) {
    if (a.size.cols != b.size.rows)
        throw ("Incompatible matrices");
    let result = { size: { rows: a.size.rows, cols: b.size.cols }, data: [] };
    a.data.forEach(row => {
        let resultRow = Array(b.size.cols);
        columns(b).forEach((column, col_index) => {
            resultRow[col_index] = dot_product(row, column);
        });
        result.data.push(resultRow);
    });
    return result;
}
export function fromHTML(table) {
    let trs = Array.from(table.getElementsByClassName("tr"));
    let rows = trs.length;
    let data = [];
    for (let tr of trs) {
        let tds = Array.from(tr.getElementsByClassName("td"));
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
        if (row.length != cols)
            throw ("Mismatched lengths");
    });
    return { size: { rows: rows, cols: cols }, data: data };
}
