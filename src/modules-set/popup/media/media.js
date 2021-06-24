var MediaPopup;

(function () {
    'use strict';

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