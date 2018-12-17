; var MobNav;

(function() {
	"use strict";

	//fix header
	var headerElem = document.querySelector('.header');

	window.addEventListener('scroll', function() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else if (!document.body.classList.contains('popup-is-opened') && !document.body.classList.contains('mob-nav-is-opened')) {
			headerElem.classList.remove('header_fixed');
		}
	});

	//mob menu
	MobNav = {
		options: null,
		winScrollTop: 0,

		fixBody: function(st) {
			if (st) {
				this.winScrollTop = window.pageYOffset;

				document.body.classList.add('mob-nav-is-opened');
				document.body.style.top = -this.winScrollTop +'px';
			} else {
				document.body.classList.remove('mob-nav-is-opened');

				window.scrollTo(0, this.winScrollTop);
			}
		},

		open: function(btnElem) {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			if (btnElem.classList.contains('opened')) {
				this.close();
			} else {
				btnElem.classList.add('opened');
				headerElem.classList.add('opened');
				this.fixBody(true);
			}
		},

		close: function() {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			headerElem.classList.remove('opened');

			var openBtnElements = document.querySelectorAll(this.options.openBtn);

			for (var i = 0; i < openBtnElements.length; i++) {
				openBtnElements[i].classList.remove('opened');
			}

			this.fixBody(false);
		},

		init: function(options) {
			this.options = options;

			document.addEventListener('click', (e) => {
				var openElem = e.target.closest(options.openBtn),
				closeElem = e.target.closest(options.closeBtn),
				menuLinkElement = e.target.closest(options.menuLinkSelector);

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (closeElem) {
					e.preventDefault();
					this.close();
				} else if (menuLinkElement) {
					this.close();
				}
			});
		}
	};
})();