function getBords(table1, table2) {
    'use strict'
    let table = table1
    let coords = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    let shipsLocation = []

    function createTable(tableName) {
        for (let i = 1; i <= 10; i++) {
            let tr = document.createElement('tr')
            tableName.append(tr)
            for (let j = 1; j <= 10; j++) {
                let div = document.createElement('div')
                let td = document.createElement('td')
                td.append(div)
                tr.append(td)
            }
        }
    }

    createTable(table)
    createTable(table2)

    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function startOfShip() {
        const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
        for (let i = 0; i < ships.length; i++) {
            let position = getRandomNum(0, 2)
            let row = null
            let cell = null
            let size = ships[i]
            if (position) {
                row = getRandomNum(0, 11 - size)
                cell = getRandomNum(0, 10)
            } else {
                row = getRandomNum(0, 10)
                cell = getRandomNum(0, 11 - size)
            }

            let test = checkAvailableCells(row, cell, position, size)
            if (test) {
                buildShip(row, cell, position, size)
            } else {
                --i
            }
        }
    }

    startOfShip()

    function buildShip(row, cell, position, size) {
        if (position) {
            for (let i = 0; i < size + 1; i++) {
                if (i < size) {
                    table.rows[row + i].cells[cell].style.backgroundColor = 'red'
                    table.rows[row + i].cells[cell].textContent = `${row + i}-${cell}`
                    table.rows[row + i].cells[cell].setAttribute('data-ship', position);
                    coords[row + i][cell] = 1
                }
                else {
                    if (coords[row + i]) {
                        coords[row + i][cell] = 2
                    }
                    if (coords[row - 1]) {
                        coords[row - 1][cell] = 2
                        if (cell - 1 >= 0) {
                            coords[row - 1][cell - 1] = 2
                        }
                    }
                }
                if (cell - 1 >= 0 && coords[row + i]) {
                    coords[row + i][cell - 1] = 2
                }
                if (cell + 1 < 10 && coords[row + i]) {
                    coords[row + i][cell + 1] = 2
                    if (coords[row - 1] && cell + 1 < 10) {
                        coords[row - 1][cell + 1] = 2
                    }
                }
            }
        } else {
            for (let i = 0; i < size + 1; i++) {
                if (i < size) {
                    table.rows[row].cells[cell + i].style.backgroundColor = 'red'
                    table.rows[row].cells[cell + i].textContent = `${row}-${cell + i}`
                    table.rows[row].cells[cell + i].setAttribute('data-ship', position);
                    coords[row][cell + i] = 1
                }
                else {
                    if (cell + i < 10) {
                        coords[row][cell + i] = 2
                    }
                    if (coords[row + 1] && cell - 1 >= 0) {
                        coords[row + 1][cell - 1] = 2
                    }
                    if (cell - 1 >= 0) {
                        coords[row][cell - 1] = 2
                        if (coords[row - 1] && cell - 1 >= 0) {
                            coords[row - 1][cell - 1] = 2
                        }
                    }
                }

                if (coords[row + 1] && cell + i < 10) {
                    coords[row + 1][cell + i] = 2
                }
                if (coords[row - 1] && cell + i < 10) {
                    coords[row - 1][cell + i] = 2
                }

            }
        }
    }

    // console.log(coords);
    function checkAvailableCells(row, cell, position, size, id) {
        let memory = []
        if (position) {
            for (let i = cell; i < 10; i++) {
                for (let j = row; j < 10; j++) {
                    if (coords[j][i] < 1) {
                        memory.push(`${j}-${i}`)
                        if (memory.length == size) {
                            shipsLocation.push(memory)
                            return true
                        }
                    }
                    else {
                        return false
                    }
                }
            }
        }
        else {
            for (let i = row; i < 10; i++) {
                for (let j = cell; j < 10; j++) {
                    if (coords[i][j] < 1) {
                        memory.push(`${i}-${j}`)
                        if (memory.length == size) {
                            shipsLocation.push(memory)
                            return true
                        }
                    }
                    else {
                        return false
                    }
                }
            }
        }
    }

    table2.addEventListener('mouseover', (e) => {
        let tr = e.target.closest('tr');
        let td = e.target.closest('td');
        if (tr) {
            let tdIndex = Array.from(tr.children).indexOf(td);
            let trIndex = Array.from(tr.parentNode.children).indexOf(tr);
            // console.log(tdIndex);
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (i == trIndex || j == tdIndex) {
                        // t1.rows[i].cells[j].style.border = '3px solid red';
                        // table2.rows[i].cells[j].style.backgroundColor = 'rgba(143, 17, 17, 0.5)'
                        table2.rows[i].cells[j].classList.add('targets')
                        // if (t1.rows[i - 1]) {
                        //     t1.rows[i - 1].cells[j].style.borderBottom = '3px solid red';
                        // }
                        // if (t1.rows[i].cells[j - 1]) {
                        //     t1.rows[i].cells[j - 1].style.borderRight = '3px solid red';
                        // }
                    }

                }
            }
            td.classList.add('target')
        }
    });

    table2.addEventListener('mouseout', () => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                // t1.rows[i].cells[j].style.border = '';
                // table2.rows[i].cells[j].style.backgroundColor = ''
                table2.rows[i].cells[j].classList.remove('targets')
                table2.rows[i].cells[j].classList.remove('target')
            }
        }
    });




    return {
        coords,
        shipsLocation
    }
}

export default getBords