/*
Bubble.init({
	element: '.js-bubble'
});
*/

; var Bubble;

(function() {
	"use strict";

	Bubble = {
		bubbleDiv: null,
		bubbleClass: null,

		show: function(elem) {
			this.bubbleDiv.innerHTML = elem.getAttribute('data-bubble');

			this.bubbleClass = elem.getAttribute('data-bubble-class');

			if (this.bubbleClass) {
				this.bubbleDiv.classList.add(this.bubbleClass);
			}

			var bubleStyle = this.bubbleDiv.style, 
			bubbleMinWidth = 100,
			bubblePotentWidth = window.innerWidth - (elem.getBoundingClientRect().left + elem.offsetWidth) - 10,
			coordX = elem.getBoundingClientRect().left + elem.offsetWidth;

			if (bubblePotentWidth < bubbleMinWidth) {
				bubblePotentWidth = bubbleMinWidth;

				coordX = window.innerWidth - bubbleMinWidth - 10;
			}

			bubleStyle.width = bubblePotentWidth +'px';
			bubleStyle.left = coordX +'px';

			var coordY = elem.getBoundingClientRect().top + pageYOffset - this.bubbleDiv.offsetHeight;

			bubleStyle.top = coordY +'px';

			this.bubbleDiv.classList.add('bubble_visible');
		},

		hide: function() {
			this.bubbleDiv.classList.remove('bubble_visible');
			this.bubbleDiv.style = '';
			this.bubbleDiv.innerHTML = '';

			if (this.bubbleClass) {
				this.bubbleDiv.classList.remove(this.bubbleClass);

				this.bubbleClass = null;
			}
		},

		init: function(opt) {
			document.addEventListener('mouseover', (e) => {
				var elem = e.target.closest(opt.element);

				if (elem) {
					this.show(elem);
				}
			});

			document.addEventListener('mouseout', (e) => {
				if (e.target.closest(opt.element)) {
					this.hide();
				}
			});

			//add bubble to DOM
			this.bubbleDiv = document.createElement('div');
			this.bubbleDiv.className = 'bubble';

			document.body.appendChild(this.bubbleDiv);
		}
	};
}());