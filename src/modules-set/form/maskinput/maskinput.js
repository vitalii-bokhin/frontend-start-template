var Maskinput;

(function () {
	'use strict';

	Maskinput = function (inputElem, type, opt) {
		if (!inputElem) return;

		opt = opt || {};

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
			} else {
				const reg = /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/;

				if (!reg.test(inputElem.value)) {
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

				if (!reg.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		this.gmail = function (ev) {
			if (ev == 'focus') return;

			if (!/[@\w.-]*/.test(inputElem.value)) {
				inputElem.value = defValue;
			} else {
				const reg = /^[\w.-]*(@gmail\.com)?$/;

				if (!reg.test(inputElem.value)) {
					inputElem.value = inputElem.value.replace(/^([\w.-]*)@(?:gmail\.com)?$/, '$1@gmail.com');
				}

				if (!reg.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		this.number = function (ev) {
			if (ev == 'focus') return;

			if (opt.maxLength && inputElem.value.length > opt.maxLength) {
				inputElem.value = defValue;
			} else {
				if (!/^\d*$/.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		this.cyr = function (ev) {
			if (ev == 'focus') return;

			if (!/^[а-я\s]*$/i.test(inputElem.value)) {
				inputElem.value = defValue;
			} else {
				defValue = inputElem.value;
			}
		}

		inputElem.addEventListener('input', () => {
			try {
				this[type]();
			} catch (error) {
				console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
			}
		});

		inputElem.addEventListener('focus', () => {
			try {
				this[type]('focus');
			} catch (error) {
				console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
			}
		}, true);
	}
})();