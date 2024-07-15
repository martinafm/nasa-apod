const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

//NASA API
const count = 5;
const apiKey = "DEMO_KEY";
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
	window.scrollTo({
		top: 0,
		behavior: "instant",
	});
	if (page === "results") {
		resultsNav.classList.remove("hidden");
		favoritesNav.classList.add("hidden");
	} else {
		resultsNav.classList.add("hidden");
		favoritesNav.classList.remove("hidden");
	}
	loader.classList.add("hidden");
}

function createDOMNodes(page) {
	const currentArray =
		page === "results" ? resultsArray : Object.values(favorites);
	currentArray.forEach((result) => {
		//Card Container
		const card = document.createElement("div");
		card.classList.add("card");

		//Link
		const link = document.createElement("a");
		link.href = result.hdurl;
		link.title = "View Full Image";
		link.target = "_blank";

		//Image
		const image = document.createElement("img");
		image.src = result.url;
		image.alt = "NASA Pictures of The Day";
		image.loading = "lazy";
		image.classList.add("card-img-top");

		//Card Body
		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body");

		//Card Title
		const cardTitle = document.createElement("h5");
		cardTitle.classList.add("card-title");
		cardTitle.textContent = result.title;

		// Save text
		const saveText = document.createElement("p");
		saveText.classList.add("clickable");
	
		if (page === "results") {
			saveText.textContent = "Add To Favorites";
			saveText.addEventListener("click", function () {
				saveFavorite(result.url);
			});
		} else {
			saveText.textContent = "Remove Favorite";
			saveText.addEventListener("click", function () {
				removeFavorite(result.url);
			});
		}

		//Card Text
		const cardText = document.createElement("p");
		cardText.textContent = result.explanation;

		//Footer
		const footer = document.createElement("footer");
		footer.classList.add("text-muted");

		// Date
		const date = document.createElement("strong");
		date.textContent = result.date;

		// Copyright
		const copyRightResult =
			result.copyright === undefined ? "" : result.copyright;
		const copyRight = document.createElement("span");
		copyRight.textContent = ` ${copyRightResult}`;
		// Append
		footer.append(date, copyRight);
		cardBody.append(cardTitle, saveText, cardText, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		imagesContainer.appendChild(card);
	});
}

function updateDOM(page) {
	if (localStorage.getItem("nasaFav")) {
		favorites = JSON.parse(localStorage.getItem("nasaFav"));
		console.log("fav from ls: " + favorites);
	}
	// clear all Card items from imagesContainer
	imagesContainer.textContent = "";
	createDOMNodes(page);
	showContent(page);
}

async function getNASAPictures() {
	// Show loader
	loader.classList.remove("hidden");
	try {
		const response = await fetch(apiURL);
		resultsArray = await response.json();
		console.log(resultsArray);
		updateDOM("results");
	} catch (error) {
		console.log(error);
	}
}

// Add result to fav
function saveFavorite(itemUrl) {
	// Loop through Results Array to select Favourite
	resultsArray.forEach((item) => {
		if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
			favorites[itemUrl] = item;
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
			}, 2000);

			// Save item to fav
			localStorage.setItem("nasaFav", JSON.stringify(favorites));
		}
	});
}

// Remove result from fav
function removeFavorite(itemUrl) {
	if (favorites[itemUrl]) {
		delete favorites[itemUrl];
		// Save item to fav
		localStorage.setItem("nasaFav", JSON.stringify(favorites));
		updateDOM("favorites");
	}
}

// on Load
getNASAPictures();
favoritesNav.addEventListener("click", getNASAPictures);
document.getElementById("loadMore").addEventListener("click", getNASAPictures);
document.getElementById("favorites").addEventListener("click", function () {
	updateDOM("favorites");
});
