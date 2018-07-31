/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function() {
	"use strict";

	Anchor = {
		duration: 1000,
		shift: 0,

		scroll: function(anchorId, e) {
			var anchorSectionElem = document.getElementById(anchorId);

			if (!anchorSectionElem) {
				return;
			}

			if (e) {
				e.preventDefault();
			}

			var scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
			scrollTo = scrollTo - this.shift;

			animate(function(progress) {
				window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
			}, this.duration, 'easeInOutQuad');
		},

		init: function(elementStr, duration, shift) {
			if (duration) {
				this.duration = duration;
			}

			if (shift) {
				this.shift = shift;
			}

			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (elem) {
					this.scroll(elem.getAttribute('href').split('#')[1], e);
				}
			});

			if (window.location.hash) {
				this.scroll(window.location.hash.split('#')[1]);
			}
		}
	};
}());