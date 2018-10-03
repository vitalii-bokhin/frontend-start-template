var Maskinput;

(function() {
	"use strict";

	Maskinput = function(inputElem, type) {
		if (!inputElem) {
			return;
		}

		var defValue = '';

		this.tel = function() {
			if (!/^\+7?((?<=\d)\(\d{0,3})?((?<=[\d\(])\)\d{0,3})?((?<=\)[\d\-]*)(\-\d{0,2})){0,2}$/.test(inputElem.value)) {
				inputElem.value = defValue;
				console.log('input default');
			} else {
				defValue = inputElem.value;
				console.log('input normal');
			}

			//console.log('curs pos before', inputElem.selectionStart, inputElem.selectionEnd);

			/*var cursPos = inputElem.selectionStart,
			//rawValue = inpValue.replace(/(\+7|\D)+/g, ''),
			replacedValue = inpValue.replace(/^(?:\+7)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function(str, p1, p2, p3, p4) {
				var repl = '';

				console.log(arguments);

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
			});*/

			//console.log(replacedValue, rawValue);
			
			//inputElem.value = replacedValue;

			//console.log('curs pos after', inputElem.selectionStart, inputElem.selectionEnd);

			if (/^\+7\(\d{0,3}\)\d{0,3}\-\d{0,2}\-\d{2}$/.test(inputElem.value)) {
				//inputElem.selectionStart = inputElem.selectionEnd = cursPos;
			}

			

			
		}

		inputElem.addEventListener('input', () => {
			this[type]();
		});
	}
}());