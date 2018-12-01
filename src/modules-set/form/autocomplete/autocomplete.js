; var AutoComplete;

(function () {
	"use strict";
	
	AutoComplete = {
		field: null,
		input: null,
		valuesData: null,
		inputValue: '',
		
		open: function () {
			this.field.classList.add('autocomplete_opened');
			
			var opionsElem = this.field.querySelector('.autocomplete__options');
			
			opionsElem.style.height = opionsElem.scrollHeight +'px';
			
			opionsElem.scrollTop = 0;
			
			setTimeout(function () {
				if (opionsElem.scrollHeight > opionsElem.offsetHeight) {
					opionsElem.classList.add('ovfauto');
				}
			}, 550);
		},
		
		close: function () {
			this.field.classList.remove('autocomplete_opened');
			
			var opionsElem = this.field.querySelector('.autocomplete__options');
			
			opionsElem.classList.remove('ovfauto');
			
			opionsElem.style.height = 0;
		},
		
		getValues: function () {
			var optionsElem = this.field.querySelector('.autocomplete__options');
			
			if (this.input.value.length) {
				var reg = new RegExp('^'+ this.input.value, 'i'),
				data = JSON.parse(this.valuesData),
				values = '';

				this.inputValue = this.input.value;
				
				for (var i = 0; i < data.length; i++) {
					var dataVal = data[i];
					
					if (dataVal.name.match(reg)) {
						values += '<li><button type="button" class="autocomplete__val">'+ dataVal.name +'</button></li>';
					}
				}
				
				optionsElem.innerHTML = values;
				
				if (values != '') {
					this.open();
				} else {
					this.close();
				}
				
				values = '';
			} else {
				optionsElem.innerHTML = '';
				
				this.close();
			}
		},

		selectVal: function (itemElem) {
			var valueElem = itemElem.querySelector('.autocomplete__val');

			this.input.value = valueElem.innerHTML;
		},
		
		keybinding: function (e) {
			var key = e.which || e.keyCode || 0;
			
			if (key != 40 && key != 38 && key != 13) return;
			
			e.preventDefault();
			
			var optionsElem = this.field.querySelector('.autocomplete__options'),
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

					this.input.blur();
				}
			}
		},
		
		init: function () {
			// focus event
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.field = elem.closest('.autocomplete');
				this.input = elem;
				
				if (this.field.querySelector('.autocomplete__val')) {
					this.open();
				}
			}, true);
			
			// blur event
			document.addEventListener('blur', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					this.close();
				}
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					this.getValues();
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