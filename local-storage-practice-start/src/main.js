import * as storage from "./storage.js"
let items = [];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  // loop though items and stick each array element into an <li>

  // use array.map()!
  const html = items.map(item => `<li>${item}</li>`).join("");

  // update the innerHTML of the <ol> already on the page
  document.querySelector("#thing-list").innerHTML = html;

};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = str => {
  if (str != "") {
    items.push(str);
  }
  showItems();

  storage.writeToLocalStorage("things", items);
};

// - Add a "Clear List" button that empties the items array
const clearItems = () => {
  items = [];
  showItems();

  storage.writeToLocalStorage("things", items);
}


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`

const interfaceSetup = () => {
  if (Array.isArray(storage.readFromLocalStorage("things"))) items = storage.readFromLocalStorage("things");

  document.querySelector("#btn-add").onclick = () => { addItem(document.querySelector("#thing-text").value) };

  document.querySelector("#btn-clear").onclick = clearItems;

  showItems();
}

interfaceSetup();

// When the page loads:
// - load in the `items` array from storage.js and display the current items
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array

// Got it working? 

