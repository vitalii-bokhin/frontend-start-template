/*
Toggle.init(Str button selector[, Str toggle class, (default - 'toggled') );

Toggle.role = function() {
	return {
		[data-role]: {
			on: function() {
				
			},
			off: function() {
					
			}
		},
	};
}
*/

; var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',
		role: null,

		toggle: function(elem) {
			var targetElements = document.querySelectorAll(elem.getAttribute('data-target-elements')),
			role = elem.getAttribute('data-role');

			if (!targetElements.length) {
				return;
			}

			if (elem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				elem.classList.remove(this.toggledClass);

				if (role && this.role) {
					this.role()[role].off();
				}

				if (elem.hasAttribute('data-first-text')) {
					elem.innerHTML = elem.getAttribute('data-first-text');
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				elem.classList.add(this.toggledClass);

				if (role && this.role) {
					this.role()[role].on();
				}

				if (elem.hasAttribute('data-second-text')) {
					elem.setAttribute('data-first-text', elem.innerHTML);

					elem.innerHTML = elem.getAttribute('data-second-text');
				}

				if (elem.hasAttribute('data-dependence-target-elements')) {
					var dependenceTargetElements = document.querySelectorAll(elem.getAttribute('data-dependence-target-elements'));

					for (var i = 0; i < dependenceTargetElements.length; i++) {
						dependenceTargetElements[i].classList.remove(this.toggledClass);
					}
				}
			}
		},

		init: function(elementStr, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
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