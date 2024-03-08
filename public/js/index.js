import getBords from "./board.js";
import { createTable } from "./help.js";
const socket = io();
createTable(document.getElementById('table2'))
let player1Data = getBords(document.getElementById('table1'))
let coords = player1Data.coords
let shipsLocation = player1Data.shipsLocation
const table2 = document.getElementById('table2')
const shuffle = document.getElementById('shuffle')
const play = document.getElementById('play')
const userscount = document.getElementById('userscount').children[0]
const table2stop = document.getElementById('table2stop')
let queue;

table2.addEventListener('click', gameHandler)

leave.addEventListener('click', () => {
    window.location.href = '/';
});

shuffle.addEventListener('click', () => {
    player1Data = getBords(document.getElementById('table1'))
    createTable(document.getElementById('table2'))
    coords = player1Data.coords
    shipsLocation = player1Data.shipsLocation
})

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
    if (!ship || ship.classList.contains('kill') || ship.classList.contains('empty') || queue % 2 !== 0) {
        return
    }

    let row = +ship.dataset.ship[0]
    let cell = +ship.dataset.ship[2]
    if (coords[row][cell] == 1) {
        socket.emit('move', 'hitt');
        shotSound()
        coords[row][cell] = 'x'
        ship.className = 'kill'

    } else {
        socket.emit('move', 'miss');
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
                table2.rows[row].cells[cell].style.backgroundColor = 'rgb(190, 6, 6,0.3)'
                if (position) {
                    if (cell + 1 < 10) {
                        table2.rows[row].cells[cell + 1].style.backgroundColor = 'lightblue'
                    }
                    if (cell - 1 >= 0) {
                        table2.rows[row].cells[cell - 1].style.backgroundColor = 'lightblue'
                    }
                    if (lastrow < 10) {
                        table2.rows[lastrow].cells[cell].style.backgroundColor = 'lightblue'
                    }
                    if (firstrow >= 0) {
                        table2.rows[firstrow].cells[cell].style.backgroundColor = 'lightblue'
                    }
                    if (cell - 1 >= 0 && lastrow < 10) {
                        table2.rows[lastrow].cells[cell - 1].style.backgroundColor = 'lightblue'
                    }
                    if (cell + 1 < 10 && lastrow < 10) {
                        table2.rows[lastrow].cells[cell + 1].style.backgroundColor = 'lightblue'
                    }
                    if (cell - 1 >= 0 && firstrow >= 0) {
                        table2.rows[firstrow].cells[cell - 1].style.backgroundColor = 'lightblue'
                    }
                    if (cell + 1 < 10 && firstrow >= 0) {
                        table2.rows[firstrow].cells[cell + 1].style.backgroundColor = 'lightblue'
                    }
                } else {
                    if (row + 1 < 10) {
                        table2.rows[row + 1].cells[cell].style.backgroundColor = 'lightblue'
                    }
                    if (row - 1 >= 0) {
                        table2.rows[row - 1].cells[cell].style.backgroundColor = 'lightblue'
                    }
                    if (lastcell < 10) {
                        table2.rows[row].cells[lastcell].style.backgroundColor = 'lightblue'
                    }
                    if (firstcell >= 0) {
                        table2.rows[row].cells[firstcell].style.backgroundColor = 'lightblue'
                    }
                    if (row - 1 >= 0 && lastcell < 10) {
                        table2.rows[row - 1].cells[lastcell].style.backgroundColor = 'lightblue'
                    }
                    if (row + 1 < 10 && lastcell < 10) {
                        table2.rows[row + 1].cells[lastcell].style.backgroundColor = 'lightblue'
                    }
                    if (row - 1 >= 0 && firstcell >= 0) {
                        table2.rows[row - 1].cells[firstcell].style.backgroundColor = 'lightblue'
                    }
                    if (row + 1 < 10 && firstcell >= 0) {
                        table2.rows[row + 1].cells[firstcell].style.backgroundColor = 'lightblue'
                    }
                }
            }

            shipsLocation.splice(i, 1)
            shipThink()
        }
        count = 0
    }

    if (shipsLocation.length == 0) {
        socket.emit('end', 'gg')
    }
}

socket.on("users", (users) => {
    userscount.textContent = users
});


socket.on('move', (msg) => {
    queue = msg
    if (queue % 2 !== 0) {
        table2stop.style.width = '100%'
    } else {
        table2stop.style.width = '0%'
    }
});

play.addEventListener('click', (d) => {
    socket.emit('ready', player1Data);
});

socket.on('ready', (d) => {
    coords = d.coords
    shipsLocation = d.shipsLocation
    play.disabled = true
    shuffle.disabled = true
    play.style.opacity = '0.5'
    shuffle.style.opacity = '0.5'
})

socket.on('end', (endData) => {
    if (endData) {
        document.getElementById('table1stop').style.width = '100%'
        table2stop.style.width = '100%'
    }
})