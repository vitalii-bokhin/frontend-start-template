//global variables
var browser;

(function() {
	"use strict";

//get useragent
document.documentElement.setAttribute('data-useragent', navigator.userAgent);

//browser identify
browser = (function(userAgent) {

	userAgent = userAgent.toLowerCase();

	if (/(msie|rv:11\.0)/.test(userAgent)) {
		return 'ie';
	}

}(navigator.userAgent));

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

//check element for hidden
Element.prototype.elementIsHidden = function() {

	var elem = this;

	while (elem) {

		if (!elem) {
			break;
		}

		var compStyles = getComputedStyle(elem);

		if (compStyles.display == 'none' || compStyles.visibility == 'hidden' || compStyles.opacity == '0') {
			return true;
		}

		elem = elem.parentElement;

	}

	return false;
}

}());