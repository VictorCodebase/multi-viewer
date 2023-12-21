const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const fs = require("fs");
//const http = require('http');
const path = require("path");
const qr = require("qrcode");
const uuid = require("uuid");
//const Jimp = require('jimp');
const { exec } = require("child_process");
const sharp = require("sharp");
//const os = require('os');
const network = require("network");
const { stderr, title } = require("process");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const port = process.env.PORT || 3000;

//let access id be assigned only when the main client refreshes
const accessID = uuid.v4();
const adminID = uuid.v4();

//! QR code generation API here
async function getDeviceIP() {
	console.log("========= getting device ip =========");

	return new Promise((resolve, reject) => {
		network.get_active_interface(function (err, obj) {
			if (err) {
				console.log("========= error getting device ip =========", err);
				reject(err);
			} else {
				
				resolve(obj.ip_address);
			}
		});
	});
}

app.get("/api/qr", async (req, res) => {
	try {
		console.log("\n", "\n", "GENERATING DEVICE QR CODE...");

		console.log("========= getting device ip =========");
		const deviceIP = await getDeviceIP();
		console.log("device IP --------> ", deviceIP);

		//TODO: how to know the client's ip to implement a firewall rule

		const data = deviceIP === undefined ? `http://localhost:${port}?accessId=${accessID}` : `http://${deviceIP}:${port}?accessId=${accessID}`;
		console.log("data to encode --------> ", data);

		const qrCodeDataURL = await qr.toDataURL(data);

		res.send(qrCodeDataURL);
		console.log("\n", "\n", "QR CODE GENERATED SUCCESSFULLY...");
	} catch (err) {
		console.log(err);
	}
});

videoPath = ""; //FIXME: is this necessary?
const videoFolder = "./videos";
const thumbnailFolder = "./thumbnails";

app.get("/api/video_list", (req, res) => {
	fs.readdir(videoFolder, (err, files) => {
		if (err) {
			console.error(err);
			return res.status(500).send(`Error reading video files from ${videoFolder}`);
		}
		res.json(files);
	});
});

app.get("/api/logo", (req, res) => {
	const logoPath = req.query.logoPath;
	const newLogoPath = path.resolve(path.join(__dirname, "public", "images", "logo.png"));
	res.sendFile(newLogoPath);
});
app.get("/api/logo_small", (req, res) => {
	const logoPath = path.resolve(path.join(__dirname, "public", "images", "logo_small.png"));
	res.sendFile(logoPath);
});

app.get("/api/thumbnail/:thumbnail", (req, res) => {
	//TODO: check if thumbnails exist for all videos and dispose excess thumbnails
	//! A better work around is to compare the number of files, if differennt either add or delete thumbnails
	const thumbnail = req.params.thumbnail;
	const thumbnailPath = path.resolve(path.join(thumbnailFolder, thumbnail));
	res.sendFile(thumbnailPath, async (err) => {
		if (err) {
			console.log("========= thumbnail not found, resolving =========");
			await checkThumbnails(thumbnail)
				.then((res) => {
					if (res) {
						res.sendFile(thumbnailPath);
					}
				})
				.catch(() => {
					// Add opening parenthesis here
					console.log("========= thumbnail not resolved, sending default =========");
					const defaultThumbnailPath = path.resolve(path.join(thumbnailFolder, "default2_thumbnail.jpeg"));
					res.sendFile(defaultThumbnailPath);
				});
		}
	});
});

function checkThumbnails(thumbnail) {
	//! I want this function to solely check if a thumbnail exists for a video and if not, generate it

	fileExists = false;
	errorSolved = false;
	return new Promise((resolve, reject) => {
		fs.readdir(thumbnailFolder, (err, files) => {
			files.forEach((file) => {
				if (file === thumbnail) {
					console.log("========= thumbnail exists in parent folder =========");
					fileExists = true;
				}
			});
		});
		if (!fileExists) {
			try {
				generateThumbnail([thumbnail.split("_")[0], ".mp4"].join(""));
				errorSolved = true;
			} catch (err) {
				errorSolved = false;
			}
		}

		if (errorSolved) {
			resolve(true);
		} else {
			reject(false);
		}
	});
}

async function generateThumbnail(video) {
	console.log("THUMBNAIL GEN LOGS FOR ", video);
	try {
		const videoPath = path.join(videoFolder, video);
		const thumbnailPath = path.join(videoFolder, `${video.replace(".mp4", "_thumbnail.jpg")}`);

		// Attempt to generate thumbnail using sharp
		try {
			const image = await sharp(videoPath, { seek: 2000 });
			await image.resize(100, 100).toFile(thumbnailPath);
			console.log(`\x1b[32mThumbnail generated for ${video} successfully\x1b[0m`);
			return; // Thumbnail generated successfully, exit function
		} catch (error) {
			console.error(`\x1b[31mError generating thumbnail with Sharp: ${error.message}\x1b[0m`);
		}

		// Fallback to Windows-generated thumbnail
		try {
			const windowsThumbnailPath = path.join(videoFolder, `${video.replace(".mp4", ".png")}`);
			const imageData = await fs.promises.readFile(windowsThumbnailPath);
			console.log(`\x1b[32mRetrieved thumbnail from Windows successfully\x1b[0m`);
			return imageData; // Return the Windows thumbnail data
		} catch (error) {
			console.error(`\x1b[31mError retrieving Windows thumbnail: ${error.message}\x1b[0m`);
		}
	} catch (error) {
		console.error(`\x1b[31mFatal error: ${error.message}\x1b[0m`);
	}
}

function deleteThumbnails(thumbnails) {
	console.log("DELETING EXCESS THUMBNAILS...");
	thumbnails.forEach((thumbnail) => {
		fs.unlink(thumbnail, (err) => {
			if (err) {
				//console.log(`error deleting ${thumbnail}`)
				//console.log(err)
			} else {
				//console.log(`deleted ${thumbnail}`)
			}
		});
	});
}

async function addThumbnails(videos) {
	for (const video of videos) {
		const videoPath = `${videoFolder}/${video}.mp4`;
		const thumbnailPath = `${thumbnailFolder}/${video}_thumbnail.jpg`;

		//console.log("VIDEOPATH: ", videoPath);
		//console.log("THUMBNAILPATH: ", thumbnailPath);

		try {
			// Use Jimp to read the video frame and save it as a thumbnail
			// const image = await Jimp.read(videoPath);
			// await image
			//   .clone()
			//   .quality(90) // set the quality of the thumbnail
			//   .crop(0, 0, image.getWidth(), image.getHeight()) // you can crop the image if needed
			//   .write(thumbnailPath);
			//console.log(`Thumbnail generated for ${video} successfully`);
		} catch (error) {
			//console.error(`Error generating thumbnail for ${video}: ${error}`);
		}
	}
}

// function addThumbnails(videos){
//     videos.forEach(video => {
//         const videoPath = `${videoFolder}/${video}.mp4`;
//         const thumbnailPath = `${thumbnailFolder}/${video}_thumbnail.jpg`;
//         const command = `ffmpeg -i "${videoPath}" -ss 00:00:05 -vframes 1 "${thumbnailPath}"`;
//         //const command = 'ffmpeg -i "./videos/Far Cry ® New Dawn 2022-12-07 18-05-48.mp4" -ss 00:00:05 -vframes 1 "./thumbnails/Far Cry ® New Dawn 2022-12-07 18-05-48_thumbnail.jpg"'
//         console.log("VIDEOPATH: ", videoPath), console.log("THUMBNAILPATH: ", thumbnailPath)

//         exec(command, (error, stdout, stderr) => {
//             if (error){
//                 console.error(`Error generating thumbnail for ${video}: ${error}`);
//             }else{
//                 console.log(`thumbail generated for ${video} successfully`)
//             }
//         })
//     })
// }

app.get("/api/stream/:video", (req, res) => {
	videoName = req.params.video;
	//console.log(`Fetched ${videoName}`)
	if (videoName === undefined || videoName === NaN) {
		//console.log(`unexpected title: ${videoName}`)
	} else {
		videoPath = videoName.includes(".mp4") ? path.join(videoFolder, videoName) : path.join(videoFolder, videoName + ".mp4");
	}
	const stat = fs.statSync(videoPath);
	const fileSize = stat.size;
	const range = req.headers.range;

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		if (isNaN(start) || isNaN(end)) {
			res.status(416).send("Range Not Satisfiable");
		} else {
			const chunkSize = end - start + 1;
			const file = fs.createReadStream(videoPath, { start, end });
			const headers = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunkSize,
				"Content-Type": "video/mp4",
			};

			res.writeHead(206, headers);
			file.pipe(res);
		}
	} else {
		const headers = {
			"Content-Length": fileSize,
			"Content-Type": "video/mp4",
		};
		res.writeHead(200, headers);
		fs.createReadStream(videoPath).pipe(res);
	}
});

// app.post("/api/upload", (req, res) => {
// 	if (req.files && req.files.video) {
// 		console.log(req.files, "files");
// 		console.log(req.files.video, "video");
// 		const videoFile = req.files.video; //accessing the uploaded file
// 		console.log(videoFile, "video file");
// 		const videoName = videoFile.originalFilename.split(".")[0];
// 		const destination = "uploads/" + videoName + ".mp4";

// 		fs.createWriteStream(videoFile.tempFilePath)
// 			.pipe(fs.createWriteStream(destination))
// 			.on("finish", () => {
// 				console.log("========= video uploaded successfully =========");
// 				res.send("video uploaded successfully");
// 			})
// 			.on("error", (err) => {
// 				console.log("========= error uploading video =========");
// 				//console.log(err)
// 				res.status(500).send(`Upload failed`);
// 			});
// 	} else {
// 		console.log(req.files, "files");
// 		res.status(400).send(`Please upload a video`);
// 	}
// });
app.post("/api/upload", (req, res) => {
	if (req.headers["content-type"].startsWith("multipart/form-data")) {
		const file = req.body.file; // Assuming the file is sent as a base64-encoded string

		if (!file) {
			return res.status(400).send("No file uploaded");
		}

		// Convert base64 string to a buffer
		const fileBuffer = Buffer.from(file, "base64");

		const fileName = "your_custom_filename.mp4"; // You can customize the filename
		const destination = path.join(__dirname, "uploads", fileName);

		// Write the buffer to the file
		fs.writeFile(destination, fileBuffer, (err) => {
			if (err) {
				console.error("Error writing file:", err);
				return res.status(500).send("Upload failed");
			}

			console.log("File uploaded successfully");
			return res.status(200).send("File uploaded successfully");
		});
	} else {
		res.status(400).send("Invalid request format");
	}
});

app.get("/", (req, res) => {
	res.render("home", { title: "Multi-Viewer" });
});

app.listen(port, () => {
	console.log("Server running on port", port);
});
