var Maskinput;

(function () {
    'use strict';

    Maskinput = function (inputSel, type, opt) {
        // if (!this.inputElem) return;

        opt = opt || {};

        var defValue = '';

        this.inputElem = null;

        this.tel = function (evStr) {
            if (evStr == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+7(';
            }

            if (!/[\+\d\(\)\-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
                    cursPos = this.inputElem.selectionStart;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function (str, p1, p2, p3, p4) {
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

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.date = function (ev) {
            if (ev == 'focus') return;

            if (!/[\d\/]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/, function (str, p1, p2, p3) {
                        let res;

                        if (p3 != '') {
                            res = p1 + '/' + p2 + '/' + p3;
                        } else if (p2 != '') {
                            res = p1 + '/' + p2;
                        }

                        return res;
                    });
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.gmail = function (ev) {
            if (ev == 'focus') return;

            if (!/[@\w.-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^[\w.-]*(@gmail\.com)?$/;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^([\w.-]*)@(?:gmail\.com)?$/, '$1@gmail.com');
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.number = function (ev) {
            if (ev == 'focus') return;

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d*$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.float = function (ev) {
            if (ev == 'focus') return;

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d[\d.,]*?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.cyr = function (ev) {
            if (ev == 'focus') return;

            if (!/^[а-я\s]*$/i.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                defValue = this.inputElem.value;
            }
        }

        console.log(type);

        document.addEventListener('input', (e) => {
            const inpEl = e.target.closest(inputSel);

            console.log(inputSel);
            console.log(e.target);
            console.log(inpEl);

            if (inpEl) {
                this.inputElem = inpEl;

                console.log(this);

                try {
                    this[type]();
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        });

        // this.inputElem.addEventListener('input', () => {
        //     try {
        //         this[type]();
        //     } catch (error) {
        //         console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
        //     }
        // });

        // this.inputElem.addEventListener('focus', () => {
        //     try {
        //         this[type]('focus');
        //     } catch (error) {
        //         console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
        //     }
        // }, true);
    }
})();