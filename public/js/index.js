import getBords from "./board.js";
import { createTable } from "./help.js";
const socket = io();
createTable(document.getElementById('table2'))
let player1Data = getBords(document.getElementById('table1'))
let coords = player1Data.coords
let shipsLocation = player1Data.shipsLocation
const table1 = document.getElementById('table1')
const table2 = document.getElementById('table2')
const shuffle = document.getElementById('shuffle')
const play = document.getElementById('play')
const userscount = document.getElementById('userscount').children[0]
const table2stop = document.getElementById('table2stop')
const table1stop = document.getElementById('table1stop')
const leave = document.getElementById('leave')
const fight = document.getElementById('fight')
let gg = false
let queue;

table2.addEventListener('click', gameHandler)

leave.addEventListener('click', () => {
    socket.emit('end', 'left')
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
        shot.currentTime = 0
        shot.play()
    } else {
        shot.currentTime = 0
        shot.play()
    }
}

function shipThink() {
    if (document.getElementById('shot').play()) {
        document.getElementById('shot').play().then(_ => {
            document.getElementById('shot').pause()
            document.getElementById('shot').currentTime = 0
            let shipThink = document.getElementById('shipThink')
            if (shipThink.paused) {
                shipThink.play()
            } else {
                shipThink.currentTime = 0
                shipThink.play()
            }
        })
    }

}

function gameHandler(e) {
    let ship = e.target.closest('td')
    let count = 0
    if (!ship || ship.classList.contains('kill') || ship.classList.contains('empty') || queue % 2 !== 0 || gg || ship.classList.contains('emptyhit')) {
        return
    }
    table1stop.style.width = '100%'
    let row = +ship.dataset.ship[0]
    let cell = +ship.dataset.ship[2]
    shotSound()
    if (coords[row][cell] == 1) {
        socket.emit('move', 'hitt');
        socket.emit('shot', ship.dataset.ship);
        coords[row][cell] = 'x'
        ship.className = 'kill'


    } else {
        socket.emit('move', 'miss');
        socket.emit('shot', ship.dataset.ship);
        ship.className = 'emptyhit'
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
                    if (cell + 1 < 10 && !table2.rows[row].cells[cell + 1].classList.contains('emptyhit')) {
                        table2.rows[row].cells[cell + 1].className = 'empty'
                    }
                    if (cell - 1 >= 0 && !table2.rows[row].cells[cell - 1].classList.contains('emptyhit')) {
                        table2.rows[row].cells[cell - 1].className = 'empty'
                    }
                    if (lastrow < 10 && !table2.rows[lastrow].cells[cell].classList.contains('emptyhit')) {
                        table2.rows[lastrow].cells[cell].className = 'empty'
                    }
                    if (firstrow >= 0 && !table2.rows[firstrow].cells[cell].classList.contains('emptyhit')) {
                        table2.rows[firstrow].cells[cell].className = 'empty'
                    }
                    if (cell - 1 >= 0 && lastrow < 10 && !table2.rows[lastrow].cells[cell - 1].classList.contains('emptyhit')) {
                        table2.rows[lastrow].cells[cell - 1].className = 'empty'
                    }
                    if (cell + 1 < 10 && lastrow < 10 && !table2.rows[lastrow].cells[cell + 1].classList.contains('emptyhit')) {
                        table2.rows[lastrow].cells[cell + 1].className = 'empty'
                    }
                    if (cell - 1 >= 0 && firstrow >= 0 && !table2.rows[firstrow].cells[cell - 1].classList.contains('emptyhit')) {
                        table2.rows[firstrow].cells[cell - 1].className = 'empty'
                    }
                    if (cell + 1 < 10 && firstrow >= 0 && !table2.rows[firstrow].cells[cell + 1].classList.contains('emptyhit')) {
                        table2.rows[firstrow].cells[cell + 1].className = 'empty'
                    }
                } else {
                    if (row + 1 < 10 && !table2.rows[row + 1].cells[cell].classList.contains('emptyhit')) {
                        table2.rows[row + 1].cells[cell].className = 'empty'
                    }
                    if (row - 1 >= 0 && !table2.rows[row - 1].cells[cell].classList.contains('emptyhit')) {
                        table2.rows[row - 1].cells[cell].className = 'empty'
                    }
                    if (lastcell < 10 && !table2.rows[row].cells[lastcell].classList.contains('emptyhit')) {
                        table2.rows[row].cells[lastcell].className = 'empty'
                    }
                    if (firstcell >= 0 && !table2.rows[row].cells[firstcell].classList.contains('emptyhit')) {
                        table2.rows[row].cells[firstcell].className = 'empty'
                    }
                    if (row - 1 >= 0 && lastcell < 10 && !table2.rows[row - 1].cells[lastcell].classList.contains('emptyhit')) {
                        table2.rows[row - 1].cells[lastcell].className = 'empty'
                    }
                    if (row + 1 < 10 && lastcell < 10 && !table2.rows[row + 1].cells[lastcell].classList.contains('emptyhit')) {
                        table2.rows[row + 1].cells[lastcell].className = 'empty'
                    }
                    if (row - 1 >= 0 && firstcell >= 0 && !table2.rows[row - 1].cells[firstcell].classList.contains('emptyhit')) {
                        table2.rows[row - 1].cells[firstcell].className = 'empty'
                    }
                    if (row + 1 < 10 && firstcell >= 0 && !table2.rows[row + 1].cells[firstcell].classList.contains('emptyhit')) {
                        table2.rows[row + 1].cells[firstcell].className = 'empty'
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
        table1stop.style.width = '0%'
        table2.style.boxShadow = ''
        table1.style.boxShadow = '0 0 20px green'
    } else {
        table2stop.style.width = '0%'
        table1stop.style.width = '100%'
        table2.style.boxShadow = '0 0 20px red'
        table1.style.boxShadow = ''
    }
});

play.addEventListener('click', (d) => {
    socket.emit('ready', player1Data);
    play.disabled = true
    play.classList.add('opac')
    shuffle.disabled = true
    shuffle.classList.add('opac')
    leave.disabled = false
    leave.classList.remove('opac')
});

socket.on('ready', (d) => {
    if (d == 1) {
        table1stop.style.width = '100%'
        document.getElementById('waiting').style.display = 'inline'
    } else {
        if (queue % 2 == 0) {
            document.getElementById('waiting').style.display = 'none'
            table1stop.style.width = '100%'
        }
        else {
            table1stop.style.width = '0%'
            document.getElementById('waiting').style.display = 'none'
        }
        document.getElementById('fight').play()
    }
    coords = d.coords
    shipsLocation = d.shipsLocation
})

socket.on('end', (endData) => {
    gg = true
    if (endData === 'gg') {
        document.getElementById('loose').play()
        document.getElementById('table1stop').style.width = '100%'
        table2stop.style.width = '100%'
        document.getElementById('gamestate').style.color = 'red'
        document.getElementById('gamestate').textContent = 'You lost'
        document.getElementById('gamestate').style.display = 'inline'
        socket.emit('end', 'win')
    } else if (endData === 'win') {
        document.getElementById('win').play()
        document.getElementById('table1stop').style.width = '100%'
        table2stop.style.width = '100%'
        document.getElementById('gamestate').style.color = 'green'
        document.getElementById('gamestate').textContent = 'You Win'
        document.getElementById('gamestate').style.display = 'inline'
    } else {
        document.getElementById('table1stop').style.width = '100%'
        table2stop.style.width = '100%'
        document.getElementById('gamestate').textContent = 'Opponent left'
        document.getElementById('gamestate').style.display = 'inline'
    }
})

socket.on('shot', function (hittData) {
    let row = hittData[0]
    let cell = hittData[2]
    let count = 0
    shotSound()
    if (player1Data.coords[row][cell] === 1) {
        table1.rows[row].cells[cell].className = 'kill'
        player1Data.coords[row][cell] = 'x'

    } else {
        table1.rows[row].cells[cell].className = 'emptyhit'
    }
    for (let i = 0; i < player1Data.shipsLocation.length; i++) {
        let ships = Object.values(player1Data.shipsLocation[i])
        let position = ships[0]
        let ship = ships[1]
        let shipLength = ship.length
        for (let j = 0; j < ship.length; j++) {
            let row = +ship[j][0]
            let cell = +ship[j][2]
            if (player1Data.coords[row][cell] === 'x') {
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
                table1.rows[row].cells[cell].style.backgroundColor = 'rgba(0, 128, 0, 0.5)'
                if (position) {
                    if (cell + 1 < 10 && !table1.rows[row].cells[cell + 1].classList.contains('emptyhit')) {
                        table1.rows[row].cells[cell + 1].className = 'empty'
                    }
                    if (cell - 1 >= 0 && !table1.rows[row].cells[cell - 1].classList.contains('emptyhit')) {
                        table1.rows[row].cells[cell - 1].className = 'empty'
                    }
                    if (lastrow < 10 && !table1.rows[lastrow].cells[cell].classList.contains('emptyhit')) {
                        table1.rows[lastrow].cells[cell].className = 'empty'
                    }
                    if (firstrow >= 0 && !table1.rows[firstrow].cells[cell].classList.contains('emptyhit')) {
                        table1.rows[firstrow].cells[cell].className = 'empty'
                    }
                    if (cell - 1 >= 0 && lastrow < 10 && !table1.rows[lastrow].cells[cell - 1].classList.contains('emptyhit')) {
                        table1.rows[lastrow].cells[cell - 1].className = 'empty'
                    }
                    if (cell + 1 < 10 && lastrow < 10 && !table1.rows[lastrow].cells[cell + 1].classList.contains('emptyhit')) {
                        table1.rows[lastrow].cells[cell + 1].className = 'empty'
                    }
                    if (cell - 1 >= 0 && firstrow >= 0 && !table1.rows[firstrow].cells[cell - 1].classList.contains('emptyhit')) {
                        table1.rows[firstrow].cells[cell - 1].className = 'empty'
                    }
                    if (cell + 1 < 10 && firstrow >= 0 && !table1.rows[firstrow].cells[cell + 1].classList.contains('emptyhit')) {
                        table1.rows[firstrow].cells[cell + 1].className = 'empty'
                    }
                } else {
                    if (row + 1 < 10 && !table1.rows[row + 1].cells[cell].classList.contains('emptyhit')) {
                        table1.rows[row + 1].cells[cell].className = 'empty'
                    }
                    if (row - 1 >= 0 && !table1.rows[row - 1].cells[cell].classList.contains('emptyhit')) {
                        table1.rows[row - 1].cells[cell].className = 'empty'
                    }
                    if (lastcell < 10 && !table1.rows[row].cells[lastcell].classList.contains('emptyhit')) {
                        table1.rows[row].cells[lastcell].className = 'empty'
                    }
                    if (firstcell >= 0 && !table1.rows[row].cells[firstcell].classList.contains('emptyhit')) {
                        table1.rows[row].cells[firstcell].className = 'empty'
                    }
                    if (row - 1 >= 0 && lastcell < 10 && !table1.rows[row - 1].cells[lastcell].classList.contains('emptyhit')) {
                        table1.rows[row - 1].cells[lastcell].className = 'empty'
                    }
                    if (row + 1 < 10 && lastcell < 10 && !table1.rows[row + 1].cells[lastcell].classList.contains('emptyhit')) {
                        table1.rows[row + 1].cells[lastcell].className = 'empty'
                    }
                    if (row - 1 >= 0 && firstcell >= 0 && !table1.rows[row - 1].cells[firstcell].classList.contains('emptyhit')) {
                        table1.rows[row - 1].cells[firstcell].className = 'empty'
                    }
                    if (row + 1 < 10 && firstcell >= 0 && !table1.rows[row + 1].cells[firstcell].classList.contains('emptyhit')) {
                        table1.rows[row + 1].cells[firstcell].className = 'empty'
                    }
                }
            }
            player1Data.shipsLocation.splice(i, 1)
            shipThink()
        }
        count = 0
    }
})