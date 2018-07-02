/*
call to init:
Toggle.init(Str button selector[, Str toggle class, default: 'toggled']);
*/
var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',

		toggle: function(elem) {
			var targetElements = document.querySelectorAll(elem.getAttribute('data-target-elements'));

			if (!targetElements.length) {
				return;
			}

			if (elem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				elem.classList.remove(this.toggledClass);
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				elem.classList.add(this.toggledClass);
			}
		},

		init: function(elementStr, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
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
}());


/*$(document).ready(function() {

	//Toggle
	$('body').on('click', '.js-toggle', function() {
		var _$ = $(this),
		targetElements = _$.attr('data-target-elements'),
		initClickOnElements = _$.attr('data-init-click-on-elements');

		if (initClickOnElements) {
			$(initClickOnElements).not(this).click();
		}

		function openMenu(st) {
			if (st) {
				var pos = $(window).scrollTop();
				$('body').css('top', -pos).attr('data-position', pos).addClass('is-menu-opened');
			} else {
				$('body').removeClass('is-menu-opened').removeAttr('style');
				$('html,body').scrollTop($('body').attr('data-position'));
			}
		}

		function actElements(st) {
			if (targetElements) {

				var $elem = $(targetElements),
				role = _$.attr('data-role');

				if (st) {
					$elem.addClass(this.toggledClass);
				} else {
					$elem.removeClass(this.toggledClass);
				}
				
				if (role && role == 'menu') {
					openMenu(st);
				}
				
			}
		}
		
		if (!_$.hasClass(this.toggledClass)) {
			actElements(1);
			_$.addClass(this.toggledClass);
			var secTxt = _$.attr('data-second-button-text');
			if (secTxt) {
				if (!_$.attr('data-first-button-text')) {
					_$.attr('data-first-button-text', _$.html());
				}
				_$.html(secTxt);
			}
		} else {
			actElements(0);
			_$.removeClass(this.toggledClass);
			var fstTxt = _$.attr('data-first-button-text');
			if (fstTxt) {
				_$.html(fstTxt);
			}
		}

		

		return false;
	});

});*/