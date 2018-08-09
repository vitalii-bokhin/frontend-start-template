var CustomPlaceholder, CustomSelect;

(function() {
	"use strict";

	//bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
			label = elem.parentElement.querySelector('label'),
			forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-'+ i;

			if (!label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}

		}

	}

	//show element on checkbox change
	var ChangeCheckbox = {

		change: function(elem) {

			var targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

			if (!targetElements.length) {
				return;
			}

			for (var i = 0; i < targetElements.length; i++) {
				targetElements[i].style.display = (elem.checked) ? 'block' : 'none';
			}

		},

		init: function() {

			document.addEventListener('change', (e) => {

				var elem = e.target.closest('input[type="checkbox"]');

				if (elem) {
					this.change(elem);
				}

			});

		}

	};

	//show element on radio button change
	var ChangeRadio = {

		change: function(checkedElem) {

			var elements = document.querySelectorAll('input[type="radio"][name="'+ checkedElem.name +'"]');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

				if (!targetElements.length) {
					continue;
				}

				for (var j = 0; j < targetElements.length; j++) {
					targetElements[j].style.display = (elem.checked) ? 'block' : 'none';
				}

			}

		},

		init: function() {

			document.addEventListener('change', (e) => {

				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					this.change(elem);
				}

			});

		}

	};

	//form custom placeholder
	CustomPlaceholder = {

		init: function(elementsStr) {
			var elements = document.querySelectorAll(elementsStr);

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.placeholder) {

					var elemFor = (elem.id) ? elem.id : 'placeholder-index-'+ i,
					label = document.createElement('label');

					label.htmlFor = elemFor;
					label.className = 'custom-placeholder';
					label.innerHTML = elem.placeholder;

					elem.parentElement.insertBefore(label, elem);

					elem.removeAttribute('placeholder');
					
					if (!elem.id) {
						elem.id = elemFor;
					}

				}

				if (elem.value.length) {
					this.hidePlaceholder(elem, true);
				}

			}

			//events
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, true);
				}

			}, true);


			document.addEventListener('blur', (e) => {

				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, false);
				}

			}, true);

		},
		
		hidePlaceholder: function(elem, hide) {

			var label = document.querySelector('label.custom-placeholder[for="'+ elem.id +'"]');

			if (!label) {
				return;
			}

			var lSt = label.style;

			if (hide) {

				lSt.textIndent = '-9999px';
				lSt.paddingLeft = '0px';
				lSt.paddingRight = '0px';

			} else {

				if (!elem.value.length) {
					lSt.textIndent = '';
					lSt.paddingLeft = '';
					lSt.paddingRight = '';
				}

			}
			
		}

	};

	//Form CustomSelect
	CustomSelect = {
		field: null,

		close: function() {
			var fieldElements = document.querySelectorAll('.custom-select');

			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('custom-select_opened');
			}

			var listItemElements = document.querySelectorAll('.custom-select__options li');

			for (var i = 0; i < listItemElements.length; i++) {
				listItemElements[i].classList.remove('hover');
			}
		},

		open: function() {
			this.field.classList.add('custom-select_opened');

			this.field.querySelector('.custom-select__options').scrollTop = 0;
		},

		selectMultipleVal: function(elem, button, input) {
			var toButtonValue = [],
			toInputValue = [],
			inputsBlock = this.field.querySelector('.custom-select__multiple-inputs');

			elem.classList.toggle('custom-select__val_checked');

			var checkedElements = this.field.querySelectorAll('.custom-select__val_checked');

			for (var i = 0; i < checkedElements.length; i++) {
				var elem = checkedElements[i];

				toButtonValue[i] = elem.innerHTML;
				toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

			}

			if (toButtonValue.length) {
				button.innerHTML = toButtonValue.join(', ');

				input.value = toInputValue[0];

				inputsBlock.innerHTML = '';

				if (toInputValue.length > 1) {

					for (var i = 1; i < toInputValue.length; i++) {
						var yetInput = document.createElement('input');

						yetInput.type = 'hidden';
						yetInput.name = input.name;
						yetInput.value = toInputValue[i];

						inputsBlock.appendChild(yetInput);
					}

				}

			} else {
				button.innerHTML = button.getAttribute('data-placeholder');
				input.value = '';
				this.close();
			}

		},

		targetAction: function() {
			var elements = this.field.querySelectorAll('.custom-select__val');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.hasAttribute('data-target-elements')) {
					return;
				}

				var targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
				targetElem.style.display = (elem.classList.contains('custom-select__val_checked')) ? 'block' : 'none';

			}

		},

		selectVal: function(elem) {
			var button = this.field.querySelector('.custom-select__button'),
			input = this.field.querySelector('.custom-select__input');

			if (this.field.classList.contains('custom-select_multiple')) {
				
				this.selectMultipleVal(elem, button, input);

			} else {
				var toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

				var lalueElements = this.field.querySelectorAll('.custom-select__val');

				for (var i = 0; i < lalueElements.length; i++) {
					lalueElements[i].classList.remove('custom-select__val_checked');
				}

				elem.classList.add('custom-select__val_checked');

				if (button) {
					button.innerHTML = toButtonValue;
				}

				input.value = toInputValue;
				
				this.close();

				CustomPlaceholder.hidePlaceholder(input, true);

			}

			this.targetAction();

			if (input.classList.contains('var-height-textarea__textarea')) {
				varHeightTextarea.setHeight(input);
			}

			this.field.classList.add('custom-select_changed');

			ValidateForm.select(input);

		},

		autocomplete: function(elem) {
			var match = false,
			reg = new RegExp(elem.value, 'gi'),
			valueElements = this.field.querySelectorAll('.custom-select__val');

			if (elem.value.length) {
				for (var i = 0; i < valueElements.length; i++) {
					var valueElem = valueElements[i];

					valueElem.classList.remove('custom-select__val_checked');
						
					if (valueElem.innerHTML.match(reg)) {
						valueElem.parentElement.classList.remove('hidden');

						match = true;
					} else {
						valueElem.parentElement.classList.add('hidden');
					}
				}
			}

			if (!match) {
				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].parentElement.classList.remove('hidden');
				}
			}
		},

		setOptions: function(fieldStr, optObj, val, name) {
			var fields = document.querySelectorAll(fieldStr);

			for (var i = 0; i < fields.length; i++) {
				var options = fields[i].querySelector('.custom-select__options');

				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li');

					li.innerHTML = '<button type="button" class="custom-select__val" data-value="'+ optObj[i][val] +'">'+ optObj[i][name] +'</button>';

					options.appendChild(li);
				}
			}

		},

		keyboard: function(key) {
			var options = this.field.querySelector('.custom-select__options'),
			hoverItem = options.querySelector('li.hover');

			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = function(item) {
						var elem = item.nextElementSibling;

						while (elem) {
							if (!elem) {
								break;
							}

							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.nextElementSibling;
							}
						}
					}(hoverItem);

					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');

						options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
					}
				} else {
					var elem = options.firstElementChild;

					while (elem) {
						if (!elem) {
							break;
						}

						if (!elem.elementIsHidden()) {
							elem.classList.add('hover');
							break;
						} else {
							elem = elem.nextElementSibling;
						}
					}
				}
				break;

				case 38:
				if (hoverItem) {
					var nextItem = function(item) {
						var elem = item.previousElementSibling;

						while (elem) {
							if (!elem) {
								break;
							}

							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.previousElementSibling;
							}
						}
					}(hoverItem);

					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');

						options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
					}
				} else {
					var elem = options.lastElementChild;

					while (elem) {
						if (!elem) {
							break;
						}

						if (!elem.elementIsHidden()) {
							elem.classList.add('hover');
							options.scrollTop = 9999;
							break;
						} else {
							elem = elem.previousElementSibling;
						}
					}
				}
				break;

				case 13:
				this.selectVal(hoverItem.querySelector('.custom-select__val'));
				break;
			}
		},

		build: function(elementStr) {
			var elements = document.querySelectorAll(elementStr);

			if (!elements.length) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				var elem = elements[i],
				options = elem.querySelectorAll('option'),
				parent = elem.parentElement,
				optionsList = '',
				selectedOption = null;
				
				//option list
				for (let i = 0; i < options.length; i++) {
					var opt = options[i];

					if (opt.hasAttribute('selected')) {
						selectedOption = opt;
					}

					optionsList += '<li><button type="button" class="custom-select__val'+ ((opt.hasAttribute('selected')) ? ' custom-select__val_checked' : '') +'"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '' ) + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '' ) +'>'+ opt.innerHTML +'</button></li>';
				}

				var require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',
				placeholder = elem.getAttribute('data-placeholder'),
				head;

				if (elem.getAttribute('data-type') == 'autocomplete') {
					head = '<input type="text" name="'+ elem.name +'"'+ require + ((placeholder) ? ' placeholder="'+ placeholder +'" ' : '') +'class="custom-select__input custom-select__autocomplete form__text-input" value="'+ ((selectedOption) ? selectedOption.innerHTML : '') +'">';
				} else {
					head = '<button type="button"'+ ((placeholder) ? ' data-placeholder="'+ placeholder +'"' : '') +' class="custom-select__button">'+ ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') +'</button>';
				}

				var multiple = {
					class: (elem.multiple) ? ' custom-select_multiple' : '',
					inpDiv: (elem.multiple) ? '<div class="custom-select__multiple-inputs"></div>' : ''
				},
				hiddenInp = (elem.getAttribute('data-type') != 'autocomplete') ? '<input type="hidden" name="'+ elem.name +'"'+ require +'class="custom-select__input" value="'+ ((selectedOption) ? selectedOption.value : '') +'">' : '';

				//output select
				var customElem = document.createElement('div');
				customElem.className = 'custom-select'+ multiple.class + ((selectedOption) ? ' custom-select_changed' : '');
				customElem.innerHTML = head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv;
				parent.insertBefore(customElem, parent.firstChild);
				parent.removeChild(parent.children[1]);
			}
		},

		init: function(elementStr) {
			this.build(elementStr);

			//click on select button event
			document.addEventListener('click', (e) => {
				var elem = e.target.closest('.custom-select__button');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				if (this.field.classList.contains('custom-select_opened')) {
					this.close();
				} else {
					this.close();

					this.open();
				}
			});

			//click on value button event
			document.addEventListener('click', (e) => {
				var elem = e.target.closest('.custom-select__val');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.selectVal(elem);
			});

			//focus autocomplete
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.close();

				this.open();
			}, true);

			//input autocomplete
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.autocomplete(elem);

				if (!this.field.classList.contains('custom-select_opened')) {
					this.open();
				}
			});

			//keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.custom-select_opened');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				var key = e.which || e.keyCode || 0;

				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();

					this.keyboard(key);
				}
			});

			//close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.custom-select_opened')) {
					this.close();
				}
			});
		}
	};

	//custom file
	var CustomFile = {

		field: null,

		loadPreview: function(file, i) {
			var imgPreviewBlock = this.field.querySelectorAll('.custom-file__preview')[i];

			if (file.type.match('image')) {
				var reader = new FileReader();

				reader.onload = function(e) {
					setTimeout(function() {
						var img = document.createElement('img');
						img.src = e.target.result;
						imgPreviewBlock.appendChild(img);
					}, 121);
				}

				reader.readAsDataURL(file);
			} else {
				imgPreviewBlock.innerHTML = '<img src="images/preview.svg">';
			}

		},

		changeInput: function(elem) {
			var maxFiles = +elem.getAttribute('data-max-files');

			if (maxFiles && elem.files.length > maxFiles) {
				return;
			}

			this.field = elem.closest('.custom-file');

			var fileItems = this.field.querySelector('.custom-file__items');

			fileItems.innerHTML = '';

			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i],
				fileItem = document.createElement('div');

				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__preview"></div><div class="custom-file__name">'+ file.name +'</div>';

				fileItems.appendChild(fileItem);

				this.loadPreview(file, i);
			}
		},

		init: function() {

			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="file"]');

				if (!elem) {
					return;
				}

				this.changeInput(elem);

			});

		}

	};

	//variable height textarea
	var varHeightTextarea = {

		setHeight: function(elem) {
			var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
			mirrorOutput = elem.value.replace(/\n/g, '<br>');

			mirror.innerHTML = mirrorOutput +'&nbsp;';
		},

		init: function() {

			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.var-height-textarea__textarea');

				if (!elem) {
					return;
				}

				this.setHeight(elem);

			});

		}

	};

	//init scripts
	document.addEventListener("DOMContentLoaded", function() {
		CustomSelect.init('select');
		CustomFile.init();
		varHeightTextarea.init();
		CustomPlaceholder.init('input[type="text"], input[type="password"], textarea');
		BindLabels('input[type="checkbox"], input[type="radio"]');
		ChangeCheckbox.init();
		ChangeRadio.init();
	});

}());