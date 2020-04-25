var Maskinput;

(function () {
	'use strict';

	Maskinput = function (inputElem, type) {
		if (!inputElem) return;

		var defValue = '';

		this.tel = function (evStr) {
			if (evStr == 'focus' && !inputElem.value.length) {
				inputElem.value = '+7(';
			}

			if (!/[\+\d\(\)\-]*/.test(inputElem.value)) {
				inputElem.value = defValue;
			} else {
				var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
					cursPos = inputElem.selectionStart;

				if (!reg.test(inputElem.value)) {
					inputElem.value = inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function (str, p1, p2, p3, p4) {
						var res = '';

						if (p4 != '') {
							res = '+7(' + p1 + ')' + p2 + '-' + p3 + '-' + p4;
						} else if (p3 != '') {
							res = '+7(' + p1 + ')' + p2 + '-' + p3;
						} else if (p2 != '') {
							res = '+7(' + p1 + ')' + p2;
						} else if (p1 != '') {
							res = '+7(' + p1;
						}

						return res;
					});
				}

				if (!reg.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		this.date = function (ev) {
			if (ev == 'focus') return;
			
			if (!/[\d\/]*/.test(inputElem.value)) {
				inputElem.value = defValue;
				console.log('def');
			} else {
				const reg = /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/;

				if (!reg.test(inputElem.value)) {
					console.log('fst');
					inputElem.value = inputElem.value.replace(/^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/, function (str, p1, p2, p3) {
						let res;

						if (p3 != '') {
							res = p1 + '/' + p2 + '/' + p3;
						} else if (p2 != '') {
							res = p1 + '/' + p2;
						}

						return res;
					});
				}

				console.log(inputElem.value);

				if (!reg.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		inputElem.addEventListener('input', () => {
			this[type]();
		});

		inputElem.addEventListener('focus', () => {
			this[type]('focus');
		}, true);
	}
})();