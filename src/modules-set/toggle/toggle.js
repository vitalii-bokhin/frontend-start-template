/*
Toggle.init({
	button: '.js-tgl-btn',
	offButton: '.js-tgl-off',
	toggledClass: 'some-class' // def: toggled
});

Toggle.onChange(function (btnEl, targetElems, state) {
    // code...
});
*/

; var Toggle;

(function () {
	'use strict';

	Toggle = {
		toggledClass: 'toggled',
		onChangeSubscribers: [],

		target: function (btnEl, state) {
			var targetElements = document.querySelectorAll(btnEl.getAttribute('data-target-elements'));

			if (!targetElements.length) return;

			if (state) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}
			}

			//call onChange
			if (this.onChangeSubscribers.length) {
				this.onChangeSubscribers.forEach(function (item) {
					item(btnEl, targetElements, state);
				});
			}
		},

		toggle: function (toggleElem, off) {
			var state;

			if (toggleElem.classList.contains(this.toggledClass)) {
				toggleElem.classList.remove(this.toggledClass);

				state = false;

				if (toggleElem.hasAttribute('data-first-text')) {
					toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
				}
			} else if (!off) {
				if (toggleElem.getAttribute('data-type') != 'button') {
					toggleElem.classList.add(this.toggledClass);
				}

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

			if (!state) return;

			//dependence elements
			if (toggleElem.hasAttribute('data-dependence-target-elements')) {
				const dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

				for (let i = 0; i < dependenceTargetElements.length; i++) {
					const el = dependenceTargetElements[i];

					dependenceTargetElements[i].classList.remove(this.toggledClass);

					if (el.hasAttribute('data-target-elements')) {
						this.target(el, false);
					}
				}
			}
		},

		toggleOff: function (btnEl) {
			const targetEls = btnEl.getAttribute('data-target-elements'),
				toggleBtnEls = document.querySelectorAll('.' + this.toggledClass +
					'[data-target-elements*="' + targetEls + '"]');

			this.target(btnEl, false);

			for (let i = 0; i < toggleBtnEls.length; i++) {
				toggleBtnEls[i].classList.remove(this.toggledClass);
			}
		},

		onDocClickOff: function (e, targetBtnEl) {
			const toggleElements = document.querySelectorAll('[data-toggle-off="document"].' + this.toggledClass);

			for (let i = 0; i < toggleElements.length; i++) {
				const elem = toggleElements[i];

				if (targetBtnEl === elem) continue;

				if (elem.hasAttribute('data-target-elements')) {
					const targetSelectors = elem.getAttribute('data-target-elements');

					if (!e.target.closest(targetSelectors)) {
						this.toggle(elem, true);
					}
				} else {
					this.toggle(elem, true);
				}
			}
		},

		onChange: function (fun) {
			if (typeof fun === 'function') {
				this.onChangeSubscribers.push(fun);
			}
		},

		init: function (opt) {
			if (opt.toggledClass) {
				this.toggledClass = opt.toggledClass;
			}

			document.addEventListener('click', (e) => {
				const btnEl = e.target.closest(opt.button),
					offBtnEl = e.target.closest(opt.offButton);

				if (btnEl) {
					e.preventDefault();

					this.toggle(btnEl);
				} else if (offBtnEl) {
					e.preventDefault();

					this.toggleOff(offBtnEl);
				}

				this.onDocClickOff(e, btnEl);
			});
		}
	};
})();