//validateForm
function ValidateForm(form) {

	var _ = this;

	_.$input = null;

	function errorTip(err,sec,trd) {
		var Field = _.$input.closest('.form__field'),
		ErrTip = Field.find('.form__error-tip');

		if (!err) {
			Field.removeClass('form__field_error');
		} else {
			Field.addClass('form__field_error');

			if (trd) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-third-error-text'));

			} else if (sec) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-second-error-text'));

			} else {

				if (ErrTip.attr('data-first-error-text')) {
					ErrTip.html(ErrTip.attr('data-first-error-text'));
				}

			}
		}

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
			errorTip(true, true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	_.email = function() {
		var err = false;
		if (!/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.$input.val())) {
			errorTip(true, true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	_.tel = function() {
		var err = false;
		if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.$input.val())) {
			errorTip(true, true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	_.pass = function() {
		var err = false,
		lng = _.$input.attr('data-pass-length');

		if (_.$input.val().length < 1) {
			errorTip(true);
			err = true;
		} else if(lng && _.$input.val().length < lng) {
			errorTip(true, true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	_.select = function(inp) {
		var err = false;
		_.$input = inp;
		if (_.$input.attr('data-required') && _.$input.val().length < 1) {
			errorTip(true);
			err = true;
		} else {
			errorTip(false);
		}
		return err;
	}

	function validateOnInput(inp) {

		_.$input = $(inp);

		var type = _.$input.attr('data-type');

		if (_.$input.hasClass('tested')) {
			if (_.$input.attr('data-required') && _.$input.val().length < 1) {
				errorTip(true);
			} else if (_.$input.val().length > 0 && type) {
				_[type]();
			} else {
				errorTip(false);
			}
		}

	}

	function validateOnBlur(inp) {

		_.$input = $(inp);

		_.$input.addClass('tested');

		var type = _.$input.attr('data-type');

		if (_.$input.attr('data-required') && _.$input.val().length < 1) {
			errorTip(true);
		} else if (_.$input.val().length > 0 && type) {
			_[type]();
		} else {
			errorTip(false);
		}

	}

	_.fUploaded = false;

	_.file = function(inp,e) {
		var _ = this;
		_.$input = $(inp);
		var _imgBlock = _.$input.closest('.form__field').find('.form__file-image'),
		file = e.target.files[0],
		fileName = file.name,
		fileSize = (file.size / 1024 / 1024).toFixed(2),
		ext = (function(fN){
			var nArr = fN.split('.');
			return nArr[nArr.length-1];
		})(fileName);

		if (_imgBlock.length) {
			if (!file.type.match('image.*')) {
				errorTip(true);
				_.fUploaded = false;
			} else {
				var reader = new FileReader();
				reader.onload = function(e) {
					_imgBlock.html('<img src="'+ e.target.result +'">');
				};
				reader.readAsDataURL(file);
				errorTip(false);
				_.fUploaded = true;
			}
		}
	};

	_.step = function(el, fun) {
		if (this.validate(el)) {
			fun();
		}
	};

	function submitButtonAction(form, st) {
		var $form = $(form),
		$button = $form.find('button[type="submit"], input[type="submit"]');

		if (st) {
			$button.prop('disabled', false).removeClass('form__button_loading');
		} else {
			$button.prop('disabled', true).addClass('form__button_loading');
		}
	}

	function clearForm(form, st) {
		var $form = $(form);

		if (st) {
			$form.find('.form__text-input, .form__textarea').val('');
			$form.find('.overlabel-apply').attr('style','');
			$form.find('.form__textarea-mirror').html('');
		}
	}

	function validate(form) {

		var $form = $(form),
		err = 0;

		$form.find('input[type="text"], textarea').each(function() {
			_.$input = $(this);

			if (!_.$input.is(':hidden')) {

				var type = _.$input.attr('data-type');
				_.$input.addClass('tested');

				if (_.$input.attr('data-required') && _.$input.val().length < 1) {
					errorTip(true);
					err++;
				} else if (_.$input.val().length > 0) {
					errorTip(false);
					if (type && _[type]()) {
						err++;
					}
				} else {
					errorTip(false);
				}

				if (type == 'pass' && _.pass()) {
					err++;
				}

			}

		});

		$form.find('.form__select-input').each(function() {
			var hidden = $(this).closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length && _.select($(this))) {
				err++;
			}
		});

		$form.find('.form__chbox-input').each(function() {
			var _inp = $(this),
			_chbox = _inp.closest('.form__chbox'),
			hidden = _inp.closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length) {
				if(_inp.attr('data-required') && !_inp.prop('checked')){
					_chbox.addClass('form__chbox_error');
					err++;
				} else {
					_chbox.removeClass('form__chbox_error');
				}
			}

		});

		$form.find('.form__chbox-group').each(function() {
			var i = 0,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__chbox-input').each(function() {
					if ($(this).prop('checked')) {
						i++;
					}
				});

				if (i < _g.attr('data-min')) {
					_g.addClass('form__chbox-group_error');
					err++;
				} else {
					_g.removeClass('form__chbox-group_error');
				}
			}
		});

		$form.find('.form__radio-group').each(function() {
			var e = true,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__radio-input').each(function() {
					if ($(this).prop('checked')) {
						e = false;
					}
				});

				if (e) {
					_g.addClass('form__radio-group_error');
					err++;
				} else {
					_g.removeClass('form__radio-group_error');
				}
			}
		});

		if ($form.find('.form__file-input').length) {
			_.$input = $form.find('.form__file-input');
			if (!_.fUploaded) {
				errorTip(true);
				err++;
			} else {
				errorTip(false);
			}
		}

		if ($form.find('.form__text-input[data-pass-compare]').length) {
			$form.find('.form__text-input[data-pass-compare]').each(function() {
				var gr = $(this).attr('data-pass-compare');
				_.$input = $form.find('.form__text-input[data-pass-compare="'+ gr +'"]');
				if (!_.pass()) {
					if (_.$input.eq(0).val() != _.$input.eq(1).val()) {
						errorTip(true, true, true);
					} else {
						errorTip(false);
					}
				}
			});
		}

		if (!err) {
			$form.removeClass('form_error');
		} else {
			$form.addClass('form_error');
		}

		return !err;
	}

	_.submit = function(fun) {
		var _ = this;

		$('body').on('change', form +' input[type="file"]', function(e) {
			_.file(this, e);
		});

		$('body').on('input', form +' input[type="text"], '+ form +' textarea', function() {
			validateOnInput(this);
		});

		$('body').on('blur', form +' input[type="text"], '+ form +' textarea', function() {
			validateOnBlur(this);
		});
		
		$('body').on('submit', form, function() {
			var _form = this;

			if (validate(_form)) {
				submitButtonAction(_form, false);
				if (fun !== undefined) {
					fun(_form, function(unlBtn, clForm) {
						submitButtonAction(_form, unlBtn);
						clearForm(_form, clForm);
					});
				} else {
					return true;
				}
			}

			return false;
		});

	};

	return this;
}