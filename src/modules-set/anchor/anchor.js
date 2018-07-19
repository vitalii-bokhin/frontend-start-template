/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function() {
	"use strict";

	Anchor = {
		duration: 1000,
		shift: 0,

		scroll: function(elem) {
			var scrollTo = document.querySelector(elem.getAttribute('href')).getBoundingClientRect().top,
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

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.scroll(elem);
			});
		}
	};
}());

/*
$(document).ready(function() {

	$('body').on('click', '.js-anchor', function () {
		var href = $(this).attr('href'),
		anch = '#'+ href.split('#')[1];

		if($(anch).length){
			var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');

			return false;
		}

	});

	if (window.location.hash) {

		var anch = window.location.hash;

		if($(anch).length && !$(anch).hasClass('popup__window')){

			$('html, body').stop().animate({scrollTop: 0}, 1);

			window.onload = function() {
				var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

				$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');
			}

		}

	}
	
});*/