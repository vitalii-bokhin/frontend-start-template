; var AutoComplete;

(function () {
	"use strict";
	
	AutoComplete = {
		field: null,
		srcData: null,

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
		
		complete: function (inpElem) {
			var optionsElem = this.field.querySelector('.autocomplete__options');
			
			if (inpElem.value.length) {
				var reg = new RegExp('^'+ inpElem.value, 'i'),
				data = JSON.parse(this.srcData),
				values = '';
				
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

				if (this.field.querySelector('.autocomplete__val')) {
					this.open();
				}
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.field = elem.closest('.autocomplete');
				
				this.complete(elem);
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