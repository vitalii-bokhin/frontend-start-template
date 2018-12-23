; var Select;

(function () {
	'use strict';
	
	// custom select
	Select = {
		field: null,
		hideCssClass: 'hidden',
		onSelect: null,
		
		reset: function (parentElem) {
			var parElem = parentElem || document, 
			fieldElements = parElem.querySelectorAll('.custom-select'),
			buttonElements = parElem.querySelectorAll('.custom-select__button'),
			inputElements = parElem.querySelectorAll('.custom-select__input'),
			valueElements = parElem.querySelectorAll('.custom-select__val');
			
			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('custom-select_changed');
			}
			
			for (var i = 0; i < buttonElements.length; i++) {
				buttonElements[i].innerHTML = buttonElements[i].getAttribute('data-placeholder');
			}
			
			for (var i = 0; i < inputElements.length; i++) {
				inputElements[i].value = '';
				inputElements[i].blur();
			}
			
			for (var i = 0; i < valueElements.length; i++) {
				valueElements[i].classList.remove('custom-select__val_checked');
			}
		},
		
		close: function () {
			var fieldElements = document.querySelectorAll('.custom-select'),
			optionsElements = document.querySelectorAll('.custom-select__options');
			
			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('custom-select_opened');
				optionsElements[i].classList.remove('ovfauto');
				optionsElements[i].style.height = 0;
			}
			
			var listItemElements = document.querySelectorAll('.custom-select__options li');
			
			for (var i = 0; i < listItemElements.length; i++) {
				listItemElements[i].classList.remove('hover');
			}
		},
		
		open: function () {
			this.field.classList.add('custom-select_opened');
			
			var opionsElem = this.field.querySelector('.custom-select__options');
			
			opionsElem.style.height = ((opionsElem.scrollHeight < 132) ? 132 : (opionsElem.scrollHeight + 2)) +'px';
			
			opionsElem.scrollTop = 0;
			
			setTimeout(function () {
				opionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		selectMultipleVal: function (elem, button, input) {
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
		
		targetAction: function () {
			var elements = this.field.querySelectorAll('.custom-select__val');
			
			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				
				if (!elem.hasAttribute('data-target-elements')) continue;
				
				var targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
				
				if (elem.classList.contains('custom-select__val_checked')) {
					targetElem.style.display = 'block';
					targetElem.classList.remove(this.hideCssClass);
					
					var textInputElement = targetElem.querySelector('input[type="text"]');
					
					if (textInputElement) {
						textInputElement.focus();
					}
				} else {
					targetElem.style.display = 'none';
					targetElem.classList.add(this.hideCssClass);
				}
			}
		},
		
		selectVal: function (elem) {
			var button = this.field.querySelector('.custom-select__button'),
			input = this.field.querySelector('.custom-select__input');
			
			if (this.field.classList.contains('custom-select_multiple')) {
				
				this.selectMultipleVal(elem, button, input);
				
			} else {
				var toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
				
				var valueElements = this.field.querySelectorAll('.custom-select__val');
				
				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].classList.remove('custom-select__val_checked');
				}
				
				elem.classList.add('custom-select__val_checked');
				
				if (button) {
					button.innerHTML = toButtonValue;
				}
				
				input.value = toInputValue;
				
				this.close();
				
				if (window.Placeholder) {
					Placeholder.hide(input, true);
				}
				
				if (input.getAttribute('data-submit-form-onchange')) {
					input.closest('form').submit();
				}
				
				if (this.onSelect) {
					this.onSelect(input, toInputValue, elem.getAttribute('data-second-value'));
				}
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
		
		setOptions: function (fieldSelector, optObj, nameKey, valKey, secValKey) {
			var fieldElements = document.querySelectorAll(fieldSelector);
			
			for (var i = 0; i < fieldElements.length; i++) {
				var optionsElem = fieldElements[i].querySelector('.custom-select__options');
				
				optionsElem.innerHTML = '';
				
				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li'),
					secValAttr = (secValKey != undefined) ? ' data-second-value="'+ optObj[i][secValKey] +'"' : '';
					
					li.innerHTML = '<button type="button" class="custom-select__val" data-value="'+ optObj[i][valKey] +'"'+ secValAttr +'>'+ optObj[i][nameKey] +'</button>';
					
					optionsElem.appendChild(li);
				}
			}
		},
		
		keyboard: function (key) {
			var options = this.field.querySelector('.custom-select__options'),
			hoverItem = options.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = function (item) {
						var elem = item.nextElementSibling;
						
						while (elem) {
							if (!elem) break;
							
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
						if (!elem) break;
						
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
					var nextItem = function (item) {
						var elem = item.previousElementSibling;
						
						while (elem) {
							if (!elem) break;
							
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
						if (!elem) break;
						
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
			}
		},
		
		build: function (elementStr) {
			var elements = document.querySelectorAll(elementStr);
			
			if (!elements.length) return;
			
			for (let i = 0; i < elements.length; i++) {
				var elem = elements[i],
				options = elem.querySelectorAll('option'),
				parent = elem.parentElement,
				optionsList = '',
				selectedOption = null;
				
				// option list
				for (let i = 0; i < options.length; i++) {
					var opt = options[i];
					
					if (opt.hasAttribute('selected')) {
						selectedOption = opt;
					}
					((opt.hasAttribute('data-second-value')) ? ' data-second-value="'+ opt.getAttribute('data-second-value') +'"' : '')
					
					optionsList += '<li><button type="button" class="custom-select__val'+ ((opt.hasAttribute('selected')) ? ' custom-select__val_checked' : '') +'"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '') + ((opt.hasAttribute('data-second-value')) ? ' data-second-value="'+ opt.getAttribute('data-second-value') +'"' : '') + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '') +'>'+ opt.innerHTML +'</button></li>';
				}
				
				var require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',
				placeholder = elem.getAttribute('data-placeholder'),
				submitOnChange = (elem.hasAttribute('data-submit-form-onchange')) ? ' data-submit-form-onchange="'+ elem.getAttribute('data-submit-form-onchange') +'" ' : '',
				head;
				
				if (elem.getAttribute('data-type') == 'autocomplete') {
					head = '<button type="button" class="custom-select__arr"></button><input type="text" name="'+ elem.name +'"'+ require + ((placeholder) ? ' placeholder="'+ placeholder +'" ' : '') +'class="custom-select__input custom-select__autocomplete form__text-input" value="'+ ((selectedOption) ? selectedOption.innerHTML : '') +'">';
				} else {
					head = '<button type="button"'+ ((placeholder) ? ' data-placeholder="'+ placeholder +'"' : '') +' class="custom-select__button">'+ ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') +'</button>';
				}
				
				var multiple = {
					class: (elem.multiple) ? ' custom-select_multiple' : '',
					inpDiv: (elem.multiple) ? '<div class="custom-select__multiple-inputs"></div>' : ''
				},
				hiddenInp = (elem.getAttribute('data-type') != 'autocomplete') ? '<input type="hidden" name="'+ elem.name +'"'+ require + submitOnChange +'class="custom-select__input" value="'+ ((selectedOption) ? selectedOption.value : '') +'">' : '';
				
				// output select
				var customElem = document.createElement('div');
				customElem.className = 'custom-select'+ multiple.class + ((selectedOption) ? ' custom-select_changed' : '');
				customElem.innerHTML = head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv;
				parent.insertBefore(customElem, parent.firstChild);
				parent.removeChild(parent.children[1]);
			}
		},
		
		init: function (elementStr) {
			this.build(elementStr);
			
			// click on select or value or arrow button
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest('.custom-select__button'),
				valElem = e.target.closest('.custom-select__val'),
				arrElem = e.target.closest('.custom-select__arr');
				
				if (btnElem) {
					this.field = btnElem.closest('.custom-select');
					
					if (this.field.classList.contains('custom-select_opened')) {
						this.close();
					} else {
						this.close();
						
						this.open();
					}
				} else if (valElem) {
					this.field = valElem.closest('.custom-select');
					
					this.selectVal(valElem);
				} else if (arrElem) {
					if (!arrElem.closest('.custom-select_opened')) {
						arrElem.closest('.custom-select').querySelector('.custom-select__autocomplete').focus();
					} else {
						this.close();
					}
				}
			});
			
			//focus autocomplete
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');
				
				if (!elem) return;
				
				this.field = elem.closest('.custom-select');
				
				this.close();
				
				this.open();
			}, true);
			
			//input autocomplete
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');
				
				if (!elem) return;
				
				this.field = elem.closest('.custom-select');
				
				this.autocomplete(elem);
				
				if (!this.field.classList.contains('custom-select_opened')) {
					this.open();
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.custom-select_opened');
				
				if (!elem) return;
				
				this.field = elem.closest('.custom-select');
				
				var key = e.which || e.keyCode || 0;
				
				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();
					
					this.keyboard(key);
				}
			});
			
			// close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.custom-select_opened')) {
					this.close();
				}
			});
		}
	};
	
	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		Select.init('select');
	});
})();