import { getRandomInt } from "./utils.js";

let words1;
let words2;
let words3;
let wordsArrays;

// parses the json from babble-data.json, assigns the word arrays, assigns event listeners, and shows startup technobabble. will only run once, when the xhr loads.
const babbleLoaded = (e) => {
  // parse the json
  console.log(`In onload - HTTP Status Code = ${e.target.status}`);
  const text = e.target.responseText;
  const json = JSON.parse(text);

  // the two buttons...
  const button = document.querySelector("#myButton");
  const fiveButton = document.querySelector("#five-babbles");

  // ...the first will generate one babble while the other will generate 5
  button.addEventListener("click", () => { generateTechno(1) });
  fiveButton.addEventListener("click", () => { generateTechno(5) });

  // assign json to variables
  words1 = json.words1;
  words2 = json.words2;
  words3 = json.words3;

  // put those variables in an array
  wordsArrays = [words1, words2, words3];

  // display technobabble on startup
  generateTechno(1);
}

// runs only once, when the page opens. sends a request for the json data.
const loadBabble = () => {
  const url = "./data/babble-data.json";
  const xhr = new XMLHttpRequest();
  xhr.onload = babbleLoaded;

  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET", url);
  xhr.send();
}

// generates technobabble based off the arrays
// params: num is how many babbles are to be generated and displayed
const generateTechno = (num) => {
  // reset the <p> tag in which the babble resides
  const babble = document.querySelector("#output");
  babble.innerHTML = "";

  // loop until all desired lines of babble are generated
  for (let i = 0; i < num; i++) {
    // pick out 3 words from the 3 arrays and update the #output text
    for (let j = 0; j < wordsArrays.length; j++) {
      babble.innerHTML += ` ${wordsArrays[j][getRandomInt(0, wordsArrays[j].length)]}`;
    }
    // create a new line of babble
    babble.innerHTML += `<br><br>`
  }
};

window.onload = loadBabble;

// init is no longer here since loadBabble and babbleLoaded make it obsolete