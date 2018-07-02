/*
call to init:
Video.init(Str button selector);
*/
var Video;

(function() {
	"use strict";

	Video = {
		play: function(elem) {
			var frameDiv = document.createElement('div'),
			iFrame = document.createElement('iframe');

			frameDiv.className = 'video__frame';
			
			elem.parentElement.appendChild(frameDiv);

			iFrame.src = elem.getAttribute('data-src') +'?autoplay=1&rel=0&amp;showinfo=0';
			iFrame.allow = 'autoplay; encrypted-media';
			iFrame.allowFullscreen = true;

			frameDiv.appendChild(iFrame);
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
}());