import getBords from "./board.js";

let p1 = getBords(document.getElementById('table1-p1'), document.getElementById('table2-p1'))
// let p2 = getBords(document.getElementById('table1-p2'), document.getElementById('table2-p2'))
let t = document.getElementById('table2-p1')
let t1 = document.getElementById('table1-p1')
let coords = p1.coords
let shipsLocation = p1.shipsLocation

console.log(p1);

document.getElementById('table2-p1').addEventListener('click', gameHandler)

function shotSound() {
    let shot = document.getElementById('shot')
    if (shot.paused) {
        shot.play()
    } else {
        shot.pause()
        shot.currentTime = 0
        shot.play()
    }
}
function shipThink() {
    let shipThink = document.getElementById('shipThink')
    if (shipThink.paused) {
        document.getElementById('shot').pause()
        shipThink.play()
    } else {
        document.getElementById('shot').pause()
        shipThink.pause()
        shipThink.currentTime = 0
        shipThink.play()
    }
}


function gameHandler(e) {
    let ship = e.target.closest('td')
    let count = 0
    if (!ship || ship.classList.contains('kill') || ship.classList.contains('empty')) {
        return
    }
    let row = +ship.dataset.ship[0]
    let cell = +ship.dataset.ship[2]
    if (coords[row][cell] == 1) {
        shotSound()
        coords[row][cell] = 'x'
        ship.className = 'kill'
    } else {
        ship.className = 'empty'
        ship.style.backgroundColor = 'lightblue'
    }

    for (let i = 0; i < shipsLocation.length; i++) {
        let ships = Object.values(shipsLocation[i])
        let position = ships[0]
        let ship = ships[1]
        let shipLength = ship.length
        for (let j = 0; j < ship.length; j++) {
            let row = +ship[j][0]
            let cell = +ship[j][2]
            if (coords[row][cell] == 'x') {
                ++count
            }
        }
        if (count == shipLength) {
            for (let z = 0; z < ship.length; z++) {
                let row = +ship[z][0]
                let cell = +ship[z][2]
                let lastrow = +ship[ship.length - 1][0] + 1
                let firstrow = +ship[0][0] - 1
                let lastcell = +ship[ship.length - 1][2] + 1
                let firstcell = +ship[0][2] - 1
                t.rows[row].cells[cell].style.backgroundColor = 'rgb(190, 6, 6,0.3)'
                if (position) {
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
            shipThink()
        }
        count = 0
    }

    if (shipsLocation.length == 0) {
        setTimeout(() => {
            alert('end')
        })
    }
}