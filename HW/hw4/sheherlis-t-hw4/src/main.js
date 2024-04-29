import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBJfeqJE7GsNLcPemu7nOBobCr8cL2FpAI",
	authDomain: "high-scores-439f3.firebaseapp.com",
	projectId: "high-scores-439f3",
	storageBucket: "high-scores-439f3.appspot.com",
	messagingSenderId: "362698984240",
	appId: "1:362698984240:web:49d177e82959aec62096f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];

let geojson;
let currentId;
let favoriteIds = [];
let favoriteBtn;
let deleteBtn;
let popup = document.querySelector(".mapboxgl-popup");


// II. Functions

const getFeatureByID = (id) => {
	return geojson.features.find((el) => el.id == id);
}

const showFeatureDetails = (id) => {
	let favorited = false;
	console.log(`showFeatureDetails - id=${id}`);
	currentId = id;
	if (favoriteIds.includes(currentId)) favorited = true;
	const feature = getFeatureByID(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	document.querySelector("#details-2").innerHTML = `
		<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href="${feature.properties.url}">${feature.properties.url}</a></p>
		<button class="button is-success" id="favorite">Favorite</button>
		<button class="button is-warning" id="delete">Delete</button>`;

	document.querySelector("#details-3").innerHTML = feature.properties.description;

	favoriteBtn = document.querySelector("#favorite");
	deleteBtn = document.querySelector("#delete");

	favoriteBtn.onclick = () => addToFavorites(id)
	favoriteBtn.disabled = favorited;

	deleteBtn.onclick = () => removeFromFavorites(id)
	deleteBtn.disabled = !favorited;
}

const createFavoriteElement = (id) => {
	const feature = getFeatureByID(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	}
	a.innerHTML = `
	<span class="panel-icon">
		<i class="fas fa-map-pin"></i>
	</span>
	${feature.properties.title}
	`;
	return a;
}

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
	storage.writeToLocalStorage("favorites", favoriteIds);
}

const addToFavorites = (id) => {
	favoriteIds.push(id);
	favoriteBtn.disabled = true;
	deleteBtn.disabled = false;
	refreshFavorites();

	// increment favorites count in firebase
	const parksRef = ref(db, `parks/${currentId}`);
	runTransaction(parksRef, (favorites) => {
		favorites++;
		return favorites;
	});
}

const removeFromFavorites = (id) => {
	favoriteIds.splice(favoriteIds.indexOf(id), 1);
	favoriteBtn.disabled = false;
	deleteBtn.disabled = true;
	refreshFavorites();

	// decrement favorites count in firebase
	const parksRef = ref(db, `parks/${currentId}`);
	runTransaction(parksRef, (favorites) => {
		favorites--;
		return favorites;
	});
}

const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	}

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	}

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	}

	refreshFavorites();
}

const init = () => {
	map.initMap(lnglatNYS);

	if (Array.isArray(storage.readFromLocalStorage("favorites"))) favoriteIds = storage.readFromLocalStorage("favorites");

	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

init();