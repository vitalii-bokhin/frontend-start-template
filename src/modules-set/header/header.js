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

		open: function(elem) {
			var navElem = document.getElementById(this.options.navId);

			if (!navElem) {
				return;
			}

			if (elem.classList.contains('opened')) {
				this.close();
			} else {
				elem.classList.add('opened');
				navElem.classList.add('opened');
				this.fixBody(true);
			}
		},

		close: function() {
			var navElem = document.getElementById(this.options.navId);

			if (!navElem || !navElem.classList.contains('opened')) {
				return;
			}

			navElem.classList.remove('opened');

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
				menuLinkElem = e.target.closest('#'+ options.navId +' a');

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (closeElem) {
					e.preventDefault();
					this.close();
				} else if (menuLinkElem || (!e.target.closest('#'+ options.navId) && document.getElementById(options.navId).classList.contains('opened'))) {
					this.close();
				}
			});
		}
	};
})();