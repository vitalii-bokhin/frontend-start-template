var Numberspin;

(function() {
	'use strict';

	Numberspin = function(options) {
		const opt = options || {};

		this.elements = document.querySelectorAll(opt.elemSel);
		this.values = [];

		for (var i = 0; i < this.elements.length; i++) {
			this.values[i] = +this.elements[i].innerHTML.replace(/\s/g, '');
			this.elements[i].innerHTML = 0;
		}

		function draw(elem, num) {
			if (opt.format) {
				const numStr = String(num);

				elem.innerHTML = numStr.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
			} else {
				elem.innerHTML = num;
			}
		}

		this.animate = function(duration) {
			animate((progress) => {
				for (var i = 0; i < this.elements.length; i++) {
					let num = Math.round(this.values[i] * progress);

					if (num < 0) {
						num = 0;
					}

					draw(this.elements[i], num);
				}
			}, duration);
		}
	}
})();