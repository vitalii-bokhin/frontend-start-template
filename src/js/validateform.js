//validateForm
function ValidateForm(form) {

	var _ = this;

	_.$input = null;

	function errorTip(err, errInd, errorTxt) {
		var $field = _.$input.closest('.form__field'),
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

	_.customErrorTip = function($inp, errorTxt) {
		_.$input = $inp;
		errorTip(true, 'custom', errorTxt);
	}

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

		if (!validDate(_.$input.val())) {
			errorTip(true, 2);
			err = true;
		} else {
			errorTip(false);
		}

		return err;
	}

	_.email = function() {
		var err = false;

		if (!/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.$input.val())) {
			errorTip(true, 2);
			err = true;
		} else {
			errorTip(false);
		}

		return err;
	}

	_.tel = function() {
		var err = false;

		if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.$input.val())) {
			errorTip(true, 2);
			err = true;
		} else {
			errorTip(false);
		}

		return err;
	}

	_.pass = function() {
		var err = false,
		minLng = _.$input.attr('data-min-length');

		if (minLng && _.$input.val().length < minLng) {
			errorTip(true, 2);
			err = true;
		} else {
			errorTip(false);
		}

		return err;
	}

	_.select = function($inp) {
		var err = false;
		_.$input = $inp;
		if (_.$input.attr('data-required') && _.$input.val().length < 1) {
			errorTip(true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	function validateOnInput(_inp) {

		_.$input = $(_inp);

		var inpType = _.$input.attr('data-type'),
		inpVal = _.$input.val();

		if (_.$input.hasClass('tested')) {
			if (_.$input.attr('data-required') && !inpVal.length) {
				errorTip(true);
			} else if (inpVal.length && inpType) {
				_[inpType]();
			} else {
				errorTip(false);
			}
		}

	}

	function validateOnBlur(_inp) {

		_.$input = $(_inp);

		_.$input.addClass('tested');

		var inpType = _.$input.attr('data-type'),
		inpVal = _.$input.val();

		if (_.$input.attr('data-required') && !inpVal.length) {
			errorTip(true);
		} else if (inpVal.length && inpType) {
			_[inpType]();
		} else {
			errorTip(false);
		}

	}

	_.file = function(_inp) {
		_.$input = $(_inp);

		var err = false,
		file = _.$input[0].files[0];

		if (file) {
			var type = _.$input.attr('data-type'),
			fileName = file.name,
			fileSize = (file.size / 1024 / 1024).toFixed(2),
			fileExt = (function(fileName){
				var arr = fileName.split('.');
				return arr[arr.length-1];
			})(fileName);

			if (!file.type.match(type)) {
				errorTip(true, 2);
				err = true;
			} else {
				errorTip(false);
			}
		}

		return err;
	}

	_.fieldset = function($el) {
		return validate($el);
	}

	function validate(form) {

		var $form = $(form),
		err = 0;

		$form.find('input[type="text"], input[type="password"], textarea').each(function() {
			_.$input = $(this);

			if (!_.$input.is(':hidden')) {

				var type = _.$input.attr('data-type'),
				inpVal = _.$input.val();

				_.$input.addClass('tested');

				if (_.$input.attr('data-required') && !inpVal.length) {
					errorTip(true);
					err++;
				} else if (inpVal.length) {
					errorTip(false);
					if (type && _[type]()) {
						err++;
					}
				} else {
					errorTip(false);
				}

			}

		});

		$form.find('.form__select-input').each(function() {
			var hidden = $(this).closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length && _.select($(this))) {
				err++;
			}
		});

		$form.find('input[type="checkbox"]').each(function() {
			_.$input = $(this);

			if (!_.$input.is(':hidden')) {

				if (_.$input.attr('data-required') && !_.$input.prop('checked')) {
					errorTip(true);
					err++;
				} else {
					errorTip(false);
				}

			}

		});

		$form.find('.form__chbox-group').each(function() {
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

		$form.find('.form__radio-group').each(function() {
			var e = true,
			_$ = $(this),
			hidden = _$.closest('.form__field_hidden, .form__fieldset_hidden');

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

		$form.find('input[type="file"]').each(function() {
			_.$input = $(this);

			if (!_.$input.is(':hidden')) {

				_.$input.addClass('tested');

				if (_.$input.attr('data-required') && !_.$input[0].files.length) {
					errorTip(true);
					err++;
				} else {
					errorTip(false);
					if (_.file(this)) {
						err++;
					}
				}

			}

		});


		$form.find('.form__text-input[data-pass-compare-input]').each(function() {
			_.$input = $(this);

			var inpVal = _.$input.val();

			if (inpVal.length) {
				if (inpVal !== $(_.$input.attr('data-pass-compare-input')).val()) {
					errorTip(true, 2);
					err++;
				} else {
					errorTip(false);
				}
			}
			
		});
		

		if (err) {
			$form.addClass('form_error');
		} else {
			$form.removeClass('form_error');
		}

		return !err;
	}

	function actSubmitBtn(_form, st) {
		var $button = $(_form).find('button[type="submit"], input[type="submit"]');

		if (!$button.is(':hidden')) {
			if (st) {
				$button.prop('disabled', false).removeClass('form__button_loading');
			} else {
				$button.prop('disabled', true).addClass('form__button_loading');
			}
		}
	}

	function clearForm(_form) {
		var $form = $(_form);
		$form.find('.form__text-input, .form__textarea').val('');
		$form.find('.overlabel-apply').attr('style','');
		$form.find('.form__textarea-mirror').html('');
	}

	_.submit = function(fun) {

		$('body').on('input', form +' input[type="text"],'+ form +' input[type="password"],'+ form +' textarea', function() {
			validateOnInput(this);
		});

		$('body').on('blur', form +' input[type="text"],'+ form +' input[type="password"],'+ form +' textarea', function() {
			validateOnBlur(this);
		});

		$('body').on('change', form +' input[type="file"]', function() {
			_.file(this);
		});
		
		$('body').on('submit', form, function() {
			var _form = this;

			if (validate(_form)) {
				actSubmitBtn(_form, false);
				$(_form).addClass('form_sending');
				if (fun !== undefined) {
					fun(_form, function(obj) {
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

	return this;
}