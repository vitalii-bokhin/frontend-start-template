/*
* call new Accord(Str button selector [, autoScroll viewport width]).init();
*/
var Accord;

(function () {
    'use strict';

    Accord = function (btnSel, autoScroll) {
        this.btnSel = btnSel;
        this.initialized = false;
        this.autoScroll = autoScroll;

        this.init = function () {
            if (this.initialized || !document.querySelectorAll('.accord').length) return;

            this.initialized = true;

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(this.btnSel);

                if (!btnEl || btnEl.closest('.accord_closed')) return;

                e.preventDefault();

                this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            const contentElem = elem.nextElementSibling;

            if (elem.classList.contains('accord__button_active')) {
                contentElem.style.height = 0;

                elem.classList.remove('accord__button_active');

            } else {
                const mainElem = elem.closest('.accord'),
                    allButtonElem = mainElem.querySelectorAll('.accord__button'),
                    allContentElem = mainElem.querySelectorAll('.accord__content');

                for (let i = 0; i < allButtonElem.length; i++) {
                    allButtonElem[i].classList.remove('accord__button_active');
                    allContentElem[i].style.height = 0;
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                elem.classList.add('accord__button_active');

                if (this.autoScroll && window.innerWidth <= this.autoScroll) {
                    this.scroll(elem);
                }
            }
        }

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop().animate({ scrollTop: $(elem).position().top - 20 }, 721);
            }, 121);
        }
    };
})();