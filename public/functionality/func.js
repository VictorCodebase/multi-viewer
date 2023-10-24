const videoPlayer = document.getElementById('videoPlayer')
const videoGrid = document.getElementById('video-grid')

videoTitle = "default"
function playVideo(title){
    console.log("title")
}



//!

//document.getElementById('video-grid').appendChild('div');
fetch('/api/video_list')
    .then(response => response.json())
    .then(videolist => {
        videolist.forEach(videotitle => {
            const videoOption = document.createElement('div');
            videoOption.classList.add('video-option');

            const videoImage = document.createElement('img');
            const thumbnailLocation = `${videotitle.split('.')[0]}_thumbnail.jpg`
            videoImage.src = `/api/thumbnail/${thumbnailLocation}`; // Adjust the path to your thumbnails



            const videoTitle = document.createElement('p');
            videoTitle.textContent = videotitle.split('.')[0];

            videoOption.appendChild(videoImage);
            videoOption.appendChild(videoTitle);
            
            videoOption.addEventListener(
                'click', function(){
                    videoPlayer.style.display = "block"
                    videoPlayer.src = `/api/stream/${encodeURIComponent(videotitle)}`
                }
            )
        videoGrid.appendChild(videoOption);
        });
    })
    .catch(error =>{
        console.error(error)
    })