/*
Toggle.init(Str toggleSelector[, Str toggledClass (default - 'toggled')]);

Toggle.on = function(tglElem) {
	// code...
}

Toggle.off = function(tglElem) {
	// code...
}
*/

; var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',
		on: null,
		off: null,

		toggle: function(toggleElem) {
			var targetElements = document.querySelectorAll(toggleElem.getAttribute('data-target-elements'));

			if (!targetElements.length) {
				return;
			}

			if (toggleElem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				toggleElem.classList.remove(this.toggledClass);

				if (this.off) {
					this.off(toggleElem);
				}

				if (toggleElem.hasAttribute('data-first-text')) {
					toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				toggleElem.classList.add(this.toggledClass);

				if (this.on) {
					this.on(toggleElem);
				}

				if (toggleElem.hasAttribute('data-second-text')) {
					toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);

					toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
				}

				if (toggleElem.hasAttribute('data-dependence-target-elements')) {
					var dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

					for (var i = 0; i < dependenceTargetElements.length; i++) {
						dependenceTargetElements[i].classList.remove(this.toggledClass);
					}
				}
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