/* Checkbox.onChange(function(el, state) {
	// body
}); */

var Checkbox;

(function () {
	'use strict';

	//show element on checkbox change
	Checkbox = {
		hideCssClass: 'hidden',
		opt: {},
		onChangeSubscribers: [],

		init: function (options) {
			options = options || {};

			this.opt.focusOnTarget = (options.focusOnTarget !== undefined) ? options.focusOnTarget : false;

			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="checkbox"]');

				if (elem) {
					this.change(elem);
				}
			});
		},

		change: function (elem) {
			this.onChangeSubscribers.forEach(item => {
				item(elem, elem.checked);
			});
			
			var targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

			if (!targetElements.length) {
				return;
			}

			for (var i = 0; i < targetElements.length; i++) {
				var targetElem = targetElements[i];

				targetElem.style.display = (elem.checked) ? 'block' : 'none';

				if (elem.checked) {
					targetElem.classList.remove(this.hideCssClass);

					const inpEls = targetElem.querySelectorAll('input[type="text"]');

					for (var j = 0; j < inpEls.length; j++) {
						var inpEl = inpEls[j];

						inpEl.focus();
					}

				} else {
					targetElem.classList.add(this.hideCssClass);
				}
			}
		},

		onChange: function (fun) {
			if (typeof fun === 'function') {
				this.onChangeSubscribers.push(fun);
			}
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		Checkbox.init({ focusOnTarget: true });
	});
})();