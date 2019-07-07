/* 
Screens.init({
	container: '.main',
	duration: 700 // default - 1000,
	menuCurrentClass: 'current' // default - 'menu__item_current'
});
*/

; var Screens;

(function () {
	'use strict';

	Screens = {
		options: null,
		contElem: null,
		scrolling: false,
		scrollSum: 0,

		menu: function (currentScreenElem) {
			const menuElements = document.querySelectorAll('.js-change-screen-menu'),
				curMenuItElem = document.querySelector('.js-change-screen-menu[data-screen="#' + currentScreenElem.id + '"]'),
				curClass = this.options.menuCurrentClass || 'menu__item_current';

			for (let i = 0; i < menuElements.length; i++) {
				const mEl = menuElements[i];

				mEl.parentElement.classList.remove(curClass);
			}

			if (curMenuItElem) {
				curMenuItElem.parentElement.classList.add(curClass);
			}
		},

		changeSection: function (nextScreenElem) {
			const currentScreenElem = this.contElem.querySelector('.screen_visible');

			if (nextScreenElem === currentScreenElem) return;

			this.scrolling = true;
			this.scrollSum = 0;

			const duration = this.options.duration || 1000;

			currentScreenElem.classList.remove('screen_active');

			nextScreenElem.classList.add('screen_visible');

			setTimeout(() => {
				this.menu(nextScreenElem);
			}, duration / 2);

			animate(function (progress) {
				currentScreenElem.style.opacity = 1 - progress;

				nextScreenElem.style.opacity = progress;
			}, duration, false, () => {
				setTimeout(() => {
					currentScreenElem.classList.remove('screen_visible');

					nextScreenElem.classList.add('screen_active');

					this.scrolling = false;
				}, 21);
			});

			window.location.hash = '#' + nextScreenElem.id.split('-')[0];

			if (window.Video && Video.stop != undefined) {
				Video.stop();
			}
		},

		mouseScroll: function (delta) {
			const currentScreenElem = this.contElem.querySelector('.screen_visible');

			let nextScreenElem = null;

			if (delta > 0) {
				if (currentScreenElem && currentScreenElem.nextElementSibling && currentScreenElem.nextElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.nextElementSibling;
				}
			} else if (delta < 0) {
				if (currentScreenElem && currentScreenElem.previousElementSibling && currentScreenElem.previousElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.previousElementSibling;
				}
			}

			if (nextScreenElem) {
				this.changeSection(nextScreenElem);
			}
		},

		init: function (options) {
			const contElem = document.querySelector(options.container);

			if (!contElem) return;

			this.options = options;
			this.contElem = contElem;

			// const screenElements = contElem.querySelectorAll('.screen');

			// for (let i = 0; i < screenElements.length; i++) {
			// 	const scrElem = screenElements[i];

			// 	scrElem.setAttribute('data-height', scrElem.scrollHeight);

			// 	if (!i) {
			// 		contElem.style.height = scrElem.scrollHeight + 'px';
			// 	}
			// }

			if ('ontouchstart' in document) {
				const _this = this;

				$(contElem).swipe({
					allowPageScroll: "vertical",
					swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

						if (direction == 'down' && window.pageYOffset == 0) {
							if (!_this.scrolling) {
								_this.mouseScroll(-1);
							}
						} else if (direction == 'up') {
							if (!_this.scrolling) {
								_this.mouseScroll(1);
							}
						}
					}
				});
			} else if ('onwheel' in document) {
				contElem.addEventListener('wheel', (e) => {
					if (document.documentElement.offsetHeight >= document.documentElement.scrollHeight) {
						e.preventDefault();

						if (!this.scrolling) {
							this.mouseScroll(e.deltaY);
						}
					} else {
						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

						if ((e.deltaY > 0 && window.pageYOffset >= dS) || e.deltaY < 0 && window.pageYOffset == 0) {
							e.preventDefault();

							const absDelta = Math.abs(e.deltaY);

							this.scrollSum += absDelta;

							if (!this.scrolling && this.scrollSum > (absDelta * 3)) {
								this.mouseScroll(e.deltaY);
							}
						}
					}

				});
			}

			document.addEventListener('click', (e) => {
				const chngSecBtn = e.target.closest('.js-change-screen-menu');

				if (chngSecBtn) {
					e.preventDefault();

					if (!this.scrolling && !chngSecBtn.parentElement.classList.contains('menu__item_current')) {
						this.changeSection(document.querySelector(chngSecBtn.getAttribute('data-screen')));
					}
				}
			});

			if (window.location.hash) {
				this.changeSection(document.querySelector(window.location.hash + '-screen'));
			}
		}
	};
})();