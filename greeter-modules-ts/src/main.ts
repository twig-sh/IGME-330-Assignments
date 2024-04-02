import { formatGreeting } from "./utils";

const input: HTMLInputElement = document.querySelector("#input-firstname") as HTMLInputElement;
const output: HTMLParagraphElement = document.querySelector("#output")!; // exclamation is a shortcut for saying an element is going to be the type previously declared
const cbForcefully: HTMLInputElement = document.querySelector("#cb-forcefully")!;

const helloButton: HTMLButtonElement = document.querySelector("#btn-hello")!;
const goodbyeButton: HTMLButtonElement = document.querySelector("#btn-goodbye")!;

let forcefully: boolean = cbForcefully.checked;

//cbForcefully.onchange = () => forcefully = cbForcefully.checked;
cbForcefully.onchange = e => forcefully = (e.target as HTMLInputElement).checked;
helloButton.onclick = () => output.innerHTML = formatGreeting("Hello", input.value.trim(), forcefully);
goodbyeButton.onclick = () => output.innerHTML = formatGreeting("Goodbye", input.value.trim(), forcefully);
