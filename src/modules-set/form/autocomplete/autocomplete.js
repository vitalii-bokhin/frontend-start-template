; var AutoComplete;

(function () {
	"use strict";
	
	AutoComplete = {
		field: null,
		srcData: null,

		complete: function (inpElem) {
			var optionsElem = this.field.querySelector('.autocomplete__options');
			
			if (inpElem.value.length) {
				var reg = new RegExp('^'+ inpElem.value, 'i'),
				match = false,
				data = JSON.parse(this.srcData);

				for (var i = 0; i < data.length; i++) {
					var dataVal = data[i];
					
					if (dataVal.match(reg)) {
						optionsElem.innerHTML = '';
						
						this.field.classList.add('autocomplete_opened');
					} else {
						optionsElem.innerHTML = '';

						this.field.classList.remove('autocomplete_opened');
					}
				}
			} else {
				optionsElem.innerHTML = '';
				this.field.classList.remove('autocomplete_opened');
			}
			
			if (!match) {
				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].parentElement.classList.remove('hidden');
				}
			}
		},
		
		keybinding: function (e) {
			var key = e.which || e.keyCode || 0;
			
			if (key != 40 && key != 38 && key != 13) return;
			
			e.preventDefault();
			
			var options = this.field.querySelector('.autocomplete__options'),
			hoverItem = options.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = (function (item) {
						var elem = item.nextElementSibling;
						
						while (elem) {
							if (!elem) break;
							
							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.nextElementSibling;
							}
						}
					})(hoverItem);
					
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
					var nextItem = (function (item) {
						var elem = item.previousElementSibling;
						
						while (elem) {
							if (!elem) break;
							
							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.previousElementSibling;
							}
						}
					})(hoverItem);
					
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
		
		init: function () {
			// focus event
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.field = elem.closest('.autocomplete');
				
				this.close();
				
				this.open();
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.field = elem.closest('.autocomplete');
				
				this.complete(elem);
				
				if (!this.field.classList.contains('autocomplete_opened')) {
					this.open();
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.autocomplete_opened');
				
				if (!elem) return;
				
				this.field = elem.closest('.autocomplete');
				
				this.keybinding(e);
			});
		}
	};
	
	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		AutoComplete.init();
	});
})();