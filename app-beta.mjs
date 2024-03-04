import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
const PORT = 8000

const server = http.createServer((req, res) => {
    let url = req.url
    switch (url) {
        case '/':
            fs.readFile('./public/index.html', (err, data) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
                res.setHeader("Content-Type", "text/html");
                res.write(data);
                res.end();
            })
            break;

        default:
            if (url.includes('/images')) {
                fs.readFile(`./public/${url}`, (err, data) => {
                    res.statusCode = 200
                    res.setHeader("Content-type", "image/jpeg")
                    res.write(data)
                    res.end()
                })
            }
            else if (url.includes('/index.js')) {
                fs.readFile(`./public/${url}`, (err, data) => {
                    res.statusCode = 200
                    res.setHeader("Content-type", "text/javascript")
                    res.write(data)
                    res.end()
                })
            }
            else if (url.includes('/board.js')) {
                fs.readFile(`./public/${url}`, (err, data) => {
                    res.statusCode = 200
                    res.setHeader("Content-type", "text/javascript")
                    res.write(data)
                    res.end()
                })
            }
            else if (url.includes('/style')) {
                fs.readFile(`./public/${url}`, (err, data) => {
                    res.statusCode = 200
                    res.setHeader("Content-type", "text/css")
                    res.write(data)
                    res.end()
                })
            }
            else if (url.includes('/audio')) {
                fs.readFile(`./public/${url}`, (err, data) => {
                    res.statusCode = 200
                    res.setHeader("Content-type", "audio/mpeg")
                    res.write(data)
                    res.end()
                })
            }
            else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/html");
                res.end('<h1>404 Not Found</h1>');
            }

            break;
    }

})

server.listen(PORT)
