; var AutoComplete;

(function () {
	'use strict';
	
	AutoComplete = {
		fieldElem: null,
		inputElem: null,
		optionsElem: null,
		valuesData: null,
		setValuesData: null,
		
		open: function () {
			this.fieldElem.classList.add('autocomplete_opened');
			
			var optionsElem = this.optionsElem;
			
			optionsElem.style.height = optionsElem.scrollHeight +'px';
			
			optionsElem.scrollTop = 0;
			
			setTimeout(function () {
				if (optionsElem.scrollHeight > optionsElem.offsetHeight) {
					optionsElem.classList.add('ovfauto');
				}
			}, 550);
		},
		
		close: function () {
			this.fieldElem.classList.remove('autocomplete_opened');
			
			var optionsElem = this.optionsElem;
			
			optionsElem.classList.remove('ovfauto');
			
			optionsElem.style.height = 0;
		},
		
		getValues: function () {
			var optionsElem = this.optionsElem;
			
			if (this.inputElem.value.length) {
				var preReg = new RegExp(this.inputElem.value, 'i'),
				values = '';
				
				if (this.setValuesData) {
					this.setValuesData(this.inputElem.value, (valuesData) => {
						for (var i = 0; i < valuesData.length; i++) {
							var dataVal = valuesData[i];
							
							if (dataVal.value.match(preReg)) {
								values += '<li><button type="button" class="autocomplete__val">'+ dataVal.value +'</button></li>';
							}
						}
						
						if (values == '') {
							values = '<li>Nothing found!</li>';
						}
						
						optionsElem.innerHTML = values;
						
						this.open();
					});
				}
			} else {
				optionsElem.innerHTML = '';
				
				this.close();
			}
		},
		
		selectVal: function (itemElem) {
			var valueElem = itemElem.querySelector('.autocomplete__val');
			
			if (valueElem) {
				this.inputElem.value = valueElem.innerHTML;
			}
		},
		
		keybinding: function (e) {
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
		
		init: function () {
			// focus event
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.fieldElem = elem.closest('.autocomplete');
				this.inputElem = elem;
				this.optionsElem = this.fieldElem.querySelector('.autocomplete__options');
				
				this.getValues();
			}, true);
			
			// blur event
			document.addEventListener('blur', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					setTimeout(() => {
						this.close();
					}, 21);
				}
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					this.getValues();
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