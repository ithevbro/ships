import getBords from "./board.js";

let p1 = getBords(document.getElementById('table1-p1'), document.getElementById('table2-p1'))
// let p2 = getBords(document.getElementById('table1-p2'), document.getElementById('table2-p2'))
let t = document.getElementById('table2-p1')
let t1 = document.getElementById('table1-p1')
let coords = p1.coords
let shipsLocation = p1.shipsLocation

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        t.rows[i].cells[j].textContent = t1.rows[i].cells[j].textContent
        if (t1.rows[i].cells[j].dataset.ship) {
            t.rows[i].cells[j].setAttribute('data-ship', t1.rows[i].cells[j].getAttribute('data-ship'));
        }
    }
}

document.getElementById('table2-p1').addEventListener('click', gameHandler)

function gameHandler(e) {
    let ship = e.target.closest('td')
    let count = 0
    if (!ship || ship.textContent == 'x') {
        return
    }
    if (ship.dataset.ship) {
        let position = ship.dataset.ship
        ship.style.backgroundColor = 'green'
        let shipHit = ship.textContent
        coords[shipHit[0]][shipHit[2]] = 'x'
        ship.textContent = 'x'
        for (let i = 0; i < shipsLocation.length; i++) {
            for (let j = 0; j < shipsLocation[i].length; j++) {
                let row = +shipsLocation[i][j][0]
                let cell = +shipsLocation[i][j][2]
                let ship = shipsLocation[i].length
                if (coords[row][cell] == 'x') {
                    ++count
                }
            }
            if (count == shipsLocation[i].length) {
                for (let z = 0; z < shipsLocation[i].length; z++) {
                    let row = +shipsLocation[i][z][0]
                    let cell = +shipsLocation[i][z][2]
                    let lastrow = +shipsLocation[i][shipsLocation[i].length - 1][0] + 1
                    let firstrow = shipsLocation[i][0][0] - 1
                    let lastcell = +shipsLocation[i][shipsLocation[i].length - 1][2] + 1
                    let firstcell = shipsLocation[i][0][2] - 1
                    if (position == '1') {
                        if (cell + 1 < 10) {
                            t.rows[row].cells[cell + 1].style.backgroundColor = 'lightblue'
                        }
                        if (cell - 1 >= 0) {
                            t.rows[row].cells[cell - 1].style.backgroundColor = 'lightblue'
                        }
                        if (lastrow < 10) {
                            t.rows[lastrow].cells[cell].style.backgroundColor = 'lightblue'
                        }
                        if (firstrow >= 0) {
                            t.rows[firstrow].cells[cell].style.backgroundColor = 'lightblue'
                        }
                        if (cell - 1 >= 0 && lastrow < 10) {
                            t.rows[lastrow].cells[cell - 1].style.backgroundColor = 'lightblue'
                        }
                        if (cell + 1 < 10 && lastrow < 10) {
                            t.rows[lastrow].cells[cell + 1].style.backgroundColor = 'lightblue'
                        }
                        if (cell - 1 >= 0 && firstrow >= 0) {
                            t.rows[firstrow].cells[cell - 1].style.backgroundColor = 'lightblue'
                        }
                        if (cell + 1 < 10 && firstrow >= 0) {
                            t.rows[firstrow].cells[cell + 1].style.backgroundColor = 'lightblue'
                        }
                    } else {
                        if (row + 1 < 10) {
                            t.rows[row + 1].cells[cell].style.backgroundColor = 'lightblue'
                        }
                        if (row - 1 >= 0) {
                            t.rows[row - 1].cells[cell].style.backgroundColor = 'lightblue'
                        }
                        if (lastcell < 10) {
                            t.rows[row].cells[lastcell].style.backgroundColor = 'lightblue'
                        }
                        if (firstcell >= 0) {
                            t.rows[row].cells[firstcell].style.backgroundColor = 'lightblue'
                        }
                        if (row - 1 >= 0 && lastcell < 10) {
                            t.rows[row - 1].cells[lastcell].style.backgroundColor = 'lightblue'
                        }
                        if (row + 1 < 10 && lastcell < 10) {
                            t.rows[row + 1].cells[lastcell].style.backgroundColor = 'lightblue'
                        }
                        if (row - 1 >= 0 && firstcell >= 0) {
                            t.rows[row - 1].cells[firstcell].style.backgroundColor = 'lightblue'
                        }
                        if (row + 1 < 10 && firstcell >= 0) {
                            t.rows[row + 1].cells[firstcell].style.backgroundColor = 'lightblue'
                        }
                    }
                }
                shipsLocation.splice(i, 1)
            }
            count = 0
        }
    }
    else {
        ship.style.backgroundColor = 'lightblue'
    }
    if (shipsLocation.length == 0) {
        setTimeout(() => {
            alert('end')
        })
    }
}