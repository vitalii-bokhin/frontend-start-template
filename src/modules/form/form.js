var ValidateForm, Form;

(function () {
	'use strict';

	// validate form
	ValidateForm = {
		input: null,

		errorTip: function (err, errInd, errorTxt) {
			const field = this.input.closest('.form__field') || this.input.parentElement,
				tipEl = field.querySelector('.field-error-tip');

			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');

				if (errInd) {
					if (tipEl) {
						if (!tipEl.hasAttribute('data-error-text')) {
							tipEl.setAttribute('data-error-text', tipEl.innerHTML);
						}
						tipEl.innerHTML = (errInd != 'custom') ? tipEl.getAttribute('data-error-text-' + errInd) : errorTxt;
					}

					field.setAttribute('data-error-index', errInd);

				} else {
					if (tipEl && tipEl.hasAttribute('data-error-text')) {
						tipEl.innerHTML = tipEl.getAttribute('data-error-text');
					}

					field.removeAttribute('data-error-index');
				}

			} else {
				field.classList.remove('field-error');
				field.classList.add('field-success');
				field.removeAttribute('data-error-index');
			}
		},

		customErrorTip: function (input, errorTxt, isLockForm) {
			if (!input) return;

			this.input = input;

			if (errorTxt) {
				this.errorTip(true, 'custom', errorTxt);

				if (isLockForm) {
					input.setAttribute('data-custom-error', 'true');
				}
			} else {
				this.errorTip(false);
				input.removeAttribute('data-custom-error');

				this.validate(input.closest('form'));
			}
		},

		formError: function (formElem, err, errTxt) {
			const errTipElem = formElem.querySelector('.form-error-tip');

			if (err) {
				formElem.classList.add('form-error');

				if (!errTipElem) return;

				if (errTxt) {
					if (!errTipElem.hasAttribute('data-error-text')) {
						errTipElem.setAttribute('data-error-text', errTipElem.innerHTML);
					}

					errTipElem.innerHTML = errTxt;
				} else if (errTipElem.hasAttribute('data-error-text')) {
					errTipElem.innerHTML = errTipElem.getAttribute('data-error-text');
				}
			} else {
				formElem.classList.remove('form-error');
			}
		},

		customFormErrorTip: function (formElem, errorTxt) {
			if (!formElem) return;

			if (errorTxt) {
				this.formError(formElem, true, errorTxt);
			} else {
				this.formError(formElem, false);
			}
		},

		txt: function () {
			var err = false;

			if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		num: function () {
			var err = false;

			if (!/^[0-9.,-]*$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		name: function () {
			var err = false;

			if (!/^[a-zа-яё'\s-]{2,21}(\s[a-zа-яё'\s-]{2,21})?(\s[a-zа-яё'\s-]{2,21})?$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		date: function () {
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

		email: function () {
			var err = false;

			if (!/^[a-z0-9]+[\w\-\.]*@([\w\-]{2,}\.)+[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		url: function () {
			var err = false;

			if (!/^(https?\:\/\/)?[а-я\w-.]+\.[a-zа-я]{2,11}[/?а-я\w/=-]+$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		tel: function () {
			var err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		pass: function () {
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

		checkbox: function (elem) {
			this.input = elem;

			var group = elem.closest('.form__chbox-group');

			if (group && group.getAttribute('data-tested')) {
				var checkedElements = 0,
					elements = group.querySelectorAll('input[type="checkbox"]');

				for (var i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
						checkedElements++;
					}
				}

				if (checkedElements < group.getAttribute('data-min')) {
					group.classList.add('form__chbox-group_error');
				} else {
					group.classList.remove('form__chbox-group_error');
				}

			} else if (elem.getAttribute('data-tested')) {
				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
				} else {
					this.errorTip(false);
				}
			}
		},

		radio: function (elem) {
			this.input = elem;

			var checkedElement = false,
				group = elem.closest('.form__radio-group');

			if (!group) return;

			var elements = group.querySelectorAll('input[type="radio"]');

			for (var i = 0; i < elements.length; i++) {
				if (elements[i].checked) {
					checkedElement = true;
				}
			}

			if (!checkedElement) {
				group.classList.add('form__radio-group_error');
			} else {
				group.classList.remove('form__radio-group_error');
			}
		},

		select: function (elem) {
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

		file: function (elem, filesArr) {
			this.input = elem;

			var err = false,
				errCount = { ext: 0, size: 0 },
				maxFiles = +this.input.getAttribute('data-max-files'),
				extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
				maxSize = +this.input.getAttribute('data-max-size'),
				fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');;

			for (var i = 0; i < filesArr.length; i++) {
				var file = filesArr[i];

				if (!file.name.match(extRegExp)) {
					errCount.ext++;

					if (fileItemElements[i]) {
						fileItemElements[i].classList.add('file-error');
					}

					continue;
				}

				if (file.size > maxSize) {
					errCount.size++;

					if (fileItemElements[i]) {
						fileItemElements[i].classList.add('file-error');
					}
				}
			}

			if (maxFiles && filesArr.length > maxFiles) {
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

		validateOnInput: function (elem) {
			this.input = elem;

			var dataType = elem.getAttribute('data-type');

			if (elem.getAttribute('data-required') && (!elem.value.length || /^\s+$/.test(elem.value))) {
				this.errorTip(true);
			} else if (elem.value.length) {
				if (dataType) {
					try {
						this[dataType]();
					} catch (error) {
						console.log('Error while process', dataType)
					}
				} else {
					this.errorTip(false);
				}
			} else {
				this.errorTip(false);
			}
		},

		validate: function (formElem) {
			var err = 0;

			// text, password, textarea
			var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], input[type="tel"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				var dataType = elem.getAttribute('data-type');

				if (elem.getAttribute('data-required') && (!elem.value.length || /^\s+$/.test(elem.value))) {
					this.errorTip(true);
					err++;
				} else if (elem.value.length) {
					if (elem.hasAttribute('data-custom-error')) {
						err++;
					} else if (dataType) {
						try {
							if (this[dataType]()) {
								err++;
							}
						} catch (error) {
							console.log('Error while process', dataType)
						}
					} else {
						this.errorTip(false);
					}
				} else {
					this.errorTip(false);
				}
			}

			// select
			const selectElements = formElem.querySelectorAll('.select__input');

			for (let i = 0; i < selectElements.length; i++) {
				const selectElem = selectElements[i];

				if (elemIsHidden(selectElem.parentElement)) continue;

				if (this.select(selectElem)) {
					err++;
				}
			}

			// checkboxes
			var elements = formElem.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}
			}

			// checkbox group
			var groups = formElem.querySelectorAll('.form__chbox-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
					checkedElements = 0;

				if (elemIsHidden(group)) {
					continue;
				}

				group.setAttribute('data-tested', 'true');

				var elements = group.querySelectorAll('input[type="checkbox"]');

				for (let i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
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

			// radio group
			var groups = formElem.querySelectorAll('.form__radio-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
					checkedElement = false;

				if (elemIsHidden(group)) {
					continue;
				}

				group.setAttribute('data-tested', 'true');

				var elements = group.querySelectorAll('input[type="radio"]');

				for (let i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
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

			// file
			var elements = formElem.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
					continue;
				}

				this.input = elem;

				if (CustomFile.inputFiles(elem).length) {
					if (this.file(elem, CustomFile.inputFiles(elem))) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}
			}

			// passwords compare
			var elements = formElem.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
					continue;
				}

				this.input = elem;

				var val = elem.value;

				if (val.length) {
					var compElemVal = formElem.querySelector(elem.getAttribute('data-pass-compare-input')).value;

					if (val !== compElemVal) {
						this.errorTip(true, 2);
						err++;
					} else {
						this.errorTip(false);
					}
				}
			}

			this.formError(formElem, err);

			return (err) ? false : true;
		},

		init: function (formSelector) {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest(formSelector + ' input[type="text"],' + formSelector + ' input[type="password"],' + formSelector + ' input[type="number"],' + formSelector + ' input[type="tel"],' + formSelector + ' textarea');

				if (elem && elem.hasAttribute('data-tested')) {
					this.validateOnInput(elem);
				}
			});

			document.addEventListener('change', (e) => {
				var elem = e.target.closest(formSelector + ' input[type="radio"],' + formSelector + ' input[type="checkbox"]');

				if (elem) {
					this[elem.type](elem);
				}
			});
		}
	};

	// variable height textarea
	var varHeightTextarea = {
		setHeight: function (elem) {
			var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
				mirrorOutput = elem.value.replace(/\n/g, '<br>');

			mirror.innerHTML = mirrorOutput + '&nbsp;';
		},

		init: function () {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.var-height-textarea__textarea');

				if (!elem) {
					return;
				}

				this.setHeight(elem);
			});
		}
	};

	// form
	Form = {
		onSubmitSubscribers: [],

		init: function (formSelector) {
			if (!document.querySelector(formSelector)) return;

			ValidateForm.init(formSelector);

			// submit event
			document.addEventListener('submit', (e) => {
				const formElem = e.target.closest(formSelector);

				if (formElem) {
					this.submitForm(formElem, e);
				}
			});

			// keyboard event
			document.addEventListener('keydown', (e) => {
				const formElem = e.target.closest(formSelector);

				if (!formElem) return;

				const key = e.code;

				if (e.target.closest('.fieldset__item') && key == 'Enter') {
					e.preventDefault();
					e.target.closest('.fieldset__item').querySelector('.js-next-fieldset-btn').click();

				} else if (e.ctrlKey && key == 'Enter') {
					e.preventDefault();
					this.submitForm(formElem, e);
				}
			});
		},

		submitForm: function (formElem, e) {
			if (!ValidateForm.validate(formElem)) {
				if (e) e.preventDefault();

				const errFieldEl = formElem.querySelector('.field-error');

				if (errFieldEl.hasAttribute('data-error-index')) {
					ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text-' + errFieldEl.getAttribute('data-error-index')));
				} else if (errFieldEl.hasAttribute('data-form-error-text')) {
					ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text'));
				}

				return;
			}

			formElem.classList.add('form_sending');

			if (!this.onSubmitSubscribers.length) {
				formElem.submit();
				return;
			}

			let fReturn;

			this.onSubmitSubscribers.forEach(item => {
				fReturn = item(formElem, (obj) => {
					obj = obj || {};

					setTimeout(() => {
						this.actSubmitBtn(obj.unlockSubmitButton, formElem);
					}, 321);

					formElem.classList.remove('form_sending');

					if (obj.clearForm == true) {
						this.clearForm(formElem);
					}
				});
			});

			if (fReturn === true) {
				formElem.submit();
			} else {
				if (e) e.preventDefault();
				this.actSubmitBtn(false, formElem);
			}
		},

		onSubmit: function (fun) {
			if (typeof fun === 'function') {
				this.onSubmitSubscribers.push(fun);
			}
		},

		clearForm: function (formElem) {
			var elements = formElem.querySelectorAll('input[type="text"], input[type="number"],input[type="tel"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				elem.value = '';

				if (window.Placeholder) {
					Placeholder.hide(elem, false);
				}
			}

			if (window.Select) {
				Select.reset();
			}

			var textareaMirrors = formElem.querySelectorAll('.var-height-textarea__mirror');

			for (var i = 0; i < textareaMirrors.length; i++) {
				textareaMirrors[i].innerHTML = '';
			}
		},

		actSubmitBtn: function (state, formElem) {
			var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (state) {
					elem.removeAttribute('disabled');
				} else {
					elem.setAttribute('disabled', 'disable');
				}
			}
		}
	};

	// bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
				label = elem.parentElement.querySelector('label'),
				forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-' + i;

			if (label && !label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}
		}
	}

	// duplicate form
	var DuplicateForm = {
		add: function (btnElem) {
			var modelElem = (btnElem.hasAttribute('data-form-model')) ? document.querySelector(btnElem.getAttribute('data-form-model')) : null,
				destElem = (btnElem.hasAttribute('data-duplicated-dest')) ? document.querySelector(btnElem.getAttribute('data-duplicated-dest')) : null;

			if (!modelElem || !destElem) return;

			var duplicatedDiv = document.createElement('div');

			duplicatedDiv.className = 'duplicated';

			duplicatedDiv.innerHTML = modelElem.innerHTML;

			destElem.appendChild(duplicatedDiv);

			var dupicatedElements = destElem.querySelectorAll('.duplicated');

			for (var i = 0; i < dupicatedElements.length; i++) {
				var dupicatedElem = dupicatedElements[i],
					labelElements = dupicatedElem.querySelectorAll('label'),
					inputElements = dupicatedElem.querySelectorAll('input');

				for (var j = 0; j < labelElements.length; j++) {
					var elem = labelElements[j];

					if (elem.htmlFor != '') {
						elem.htmlFor += '-' + i + '-' + j;
					}
				}

				for (var j = 0; j < inputElements.length; j++) {
					var elem = inputElements[j];

					if (elem.id != '') {
						elem.id += '-' + i + '-' + j;
					}
				}
			}
		},

		remove: function (btnElem) {
			var duplElem = btnElem.closest('.duplicated');

			if (duplElem) {
				duplElem.innerHTML = '';
			}
		},

		init: function (addBtnSelector, removeBtnSelector) {
			document.addEventListener('click', (e) => {
				var addBtnElem = e.target.closest(addBtnSelector),
					removeBtnElem = e.target.closest(removeBtnSelector);

				if (addBtnElem) {
					this.add(addBtnElem);
				} else if (removeBtnElem) {
					this.remove(removeBtnElem);
				}
			});
		}
	};

	// set tabindex
	/*function SetTabindex(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);
		
		for (let i = 0; i < elements.length; i++) {
			var elem = elements[i];
			
			if (!elemIsHidden(elem)) {
				elem.setAttribute('tabindex', i + 1);
			}
		}
	}*/

	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		BindLabels('input[type="text"], input[type="number"], input[type="tel"], input[type="checkbox"], input[type="radio"]');
		// SetTabindex('input[type="text"], input[type="password"], textarea');
		varHeightTextarea.init();
		DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
	});
})();