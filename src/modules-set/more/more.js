/*
call to init:
More.init(Str button selector);
*/
var More;

(function () {
    'use strict';

    More = {
        toggle: function (elem) {
            var contentElem = elem.closest('.more').querySelector('.more__content');

            if (elem.classList.contains('active')) {
                contentElem.style.height = contentElem.getAttribute('data-height') + 'px';

                elem.classList.remove('active');

                elem.closest('.more').classList.remove('more_toggled');

                $('html,body').stop().animate({scrollTop: $(elem).attr('data-scroll-top')}, 210);

            } else {
                elem.setAttribute('data-scroll-top', $(window).scrollTop());

                contentElem.setAttribute('data-height', contentElem.offsetHeight);

                contentElem.style.height = contentElem.scrollHeight + 'px';

                elem.classList.add('active');

                elem.closest('.more').classList.add('more_toggled');

                setTimeout(function() {
                    contentElem.style.height = 'auto';
                }, 321);
            }

            setTimeout(function () {
                var btnTxt = elem.innerHTML;

                elem.innerHTML = elem.getAttribute('data-btn-text');

                elem.setAttribute('data-btn-text', btnTxt);
            }, 321);
        },

        init: function (elementStr) {
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (!elem) {
                    return;
                }

                e.preventDefault();

                this.toggle(elem);
            });
        }
    };
})();