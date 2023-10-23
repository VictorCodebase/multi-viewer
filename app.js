const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs')

app.set('view engine', 'ejs');


const videoPath = './videos/sample1.mp4'

app.get('/api/stream', (req, res) => {
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (isNaN(start) || isNaN(end)) {
            // Invalid range values, send an appropriate response (e.g., 416 Range Not Satisfiable).
            res.status(416).send('Range Not Satisfiable');
        } else {
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const headers = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, headers);
            file.pipe(res);
        }
    } else {
        const headers = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
});



app.get('/', (req, res) => {
    res.render('home');
});


// Listen on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
