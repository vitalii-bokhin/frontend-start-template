/*
animateJS(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
*/
var animateJS;

(function() {
	"use strict";

	animateJS = function(draw, duration, ease, complete) {
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
				complete();
			}
		});
	}

	function easing(timeFraction, ease) {
		if (ease == 'easeInOutQuad') {
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
}());