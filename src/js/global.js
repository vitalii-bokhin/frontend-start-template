// global variables
; var browser, ajax, animate;

(function() {
	"use strict";

	// Get useragent
	document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());

	// Browser identify
	browser = (function(userAgent) {
		userAgent = userAgent.toLowerCase();

		if (/(msie|rv:11\.0)/.test(userAgent)) {
			return 'ie';
		}
	})(navigator.userAgent);

	// Add support CustomEvent constructor for IE
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

	// Window Resized Event
	var winResizedEvent = new CustomEvent('winResized'),
	rsz = true;

	window.addEventListener('resize', function() {
		if (rsz) {
			rsz = false;

			setTimeout(function() {
				window.dispatchEvent(winResizedEvent);
				rsz = true;
			}, 1021);
		}
	});

	// Closest polyfill
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
		})(Element.prototype);
	}

	// Check element for hidden
	Element.prototype.elementIsHidden = function() {
		var elem = this;

		while (elem) {
			if (!elem) break;

			var compStyle = getComputedStyle(elem);

			if (compStyle.display == 'none' || compStyle.visibility == 'hidden' || compStyle.opacity == '0') {
				return true;
			}

			elem = elem.parentElement;
		}

		return false;
	}

	// Ajax
	ajax = function(options) {
		var xhr = new XMLHttpRequest();

		xhr.open('POST', options.url);

		if (typeof options.send == 'string') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				options.success(xhr.response);
			} else if (xhr.readyState == 4 && xhr.status != 200) {
				options.error(xhr.response);
			}
		}

		xhr.send(options.send);
	}

	/*
	Animation
	animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
	*/
	animate = function(draw, duration, ease, complete) {
		var start = performance.now();

		requestAnimationFrame(function anim(time) {
			var timeFraction = (time - start) / duration;

			if (timeFraction > 1) {
				timeFraction = 1;
			}

			var progress = (ease) ? easing(timeFraction, ease) : timeFraction;

			draw(progress);

			if (timeFraction < 1) {
				requestAnimationFrame(anim);
			} else {
				if (complete != undefined) {
					complete();
				}
			}
		});
	}

	function easing(timeFraction, ease) {
		switch (ease) {
			case 'easeInQuad':
			return quad(timeFraction);
			
			case 'easeOutQuad':
			return 1 - quad(1 - timeFraction);
			
			case 'easeInOutQuad':
			if (timeFraction <= 0.5) {
				return quad(2 * timeFraction) / 2;
			} else {
				return (2 - quad(2 * (1 - timeFraction))) / 2;
			}
		}
	}

	function quad(timeFraction) {
		return Math.pow(timeFraction, 2)
	}
})();