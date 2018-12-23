/*
call to init:
Video.init(Str button selector);
*/
var Video;

(function() {
	'use strict';

	Video = {
		play: function(elem) {
			elem.nextElementSibling.classList.add('video__frame_visible');

			var iFrame = document.createElement('iframe');

			iFrame.src = elem.getAttribute('data-src') +'?autoplay=1&rel=0&amp;showinfo=0';
			iFrame.allow = 'autoplay; encrypted-media';
			iFrame.allowFullscreen = true;

			iFrame.addEventListener('load', function() {
				iFrame.classList.add('visible');
			});

			elem.nextElementSibling.appendChild(iFrame);
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.play(elem);
			});
		}
	};
})();