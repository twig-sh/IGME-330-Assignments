const loadXHR = (url, callback) => {
	// set up the connection
	// when the data loads, invoke the callback function and pass it the `xhr` object
	const xhr = new XMLHttpRequest();
	xhr.onload = () => callback(xhr);
	xhr.open("GET", url);
	xhr.send();
};

export { loadXHR };