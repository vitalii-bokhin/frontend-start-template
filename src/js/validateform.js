//validateForm
var ValidateForm;

(function() {
	"use strict";

	ValidateForm = {

		$input: null,

		errorTip: function(err, errInd) {
			var _ = this, 
			$field = _.$input.closest('.form__field'),
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

		},

		customErrorTip: function($inp, errorTxt) {
			var _ = this;

			_.$input = $inp;
			_.errorTip(true, 'custom', errorTxt);
		},

		date: function() {
			var _ = this,
			err = false,
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
				_.errorTip(true, 2);
				err = true;
			} else {
				_.errorTip(false);
			}

			return err;
		},

		email: function() {
			var _ = this,
			err = false;

			if (!/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.$input.val())) {
				_.errorTip(true, 2);
				err = true;
			} else {
				_.errorTip(false);
			}

			return err;
		},

		tel: function() {
			var _ = this,
			err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.$input.val())) {
				_.errorTip(true, 2);
				err = true;
			} else {
				_.errorTip(false);
			}

			return err;
		},

		pass: function() {
			var _ = this,
			err = false,
			minLng = _.$input.attr('data-min-length');

			if (minLng && _.$input.val().length < minLng) {
				_.errorTip(true, 2);
				err = true;
			} else {
				_.errorTip(false);
			}

			return err;
		},

		select: function($inp) {
			var _ = this,
			err = false;

			_.$input = $inp;

			if (_.$input.hasClass('tested')) {
				if (_.$input.attr('data-required') && !_.$input.val().length) {
					_.errorTip(true);
					err = true;
				} else {
					_.errorTip(false);
				}
			}

			return err;
		},

		validateOnInput: function(_inp) {
			var _ = this;

			_.$input = $(_inp);

			var inpType = _.$input.attr('data-type'),
			inpVal = _.$input.val();

			if (_.$input.hasClass('tested')) {
				if (_.$input.attr('data-required') && !inpVal.length) {
					_.errorTip(true);
				} else if (inpVal.length && inpType) {
					_[inpType]();
				} else {
					_.errorTip(false);
				}
			}

		},

		validateOnBlur: function(_inp) {
			var _ = this;

			_.$input = $(_inp);

			_.$input.addClass('tested');

			var inpType = _.$input.attr('data-type'),
			inpVal = _.$input.val();

			if (_.$input.attr('data-required') && !inpVal.length) {
				_.errorTip(true);
			} else if (inpVal.length && inpType) {
				_[inpType]();
			} else {
				_.errorTip(false);
			}

		},

		file: function(_inp) {
			var _ = this;

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
		},

		validate: function(form) {
			var _ = this,
			$form = $(form),
			err = 0;

			$form.find('input[type="text"], input[type="password"], textarea').each(function() {
				_.$input = $(this);

				if (!_.$input.is(':hidden')) {

					var type = _.$input.attr('data-type'),
					inpVal = _.$input.val();

					_.$input.addClass('tested');

					if (inpVal.length) {
						if (type && _[type]()) {
							err++;
						}
					} else if (_.$input.attr('data-required')) {
						_.errorTip(true);
						err++;
					} else {
						_.errorTip(false);
					}

				}

			});

			$form.find('.custom-select__input').each(function() {
				_.$input = $(this);

				if (!_.$input.parent().is(':hidden')) {
					_.$input.addClass('tested');

					if (_.$input.attr('data-required') && !_.$input.val().length) {
						_.errorTip(true);
						err++;
					} else {
						_.errorTip(false);
					}

				}

			});

			$form.find('input[type="checkbox"]').each(function() {
				_.$input = $(this);

				if (!_.$input.is(':hidden')) {

					if (_.$input.attr('data-required') && !_.$input.prop('checked')) {
						_.errorTip(true);
						err++;
					} else {
						_.errorTip(false);
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

					if (_.$input[0].files.length) {
						if (_.file(this)) {
							err++;
						}
					} else if (_.$input.attr('data-required')) {
						_.errorTip(true);
						err++;
					} else {
						_.errorTip(false);
					}

				}

			});

			$form.find('.form__text-input[data-pass-compare-input]').each(function() {
				_.$input = $(this);

				var inpVal = _.$input.val();

				if (inpVal.length) {
					if (inpVal !== $(_.$input.attr('data-pass-compare-input')).val()) {
						_.errorTip(true, 2);
						err++;
					} else {
						_.errorTip(false);
					}
				}

			});

			if (err) {
				$form.addClass('form_error');
			} else {
				$form.removeClass('form_error');
			}

			return (err) ? false : true;
		},

		actSubmitBtn: function(_form, st) {
			var $button = $(_form).find('button[type="submit"], input[type="submit"]');
			if (st) {
				$button.prop('disabled', false);
			} else {
				$button.prop('disabled', true);
			}
		},

		clearForm: function(_form) {
			var $form = $(_form);
			$form.find('input[type="text"], input[type="password"], textarea').val('');
			$form.find('.custom-placeholder').attr('style','');
			$form.find('.form__textarea-mirror').html('');
		},

		submit: function(_form, fun) {
			var _ = this;

			$(_form).addClass('form_sending');

			fun(_form, function(obj) {
				obj = obj || {};

				_.actSubmitBtn(_form, obj.unlockButton);

				if (obj.clearForm == true) {
					_.clearForm(_form);
				}

				$(_form).removeClass('form_sending');
			});
		},

		init: function(form, fun) {
			var _ = this;

			$('body').on('input', form +' input[type="text"],'+ form +' input[type="password"],'+ form +' textarea', function() {

				_.validateOnInput(this);

			}).on('blur', form +' input[type="text"],'+ form +' input[type="password"],'+ form +' textarea', function() {

				_.validateOnBlur(this);

			}).on('change', form +' input[type="file"]', function() {

				_.file(this);

			}).on('submit', form, function() {
				var _$ = this;

				if (_.validate(_$)) {
					_.actSubmitBtn(_$, false);

					if (fun !== undefined) {
						_.submit(_$, fun);
					} else {
						return true;
					}
				}

				return false;
			});

		}

	};

})();