/*
Toggle.init(Str toggleSelector[, Str toggledClass (default - 'toggled')]);

Toggle.onChange = function(toggleElem, state) {
	// code...
}
*/

; var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',
		onChange: null,

		target: function(toggleElem, state) {
			var targetElements = document.querySelectorAll(toggleElem.getAttribute('data-target-elements'));

			if (!targetElements.length) {
				return;
			}

			if (state) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				//dependence elements
				if (toggleElem.hasAttribute('data-dependence-target-elements')) {
					var dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

					for (var i = 0; i < dependenceTargetElements.length; i++) {
						dependenceTargetElements[i].classList.remove(this.toggledClass);
					}
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}
			}
		},

		toggle: function(toggleElem) {
			var state;

			if (toggleElem.classList.contains(this.toggledClass)) {
				toggleElem.classList.remove(this.toggledClass);

				state = false;

				if (toggleElem.hasAttribute('data-first-text')) {
					toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
				}
			} else {
				toggleElem.classList.add(this.toggledClass);

				state = true;

				if (toggleElem.hasAttribute('data-second-text')) {
					toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);

					toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
				}
			}

			//target
			if (toggleElem.hasAttribute('data-target-elements')) {
				this.target(toggleElem, state);
			}

			//call onChange
			if (this.onChange) {
				this.onChange(toggleElem, state);
			}
		},

		init: function(toggleSelector, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
			document.addEventListener('click', (e) => {
				var toggleElem = e.target.closest(toggleSelector);

				if (toggleElem) {
					e.preventDefault();

					this.toggle(toggleElem);
				}
			});
		}
	};
})();