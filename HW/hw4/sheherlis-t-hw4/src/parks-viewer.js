// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBJfeqJE7GsNLcPemu7nOBobCr8cL2FpAI",
	authDomain: "high-scores-439f3.firebaseapp.com",
	databaseURL: "https://high-scores-439f3-default-rtdb.firebaseio.com",
	projectId: "high-scores-439f3",
	storageBucket: "high-scores-439f3.appspot.com",
	messagingSenderId: "362698984240",
	appId: "1:362698984240:web:e2d0e2e0560102502096f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app); // make sure firebase is loaded

const parks = {
	"p79": "Letchworth State Park",
	"p20": "Hamlin Beach State Park",
	"p180": "Brookhaven State Park",
	"p35": "Allan H. Treman State Marine Park",
	"p118": "Stony Brook State Park",
	"p142": "Watkins Glen State Park",
	"p62": "Taughannock Falls State Park",
	"p84": "Selkirk Shores State Park",
	"p43": "Chimney Bluffs State Park",
	"p200": "Shirley Chisholm State Park",
	"p112": "Saratoga Spa State Park"
};

// #2 NEW STUFF
const db = getDatabase();
const favoritesRef = ref(db, 'parks');

const favoritesChanged = (snapshot) => {
	if (snapshot.size != 0) {
		document.querySelector("#favorites-view").innerHTML = "";
	}
	else {
		document.querySelector("#favorites-view").innerHTML = "<li>No data yet!</li>";
	}
	snapshot.forEach(park => {
		const childKey = park.key;
		const childData = park.val();
		console.log(childKey, childData);
		if (childData > 0) {
			document.querySelector("#favorites-view").innerHTML += `<li><b>${parks[childKey]} (${childKey})</b> - ${childData}</li>`;
		}
	});
}

onValue(favoritesRef, favoritesChanged);