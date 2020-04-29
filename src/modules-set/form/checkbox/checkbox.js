(function () {
	'use strict';

	//show element on checkbox change
	var ChangeCheckbox = {
		hideCssClass: 'hidden',
		opt: {},

		change: function (elem) {
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

		init: function (options) {
			options = options || {};

			this.opt.focusOnTarget = (options.focusOnTarget !== undefined) ? options.focusOnTarget : false;

			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="checkbox"]');

				if (elem) {
					this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		ChangeCheckbox.init({ focusOnTarget: true });
	});
})();