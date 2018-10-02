var Maskinput;

(function() {
	"use strict";

	Maskinput = function(inputElem, type) {
		if (!inputElem) {
			return;
		}

		var defValue = null,
		inpValue = null;

		this.tel = function() {
			if (!/^[\+\(\)\d\-]{0,16}$/.test(inputElem.value)) {
				inpValue = defValue;
				console.log('input default');
			} else {
				inpValue = inputElem.value;
				defValue = inputElem.value;
			}


			var rawValue = inpValue.replace(/(\+7|\D)+/g, ''),
			replacedValue = rawValue.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, function(str, p1, p2, p3, p4) {
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
			
			inputElem.value = replacedValue;
		}

		inputElem.addEventListener('input', () => {
			this[type]();
		});
	}
}());