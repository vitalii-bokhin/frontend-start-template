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

		function submit(e) {
			e.preventDefault();
			this.onSubmit.bind(form)();
		}

		form.addEventListener('submit', submit.bind(this));

	}


	

}());