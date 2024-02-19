import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";

let ctx;
let paused = true;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

const drawRandomRect = (ctx) => {
	drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor());
}

const drawRandomArc = (ctx) => {
	drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(5, 45), getRandomColor(), getRandomInt(2, 12), getRandomColor())
}

const drawRandomLine = (ctx) => {
	drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(2, 12), getRandomColor());
}

// handy helper functions!
const canvasClicked = (e) => {
	let rect = e.target.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;
	console.log(mouseX, mouseY);

	for (let i = 0; i < 10; i++) {
		let x = getRandomInt(-100, 100) + mouseX;
		let y = getRandomInt(-100, 100) + mouseY;
		let radius = getRandomInt(10, 25);
		let color = getRandomColor();
		drawArc(ctx, x, y, radius, color)
	}
}

const setupUI = () => {
	document.querySelector("#btn-play").addEventListener("click", () => { paused = false; });
	document.querySelector("#btn-pause").addEventListener("click", () => { paused = true; });
	document.querySelector("#btn-clear").onclick = () => ctx.clearRect(0, 0, 640, 480);

	canvas.onclick = canvasClicked;

	document.querySelector("#cb-rectangles").onclick = (e) => { createRectangles = e.target.checked; }
	document.querySelector("#cb-arcs").onclick = (e) => { createArcs = e.target.checked; }
	document.querySelector("#cb-lines").onclick = (e) => { createLines = e.target.checked; }
}

const update = () => {
	requestAnimationFrame(update);
	if (paused) return;
	if (createRectangles) drawRandomRect(ctx);
	if (createArcs) drawRandomArc(ctx);
	if (createLines) drawRandomLine(ctx);
}

const init = () => {
	console.log("page loaded!");
	canvas = document.querySelector("canvas")

	// B - the `ctx` variable points at a "2D drawing context"
	ctx = canvas.getContext("2d");
	drawRectangle(ctx, 20, 20, 600, 440, "red");
	drawRectangle(ctx, 120, 120, 400, 300, "#ffff00");
	drawRectangle(ctx, 120, 120, 400, 300, "#0000", 20, "rgb(0,0,255)")

	// lines
	drawLine(ctx, 20, 20, 620, 460, 20, "green");
	drawLine(ctx, 620, 20, 20, 460, 20, "green");

	// circle
	drawArc(ctx, 320, 240, 50, "yellow", 5, "purple", 0, Math.PI * 2);


	// semi-circle
	drawArc(ctx, 320, 245, 10, "pink", 5, "red", 0, Math.PI);
	drawArc(ctx, 300, 225, 10, "white", 5, "black", 0, Math.PI * 2);
	drawArc(ctx, 340, 225, 10, "white", 5, "black", 0, Math.PI * 2);

	drawLine(ctx, 20, 50, 620, 50, 20, "orange");

	update();
	setupUI();
}



init();