/*
* call Accord.init(Str button selector);
*/
var Accord;

(function() {
	'use strict';

	Accord = {
		toggle: function(elem) {
			var contentElem = elem.nextElementSibling;

			if (elem.classList.contains('accord__button_active')) {
				contentElem.style.height = 0;

				elem.classList.remove('accord__button_active');
			} else {
				var mainElem = elem.closest('.accord'),
				allButtonElem = mainElem.querySelectorAll('.accord__button'),
				allContentElem = mainElem.querySelectorAll('.accord__content');

				for (var i = 0; i < allButtonElem.length; i++) {
					allButtonElem[i].classList.remove('accord__button_active');
					allContentElem[i].style.height = 0;
				}

				contentElem.style.height = contentElem.scrollHeight +'px';

				elem.classList.add('accord__button_active');
			}
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.toggle(elem);
			});
		}
	};
})();