var Popup, MediaPopup;

(function () {
	'use strict';

	//popup core
	Popup = {
		winScrollTop: 0,
		onClose: null,
		_onclose: null,
		onOpen: null,
		headerSelector: '.header',

		fixBody: function (st) {
			var headerElem = document.querySelector(this.headerSelector);

			if (st && !document.body.classList.contains('popup-is-opened')) {
				this.winScrollTop = window.pageYOffset;

				var offset = window.innerWidth - document.documentElement.clientWidth;

				document.body.classList.add('popup-is-opened');

				if (headerElem) {
					headerElem.style.right = offset + 'px';
				}

				document.body.style.right = offset + 'px';

				document.body.style.top = (-this.winScrollTop) + 'px';
			} else if (!st) {
				if (headerElem) {
					headerElem.style.right = '';
				}

				document.body.classList.remove('popup-is-opened');

				window.scrollTo(0, this.winScrollTop);
			}
		},

		open: function (elementStr, callback, btnElem) {
			var elem = document.querySelector(elementStr);

			if (!elem || !elem.classList.contains('popup__window')) {
				return;
			}

			this.close();

			var elemParent = elem.parentElement;

			elemParent.classList.add('popup_visible');

			elemParent.scrollTop = 0;

			elem.classList.add('popup__window_visible');

			if (callback) {
				this._onclose = callback;
			}

			this.fixBody(true);

			if (this.onOpen) {
				this.onOpen(elementStr, btnElem);
			}

			return elem;
		},

		message: function (msg, elementStr, callback) {
			const elemStr = elementStr || '#message-popup',
				elem = this.open(elemStr, callback);

			elem.querySelector('.popup__inner').innerHTML = '<div class="popup__message m-0">' + msg + '</div>';
		},

		close: function () {
			var elements = document.querySelectorAll('.popup__window');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.classList.contains('popup__window_visible')) {
					continue;
				}

				elem.classList.remove('popup__window_visible');

				elem.parentElement.classList.remove('popup_visible');
			}

			if (this._onclose) {
				this._onclose();
				this._onclose = null;
			} else if (this.onClose) {
				this.onClose();
			}
		},

		init: function (elementStr) {
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest(elementStr),
					closeBtnElem = e.target.closest('.js-popup-close');

				if (btnElem) {
					e.preventDefault();
					this.open(btnElem.getAttribute('data-popup'), false, btnElem);
				} else if (
					closeBtnElem ||
					(!e.target.closest('.popup__window') && e.target.closest('.popup') && !e.target.closest('.btn-close-only'))
				) {
					this.fixBody(false);
					this.close();
				}
			});

			if (window.location.hash) {
				this.open(window.location.hash);
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