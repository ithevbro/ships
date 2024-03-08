function createTable(tableName) {
    tableName.innerHTML = ''
    for (let i = 0; i < 10; i++) {
        let tr = document.createElement('tr')
        for (let j = 0; j < 10; j++) {
            let td = document.createElement('td')
            td.dataset.ship = `${i}-${j}`
            tr.append(td)
        }
        tableName.append(tr)
    }
}
export { createTable }