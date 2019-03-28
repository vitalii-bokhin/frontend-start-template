; var Select;

(function () {
	'use strict';
	
	// custom select
	Select = {
		field: null,
		hideCssClass: 'hidden',
		onSelect: null,
		
		reset: function(parentElem) {
			var parElem = parentElem || document, 
			fieldElements = parElem.querySelectorAll('.select'),
			buttonElements = parElem.querySelectorAll('.select__button'),
			inputElements = parElem.querySelectorAll('.select__input'),
			valueElements = parElem.querySelectorAll('.select__val');
			
			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('select_changed');
			}
			
			for (var i = 0; i < buttonElements.length; i++) {
				buttonElements[i].innerHTML = buttonElements[i].getAttribute('data-placeholder');
			}
			
			for (var i = 0; i < inputElements.length; i++) {
				inputElements[i].value = '';
				inputElements[i].blur();
			}
			
			for (var i = 0; i < valueElements.length; i++) {
				valueElements[i].classList.remove('select__val_checked');
			}
		},
		
		close: function() {
			var fieldElements = document.querySelectorAll('.select'),
			optionsElements = document.querySelectorAll('.select__options');
			
			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('select_opened');
				optionsElements[i].classList.remove('ovfauto');
				optionsElements[i].style.height = 0;
			}
			
			var listItemElements = document.querySelectorAll('.select__options li');
			
			for (var i = 0; i < listItemElements.length; i++) {
				listItemElements[i].classList.remove('hover');
			}
		},
		
		open: function() {
			this.field.classList.add('select_opened');
			
			const optionsElem = this.field.querySelector('.select__options');
			
			optionsElem.style.height = (optionsElem.scrollHeight + 2) +'px';
			optionsElem.scrollTop = 0;
			
			setTimeout(function () {
				optionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		selectMultipleVal: function(elem, button, input) {
			var toButtonValue = [],
			toInputValue = [],
			inputsBlock = this.field.querySelector('.select__multiple-inputs');
			
			elem.classList.toggle('select__val_checked');
			
			var checkedElements = this.field.querySelectorAll('.select__val_checked');
			
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
			const elements = this.field.querySelectorAll('.select__val');
			
			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i];
				
				if (!elem.hasAttribute('data-target-elements')) continue;
				
				const targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
				
				if (elem.classList.contains('select__val_checked')) {
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
		
		selectVal: function(elem) {
			const button = this.field.querySelector('.select__button'),
			input = this.field.querySelector('.select__input');
			
			if (this.field.classList.contains('select_multiple')) {
				this.selectMultipleVal(elem, button, input);
			} else {
				const toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
				
				const valueElements = this.field.querySelectorAll('.select__val');
				
				for (let i = 0; i < valueElements.length; i++) {
					const valElem = valueElements[i];

					valElem.classList.remove('select__val_checked');
					valElem.disabled = false;
				}
				
				elem.classList.add('select__val_checked');
				elem.disabled = true;
				
				if (button) {
					button.innerHTML = toButtonValue;
				}
				
				input.value = toInputValue;
				
				this.close();
				
				if (window.Placeholder) {
					Placeholder.hide(input, true);
				}
				
				if (input.getAttribute('data-submit-form-onchange')) {
					Form.submitForm(input.closest('form'));
				}
				
				if (this.onSelect) {
					this.onSelect(input, toInputValue, elem.getAttribute('data-second-value'));
				}
			}
			
			this.targetAction();
			
			if (input.classList.contains('var-height-textarea__textarea')) {
				varHeightTextarea.setHeight(input);
			}
			
			this.field.classList.add('select_changed');
			
			ValidateForm.select(input);
		},
		
		setOptions: function(fieldSelector, optObj, nameKey, valKey, secValKey) {
			var fieldElements = document.querySelectorAll(fieldSelector +' .select');
			
			for (var i = 0; i < fieldElements.length; i++) {
				var optionsElem = fieldElements[i].querySelector('.select__options');
				
				optionsElem.innerHTML = '';
				
				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li'),
					secValAttr = (secValKey != undefined) ? ' data-second-value="'+ optObj[i][secValKey] +'"' : '';
					
					li.innerHTML = '<button type="button" class="select__val" data-value="'+ optObj[i][valKey] +'"'+ secValAttr +'>'+ optObj[i][nameKey] +'</button>';
					
					optionsElem.appendChild(li);
				}
			}
		},
		
		keyboard: function(key) {
			var options = this.field.querySelector('.select__options'),
			hoverItem = options.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = function (item) {
						var elem = item.nextElementSibling;
						
						while (elem) {
							if (!elem) break;
							
							if (!elemIsHidden(elem)) {
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
						
						if (!elemIsHidden(elem)) {
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
							
							if (!elemIsHidden(elem)) {
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
						
						if (!elemIsHidden(elem)) {
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
				this.selectVal(hoverItem.querySelector('.select__val'));
			}
		},
		
		build: function(elementStr) {
			const elements = document.querySelectorAll(elementStr);
			
			if (!elements.length) return;
			
			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i],
				options = elem.querySelectorAll('option'),
				parent = elem.parentElement;
				
				let optionsList = '',
				selectedOption = null;
				
				// option list
				for (let i = 0; i < options.length; i++) {
					const opt = options[i];
					
					if (opt.hasAttribute('selected')) {
						selectedOption = opt;
					}
					
					optionsList += '<li><button type="button" class="select__val'+ ((opt.hasAttribute('selected')) ? ' select__val_checked' : '') +'"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '') + ((opt.hasAttribute('data-second-value')) ? ' data-second-value="'+ opt.getAttribute('data-second-value') +'"' : '') + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '') +'>'+ opt.innerHTML +'</button></li>';
				}
				
				const require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',

				placeholder = elem.getAttribute('data-placeholder'),

				submitOnChange = (elem.hasAttribute('data-submit-form-onchange')) ? ' data-submit-form-onchange="'+ elem.getAttribute('data-submit-form-onchange') +'" ' : '',

				head = '<button type="button"'+ ((placeholder) ? ' data-placeholder="'+ placeholder +'"' : '') +' class="select__button">'+ ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') +'</button>',

				multiple = {
					class: (elem.multiple) ? ' select_multiple' : '',
					inpDiv: (elem.multiple) ? '<div class="select__multiple-inputs"></div>' : ''
				},

				hiddenInp = '<input type="hidden" name="'+ elem.name +'"'+ require + submitOnChange +'class="select__input" value="'+ ((selectedOption) ? selectedOption.value : '') +'">';

				if (elem.hasAttribute('data-empty-text')) {
					optionsList = '<li class="select__options-empty">'+ elem.getAttribute('data-empty-text') +'</li>';
				}
				
				// output select
				const customElem = document.createElement('div');

				customElem.className = 'select'+ multiple.class + ((selectedOption) ? ' select_changed' : '');

				customElem.innerHTML = head +'<ul class="select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv;

				parent.insertBefore(customElem, parent.firstChild);
				parent.removeChild(parent.children[1]);
			}
		},
		
		init: function (elementStr) {
			this.build(elementStr);
			
			// click on select or value or arrow button
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest('.select__button'),
				valElem = e.target.closest('.select__val'),
				arrElem = e.target.closest('.select__arr');
				
				if (btnElem) {
					this.field = btnElem.closest('.select');
					
					if (this.field.classList.contains('select_opened')) {
						this.close();
					} else {
						this.close();
						this.open();
					}
				} else if (valElem) {
					this.field = valElem.closest('.select');
					this.selectVal(valElem);
				} else if (arrElem) {
					if (!arrElem.closest('.select_opened')) {
						arrElem.closest('.select').querySelector('.select__autocomplete').focus();
					} else {
						this.close();
					}
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.select_opened');
				
				if (!elem) return;
				
				this.field = elem.closest('.select');
				
				var key = e.which || e.keyCode || 0;
				
				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();
					this.keyboard(key);
				}
			});
			
			// close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.select_opened')) {
					this.close();
				}
			});
		}
	};
	
	// init script
	document.addEventListener('DOMContentLoaded', function () {
		Select.init('select');
	});
})();