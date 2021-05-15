var Popup, MediaPopup;

(function () {
    'use strict';

    //popup core
    Popup = {
        winScrollTop: 0,
        onClose: null,
        _onclose: null,
        onOpenSubscribers: [],
        headerSelector: '.header',
        delay: 300,

        init: function (elementStr) {
            document.addEventListener('click', (e) => {
                var btnElem = e.target.closest(elementStr),
                    closeBtnElem = e.target.closest('.js-popup-close');

                if (btnElem) {
                    e.preventDefault();
                    this.open(btnElem.getAttribute('data-popup'), false, btnElem);
                } else if (
                    closeBtnElem ||
                    (
                        !e.target.closest('.popup__window') &&
                        e.target.closest('.popup') &&
                        !e.target.closest('.popup[data-btn-close-only="true"]')
                    )
                ) {
                    this.close('closeButton');
                }
            });

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        open: function (elementStr, callback, btnElem) {
            const winEl = document.querySelector(elementStr);

            if (!winEl || !winEl.classList.contains('popup__window')) return;

            this.close('openPopup', winEl);

            const elemParent = winEl.parentElement;

            elemParent.style.display = 'block';

            setTimeout(function () {
                elemParent.style.opacity = '1';
            }, 121);

            elemParent.scrollTop = 0;

            setTimeout(function () {
                winEl.style.display = 'inline-block';

                if (winEl.offsetHeight < window.innerHeight) {
                    winEl.style.top = ((window.innerHeight - winEl.offsetHeight) / 2) + 'px';
                }

                winEl.style.opacity = '1';

                setTimeout(() => {
                    winEl.classList.add('popup__window_visible');
                }, this.delay);
            }, this.delay);


            if (callback) this._onclose = callback;

            this.fixBody(true);

            this.onOpenSubscribers.forEach(function (item) {
                item(elementStr, btnElem);
            });

            return winEl;
        },

        onOpen: function (fun) {
            if (typeof fun === 'function') {
                this.onOpenSubscribers.push(fun);
            }
        },

        message: function (msg, winSel, callback) {
            const winEl = this.open(winSel || '#message-popup', callback);

            winEl.querySelector('.popup__message').innerHTML = msg;
        },

        close: function (evInit, openedWinEl) {
            const visWinElems = document.querySelectorAll('.popup__window_visible');

            if (!visWinElems.length) return;

            for (let i = 0; i < visWinElems.length; i++) {
                const winEl = visWinElems[i];

                if (!winEl.classList.contains('popup__window_visible')) continue;

                winEl.style.opacity = '0';

                const samePop = openedWinEl ? winEl.parentElement === openedWinEl.parentElement : false;

                setTimeout(() => {
                    winEl.classList.remove('popup__window_visible');
                    winEl.style.display = 'none';

                    if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.opacity = '0';

                    setTimeout(() => {
                        if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.display = 'none';

                        if (evInit == 'closeButton') this.fixBody(false);
                    }, this.delay);
                }, this.delay);
            }

            if (this._onclose) {
                this._onclose();
                this._onclose = null;
            } else if (this.onClose) {
                this.onClose();
            }
        },

        fixBody: function (st) {
            var headerElem = document.querySelector(this.headerSelector);

            if (st && !document.body.classList.contains('popup-is-opened')) {
                this.winScrollTop = window.pageYOffset;

                var offset = window.innerWidth - document.documentElement.clientWidth;

                document.body.classList.add('popup-is-opened');

                if (headerElem) {
                    headerElem.style.transition = '0s';
                    headerElem.style.right = offset + 'px';
                }

                document.body.style.right = offset + 'px';

                document.body.style.top = (-this.winScrollTop) + 'px';

            } else if (!st) {
                if (headerElem) {
                    headerElem.style.right = '';
                    setTimeout(function () {
                        headerElem.style.transition = '';
                    }, 321);
                }

                document.body.classList.remove('popup-is-opened');

                window.scrollTo(0, this.winScrollTop);
            }
        }
    };

    //popup media
    MediaPopup = {
        image: function (args) {
            const elemPopup = Popup.open(args.popupStr),
                elemImg = elemPopup.querySelector('.popup-media__image');

            Popup.onClose = function () {
                elemImg.src = '#';
                elemImg.classList.remove('popup-media__image_visible');
            }

            elemImg.src = args.href;
            elemImg.classList.add('popup-media__image_visible');

        },

        video: function (args) {
            const elemPopup = Popup.open(args.popupStr),
                videoEl = elemPopup.querySelector('.popup-media__video'),
                prevEl = videoEl.querySelector('.popup-media__preview'),
                btnPlayEl = videoEl.querySelector('.popup-media__btn-play');

            Popup.onClose = function () {
                Video.stop();
                prevEl.src = '#';
                videoEl.classList.remove('popup-media__video_visible');
            }

            prevEl.src = args.preview;
            btnPlayEl.setAttribute('data-src', args.href);
            videoEl.classList.add('popup-media__video_visible');
        },

        next: function (elem) {
            if (!elem.hasAttribute('data-group')) {
                return;
            }

            var group = elem.getAttribute('data-group'),
                index = [].slice.call(document.querySelectorAll('[data-group="' + group + '"]')).indexOf(elem);
        },

        init: function (btnSel) {
            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(btnSel);

                if (!btnEl) return;

                e.preventDefault();

                const type = btnEl.getAttribute('data-type'),
                    args = {
                        href: btnEl.href,
                        preview: btnEl.getAttribute('data-preview'),
                        caption: btnEl.getAttribute('data-caption'),
                        group: btnEl.getAttribute('data-group'),
                        popupStr: btnEl.getAttribute('data-popup') || '#media-popup'
                    };

                if (type == 'image') {
                    this.image(args);
                } else if (type == 'video') {
                    this.video(args);
                }

                this.next(btnEl);
            });
        }
    };

})();