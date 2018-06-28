var Form, NextFieldset;

(function() {
	"use strict";

	//next fieldset
	NextFieldset = {

		next: function(elem) {
			var nextFieldset = (elem.hasAttribute('data-next-fieldset-item')) ? document.querySelector(elem.getAttribute('data-next-fieldset-item')) : false;

			if (!nextFieldset) {
				return;
			}

			var currentFieldset = elem.closest('.fieldset__item');

			if (ValidateForm.validate(currentFieldset)) {
				currentFieldset.classList.add('fieldset__item_hidden');
				nextFieldset.classList.remove('fieldset__item_hidden');
			}

		},

		init: function(form, elemStr) {
			form.addEventListener('click', (e) => {
				var elem = e.target.closest(elemStr);

				if (elem) {
					this.next(elem);
				}
			});
		}
	};

	//init forms
	Form = function(formSelector) {

		this.onSubmit = null;

		var form = document.querySelector(formSelector);

		if (!form) {
			return;
		}

		this.element = form;

		//clear form
		function clear() {
			//clear inputs
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				elem.value = '';
				CustomPlaceholder.hidePlaceholder(elem, false);
			}

			var textareaMirrors = form.querySelectorAll('.form__textarea-mirror');

			for (var i = 0; i < textareaMirrors.length; i++) {
				textareaMirrors[i].innerHTML = '';
			}

		}

		//submit button
		function actSubmitBtn(st) {
			var elements = form.querySelectorAll('button[type="submit"], input[type="submit"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.elementIsHidden()) {
					if (st) {
						elem.removeAttribute('disabled');
					} else {
						elem.setAttribute('disabled', 'disable');
					}
				}
			}

		}

		//submit
		form.addEventListener('submit', (e) => {
			if (this.onSubmit) {
				e.preventDefault();

				var sending = this.onSubmit(form, function(obj) {
					obj = obj || {};

					actSubmitBtn(obj.unlockSubmitButton);

					form.classList.remove('form_sending');

					if (obj.clearForm == true) {
						clear();
					}
				});

				if (sending) {
					actSubmitBtn(false);

					form.classList.add('form_sending');
				}

			}
		});

		
	}
	

}());