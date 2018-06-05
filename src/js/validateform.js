//validateForm
var ValidateForm;

(function() {
	"use strict";

	ValidateForm = {

		input: null,

		errorTip: function(err, errInd) {
			var field = this.input.closest('.form__field'),
			errTip = field.querySelector('.form__error-tip');

			if (err) {

				field.classList.add('form__field_error');

				if (errInd) {
					if (!errTip.getAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = errTip.getAttribute('data-error-text-'+ errInd);
				}

			} else {
				field.classList.remove('form__field_error');
			}

		},

		customErrorTip: function($inp, errorTxt) {
			var _ = this;

			_.$input = $inp;
			_.errorTip(true, 'custom', errorTxt);
		},

		date: function() {
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

			if (!validDate(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		email: function() {
			var err = false;

			if (!/^[a-z0-9]+[\w\-\.]*@[\w\-]{2,}\.[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		tel: function() {
			var err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		pass: function() {
			var err = false,
			minLng = this.input.getAttribute('data-min-length');

			if (minLng && this.input.value.length < minLng) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		select: function($inp) {
			var _ = this,
			err = false;

			_.$input = $inp;

			if (_.$input.attr('data-required') && !_.$input.val().length) {
				_.errorTip(true);
				err = true;
			} else {
				_.errorTip(false);
			}
			
			return err;
		},

		validateOnInputOrBlur: function(e) {

			var elem = e.target.closest('input[type="text"], input[type="password"], textarea');

			if (!elem) {
				return;
			}

			this.input = elem;

			if (e.type == 'blur') {
				elem.setAttribute('data-tested', 'true');
			} else if (e.type == 'input' && !elem.getAttribute('data-tested')) {
				return;
			}

			var type = elem.getAttribute('data-type'),
			val = elem.value;

			if (elem.getAttribute('data-required') && !val.length) {
				this.errorTip(true);
			} else if (val.length && type) {
				this[type]();
			} else {
				this.errorTip(false);
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
				_.errorTip(true, 2);
				err = true;
			} else if (errCount.size) {
				_.errorTip(true, 3);
				err = true;
			} else {
				_.errorTip(false);
			}

			return err;
		},

		validate: function(form) {
			var err = 0;

			//func for check elem is visible
			function isHidden(elem) {
				var hidden = false;

				while (elem) {

					if (!elem) {
						break;
					}

					var compStyles = getComputedStyle(elem);

					if (compStyles.display == 'none' || compStyles.visibility == 'hidden' || compStyles.opacity == '0') {
						hidden = true;
						break;
					}

					elem = elem.parentElement;

				}

				return hidden;
			}

			//text, password, textarea
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (isHidden(elem)) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				var inpType = elem.getAttribute('data-type');

				if (elem.value.length) {
					if (inpType && this[inpType]()) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//select
			var elements = form.querySelectorAll('.custom-select__input');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (isHidden(elem)) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				if (elem.getAttribute('data-required') && !elem.value.length) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//checkboxes
			var elements = form.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (isHidden(elem)) {
					continue;
				}

				this.input = elem;

				console.dir(elem);

				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//checkbox group
			var groups = form.querySelectorAll('.form__chbox-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElements = 0;

				if (isHidden(group)) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="checkbox"]');

				elements.forEach(function(elem) {
					if (elem.checked) {
						checkedElements++;
					}
				});

				if (checkedElements < group.getAttribute('data-min')) {
					group.classList.add('form__chbox-group_error');
					err++;
				} else {
					group.classList.remove('form__chbox-group_error');
				}

			}

			//radio group
			var groups = form.querySelectorAll('.form__radio-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElement = false;

				if (isHidden(group)) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="radio"]');

				elements.forEach(function(elem) {
					if (elem.checked) {
						checkedElement = true;
					}
				});

				if (!checkedElement) {
					group.classList.add('form__radio-group_error');
					err++;
				} else {
					group.classList.remove('form__radio-group_error');
				}

			}

			//file
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

			//passwords compare
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

			//error
			if (err) {
				$form.addClass('form_error');
			} else {
				$form.removeClass('form_error');
			}

			return (err) ? false : true;
		},

		actSubmitBtn: function(_form, st) {
			var $button = $(_form).find('button[type="submit"], input[type="submit"]');

			if (!$button.is(':hidden')) {
				if (st) {
					$button.prop('disabled', false);
				} else {
					$button.prop('disabled', true);
				}
			}
			
		},

		clearForm: function(_form) {
			var $form = $(_form);
			$form.find('input[type="text"], input[type="password"], textarea').val('');
			$form.find('.custom-placeholder').attr('style','');
			$form.find('.form__textarea-mirror').html('');
		},

		submit: function(form) {

			return this.validate(form);

			//form.addClass('form_sending');

			

			/*fun(_form, function(obj) {
				obj = obj || {};

				_.actSubmitBtn(_form, obj.unlockButton);

				if (obj.clearForm == true) {
					_.clearForm(_form);
				}

				$(_form).removeClass('form_sending');
			});*/
		},

		init: function(form) {

			form.addEventListener('input', this.validateOnInputOrBlur.bind(this));

			form.addEventListener('blur', this.validateOnInputOrBlur.bind(this), true);

		}

		/*init: function(form, fun) {
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

		}*/

	};

}());