; var AutoComplete;

(function () {
	'use strict';
	
	AutoComplete = {
		fieldElem: null,
		inputElem: null,
		optionsElem: null,
		getValues: null,
		opt: {},
		
		open: function (optH) {
			this.fieldElem.classList.add('autocomplete_opened');
			
			const optionsHeight = optH || 185;
			
			this.optionsElem.style.height = (optionsHeight + 2) +'px';
			this.optionsElem.scrollTop = 0;
			
			setTimeout(() => {
				this.optionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		close: function (inputElem) {
			const inpElem = inputElem || this.inputElem,
			fieldElem = inpElem.closest('.autocomplete'),
			optionsElem = fieldElem.querySelector('.autocomplete__options');
			
			fieldElem.classList.remove('autocomplete_opened');
			
			optionsElem.classList.remove('ovfauto');
			optionsElem.style.height = 0;
		},
		
		searchValue: function() {
			if (!this.getValues) return;
			
			let values = '';
			
			if (this.inputElem.value.length) {
				const preReg = new RegExp('('+ this.inputElem.value +')', 'i');
				
				this.getValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
					for (let i = 0; i < valuesData.length; i++) {
						const valData = valuesData[i];
						
						if (nameKey !== undefined) {
							if (valData[nameKey].match(preReg)) {
								values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey].replace(preReg, '<span>$1</span>') +'</button></li>';
							}
						} else {
							if (valData.match(preReg)) {
								values += '<li><button type="button" class="autocomplete__val">'+ valData.replace(preReg, '<span>$1</span>') +'</button></li>';
							}
						}
					}
					
					if (values == '') {
						if (this.inputElem.hasAttribute('data-other-value')) {
							values = '<li class="autocomplete__options-other"><button type="button" class="autocomplete__val">'+ this.inputElem.getAttribute('data-other-value') +'</button></li>';

							this.optionsElem.innerHTML = values;
							
							this.open(this.optionsElem.querySelector('.autocomplete__options-other').offsetHeight);
						} else {
							values = '<li class="autocomplete__options-empty">'+ this.inputElem.getAttribute('data-nf-text') +'</li>';
							
							this.optionsElem.innerHTML = values;
							
							this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
						}
						
						
					} else {
						this.optionsElem.innerHTML = values;
						this.open();
					}
				});
			} else {
				if (this.opt.getAllValuesIfEmpty) {
					this.getValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
						for (let i = 0; i < valuesData.length; i++) {
							const valData = valuesData[i];
							
							if (nameKey !== undefined) {
								values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey] +'</button></li>';
							} else {
								values += '<li><button type="button" class="autocomplete__val">'+ valData +'</button></li>';
							}
						}
						
						this.optionsElem.innerHTML = values;
						this.open();
					});
				} else {
					this.optionsElem.innerHTML = '';
					this.close();
				}
			}
		},
		
		selectVal: function(itemElem) {
			const valueElem = itemElem.querySelector('.autocomplete__val');
			
			if (!valueElem) return;
			
			if (window.Placeholder) {
				Placeholder.hide(this.inputElem, true);
			}
			
			this.inputElem.value = valueElem.innerHTML.replace(/<\/?span>/g, '');
		},
		
		keybinding: function(e) {
			const key = e.which || e.keyCode || 0;
			
			if (key != 40 && key != 38 && key != 13) return;
			
			e.preventDefault();
			
			const optionsElem = this.optionsElem,
			hoverItem = optionsElem.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = hoverItem.nextElementSibling;
					
					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);
						
						this.selectVal(nextItem);
					}
				} else {
					var nextItem = optionsElem.firstElementChild;
					
					if (nextItem) {
						nextItem.classList.add('hover');
						
						this.selectVal(nextItem);
					}
				}
				break;
				
				case 38:
				if (hoverItem) {
					var nextItem = hoverItem.previousElementSibling;
					
					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);
						
						this.selectVal(nextItem);
					}
				} else {
					var nextItem = optionsElem.lastElementChild;
					
					if (nextItem) {
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = 9999;
						
						this.selectVal(nextItem);
					}
				}
				break;
				
				case 13:
				if (hoverItem) {
					this.selectVal(hoverItem);
					
					this.inputElem.blur();
				}
			}
		},
		
		init: function(options) {
			options = options || {};
			
			this.opt.getAllValuesIfEmpty = (options.getAllValuesIfEmpty !== undefined) ? options.getAllValuesIfEmpty : true;
			
			// focus event
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.fieldElem = elem.closest('.autocomplete');
				this.inputElem = elem;
				this.optionsElem = this.fieldElem.querySelector('.autocomplete__options');
				
				this.searchValue();
			}, true);
			
			// blur event
			document.addEventListener('blur', (e) => {
				const inpElem = e.target.closest('.autocomplete__input');
				
				if (inpElem) {
					setTimeout(() => {
						this.close(inpElem);
					}, 321);
				}
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					this.searchValue();
				}
			});
			
			// click event
			document.addEventListener('click', (e) => {
				const valElem = e.target.closest('.autocomplete__val'),
				arrElem = e.target.closest('.autocomplete__arr');
				
				if (valElem) {
					this.selectVal(valElem.parentElement);
				} else if (arrElem) {
					if (!arrElem.closest('.autocomplete_opened')) {
						arrElem.closest('.autocomplete').querySelector('.autocomplete__input').focus();
					} else {
						this.close();
					}
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				if (e.target.closest('.autocomplete_opened')) {
					this.keybinding(e);
				}
			});
		}
	};
	
	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		AutoComplete.init();
	});
})();