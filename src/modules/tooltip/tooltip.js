/*
tooltip.init({
	element: '.js-tooltip'
});
*/

; var ToolTip;

(function() {
	'use strict';

	ToolTip = {
		tooltipDiv: null,
		tooltipClass: null,
		canBeHidden: true,

		show: function(elem) {
			this.tooltipDiv.innerHTML = elem.getAttribute('data-tooltip');

			this.tooltipClass = elem.getAttribute('data-tooltip-class');

			if (this.tooltipClass) {
				this.tooltipDiv.classList.add(this.tooltipClass);
			}

			var bubleStyle = this.tooltipDiv.style, 
			tooltipMinWidth = 100,
			tooltipPotentWidth = window.innerWidth - (elem.getBoundingClientRect().left + elem.offsetWidth) - 10,
			coordX = elem.getBoundingClientRect().left + elem.offsetWidth;

			if (tooltipPotentWidth < tooltipMinWidth) {
				tooltipPotentWidth = tooltipMinWidth;

				coordX = window.innerWidth - tooltipMinWidth - 10;
			}

			bubleStyle.width = tooltipPotentWidth +'px';
			bubleStyle.left = coordX +'px';

			var coordY = elem.getBoundingClientRect().top + pageYOffset - this.tooltipDiv.offsetHeight;

			bubleStyle.top = coordY +'px';

			this.tooltipDiv.classList.add('tooltip_visible');
		},

		hide: function() {
			this.tooltipDiv.classList.remove('tooltip_visible');
			this.tooltipDiv.removeAttribute('style');
			this.tooltipDiv.innerHTML = '';

			if (this.tooltipClass) {
				this.tooltipDiv.classList.remove(this.tooltipClass);

				this.tooltipClass = null;
			}
		},

		init: function(opt) {
			var mouseOver, mouseOut;

			mouseOut = (e) => {
				setTimeout(() => {
					if (document.ontouchstart !== undefined) {
						this.hide();

						document.removeEventListener('touchstart', mouseOut);
					} else {
						if ((e.target.closest(opt.element) && this.canBeHidden) || e.target.closest('.tooltip')) {
							this.hide();

							this.canBeHidden = true;
						}
					}
				}, 21);
			}

			mouseOver = (e) => {
				var elem = e.target.closest(opt.element);
				
				if (!elem) return;

				if (document.ontouchstart !== undefined) {
					
					this.show(elem);

					document.addEventListener('touchstart', mouseOut);
				} else {
					if (elem) {
						this.show(elem);
					} else if (e.target.closest('.tooltip')) {
						this.canBeHidden = false;
					}
				}
			}

			if (document.ontouchstart !== undefined) {
				document.addEventListener('click', mouseOver);
			} else {
				document.addEventListener('mouseover', mouseOver);
				document.addEventListener('mouseout', mouseOut);
			}

			//add tooltip to DOM
			this.tooltipDiv = document.createElement('div');
			this.tooltipDiv.className = 'tooltip';

			document.body.appendChild(this.tooltipDiv);
		}
	};
})();