/*
* call new Accord(Str button selector [, autoScroll viewport width]).init();
*/
var Accord;

(function () {
    'use strict';

    Accord = function (btnSel, autoScroll, maxViewport) {
        this.btnSel = btnSel;
        this.initialized = false;
        this.autoScroll = autoScroll;

        this.init = function () {
            if (this.initialized || !document.querySelectorAll('.accord').length) return;

            this.initialized = true;

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(this.btnSel);

                if (
                    !btnEl || btnEl.closest('.accord_closed') ||
                    (maxViewport && window.innerWidth > maxViewport)
                ) {
                    return;
                }

                e.preventDefault();

                this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            const contentElem = elem.closest('.accord__item').querySelector('.accord__content');

            if (elem.classList.contains('accord__button_active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = '0';
                }, 21);

                elem.classList.remove('accord__button_active');

            } else {
                const mainElem = elem.closest('.accord'),
                    allButtonElem = mainElem.querySelectorAll('.accord__button'),
                    allContentElem = mainElem.querySelectorAll('.accord__content');

                for (let i = 0; i < allButtonElem.length; i++) {
                    if (allButtonElem[i] != elem) {
                        allButtonElem[i].classList.remove('accord__button_active');

                        allContentElem[i].style.height = allContentElem[i].offsetHeight + 'px';

                        setTimeout(function () {
                            allContentElem[i].style.height = '0';
                        }, 21);
                    }
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = 'auto';
                }, 300);

                elem.classList.add('accord__button_active');

                if (this.autoScroll && window.innerWidth <= this.autoScroll) {
                    this.scroll(elem);
                }
            }
        }

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop().animate({ scrollTop: $(elem).position().top - 20 }, 721);
            }, 321);
        }
    };
})();