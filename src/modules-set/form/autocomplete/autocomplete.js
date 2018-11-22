; var AutoComplete;

(function () {
   "use strict";

   AutoComplete = {
      complete: function (elem) {
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

      init: function () {
         document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				Select.field = elem.closest('.custom-select');
				
				Select.close();
				
				Select.open();
         }, true);
         
         document.addEventListener('input', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				Select.field = elem.closest('.autocomplete');
				
				this.complete(elem);
				
				if (!Select.field.classList.contains('custom-select_opened')) {
					Select.open();
				}
			});
      }
   };

   // init scripts
	document.addEventListener('DOMContentLoaded', function () {
		AutoComplete.init();
	});
})();