/*
Video.init(Str button selector);
*/
var Video;

(function() {
	'use strict';
	
	Video = {
		play: function(elem) {
			elem.nextElementSibling.classList.add('video__frame_visible');
			
			const iFrame = document.createElement('iframe'),
			vId = elem.getAttribute('data-src').match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i)[1];
			
			iFrame.src = 'https://www.youtube.com/embed/'+ vId +'?autoplay=1&rel=0&amp;showinfo=0';
			iFrame.allow = 'autoplay; encrypted-media';
			iFrame.allowFullscreen = true;
			
			iFrame.addEventListener('load', function() {
				iFrame.classList.add('visible');

				elem.nextElementSibling.classList.add('video__frame_played');
			});
			
			elem.nextElementSibling.appendChild(iFrame);
		},

		stop: function() {
			const frameBlockElem = document.querySelector('.video__frame');
			
			if (!frameBlockElem) return;

			frameBlockElem.innerHTML = '';
			frameBlockElem.classList.remove('video__frame_visible');
			frameBlockElem.classList.remove('video__frame_played');
		},
		
		init: function(elementStr) {
			if (!document.querySelectorAll('.video').length) return;
			
			document.addEventListener('click', (e) => {
				const elem = e.target.closest(elementStr);
				
				if (elem) {
					this.play(elem);
				}
			});
		}
	};
})();