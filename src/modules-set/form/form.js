var ValidateForm, Form;

(function () {
	'use strict';
	
	// validate form
	ValidateForm = {
		input: null,
		
		errorTip: function (err, errInd, errorTxt) {
			var field = this.input.closest('.form__field') || this.input.parentElement,
			errTip = field.querySelector('.field-error-tip');
			
			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');
				
				if (!errTip) {
					return;
				}
				
				if (errInd) {
					if (!errTip.hasAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = (errInd != 'custom') ? errTip.getAttribute('data-error-text-'+ errInd) : errorTxt;
				} else if (errTip.hasAttribute('data-error-text')) {
					errTip.innerHTML = errTip.getAttribute('data-error-text');
				}
			} else {
				field.classList.remove('field-error');
				field.classList.add('field-success');
			}
		},
		
		customErrorTip: function (input, errorTxt) {
			if (!input) {
				return;
			}
			
			this.input = input;
			
			this.errorTip(true, 'custom', errorTxt);
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
			
			if (!/^[a-zа-яё'-]{3,21}(\s[a-zа-яё'-]{3,21})?(\s[a-zа-яё'-]{3,21})?$/i.test(this.input.value)) {
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
			
			if (!/^[a-z0-9]+[\w\-\.]*@[\w\-]{2,}\.[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}
			
			return err;
		},
		
		url: function () {
			var err = false;
			
			if (!/^(https?\:\/\/)?[a-zа-я0-9\-\.]+\.[a-zа-я]{2,11}$/i.test(this.input.value)) {
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
			group = elem.closest('.form__radio-group'),
			elements = group.querySelectorAll('input[type="radio"]');
			
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
			errCount = {ext: 0, size: 0},
			maxFiles = +this.input.getAttribute('data-max-files'),
			extRegExp = new RegExp('(?:\\.'+ this.input.getAttribute('data-ext').replace(/,/g, '|\\.') +')$', 'i'),
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
			
			if (elem.getAttribute('data-required') && !elem.value.length) {
				this.errorTip(true);
			} else if (elem.value.length) {
				if (dataType) {
					this[dataType]();
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
			var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');
			
			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				
				if (elem.elementIsHidden()) {
					continue;
				}
				
				this.input = elem;
				
				elem.setAttribute('data-tested', 'true');
				
				var dataType = elem.getAttribute('data-type');
				
				if (elem.getAttribute('data-required') && !elem.value.length) {
					this.errorTip(true);
					err++;
				} else if (elem.value.length) {
					if (dataType) {
						if (this[dataType]()) {
							err++;
						}
					} else {
						this.errorTip(false);
					}
				} else {
					this.errorTip(false);
				}
			}
			
			// select
			var elements = formElem.querySelectorAll('.custom-select__input');
			
			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				
				if (elem.parentElement.elementIsHidden()) {
					continue;
				}
				
				if (this.select(elem)) {
					err++;
				}
			}
			
			// checkboxes
			var elements = formElem.querySelectorAll('input[type="checkbox"]');
			
			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				
				if (elem.elementIsHidden()) {
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
				
				if (group.elementIsHidden()) {
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
				
				if (group.elementIsHidden()) {
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
				
				if (elem.elementIsHidden()) {
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
				
				if (elem.elementIsHidden()) {
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
			
			if (err) {
				formElem.classList.add('form-error');
			} else {
				formElem.classList.remove('form-error');
			}
			
			return (err) ? false : true;
		},
		
		init: function (formSelector) {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest(formSelector +' input[type="text"],'+ formSelector +' input[type="password"],'+ formSelector +' textarea');
				
				if (elem && elem.hasAttribute('data-tested')) {
					this.validateOnInput(elem);
				}
			});
			
			document.addEventListener('change', (e) => {
				var elem = e.target.closest(formSelector +' input[type="radio"],'+ formSelector +' input[type="checkbox"]');
				
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
			
			mirror.innerHTML = mirrorOutput +'&nbsp;';
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
	
	// next fieldset
	var NextFieldset = {
		next: function (btnElem, fwd) {
			var nextFieldset = (btnElem.hasAttribute('data-go-to-fieldset')) ? document.querySelector(btnElem.getAttribute('data-go-to-fieldset')) : null;
			
			if (!nextFieldset) return;
			
			var currentFieldset = btnElem.closest('.fieldset__item'),
			goTo = (fwd) ? ValidateForm.validate(currentFieldset) : true;
			
			if (goTo) {
				currentFieldset.classList.add('fieldset__item_hidden');
				nextFieldset.classList.remove('fieldset__item_hidden');
			}
		},
		
		init: function (nextBtnSelector, prevBtnSelector) {
			document.addEventListener('click', (e) => {
				var nextBtnElem = e.target.closest(nextBtnSelector),
				prevBtnElem = e.target.closest(prevBtnSelector);
				
				if (nextBtnElem) {
					this.next(nextBtnElem, true);
				} else if (prevBtnElem) {
					this.next(prevBtnElem, false);
				}
			});
		}
	};
	
	// form
	Form = {
		onSubmit: null,
		
		submit: function (e, formElem) {
			formElem.classList.add('form_sending');
			
			if (!this.onSubmit) {
				formElem.submit();
				return;
			}
			
			// clear form
			function clear() {
				var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');
				
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
				
				var textareaMirrors = formElem.querySelectorAll('.form__textarea-mirror');
				
				for (var i = 0; i < textareaMirrors.length; i++) {
					textareaMirrors[i].innerHTML = '';
				}
			}
			
			// submit button
			function actSubmitBtn(st) {
				var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');
				
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
			
			// call onSubmit
			var ret = this.onSubmit(formElem, function (obj) {
				obj = obj || {};
				
				actSubmitBtn(obj.unlockSubmitButton);
				
				formElem.classList.remove('form_sending');
				
				if (obj.clearForm == true) {
					clear();
				}
			});
			
			if (ret === false) {
				e.preventDefault();
				actSubmitBtn(false);
			} else {
				formElem.submit();
			}
		},
		
		init: function (formSelector) {
			if (!document.querySelector(formSelector)) return;
			
			ValidateForm.init(formSelector);
			
			// submit event
			document.addEventListener('submit', (e) => {
				var formElem = e.target.closest(formSelector);
				
				if (!formElem) return;
				
				if (ValidateForm.validate(formElem)) {
					this.submit(e, formElem);
				} else {
					e.preventDefault();
				}
			});
			
			// keyboard event
			document.addEventListener('keydown', (e) => {
				var formElem = e.target.closest(formSelector);
				
				if (!formElem) return;
				
				var key = e.which || e.keyCode || 0;
				
				if (e.ctrlKey && key == 13) {
					e.preventDefault();

					if (ValidateForm.validate(formElem)) {
						this.submit(e, formElem);
					}
				}
			});
		}
	};
	
	// bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);
		
		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
			label = elem.parentElement.querySelector('label'),
			forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-'+ i;
			
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
						elem.htmlFor += '-'+ i +'-'+ j;
					}
				}
				
				for (var j = 0; j < inputElements.length; j++) {
					var elem = inputElements[j];
					
					if (elem.id != '') {
						elem.id += '-'+ i +'-'+ j;
					}
				}
			}
		},
		
		remove: function (btnElem) {
			var duplElem =  btnElem.closest('.duplicated');
			
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
			
			if (!elem.elementIsHidden()) {
				elem.setAttribute('tabindex', i + 1);
			}
		}
	}*/
	
	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		BindLabels('input[type="text"], input[type="checkbox"], input[type="radio"]');
		// SetTabindex('input[type="text"], input[type="password"], textarea');
		varHeightTextarea.init();
		NextFieldset.init('.js-next-fieldset-btn', '.js-prev-fieldset-btn');
		DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
	});
})();