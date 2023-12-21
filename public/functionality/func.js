	const videoPlayer = document.getElementById("videoPlayer");
const videoGrid = document.getElementById("video-grid");
const displayScreen = document.getElementById("display-screen");

console.log("func js ran");
videoTitle = "default";
function playVideo(title) {
	console.log("title");
}
videoPlayer.src = ``;

//!

//document.getElementById('video-grid').appendChild('div');
fetch("/api/video_list")
	//promise chain
	.then((response) => response.json())
	.then((videolist) => {
		if (videolist.length === 0) {
			console.log("no videos found");
			return;
		} else if (videolist.length == 1 && videolist[0] == "Multiview default video.mp4") {
			//videoPlayer.style.display = "block"
			videoPlayer.src = `/api/stream/Multiview default video.mp4`;
			return;
		}
		videolist.forEach((videotitle) => {
			const videoOption = document.createElement("div");
			videoOption.classList.add("video-option");

			const videoImage = document.createElement("img");
			const thumbnailLocation = `${videotitle.split(".")[0]}_thumbnail.jpg`;

			videoImage.src = `/api/thumbnail/${thumbnailLocation}`; // Adjust the path to your thumbnails
			console.log(videoImage.src);
			const linkToScreen = document.createElement("a");
			linkToScreen.href = "#videoPlayer";

			const videoTitle = document.createElement("p");
			videoTitle.textContent = videotitle.split(".")[0];
			linkToScreen.appendChild(videoOption);
			videoOption.appendChild(videoImage);
			videoOption.appendChild(videoTitle);

			videoOption.addEventListener(
				//! Here===========================
				"click",
				function () {
					videoPlayer.style.display = "block";
					displayScreen.style.backgroundColor = "transparent";
					videoPlayer.src = `/api/stream/${encodeURIComponent(videotitle)}`;
				}
			);
			videoGrid.appendChild(linkToScreen);
		});
	})
	.catch((error) => {
		console.error(error);
	});

//! picking from branding file

const header = document.querySelector("header");

function generateMenu() {
	const dropMenu = document.createElement("div");
	const menuSect1 = createMenuItems("Options", [
		{
			tag: "div",
			html: "Upload Video",
			id: "uploadVideo",
			class: "menuSectionEl",
		},
		{
			tag: "div",
			html: "Drop to upload",
			id: "dropVideo",
			class: "menuSectionEl",
		},
		{
			tag: "div",
			html: "Scan to connect",
			id: "scanQRTitle",
			class: "menuSectionTitle",
		},
		{ tag: "div", html: "", id: "QR" },
		{
			tag: "div",
			html: "Generate Admin QR",
			id: "adminQR",
			class: "menuSectionEl",
		},
	]);

	const menuSect2 = createMenuItems("Options", []);

	dropMenu.id = "menuDropdown";
	dropMenu.appendChild(menuSect1);
	header.appendChild(dropMenu);

	function createMenuItems(title, content) {
		const menuSection = document.createElement("div");
		menuSection.id = "menuSection";

		// Create a title for the section
		const titleElement = document.createElement("div");
		titleElement.className = "menuSectionTitle";
		titleElement.textContent = title;
		menuSection.appendChild(titleElement);

		//! Create content elements
		//? All custom buttons should have the class 'menuSectionEl'
		for (const item of content) {
			const element = document.createElement(item.tag || "img");

			if (item.id != "QR") {
				element.innerHTML = item.html;
				element.id = item.id;
				element.className = item.class;
			} else {
				element.id = item.id;
				console.log(item.id);
				getQR(item.id);
			}
			menuSection.appendChild(element);
		}

		function getQR(elId) {
			fetch("/api/qr")
				.then((response) => response.text())
				.then((qrCodeDataURL) => {
					// Update the container with the QR code image
					const container = document.getElementById(elId);
					console.log(container);
					container.innerHTML = `<img src="${qrCodeDataURL}" alt="QR Code">`;
				})
				.catch((error) => console.error(error));
		}

		return menuSection;
	}
	menuSect1.addEventListener("click", function (event) {
		if (event.target.id === "uploadVideo") {
			// const videoInput = document.createElement("input");
			// videoInput.type = "file";
			// videoInput.accept = "video/*";
			// videoInput.click();

			// //!Video upload
			// videoInput.addEventListener("change", function () {
			// 	const videoFile = videoInput.files[0];
			// 	const xhr = new XMLHttpRequest();
			// 	xhr.open("POST", "/api/upload", true);
			// 	xhr.onload = function () {
			// 		if (xhr.status === 200) {
			// 			consolelog("video uploaded");
			// 		} else {
			// 			console.log("video upload failed");
			// 		}
			// 	};
			// 	const formData = new FormData(); //create a new formdata to hold the vid
			// 	formData.append("video", videoFile); //append the video to the formdata
			// 	console.log(formData);
			// 	xhr.send(formData); //send the formdata to the server
			// });


			const videoInput = document.createElement("input");
			videoInput.type = "file";
			videoInput.accept = "video/*";
			videoInput.click();

			//! Video upload
			videoInput.addEventListener("change", function () {
				const videoFile = videoInput.files[0];
				console.log(videoFile);
				const formData = new FormData();
				formData.append("file", videoFile); // Make sure the key matches what the server expects

				fetch("/api/upload", {
					method: "POST",
					body: formData,
				})
					.then((response) => {
						if (response.ok) {
							console.log("Video uploaded successfully");
						} else {
							console.log("Video upload failed");
						}
					})
					.catch((error) => {
						console.error("Error uploading video:", error);
					});
			});
		} else if (event.target.id === "dropVideo") {
			//window.location.href = '/drop'
			alert("drop video clicked");
		} else if (event.target.id === "adminQR") {
			//window.location.href = '/admin'
			alert("admin qr clicked");
		}
	});
}
generateMenu();
