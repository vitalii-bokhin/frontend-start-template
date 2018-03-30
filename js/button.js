$(document).ready(function() {

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _$ = $(this),
		targetElements = _$.attr('data-target-elements');

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
				$elemParent = $(_$.attr('data-elements-parent')),
				role = _$.attr('data-role');

				if ($elemParent.length) {
					if (st) {
						$elemParent.find(targetElements).addClass('toggled');
					} else {
						$elemParent.find(targetElements).removeClass('toggled');
					}
				} else {
					if (st) {
						$elem.addClass('toggled');
					} else {
						$elem.removeClass('toggled');
					}
				}

				if (role && role == 'menu') {
					openMenu(st);
				}
				
			}
		}
		
		if (!_$.hasClass('toggled')) {
			actElements(1);
			_$.addClass('toggled');
			var secTxt = _$.attr('data-second-button-text');
			if (secTxt) {
				if (!_$.attr('data-first-button-text')) {
					_$.attr('data-first-button-text', _$.html());
				}
				_$.html(secTxt);
			}
		} else {
			actElements(0);
			_$.removeClass('toggled');
			var fstTxt = _$.attr('data-first-button-text');
			if (fstTxt) {
				_$.html(fstTxt);
			}
		}

		return false;
	});

});