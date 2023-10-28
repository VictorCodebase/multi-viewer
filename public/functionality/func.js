const videoPlayer = document.getElementById('videoPlayer')
const videoGrid = document.getElementById('video-grid')

videoTitle = "default"
function playVideo(title){
    console.log("title")
}
videoPlayer.src = `/api/stream/Multiview default video.mp4` // this is the default video


//!

//document.getElementById('video-grid').appendChild('div');
fetch('/api/video_list') //TODO: use a promise approach to ensure all thumbnails needing to be generated are generated before the page loads
    .then(response => response.json())
    .then(videolist => {
        if (videolist.length === 0){
            console.log('no videos found')
            return
        }
        else if (videolist.length ==  1 && videolist[0] == 'Multiview default video.mp4'){
            videoPlayer.style.display = "block"
            videoPlayer.src = `/api/stream/Multiview default video.mp4`
            return
        }
        videolist.forEach(videotitle => {
            const videoOption = document.createElement('div');
            videoOption.classList.add('video-option');

            const videoImage = document.createElement('img');
            const thumbnailLocation = `${videotitle.split('.')[0]}_thumbnail.jpg`

            videoImage.src = `/api/thumbnail/${thumbnailLocation}`; // Adjust the path to your thumbnails
            console.log(videoImage.src)
            const linkToScreen = document.createElement('a')
            linkToScreen.href = '#videoPlayer'


            const videoTitle = document.createElement('p');
            videoTitle.textContent = videotitle.split('.')[0];
            linkToScreen.appendChild(videoOption);
            videoOption.appendChild(videoImage);
            videoOption.appendChild(videoTitle);
            
            videoOption.addEventListener(
                'click', function(){
                    videoPlayer.style.display = "block"
                    videoPlayer.src = `/api/stream/${encodeURIComponent(videotitle)}`
                }
            )
        videoGrid.appendChild(linkToScreen);
        });
    })
    .catch(error =>{
        console.error(error)
    })