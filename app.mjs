import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
const PORT = 8000

const mimeTypes = {
    '.css': 'text/css',
    '.gif': 'image/gif',
    '.jpg': 'image/jpg',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.mp3': 'audio/mpeg',
    '.txt': 'text/plain',
    '.wav': 'audio/wav'
};

function staticFile(res, filePath, ext) {
    res.setHeader("Content-type", mimeTypes[ext])
    fs.readFile('./public' + filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.end()
        }
        res.end(data)
    })
}
http.createServer((req, res) => {
    let url = req.url
    console.log(url);

    switch (url) {
        case '/':
            staticFile(res, '/index.html', '.html')
            break;
        default:
            let extname = path.extname(url)
            if (extname in mimeTypes) {
                staticFile(res, url, extname)
            }
            else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/html");
                res.end('<h1>404 Not Found</h1>');
            }
            break;
    }

}).listen(PORT)