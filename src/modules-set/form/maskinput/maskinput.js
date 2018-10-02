var Maskinput;

(function() {
	"use strict";

	Maskinput = function(inputElem, type) {
		if (!inputElem) {
			return;
		}

		var defValue = null;

		function tel() {
			var rawValue = inputElem.value.replace(/(\+7|\D)+/g, ''),
			replacedValue = rawValue.replace(/^(?:[\+7]{0,2}?)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, function(str, p1, p2, p3, p4) {
				var repl = '';

				if (p4 != '') {
					repl = '+7('+ p1 +')'+ p2 +'-'+ p3 +'-'+ p4;
				} else if (p3 != '') {
					repl = '+7('+ p1 +')'+ p2 +'-'+ p3;
				} else if (p2 != '') {
					repl = '+7('+ p1 +')'+ p2;
				} else if (p1 != '') {
					repl = '+7('+ p1;
				}

				return repl;
			});

			console.log(replacedValue, rawValue);

			if (!/^\+7\(?\d{0,3}?\)?\d{0,3}?\-?\d{0,2}?\-?\d{0,2}?$/.test(replacedValue)) {
				inputElem.value = defValue;
				console.log('stop');
			} else {
				inputElem.value = replacedValue;
				defValue = replacedValue;
			}
			
			//console.log(this.inputValue);
		}

		inputElem.addEventListener('input', () => {
			[type]();
		});
	}
}());