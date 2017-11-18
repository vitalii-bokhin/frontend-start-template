$(document).ready(function() {

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _ = $(this),
		targetId = _.attr('data-target-id'),
		targetClass = _.attr('data-target-class');

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
		
		if (!_.hasClass('toggled')) {
			tId(1);
			tCl(1);
			_.addClass('toggled');
		} else {
			tId(0);
			tCl(0);
			_.removeClass('toggled');
		}

		return false;
	});

});