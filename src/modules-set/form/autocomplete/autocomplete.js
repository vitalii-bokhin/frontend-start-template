; var AutoComplete;

(function () {
	'use strict';
	
	AutoComplete = {
		fieldElem: null,
		inputElem: null,
		optionsElem: null,
		valuesData: null,
		getValues: null,
		opt: {},
		
		open: function (optH) {
			this.fieldElem.classList.add('autocomplete_opened');
			
			const optionsHeight = optH || 117;
			
			this.optionsElem.style.height = (optionsHeight + 2) +'px';
			this.optionsElem.scrollTop = 0;
			
			setTimeout(() => {
				this.optionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		close: function () {
			this.fieldElem.classList.remove('autocomplete_opened');
			
			this.optionsElem.classList.remove('ovfauto');
			this.optionsElem.style.height = 0;
		},
		
		searchValue: function() {
			if (!this.getValues) return;
			
			let values = '';
			
			if (this.inputElem.value.length) {
				const preReg = new RegExp('('+ this.inputElem.value +')', 'i');
				
				this.getValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
					for (let i = 0; i < valuesData.length; i++) {
						const valData = valuesData[i];
						
						if (valData[nameKey].match(preReg)) {
							values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey].replace(preReg, '<span>$1</span>') +'</button></li>';
						}
					}
					
					if (values == '') {
						values = '<li class="autocomplete__options-empty">'+ this.inputElem.getAttribute('data-nf-text') +'</li>';
						
						this.optionsElem.innerHTML = values;
						
						this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
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
							
							values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey] +'</button></li>';
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
			var valueElem = itemElem.querySelector('.autocomplete__val');
			
			if (!valueElem) return;
			
			if (window.Placeholder) {
				Placeholder.hide(this.inputElem, true);
			}
			
			this.inputElem.value = valueElem.innerHTML.replace(/<\/?span>/g, '');
		},
		
		keybinding: function(e) {
			var key = e.which || e.keyCode || 0;
			
			if (key != 40 && key != 38 && key != 13) return;
			
			e.preventDefault();
			
			var optionsElem = this.optionsElem,
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
				if (e.target.closest('.autocomplete__input')) {
					setTimeout(() => {
						this.close();
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
				var elem = e.target.closest('.autocomplete__val');
				
				if (elem) {
					this.selectVal(elem.parentElement);
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