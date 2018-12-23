/*
call to init:
Tab.init({
	container: '.tab',
	button: '.tab__button',
	item: '.tab__item'
});
*/
var Tab;

(function() {
	'use strict';

	Tab = {
		options: null,

		change: function(btnElem) {
			if (btnElem.classList.contains('active')) return;

			var contElem = btnElem.closest(this.options.container),
			btnElements = contElem.querySelectorAll(this.options.button),
			tabItemElements = contElem.querySelectorAll(this.options.item);

			//remove active state
			for (var i = 0; i < btnElements.length; i++) {
				btnElements[i].classList.remove('active');

				tabItemElements[i].classList.remove('active');
			}

			//get current tab item
			var tabItemElem = contElem.querySelector(this.options.item +'[data-index="'+ btnElem.getAttribute('data-index') +'"]');

			//set active state
			tabItemElem.classList.add('active');

			btnElem.classList.add('active');

			//set height
			this.setHeight(tabItemElem);
		},

		setHeight: function(tabItemElem) {
			tabItemElem.parentElement.style.height = tabItemElem.offsetHeight +'px';
		},

		reInit: function() {
			if (!this.options) return;

			var contElements = document.querySelectorAll(this.options.container);
			
			for (var i = 0; i < contElements.length; i++) {
				this.setHeight(contElements[i].querySelector(this.options.item +'.active'));
			}
		},

		init: function(options) {
			var contElements = document.querySelectorAll(options.container);

			if (!contElements.length) return;

			this.options = options;

			//init tabs
			for (let i = 0; i < contElements.length; i++) {
				var contElem = contElements[i],
				btnElements = contElem.querySelectorAll(options.button),
				tabItemElements = contElem.querySelectorAll(options.item),
				tabItemElemActive = contElem.querySelector(this.options.item +'.active');

				this.setHeight(tabItemElemActive);

				for (let i = 0; i < btnElements.length; i++) {
					btnElements[i].setAttribute('data-index', i);

					tabItemElements[i].setAttribute('data-index', i);
				}
			}

			//btn event
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest(options.button);

				if (!btnElem) return;

				e.preventDefault();

				this.change(btnElem);
			});
		}
	};
})();