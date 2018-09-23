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
		canBeHidden: true,

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
			var mouseOver = (e) => {
				var elem = e.target.closest(opt.element);

				if (elem) {
					this.show(elem);
				} else if (e.target.closest('.bubble')) {
					this.canBeHidden = false;
				}
			}

			var mouseOut = (e) => {
				setTimeout(() => {
					if ((e.target.closest(opt.element) && this.canBeHidden) || e.target.closest('.bubble')) {
						this.hide();

						this.canBeHidden = true;
					}
				}, 21);
			}

			if (document.ontouchstart !== undefined) {
				document.addEventListener('touchstart', mouseOver);
				document.addEventListener('touchend', mouseOut);
			} else {
				document.addEventListener('mouseover', mouseOver);
				document.addEventListener('mouseout', mouseOut);
			}

			//add bubble to DOM
			this.bubbleDiv = document.createElement('div');
			this.bubbleDiv.className = 'bubble';

			document.body.appendChild(this.bubbleDiv);
		}
	};
}());