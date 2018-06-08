$(document).ready(function() {

	$('label').each(function(i) {
		var _$ = $(this),
		$sibLabel = _$.siblings('label'),
		$input = _$.siblings('input, textarea'),
		inpId = $input.attr('id');

		if (!_$.attr('for')) {
			var inpFor = (inpId) ? inpId : 'keylabel-'+ i;

			_$.attr('for', inpFor);
			$sibLabel.attr('for', inpFor);
			$input.attr('id', inpFor);
		}

	});

	$('body').on('change', 'input[type="checkbox"]', function() {
		var _$ = $(this),
		targetElements = _$.attr('data-target-elements');

		if (targetElements) {
			var $elem = $(targetElements);
			if (_$.prop('checked')) {
				$elem.show();
			} else {
				$elem.hide();
			}
		}

	});

	$('body').on('change', 'input[type="radio"]', function() {
		var name = $(this).attr('name');

		$('input[type="radio"][name="'+ name +'"]').each(function() {
			var _$ = $(this),
			targetElements = _$.attr('data-target-elements');

			if (targetElements) {
				var $elem = $(targetElements);
				if (_$.prop('checked')) {
					$elem.show();
				} else {
					$elem.hide();
				}
			}
			
		});

	});

	$('body').on('click', '.form__button', function() {
		var _$ = $(this),
		nextFsetItem = _$.attr('data-next-fieldset-item');

		if (nextFsetItem) {
			var $nextItem = $(nextFsetItem),
			$curItem = _$.closest('.fieldset__item');

			if (ValidateForm.validate($curItem)) {
				$curItem.addClass('fieldset__item_hidden');
				$nextItem.removeClass('fieldset__item_hidden');
			}
		}

	});

});

//formfactory
var Form;
(function() {
	"use strict";

	Form = function(formSelector) {

		this.onSubmit = null;

		var form = document.querySelector(formSelector);

		if (!form) {
			return;
		}

		//clear form
		function clear() {
			//clear inputs
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			elements.forEach(function(elem) {
				elem.value = '';
			});

			//show placeholders
			var elements = form.querySelectorAll('.custom-placeholder');

			elements.forEach(function(elem) {
				elem.removeAttribute('style');
			});

			//$form.querySelector('.form__textarea-mirror').html('');
		}

		//submit button
		function actSubmitBtn(st) {
			var elements = form.querySelectorAll('button[type="submit"], input[type="submit"]');

			elements.forEach(function(elem) {
				if (!isHidden(elem)) {
					if (st) {
						elem.removeAttribute('disabled');
					} else {
						elem.setAttribute('disabled', 'disable');
					}
				}
			});

		}

		//submit
		function submit(e) {

			if (ValidateForm.submit(form)) {

				actSubmitBtn(false);

				form.classList.add('form_sending');

				if (this.onSubmit) {
					e.preventDefault();

					this.onSubmit(form, function(obj) {
						obj = obj || {};

						actSubmitBtn(obj.unlockSubmitButton);

						form.classList.remove('form_sending');

						if (obj.clearForm == true) {
							clear();
						}

					});

				}

				form.classList.remove('form_error');

			} else {
				e.preventDefault();
				form.classList.add('form_error');
			}

		}

		//add submit event
		form.addEventListener('submit', submit.bind(this));

		ValidateForm.init(form);

	}
	

}());