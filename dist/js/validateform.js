//validateForm
var



function ValidateForm(form) {
	"use strict";

	var _ = this,
	submitFunc;

	_.$input = null;

	

	_.date = function() {
		var err = false,
		validDate = function(val) {
			var _reg = new RegExp("^([0-9]{2}).([0-9]{2}).([0-9]{4})$"),
			matches = _reg.exec(val);
			if (!matches) {
				return false;
			}
			var now = new Date(),
			cDate = new Date(matches[3], (matches[2] - 1), matches[1]);
			return ((cDate.getMonth() == (matches[2] - 1)) && (cDate.getDate() == matches[1]) && (cDate.getFullYear() == matches[3]) && (cDate.valueOf() < now.valueOf()));
		};

		if (validDate(_.$input.val())) {
			errorTip(_$, false);
		} else {
			errorTip(_$, true, 2);
			err = true;
		}

		return err;
	}

	_.email = function() {
		var err = false;

		if (/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.$input.val())) {
			errorTip(_$, false);
		} else {
			errorTip(_$, true, 2);
			err = true;
		}

		return err;
	}

	_.tel = function() {
		var err = false;

		if (/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.$input.val())) {
			errorTip(_$, false);
		} else {
			errorTip(_$, true, 2);
			err = true;
		}

		return err;
	}

	_.pass = function() {
		var err = false,
		minLng = _.$input.attr('data-min-length');

		if (minLng && _.$input.val().length < minLng) {
			errorTip(_$, true, 2);
			err = true;
		} else {
			errorTip(_$, false);
		}

		return err;
	}

	_.select = function($inp) {
		var err = false;
		_.$input = $inp;
		if (_.$input.attr('data-required') && _.$input.val().length < 1) {
			errorTip(_$, true);
			err = true;
		} else {
			errorTip(_$, false);
		}
		return err;
	}

	function validateOnInput(_inp) {

		_.$input = $(_inp);

		var inpType = _.$input.attr('data-type'),
		inpVal = _.$input.val();

		if (_.$input.hasClass('tested')) {
			if (_.$input.attr('data-required') && !inpVal.length) {
				errorTip(_$, true);
			} else if (inpVal.length && inpType) {
				_[inpType]();
			} else {
				errorTip(_$, false);
			}
		}

	}

	function validateOnBlur(_inp) {

		_.$input = $(_inp);

		_.$input.addClass('tested');

		var inpType = _.$input.attr('data-type'),
		inpVal = _.$input.val();

		if (_.$input.attr('data-required') && !inpVal.length) {
			errorTip(_$, true);
		} else if (inpVal.length && inpType) {
			_[inpType]();
		} else {
			errorTip(_$, false);
		}

	}

	_.file = function(_inp) {
		_.$input = $(_inp);

		var err = false,
		errCount = {type: 0, size: 0},
		filesArr = _.$input[0].files,
		type = _.$input.attr('data-type'),
		maxSize = +_.$input.attr('data-max-size');

		for (var i = 0; i < filesArr.length; i++) {
			if (!filesArr[i].type.match(type)) {
				errCount.type++;
			}
			if (filesArr[i].size > maxSize) {
				errCount.size++;
			}
		}

		if (errCount.type) {
			errorTip(_$, true, 2);
			err = true;
		} else if (errCount.size) {
			errorTip(_$, true, 3);
			err = true;
		} else {
			errorTip(_$, false);
		}

		return err;
	}

	function actSubmitBtn(_form, st) {
		var $button = $(_form).find('button[type="submit"], input[type="submit"]');

		if (st) {
			$button.prop('disabled', false);
		} else {
			$button.prop('disabled', true);
		}
	}

	

	_.submit = function(fun) {
		submitFunc = fun;
	}


	$('body').on('blur', form +' input[type="text"], '+ form +' input[type="password"], '+ form +' textarea', function() {
		validateOnBlur(this);
	});

	$('body').on('input', form +' input[type="text"], '+ form +' input[type="password"], '+ form +' textarea', function() {
		validateOnInput(this);
	});

	$('body').on('change', form +' input[type="file"]', function() {
		_.file(this);
	});

	$('body').on('submit', form, function() {

		var _form = this;

		if (validate(_form)) {
			actSubmitBtn(_form, false);
			$(_form).addClass('form_sending');

			if (submitFunc !== undefined) {

				submitFunc(_form, function(obj) {
					obj = obj || {};
					actSubmitBtn(_form, obj.unlockButton);
					if (obj.clearForm == true) {
						clearForm(_form);
					}
					$(_form).removeClass('form_sending');
				});

			} else {
				return true;
			}
		}

		return false;
	});

}



function validate(parent) {
	"use strict";

	var $par = $(parent),
	err = 0;

	$par.find('input[type="text"], input[type="password"], textarea').each(function() {
		var _$ = $(this);

		if (!_$.is(':hidden')) {

			var type = _$.attr('data-type'),
			inpVal = _$.val();

			_$.addClass('tested');

			if (_$.attr('data-required') && !inpVal.length) {
				errorTip(_$, true);
				err++;
			} else if (inpVal.length) {
				errorTip(_$, false);
				if (type && _[type]()) {
					err++;
				}
			} else {
				errorTip(_$, false);
			}

		}

	});

	$par.find('.form__select-input').each(function() {
		var hidden = $(this).closest('.form__field_hidden, .form__fieldset_hidden');
		if (!hidden.length && _.select($(this))) {
			err++;
		}
	});

	$par.find('input[type="checkbox"]').each(function() {
		var _$ = $(this);

		if (!_$.is(':hidden')) {

			if (_$.attr('data-required') && !_$.prop('checked')) {
				errorTip(_$, true);
				err++;
			} else {
				errorTip(_$, false);
			}

		}

	});

	$par.find('.form__chbox-group').each(function() {
		var i = 0,
		_$ = $(this);

		if (!_$.is(':hidden')) {
			_$.find('input[type="checkbox"]').each(function() {
				if ($(this).prop('checked')) {
					i++;
				}

			});

			if (i < _$.attr('data-min')) {
				_$.addClass('form__chbox-group_error');
				err++;
			} else {
				_$.removeClass('form__chbox-group_error');
			}
		}
	});

	$par.find('.form__radio-group').each(function() {
		var e = true,
		_$ = $(this);

		if (!_$.is(':hidden')) {
			_$.find('input[type="radio"]').each(function() {
				if ($(this).prop('checked')) {
					e = false;
				}
			});

			if (e) {
				_$.addClass('form__radio-group_error');
				err++;
			} else {
				_$.removeClass('form__radio-group_error');
			}
		}
	});

	$par.find('input[type="file"]').each(function() {
		var _$ = $(this);

		if (!_$.is(':hidden')) {

			_$.addClass('tested');

			if (_$.attr('data-required') && !_$[0].files.length) {
				errorTip(_$, true);
				err++;
			} else {
				errorTip(_$, false);
				if (_.file(this)) {
					err++;
				}
			}

		}

	});


	$par.find('.form__text-input[data-pass-compare-input]').each(function() {
		var _$ = $(this),
		inpVal = _$.val();

		if (inpVal.length) {
			if (inpVal !== $(_$.attr('data-pass-compare-input')).val()) {
				errorTip(_$, true, 2);
				err++;
			} else {
				errorTip(_$, false);
			}
		}

	});


	if (err) {
		$par.addClass('form_error');
	} else {
		$par.removeClass('form_error');
	}

	return (err) ? false : true;
}


function errorTip($inp, err, errInd, errorTxt) {
	"use strict";

	var $field = $inp.closest('.form__field'),
	$errTip = $field.find('.form__error-tip');

	if (err) {

		$field.addClass('form__field_error');

		function fixFirstErr() {
			if (!$errTip.attr('data-first-error-text')) {
				$errTip.attr('data-first-error-text', $errTip.html());
			}
		}

		switch (errInd) {
			case 2:

			fixFirstErr();
			$errTip.html($errTip.attr('data-second-error-text'));

			break;

			case 3:

			fixFirstErr();
			$errTip.html($errTip.attr('data-third-error-text'));

			break;

			case 'custom':

			fixFirstErr();
			$errTip.html(errorTxt);

			break;

			default:

			if ($errTip.attr('data-first-error-text')) {
				$errTip.html($errTip.attr('data-first-error-text'));
			}

			break;

		}

	} else {
		$field.removeClass('form__field_error');
	}
}

ValidateForm.prototype.customErrorTip = function($inp, errorTxt) {
	"use strict";

	var _ = this;

	_.$input = $inp;
	errorTip(_$, true, 'custom', errorTxt);
}

function clearForm(_form) {
	var $form = $(_form);
	$form.find('.form__text-input, .form__textarea').val('');
	$form.find('.custom-placeholder').attr('style','');
	$form.find('.form__textarea-mirror').html('');
}