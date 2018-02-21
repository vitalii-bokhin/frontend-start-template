$(document).ready(function() {

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _ = $(this),
		targetId = _.attr('data-target-id'),
		targetClass = _.attr('data-target-class'),
		targetElements = _.attr('data-target-elements');

		function tId(st) {
			if (targetId) {
				var _$ = $('#'+ targetId);
				if (st) {
					_$.addClass('toggled');
				} else {
					_$.removeClass('toggled');
				}
			}
		}

		function tCl(st) {
			if (targetClass) {

				var _$ = null,
				toggledClass = '',
				splClass = targetClass.split(':');

				if (splClass.length > 1) {
					_$ = $('.'+ splClass[0]);
					toggledClass = splClass[1];
				} else {
					_$ = $('.'+ targetClass);
					toggledClass = 'toggled';
				}
				
				if (st) {
					_$.addClass(toggledClass);
				} else {
					_$.removeClass(toggledClass);
				}

			}
		}

		function tEl(st) {
			if (targetElements) {

				var _$ = $(targetElements),
				$par = $(_.attr('data-elements-parent'));

				if ($par.length) {
					if (st) {
						$par.find(targetElements).addClass('toggled');
					} else {
						$par.find(targetElements).removeClass('toggled');
					}
				} else {
					if (st) {
						_$.addClass('toggled');
					} else {
						_$.removeClass('toggled');
					}
				}
				
			}
		}
		
		if (!_.hasClass('toggled')) {
			tId(1);
			tCl(1);
			tEl(1);
			_.addClass('toggled');
			var secTxt = _.attr('data-second-button-text');
			if (secTxt) {
				if (!_.attr('data-first-button-text')) {
					_.attr('data-first-button-text', _.html());
				}
				_.html(secTxt);
			}
		} else {
			tId(0);
			tCl(0);
			tEl(0);
			_.removeClass('toggled');
			var fstTxt = _.attr('data-first-button-text');
			if (fstTxt) {
				_.html(fstTxt);
			}
		}

		return false;
	});

});