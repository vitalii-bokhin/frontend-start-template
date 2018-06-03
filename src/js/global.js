//global variables
var winW, winH;

(function() {
"use strict";

//get useragent
document.documentElement.setAttribute('data-useragent', navigator.userAgent);

//get window sizes
winW = window.innerWidth;
winH = window.innerHeight;
window.addEventListener('winResized', function() {
	winW = window.innerWidth;
	winH = window.innerHeight;
});

//add support CustomEvent constructor for IE
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

//closest polyfill
if (!Element.prototype.closest) {
	(function(ElProto) {
		ElProto.matches = ElProto.matches || ElProto.mozMatchesSelector || ElProto.msMatchesSelector || ElProto.oMatchesSelector || ElProto.webkitMatchesSelector;
		ElProto.closest = ElProto.closest || function closest(selector) {
			if (!this) {
				return null;
			}
			if (this.matches(selector)) {
				return this;
			}
			if (!this.parentElement) {
				return null;
			} else {
				return this.parentElement.closest(selector);
			}
		};
	}(Element.prototype));
}

}());