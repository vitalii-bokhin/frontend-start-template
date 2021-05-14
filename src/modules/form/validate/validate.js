var ValidateForm;

(function() {
    'use strict';

    ValidateForm = {
        input: null,
        formSelector: null,

        errorTip: function (err, errInd, errorTxt) {
            const field = this.input.closest('.form__field') || this.input.parentElement,
                tipEl = field.querySelector('.field-error-tip');

            if (err) {
                field.classList.remove('field-success');
                field.classList.add('field-error');

                if (errInd) {
                    if (tipEl) {
                        if (!tipEl.hasAttribute('data-error-text')) {
                            tipEl.setAttribute('data-error-text', tipEl.innerHTML);
                        }
                        tipEl.innerHTML = (errInd != 'custom') ? tipEl.getAttribute('data-error-text-' + errInd) : errorTxt;
                    }

                    field.setAttribute('data-error-index', errInd);

                } else {
                    if (tipEl && tipEl.hasAttribute('data-error-text')) {
                        tipEl.innerHTML = tipEl.getAttribute('data-error-text');
                    }

                    field.removeAttribute('data-error-index');
                }

            } else {
                field.classList.remove('field-error');
                field.classList.add('field-success');
                field.removeAttribute('data-error-index');
            }
        },

        customErrorTip: function (input, errorTxt, isLockForm) {
            if (!input) return;

            this.input = input;

            if (errorTxt) {
                this.errorTip(true, 'custom', errorTxt);

                if (isLockForm) {
                    input.setAttribute('data-custom-error', 'true');
                }
            } else {
                this.errorTip(false);
                input.removeAttribute('data-custom-error');

                this.validate(input.closest('form'));
            }
        },

        formError: function (formElem, err, errTxt) {
            const errTipElem = formElem.querySelector('.form-error-tip');

            if (err) {
                formElem.classList.add('form-error');

                if (!errTipElem) return;

                if (errTxt) {
                    if (!errTipElem.hasAttribute('data-error-text')) {
                        errTipElem.setAttribute('data-error-text', errTipElem.innerHTML);
                    }

                    errTipElem.innerHTML = errTxt;
                } else if (errTipElem.hasAttribute('data-error-text')) {
                    errTipElem.innerHTML = errTipElem.getAttribute('data-error-text');
                }
            } else {
                formElem.classList.remove('form-error');
            }
        },

        customFormErrorTip: function (formElem, errorTxt) {
            if (!formElem) return;

            if (errorTxt) {
                this.formError(formElem, true, errorTxt);
            } else {
                this.formError(formElem, false);
            }
        },

        txt: function () {
            let err = false;

            if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        num: function () {
            let err = false;

            if (!/^[0-9.,-]*$/.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        cardNumber: function () {
            let err = false;

            if (!/^\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        name: function () {
            let err = false;

            if (!/^[a-zа-яё'\s-]{2,21}(\s[a-zа-яё'\s-]{2,21})?(\s[a-zа-яё'\s-]{2,21})?$/i.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        date: function () {
            let err = false,
                errDate = false,
                matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

            if (!matches) {
                errDate = 1;
            } else {
                var compDate = new Date(matches[3], (matches[2] - 1), matches[1]),
                    curDate = new Date();

                if (this.input.hasAttribute('data-min-years-passed')) {
                    var interval = curDate.valueOf() - new Date(curDate.getFullYear() - (+this.input.getAttribute('data-min-years-passed')), curDate.getMonth(), curDate.getDate()).valueOf();

                    if (curDate.valueOf() < compDate.valueOf() || (curDate.getFullYear() - matches[3]) > 100) {
                        errDate = 1;
                    } else if ((curDate.valueOf() - compDate.valueOf()) < interval) {
                        errDate = 2;
                    }
                }

                if (compDate.getFullYear() != matches[3] || compDate.getMonth() != (matches[2] - 1) || compDate.getDate() != matches[1]) {
                    errDate = 1;
                }
            }

            if (errDate == 1) {
                this.errorTip(true, 2);
                err = true;
            } else if (errDate == 2) {
                this.errorTip(true, 3);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        time: function () {
            const matches = this.input.value.match(/^(\d{1,2}):(\d{1,2})$/);

            let err = false;

            if (!matches || Number(matches[1]) > 23 || Number(matches[2]) > 59) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        email: function () {
            let err = false;

            if (!/^[a-z0-9]+[\w\-\.]*@([\w\-]{2,}\.)+[a-z]{2,}$/i.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        url: function () {
            let err = false;

            if (!/^(https?\:\/\/)?[а-я\w-.]+\.[a-zа-я]{2,11}[/?а-я\w/=-]+$/i.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        tel: function () {
            let err = false;

            if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        pass: function () {
            let err = false,
                minLng = this.input.getAttribute('data-min-length');

            if (minLng && this.input.value.length < minLng) {
                this.errorTip(true, 2);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        checkbox: function (elem) {
            this.input = elem;

            var group = elem.closest('.form__chbox-group');

            if (group && group.getAttribute('data-tested')) {
                var checkedElements = 0,
                    elements = group.querySelectorAll('input[type="checkbox"]');

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                } else {
                    group.classList.remove('form__chbox-group_error');
                }

            } else if (elem.getAttribute('data-tested')) {
                if (elem.getAttribute('data-required') && !elem.checked) {
                    this.errorTip(true);
                } else {
                    this.errorTip(false);
                }
            }
        },

        radio: function (elem) {
            this.input = elem;

            var checkedElement = false,
                group = elem.closest('.form__radio-group');

            if (!group) return;

            var elements = group.querySelectorAll('input[type="radio"]');

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].checked) {
                    checkedElement = true;
                }
            }

            if (!checkedElement) {
                group.classList.add('form__radio-group_error');
            } else {
                group.classList.remove('form__radio-group_error');
            }
        },

        select: function (elem) {
            let err = false;

            this.input = elem;

            if (elem.getAttribute('data-required') && !elem.value.length) {
                this.errorTip(true);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        file: function (elem, filesArr) {
            this.input = elem;

            let err = false,
                errCount = { ext: 0, size: 0 },
                maxFiles = +this.input.getAttribute('data-max-files'),
                extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
                maxSize = +this.input.getAttribute('data-max-size'),
                fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');;

            for (var i = 0; i < filesArr.length; i++) {
                var file = filesArr[i];

                if (!file.name.match(extRegExp)) {
                    errCount.ext++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }

                    continue;
                }

                if (file.size > maxSize) {
                    errCount.size++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }
                }
            }

            if (maxFiles && filesArr.length > maxFiles) {
                this.errorTip(true, 4);
                err = true;
            } else if (errCount.ext) {
                this.errorTip(true, 2);
                err = true;
            } else if (errCount.size) {
                this.errorTip(true, 3);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        validateOnInput: function (elem) {
            this.input = elem;

            const dataType = elem.getAttribute('data-type');

            if (elem.getAttribute('data-required') && (!elem.value.length || /^\s+$/.test(elem.value))) {
                this.errorTip(true);
            } else if (elem.value.length) {
                if (dataType) {
                    try {
                        this[dataType]();
                    } catch (error) {
                        console.log('Error while process', dataType)
                    }
                } else {
                    this.errorTip(false);
                }
            } else {
                this.errorTip(false);
            }
        },

        validate: function (formElem) {
            let err = 0;

            // text, password, textarea
            const elements = formElem.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], input[type="tel"], textarea');

            const checkElems = (elements) => {
                for (let i = 0; i < elements.length; i++) {
                    const elem = elements[i];

                    if (elemIsHidden(elem)) continue;

                    this.input = elem;

                    elem.setAttribute('data-tested', 'true');

                    const dataType = elem.getAttribute('data-type');

                    if (elem.getAttribute('data-required') && (!elem.value.length || /^\s+$/.test(elem.value))) {
                        this.errorTip(true);
                        err++;
                    } else if (elem.value.length) {
                        if (elem.hasAttribute('data-custom-error')) {
                            err++;
                        } else if (dataType) {
                            try {
                                if (this[dataType]()) {
                                    err++;
                                }
                            } catch (error) {
                                console.log('Error while process', dataType)
                            }
                        } else {
                            this.errorTip(false);
                        }
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            checkElems(elements);

            if (formElem.id) {
                const elements = document.querySelectorAll('input[form="' + formElem.id + '"]');

                checkElems(elements);
            }

            // select
            const selectElements = formElem.querySelectorAll('.select__input');

            for (let i = 0; i < selectElements.length; i++) {
                const selectElem = selectElements[i];

                if (elemIsHidden(selectElem.parentElement)) continue;

                if (this.select(selectElem)) {
                    err++;
                }
            }

            // checkboxes
            const chboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < chboxEls.length; i++) {
                const elem = chboxEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                elem.setAttribute('data-tested', 'true');

                if (elem.getAttribute('data-required') && !elem.checked) {
                    this.errorTip(true);
                    err++;
                } else {
                    this.errorTip(false);
                }
            }

            // checkbox group
            const chboxGrEls = formElem.querySelectorAll('.form__chbox-group');

            for (let i = 0; i < chboxGrEls.length; i++) {
                var group = chboxGrEls[i],
                    checkedElements = 0;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const chboxInGrEls = group.querySelectorAll('input[type="checkbox"]');

                for (let i = 0; i < chboxInGrEls.length; i++) {
                    if (chboxInGrEls[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                    err++;
                } else {
                    group.classList.remove('form__chbox-group_error');
                }
            }

            // radio group
            const radGrEls = formElem.querySelectorAll('.form__radio-group');

            for (let i = 0; i < radGrEls.length; i++) {
                var group = radGrEls[i],
                    checkedElement = false;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const radInGrEls = group.querySelectorAll('input[type="radio"]');

                for (let i = 0; i < radInGrEls.length; i++) {
                    if (radInGrEls[i].checked) {
                        checkedElement = true;
                    }
                }

                if (!checkedElement) {
                    group.classList.add('form__radio-group_error');
                    err++;
                } else {
                    group.classList.remove('form__radio-group_error');
                }
            }

            // file
            const fileEls = formElem.querySelectorAll('input[type="file"]');

            for (var i = 0; i < fileEls.length; i++) {
                var elem = fileEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                if (CustomFile.inputFiles(elem).length) {
                    if (this.file(elem, CustomFile.inputFiles(elem))) {
                        err++;
                    }
                } else if (elem.getAttribute('data-required')) {
                    this.errorTip(true);
                    err++;
                } else {
                    this.errorTip(false);
                }
            }

            // passwords compare
            const pwdCompEls = formElem.querySelectorAll('input[data-pass-compare-input]');

            for (var i = 0; i < pwdCompEls.length; i++) {
                var elem = pwdCompEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                var val = elem.value;

                if (val.length) {
                    var compElemVal = formElem.querySelector(elem.getAttribute('data-pass-compare-input')).value;

                    if (val !== compElemVal) {
                        this.errorTip(true, 2);
                        err++;
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            this.formError(formElem, err);

            return (err) ? false : true;
        },

        init: function (formSelector) {
            this.formSelector = formSelector;

            document.removeEventListener('input', this.inpH);
            document.removeEventListener('change', this.chH);

            this.inpH = this.inpH.bind(this);
            this.chH = this.chH.bind(this);

            document.addEventListener('input', this.inpH);
            document.addEventListener('change', this.chH);
        },

        inpH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="text"],' + this.formSelector + ' input[type="password"],' + this.formSelector + ' input[type="number"],' + this.formSelector + ' input[type="tel"],' + this.formSelector + ' textarea, input[type="text"][form]');

            if (elem && elem.hasAttribute('data-tested')) {
                setTimeout(() => {
                    this.validateOnInput(elem);
                }, 121);
            }
        },

        chH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="radio"],' + this.formSelector + ' input[type="checkbox"]');

            if (elem) {
                this[elem.type](elem);
            }
        }
    };
})();