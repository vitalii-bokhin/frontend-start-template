; var Placeholder;

(function () {
	'use strict';

	Placeholder = {
		init: function (elementsStr) {
			var elements = document.querySelectorAll(elementsStr);

			if (!elements.length) return;

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.placeholder) {

					var elemFor = (elem.id) ? elem.id : 'placeholder-index-' + i,
						label = document.createElement('label');

					label.htmlFor = elemFor;
					label.className = 'placeholder';
					label.innerHTML = elem.placeholder;

					elem.parentElement.insertBefore(label, elem);

					elem.removeAttribute('placeholder');

					if (!elem.id) {
						elem.id = elemFor;
					}

				}

				if (elem.value.length) {
					this.hide(elem, true);
				}
			}

			//events
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hide(elem, true);
				}
			}, true);

			document.addEventListener('blur', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hide(elem, false);
				}
			}, true);
		},

		hide: function (elem, hide) {
			var label = document.querySelector('label.placeholder[for="' + elem.id + '"]');

			if (!label) return;

			if (hide) {
				label.style.display = 'none';

			} else if (!elem.value.length) {
				label.style.display = '';
			}
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		Placeholder.init('input[type="text"], input[type="number"], input[type="tel"], input[type="password"], textarea');
	});
})();