const header = document.querySelector("header");
const footer = document.querySelector("footer");
import config from "./config.js";

console.log("brand Js run");

//const config = runConfig();

function constructHeader() {
	const headerTitle = document.createElement("h1");
	headerTitle.textContent = document.title;
	var isLargeScreen = window.innerWidth > 800;

	//! Create the header container
	const logoDiv = document.createElement("div");
	logoDiv.id = "logoContainer";
	let logoPath = isLargeScreen ? config.logoPath.large : config.logoPath.small;

	const logoImgDiv = document.createElement("div");
	let logoImgDivClass = isLargeScreen ? "logoImg" : "logoImgMobile";
	logoImgDiv.classList.add(logoImgDivClass);

	const logoImg = document.createElement("img");
	const logoUrl = document.createElement("a");
	logoImg.src = logoPath;
	logoUrl.href = config.githubLink;
	logoUrl.target = "_blank";
	logoImg.alt = "Logo";

	logoImgDiv.appendChild(logoUrl);
	logoUrl.appendChild(logoImg);
	logoDiv.appendChild(logoImgDiv);

	//! Create the file title
	const titleDiv = document.createElement("div");
	titleDiv.id = "title";
	const appTitleDiv = document.createElement("div");
	appTitleDiv.classList.add("appTitle");
	appTitleDiv.textContent = document.title.toUpperCase();

	titleDiv.appendChild(appTitleDiv);

	//! Create the hamburger menu
	const menuDiv = document.createElement("div");
	menuDiv.id = "menu";
	const hamburgerMenuContainer = document.createElement("div");
	hamburgerMenuContainer.id = "hamburgerMenuContainer";
	for (let i = 0; i < 3; i++) {
		const hamburgerMenuEl = document.createElement("div");
		hamburgerMenuEl.id = `hamburgerMenuEl${i}`;
		hamburgerMenuEl.classList.add("hamburgerMenuEl");
		hamburgerMenuContainer.appendChild(hamburgerMenuEl);
	}

	menuDiv.appendChild(hamburgerMenuContainer);
	hamburgerMenuContainer.addEventListener("click", function () {
		const menuDropdown = document.getElementById("menuDropdown");
		if (menuDropdown.style.display === "flex") {
			menuDropdown.style.display = "none";
		} else {
			menuDropdown.style.display = "flex";
		}
	});

	//! Append sections
	header.appendChild(logoDiv);
	header.appendChild(titleDiv);
	header.appendChild(menuDiv);

	//! =======================================================================================
	//! EDIT MENU HERE
}

function constructFooter() {
	// Create a container div for the footer sections
	const footerContainer = document.createElement("div");
	footerContainer.classList.add("rows");

	//! Create the first footer section
	const footerSection1 = createFooterSection("Contribution", [
		{ tag: "p", html: "We &#U+2764; You" },
		{
			src: config.footerSectImages.contributeGithub,
			html: "view on github",
			id: "githubLink",
		},
		{
			src: config.footerSectImages.starProject,
			html: "star project on github",
			id: "starProject",
		},
		{
			src: config.footerSectImages.buyCoffee,
			html: "Buy us coffee",
			id: "buyCoffee",
		},
	]);

	//! Create the second footer section
	const footerSection2 = createFooterSection("Contacts", [
		{ tag: "p", html: "mobile: +254790405421" },
		{
			tag: "p",
			html: "email 1: (collaboration): victorkithinji@outlook.com",
		},
		{
			tag: "p",
			html: "email 2: (feedback): markkithinji469@gmail.com",
		},
	]);

	// Create the third footer section
	const footerSection3 = createFooterSection("Other Products", [
		{ tag: "p", html: "More from CodeBase Studio" },
		{
			tag: "p",
			html: `visit: <a href=${config.codebaseStudio}>VictorCodebase studio</a>`,
		},
		{
			tag: "p",
			html: `productivity tools: <a href=${config.codebaseWindows}>VictorCodebase - windows</a>`,
		},
		{
			tag: "p",
			html: `mobile games: <a href=${config.codebaseGames}>VictorCodebase - games</a>`,
		},
	]);

	// Create the footer base section
	const footerBase = document.createElement("div");
	footerBase.classList.add("footerbase");

	const center = document.createElement("center");
	const p = document.createElement("p");
	p.innerHTML = "&copy; 2023 VictorCodebase Studio";

	center.appendChild(p);
	footerBase.appendChild(center);

	// Append the sections and the footer base to the document
	footerContainer.appendChild(footerSection1);
	footerContainer.appendChild(footerSection2);
	footerContainer.appendChild(footerSection3);
	footer.appendChild(footerContainer);
	footer.appendChild(footerBase);

	// Function to create a footer section with content
	function createFooterSection(title, content) {
		const footerSection = document.createElement("div");
		footerSection.classList.add("footer-section");

		// Create a title for the section
		const titleElement = document.createElement("div");
		titleElement.classList.add("footer-section-title");
		titleElement.textContent = title;
		footerSection.appendChild(titleElement);

		//! Create content elements
		for (const item of content) {
			const element = document.createElement(item.tag || "img");
			if (item.src) {
				element.src = item.src;
				element.alt = item.alt;
				element.id = item.id;
			} else {
				element.innerHTML = item.html;
			}
			footerSection.appendChild(element);
		}

		return footerSection;
	}

	//event delegation
	footerSection1.addEventListener("click", function (event) {
		if (event.target.id === "githubLink") {
			window.open(config.githubProject, "_blank", (rel = "noopener noreferrer"));
		} else if (event.target.id === "starProject") {
			window.open(config.githubReposLink, "_blank", (rel = "noopener noreferrer"));
		} else if (event.target.id === "buyCoffee") {
			window.open(config.donations, "_blank", (rel = "noopener noreferrer"));
		}
	});
}

constructHeader();
constructFooter();
