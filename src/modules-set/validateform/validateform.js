var ValidateForm;

(function() {
	"use strict";

	ValidateForm = {

		input: null,

		errorTip: function(err, errInd, errorTxt) {
			var field = this.input.parentElement,
			errTip = field.querySelector('.field-error-tip') || field.parentElement.querySelector('.field-error-tip');
			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');

				if (errInd) {
					if (!errTip.hasAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = (errInd != 'custom') ? errTip.getAttribute('data-error-text-'+ errInd) : errorTxt;
				}
			} else {
				field.classList.remove('field-error');
				field.classList.add('field-success');
			}
		},

		customErrorTip: function(input, errorTxt) {
			if (!input) {
				return;
			}

			this.input = input;

			this.errorTip(true, 'custom', errorTxt);
		},

		name: function() {
			var err = false;

			if (!/^[a-zа-яё-]{3,21}(\s[a-zа-яё-]{3,21})?(\s[a-zа-яё-]{3,21})?$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		date: function() {
			var err = false, 
			errDate = false, 
			matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

			if (!matches) {
				errDate = 1;
			} else {
				var compDate = new Date(matches[3], (matches[2] - 1), matches[1]),
				curDate = new Date();

				if (this.input.hasAttribute('data-min-years-passed')) {
					var interval = curDate.valueOf() - new Date(curDate.getFullYear() - (+this.input.getAttribute('data-min-years-passed')), curDate.getMonth(), curDate.getDate()).valueOf();

					if (curDate.valueOf() < compDate.valueOf() || (curDate.getFullYear() - matches[3]) > 100) {
						errDate = 1;
					} else if ((curDate.valueOf() - compDate.valueOf()) < interval) {
						errDate = 2;
					}
				}

				if (compDate.getFullYear() != matches[3] || compDate.getMonth() != (matches[2] - 1) || compDate.getDate() != matches[1]) {
					errDate = 1;
				}
			}

			if (errDate == 1) {
				this.errorTip(true, 2);
				err = true;
			} else if (errDate == 2) {
				this.errorTip(true, 3);
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

		select: function(elem) {
			var err = false;

			this.input = elem;

			if (elem.getAttribute('data-required') && !elem.value.length) {
				this.errorTip(true);
				err = true;
			} else {
				this.errorTip(false);
			}
			
			return err;
		},

		file: function(e) {
			if (e) {
				var elem = e.target.closest('input[type="file"]');
				if (!elem) {
					return;
				} else {
					this.input = elem;
				}
			}

			var err = false,
			errCount = {ext: 0, size: 0},
			files = this.input.files,
			maxFiles = +this.input.getAttribute('data-max-files'),
			extensions = this.input.getAttribute('data-ext'),
			extRegExp = new RegExp('(?:\\.'+ extensions.replace(/,/g, '|\\.') +')$'),
			maxSize = +this.input.getAttribute('data-max-size');

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				if (!file.name.match(extRegExp)) {
					errCount.ext++;
					continue;
				}

				if (file.size > maxSize) {
					errCount.size++;
				}
			}
			
			if (maxFiles && files.length > maxFiles) {
				this.errorTip(true, 4);
				err = true;
			} else if (errCount.ext) {
				this.errorTip(true, 2);
				err = true;
			} else if (errCount.size) {
				this.errorTip(true, 3);
				err = true;
			} else {
				this.errorTip(false);
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

		validate: function(form) {
			var err = 0;

			//text, password, textarea
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
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

				if (elem.parentElement.elementIsHidden()) {
					continue;
				}

				if (this.select(elem)) {
					err++;
				}

			}

			//checkboxes
			var elements = form.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

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

				if (group.elementIsHidden()) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="checkbox"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
						checkedElements++;
					}
				}

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

				if (group.elementIsHidden()) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="radio"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
						checkedElement = true;
					}
				}

				if (!checkedElement) {
					group.classList.add('form__radio-group_error');
					err++;
				} else {
					group.classList.remove('form__radio-group_error');
				}

			}

			//file
			var elements = form.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (elem.files.length) {
					if (this.file()) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//passwords compare
			var elements = form.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				var val = elem.value;

				if (val.length) {
					var compElemVal = form.querySelector(elem.getAttribute('data-pass-compare-input')).value;

					if (val !== compElemVal) {
						this.errorTip(true, 2);
						err++;
					} else {
						this.errorTip(false);
					}

				}

			}

			return (err) ? false : true;
		},

		submit: function(form) {
			return this.validate(form);
		},

		init: function(form) {
			if (!form) {
				return;
			}

			form.addEventListener('input', this.validateOnInputOrBlur.bind(this));

			form.addEventListener('blur', this.validateOnInputOrBlur.bind(this), true);

			form.addEventListener('change', this.file.bind(this));

			form.addEventListener('submit', (e) => {
				if (this.validate(form)) {
					form.classList.remove('form-error');
				} else {
					e.preventDefault();

					form.classList.add('form-error');
				}
			});
		}

	};

}());