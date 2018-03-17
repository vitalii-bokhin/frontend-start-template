//global variables
var winW, winH;

(function() {

//get window sizes
winW = window.innerWidth;
winH = window.innerHeight;
window.addEventListener('winResized', function() {
	winW = window.innerWidth;
	winH = window.innerHeight;
});

//add support CustomEvent constructor for IE9+
try {
	new CustomEvent("IE has CustomEvent, but doesn't support constructor");
} catch (e) {
	window.CustomEvent = function(event, params) {
		var evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}
	CustomEvent.prototype = Object.create(window.Event.prototype);
}

//window Resized Event
var winResizedEvent = new CustomEvent('winResized');
var rsz = true;
window.addEventListener('resize', function() {
	if (rsz) {
		rsz = false;
		setTimeout(function() {
			window.dispatchEvent(winResizedEvent);
			rsz = true;
		}, 1021);
	}
});



})();