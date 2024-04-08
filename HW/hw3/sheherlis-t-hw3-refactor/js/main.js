let container = document.querySelector(".container");
let cards = document.querySelectorAll(".result");
let cardFront = document.querySelectorAll(".front");
let cardBack = document.querySelectorAll(".back");
let cardImgs = document.querySelectorAll(".card-img");
let cardNames = document.querySelectorAll(".name");
let buttons = document.querySelectorAll(".main-button");
let fish = document.querySelector("#fish");
let fishDropDown = document.querySelector("#fish-list");
let bugs = document.querySelector("#bugs");
let bugsDropDown = document.querySelector("#bugs-list");
let villagersDropDown = document.querySelector("#villagers-list");
let favoritesDropDown = document.querySelector("#favorites-list");
let clearButton = document.querySelector("#clear");
let instructions = document.querySelector("#instructions");

const prefix = "cks2693-";
const critterKey = prefix + "critters";
const villagerKey = prefix + "villagers";

let currentArray = [];
let favoriteCrittersArray = [];
let favoriteVillagersArray = [];

const storedCritters = localStorage.getItem(critterKey);
const storedVillagers = localStorage.getItem(villagerKey);

if (storedCritters) {
  favoriteCrittersArray = JSON.parse(storedCritters);
}

if (storedVillagers) {
  favoriteVillagersArray = JSON.parse(storedVillagers);
}

const API_URL = "https://api.nookipedia.com/";
const API_KEY = "ee03ae8c-8f89-495a-a9ed-d4e07fa9df9f";

// grab data from api
let getData = (url) => {
  let xhr = new XMLHttpRequest();

  xhr.onload = dataLoaded;

  xhr.onerror = dataError;

  xhr.open("GET", url);
  xhr.send();
};

// take data from api and puts it on the page
let dataLoaded = (e) => {
  // getting values from the api
  let xhr = e.target;
  let obj = JSON.parse(xhr.responseText);
  currentArray = Object.values(obj);

  // checks if we're displaying critters or villagers
  if (
    e.target.responseURL.includes("fish") ||
    e.target.responseURL.includes("bugs")
  ) {
    // filter based on if the critters are fish or bugs
    if (e.target.responseURL.includes("fish")) filterFish();
    else if (e.target.responseURL.includes("bugs")) filterBugs();

    // display cards for the critters and then set them up for interactivity
    displayBugOrFish(currentArray);
    setUpCards(currentArray);

    // adjusting image size
    cardImgs.forEach((e) => (e.style.height = "80%"));

    // look it's the villagers i was talking about
  } else if (e.target.responseURL.includes("villagers")) {
    //filters the villagers and sets up the cards for display and interactivity
    filterVillagers();
    displayVillagers(currentArray);
    setUpCards(currentArray);

    // adjusting image size
    cardImgs.forEach(
      (e) => ((e.style.height = "70%"), (e.style.width = "30%"))
    );
  }
};

// no data found (this should theoretically never be called)
let dataError = (e) => {
  console.log("An error occured");
};

let buttonPress = (e) => {
  let url = API_URL;

  console.log(e.target);

  container.innerHTML = "";

  // clicking a critter button sets the endpoint to that critter...
  if (e.target.value === "fish" || e.target.value === "bugs") {
    url += "nh/" + e.target.value + "?api_key=" + API_KEY;
    getData(url);
  }
  // ...and clicking the villager button sets the endpoint to villagers!
  else if (e.target.value === "villagers") {
    url += e.target.value + "?api_key=" + API_KEY;
    getData(url);
  }
  // clicking the favorites button works with no api calls!
  else if (e.target.value === "favorites") {
    loadFavorites(favoritesDropDown.value);
  }
};

// manipulates the DOM to display cards for the critters loaded
let displayBugOrFish = (array) => {
  if (clearButton != null) clearButton.remove();

  instructions.innerHTML =
    "Hover over cards to flip them or click to favorite!";

  array.forEach((result) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class='result' data-type='critter'>
                        <div class='result-card' data-type='critter'>
                        <div class='front' data-type='critter'>
                            <img class='card-img' data-type='critter' src=${result.image_url} />
                            <p class='name' data-type='critter'>${result.name}</p>
                        </div>
                        <div class='back'>
                            <p>${result.name}</p>
                            <p>Months Available: ${result.north.months}</p>
                            <p>Location: ${result.location}</p>
                            <p>Rarity: ${result.rarity}</p>
                            <p>Price: ${result.sell_nook}</p>
                        </div>
                        </div>
                    </div>`
    );
  });
};

// manipulates the DOM to display cards for the villagers loaded
let displayVillagers = (array) => {
  if (clearButton != null) clearButton.remove();

  instructions.innerHTML =
    "Hover over cards to flip them or click to favorite!";

  array.forEach((result) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class='result' data-type='villager'>
                        <div class='result-card' data-type='villager'>
                        <div class='front' data-type='villager'>
                            <img class='card-img' data-type='villager' src=${result.image_url} />
                            <p class='name' data-type='villager'>${result.name}</p>
                        </div>
                        <div class='back' data-type='villager'>
                            <p>${result.name}</p>
                            <p>Species: ${result.species}</p>
                            <p>Gender: ${result.gender}</p>
                            <p>Personality: ${result.personality}</p>
                            <p>Birthday: ${result.birthday_month} ${result.birthday_day}</p>
                        </div>
                        </div>
                    </div>`
    );
  });
};

// filters the currentArray based on fish location
let filterFish = () => filterLocation(fishDropDown.value);

// filters the currentArray based on bug locations (this can probably be simplified but it
// wasn't as easy as the fish)
let filterBugs = () => {
  switch (bugsDropDown.value) {
    case "flying":
      filterLocation("Flying");
      break;

    case "ground":
      filterLocation("ground");
      break;

    case "trees":
      filterLocation("trees");
      break;

    case "flowers":
      filterLocation("flowers");
      break;

    case "on":
      currentArray = currentArray.filter(
        (critter) =>
          critter.location.includes("On") || critter.location.includes("on")
      );
      break;
  }
};

// filters the current array based on villager species (there are so many,,,)
let filterVillagers = () => filterSpecies(villagersDropDown.value);

// adds clicked card to a list of either favorite villagers or critters
let favoriteClick = (e) => {
  let newData = currentArray[parseInt(e.target.dataset.index)];

  if (e.target.dataset.type === "villager") {
    if (favoriteVillagersArray.includes(newData)) {
      favoriteVillagersArray.splice(favoriteVillagersArray.indexOf(newData), 1);
      localStorage.setItem(villagerKey, JSON.stringify(favoriteVillagersArray));
    } else {
      favoriteVillagersArray.push(newData);
      localStorage.setItem(villagerKey, JSON.stringify(favoriteVillagersArray));
    }
  } else if (e.target.dataset.type === "critter") {
    if (favoriteCrittersArray.includes(newData)) {
      favoriteCrittersArray.splice(favoriteCrittersArray.indexOf(newData), 1);
      localStorage.setItem(critterKey, JSON.stringify(favoriteCrittersArray));
    } else {
      favoriteCrittersArray.push(newData);
      localStorage.setItem(critterKey, JSON.stringify(favoriteCrittersArray));
    }
  }
};

// updates the DOM variables to their current state
let updateDOM = () => {
  cards = document.querySelectorAll(".result");
  cardFront = document.querySelectorAll(".front");
  cardBack = document.querySelectorAll(".back");
  cardImgs = document.querySelectorAll(".card-img");
  cardNames = document.querySelectorAll(".name");
};

// sets up cards to be interactable
let setUpCards = (array) => {
  updateDOM();
  for (let i = 0; i < array.length; i++) {
    cards[i].dataset.index = `${i}`;
    cardFront[i].dataset.index = `${i}`;
    cardBack[i].dataset.index = `${i}`;
    cardImgs[i].dataset.index = `${i}`;
    cardNames[i].dataset.index = `${i}`;
    cards[i].onclick = favoriteClick;
  }
};

// filter helper method for critters
let filterLocation = (string) => {
  currentArray = currentArray.filter((critter) =>
    critter.location.includes(string)
  );
};

// filter helper method for villagers. not really needed but oh well!
let filterSpecies = (string) => {
  currentArray = currentArray.filter((villager) =>
    villager.species.includes(string)
  );
};

// displays either favorite critter or villager array
let loadFavorites = (value) => {
  if (value === "critters") {
    if (favoriteCrittersArray.length === 0) {
      instructions.innerHTML =
        "Nothing currently favorited, click a button to load items!";
      container.innerHTML = "";
    } else {
      displayBugOrFish(favoriteCrittersArray);
      updateDOM();

      // adjusting image size
      cardImgs.forEach((e) => (e.style.height = "80%"));

      container.insertAdjacentHTML(
        "afterend",
        `<button id='clear' value=${value}>Clear</button>`
      );
      clearButton = document.querySelector("#clear");
      clearButton.onclick = clearFavorites;
    }
  } else if (value === "villagers") {
    if (favoriteVillagersArray.length === 0) {
      instructions.innerHTML =
        "Nothing currently favorited, click a button to load items!";
      container.innerHTML = "";
    } else {
      displayVillagers(favoriteVillagersArray);
      updateDOM();

      // adjusting image size
      cardImgs.forEach(
        (e) => ((e.style.height = "70%"), (e.style.width = "30%"))
      );

      container.insertAdjacentHTML(
        "afterend",
        `<button id='clear' value=${value}>Clear</button>`
      );
      clearButton = document.querySelector("#clear");
      clearButton.onclick = clearFavorites;
    }
  }
};

// clears the current favorites array
let clearFavorites = (e) => {
  if (e.target.value === "critters") {
    favoriteCrittersArray = [];
    localStorage.setItem(critterKey, JSON.stringify(favoriteCrittersArray));
  } else if (e.target.value === "villagers") {
    favoriteVillagersArray = [];
    localStorage.setItem(villagerKey, JSON.stringify(favoriteVillagersArray));
  }
  loadFavorites(e.target.value);
  clearButton.remove();
};

buttons.forEach((button) => {
  button.addEventListener("click", buttonPress);
});
