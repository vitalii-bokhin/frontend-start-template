; var Bubble;

(function() {
	"use strict";

	Bubble = {
		bubbleDiv: null,

		show: function(elem) {
			this.bubbleDiv.classList.add('bubble_visible');

			
			if (this.bubbleDiv.offsetWidth > window.innerWidth) {
				this.bubbleDiv.style.width = (window.innerWidth - 20) +'px';
			}

			var coordX = elem.getBoundingClientRect().left + elem.offsetWidth,
			coordY = elem.getBoundingClientRect().top + pageYOffset - this.bubbleDiv.offsetHeight;



			if ((coordX + this.bubbleDiv.offsetWidth) > window.innerWidth) {
				coordX = coordX - (coordX + this.bubbleDiv.offsetWidth - window.innerWidth) - 10;
			}

			this.bubbleDiv.style.left = coordX +'px';

			this.bubbleDiv.style.top = coordY +'px';

			
		},

		hide: function() {
			this.bubbleDiv.classList.remove('bubble_visible');
		},

		init: function(opt) {
			if (window.innerWidth < 1200) {
				document.addEventListener('click', (e) => {
					var elem = e.target.closest(opt.element);

					if (elem) {
						e.preventDefault();

						this.show(elem);
					} else {
						this.hide();
					}
				});
			} else {
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
			}

			//add bubble to DOM
			this.bubbleDiv = document.createElement('div');
			this.bubbleDiv.className = 'bubble';

			document.body.appendChild(this.bubbleDiv);
		}
	};
}());