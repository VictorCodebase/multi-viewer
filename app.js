const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');
const { stderr, title } = require('process');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));


const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found.');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});


videoPath = './videos/Forza Horizon 5 2022-08-01 21-58-50.mp4'
const videoFolder = './videos'
const thumbnailFolder = './thumbnails'

app.get('/api/video_list', (req, res) => {
    fs.readdir(videoFolder, (err, files) => {
        if(err){
            console.error(err)
            return res.status(500).send(`Error reading video files from ${videoFolder}`)
        }
        res.json(files)
    })
})

app.get('/api/logo', (req, res) => {
    const logoPath = req.query.logoPath
    const newLogoPath = path.resolve(path.join(__dirname, 'public', 'images', 'logo.png'))
    res.sendFile(newLogoPath)
})
app.get('/api/logo_small', (req, res) => {
    const logoPath = path.resolve(path.join(__dirname, 'public', 'images', 'logo_small.png'))
    res.sendFile(logoPath)
})

app.get('/api/thumbnail/:thumbnail', (req, res) => {
    //TODO: check if thumbnails exist for all videos and dispose excess thumbnails
    const thumbnail = req.params.thumbnail
    const thumbnailPath = path.resolve(path.join(thumbnailFolder, thumbnail))
    res.sendFile(thumbnailPath, async (err)  => {

        if(err){
            console.error(err)
            //can we capture a 404 error and run the checkThumbnails function to troubleshoot?
            console.log("thumbnail not found, running checkThumbnails")
            await checkThumbnails()
            .then((res) => {
                console.log("thumbnail added successfully")
                res.sendFile(thumbnailPath)
                console.log(res)
                if (!res){
                    console.log("thumbnail couldnt be generated")
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(404).send(`Thumbnail ${thumbnail} not found`)
            })
        }
    
    })
})
    
    

function checkThumbnails(){
    const videoTitles = new Set()
    const videoThumbnails = new Set()
    errorSolved = false
    return new Promise((resolve, reject) => {
        fs.readdir(videoFolder, (err, files) => {
            if(err){
                console.log(err)
            }
            files.forEach(file => {
                file = file.split('.')[0]
                videoTitles.add(file)
            });
            fs.readdir(thumbnailFolder, (err, titles) => {
                if(err){
                    console.log(err)
                }
                titles.forEach(title => {
                    console.log(title)
                    title = title.split('_')[0]
                    videoThumbnails.add(title)
                
                });
            })

            videosWithoutThumbnails = [...videoTitles].filter(x => !videoThumbnails.has(x))
            console.log("No thumbnails", videosWithoutThumbnails)
            thumbnailsWithNoVideos = [...videoThumbnails].filter(x => !videoTitles.has(x))
            console.log(thumbnailsWithNoVideos)

            if (videosWithoutThumbnails.length > 0){
                console.log('adding thumbnails')
                if(addThumbnails(videosWithoutThumbnails)){
                    errorSolved = true
                }
            }
            if (thumbnailsWithNoVideos.length > 0){
                console.log('deleting unrelated thumbnails')
                deleteThumbnails(thumbnailsWithNoVideos)
            }        
        })
        if (errorSolved){
            resolve(true)
        }
        else{
            reject(false)
        }
    })
}

function deleteThumbnails(thumbnails){
    thumbnails.forEach(thumbnail => {
        fs.unlink(thumbnail, (err) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(`deleted ${thumbnail}`)
            }
        })
    })
}

function addThumbnails(videos){
    videos.forEach(video => {
        const videoPath = `${videoFolder}/${video}.mp4`;
        const thumbnailPath = `${thumbnailFolder}/${video}_thumbnail.jpg`;
        const command = `ffmpeg -i "${videoPath}" -ss 00:00:05 -vframes 1 "${thumbnailPath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error){
                console.error(`Error generating thumbnail for ${video}: ${error}`);
            }else{
                console.log(`thumbail generated for ${video} successfully`)
            }
        })
    })
}


function generateThumbnails(videos){
    fs.readdir(videoFolder, (err, files) => {
        if (err){
            console.log(err)
            return
        }
        files.forEach(file =>{
            if(file.endsWith('.mp4')){
                const videoPath = `${videoFolder}/${file}`;
                const thumbnailPath = `${videoFolder}/${file.replace('.mp4', '_thumbnail.jpg')}`;
                const command = `ffmpeg -i "${videoPath}" -ss 00:00:05 -vframes 1 "${thumbnailPath}"`;
                
                exec(command, (error, stdout, stderr) => {
                    if (error){
                        console.error(`Error generating thumbnail for ${file}: ${error}`);
                    }else{
                        console.log(`thumbail generated for ${file} successfully`)
                    }
                })
            }
        })
    })
}

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
