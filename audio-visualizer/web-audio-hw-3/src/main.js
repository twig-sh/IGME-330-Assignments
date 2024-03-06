/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
	showGradient: true,
	showBars: true,
	showCircles: true,
	showInvert: false,
	showEmboss: false,
	showFrequency: true,
	showNoise: 0
};

let fps = 60;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1: "media/New Adventure Theme.mp3"
});

const loop = () => {
	/* NOTE: This is temporary testing code that we will delete in Part II */
	setTimeout(loop, 1000 / fps);
	canvas.draw(drawParams);
	console.log(drawParams.showFrequency);
}

const setupUI = (canvasElement) => {
	// A - hookup fullscreen button
	const fsButton = document.querySelector("#btn-fs");

	// B - hookup play button
	const playButton = document.querySelector("#btn-play");

	// add .onclick event to button
	fsButton.onclick = e => {
		console.log("goFullscreen() called");
		utils.goFullscreen(canvasElement);
	};

	// add .onclick event to button
	playButton.onclick = e => {
		console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

		// check if context is in suspended state (autoplay policy)
		if (audio.audioCtx.state == "suspended") {
			audio.audioCtx.resume();
		}
		console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
		if (e.target.dataset.playing == "no") {
			// if track is currently paused, play it
			audio.playCurrentSound();
			e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
			// if track IS playing, pause it
		}
		else {
			audio.pauseCurrentSound();
			e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
		}
	}

	// C - hookup volume slider & label
	let volumeSlider = document.querySelector("#slider-volume");
	let volumeLabel = document.querySelector("#label-volume");

	// add .oninput event to slider
	volumeSlider.oninput = e => {
		// set the gain
		audio.setVolume(e.target.value);
		// update value of label to match value of slider
		volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
	};

	// set value of label to match initial value of slider
	volumeSlider.dispatchEvent(new Event("input"));

	// D - hookup track <select>
	let trackSelect = document.querySelector("#select-track");
	// add .onchange event to <select>
	trackSelect.onchange = e => {
		audio.loadSoundFile(e.target.value);
		// pause the current track if it is playing
		if (playButton.dataset.playing == "yes") {
			playButton.dispatchEvent(new MouseEvent("click"));
		}
	};

	const gradientCB = document.querySelector("#cb-gradient");
	const barsCB = document.querySelector("#cb-bars");
	const circlesCB = document.querySelector("#cb-circles");
	const noiseSlider = document.querySelector("#slider-noise");
	let noiseLabel = document.querySelector("#label-noise");
	const invertCB = document.querySelector("#cb-invert");
	const embossCB = document.querySelector("#cb-emboss");
	const highshelfSlider = document.querySelector("#slider-highshelf");
	const lowshelfSlider = document.querySelector("#slider-lowshelf");
	let lowshelfLabel = document.querySelector("#label-lowshelf");
	let highshelfLabel = document.querySelector("#label-highshelf");
	const frequencyRadio = document.querySelector("#radio-frequency");
	const waveformRadio = document.querySelector("#radio-waveform");

	gradientCB.onchange = e => {
		drawParams.showGradient = gradientCB.checked;
	}

	barsCB.onchange = e => {
		drawParams.showBars = barsCB.checked;
	}

	circlesCB.onchange = e => {
		drawParams.showCircles = circlesCB.checked;
	}

	noiseSlider.oninput = e => {
		drawParams.showNoise = noiseSlider.value;
		noiseLabel.innerHTML = e.target.value;
	}

	invertCB.onchange = e => {
		drawParams.showInvert = invertCB.checked;
	}

	embossCB.onchange = e => {
		drawParams.showEmboss = embossCB.checked;
	}

	highshelfSlider.oninput = e => {
		audio.toggleHighshelf(highshelfSlider.value);
		highshelfLabel.innerHTML = Math.round((e.target.value))
	}

	lowshelfSlider.oninput = e => {
		audio.toggleLowshelf(lowshelfSlider.value);
		lowshelfLabel.innerHTML = Math.round((e.target.value))
	}

	frequencyRadio.onchange = e => {
		drawParams.showFrequency = frequencyRadio.checked;
	}

	waveformRadio.onchange = e => {
		drawParams.showFrequency = frequencyRadio.checked;
	}

} // end setupUI

const init = () => {
	audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement, audio.analyserNode);
	loop();
}

export { init };