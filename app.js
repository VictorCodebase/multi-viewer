const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
const { Stream } = require('stream');
const path = require('path');

app.set('view engine', 'ejs');


videoPath = './videos/Forza Horizon 5 2022-08-01 21-58-50.mp4'
const videoFolder = './videos'

app.get('/api/video_list', (req, res) => {
    fs.readdir(videoFolder, (err, files) => {
        if(err){
            console.error(err)
            return res.status(500).send(`Error reading video files from ${videoFolder}`)
        }
        res.json(files)
    })
})

app.get('/api/:thumbnail/', (req, res) => {
    //TODO: send image to client

})

app.get('/api/stream/:video', (req, res) => {
    videoName = req.params.video
    console.log(`Fetched ${videoName}`)
    if (videoName === undefined || videoName === NaN){
        console.log(`unexpected title: ${videoName}`) 
    }else{
        videoPath = (videoName.includes('.mp4')) ? path.join(videoFolder, videoName) : path.join(videoFolder, videoName + '.mp4')
    }
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
