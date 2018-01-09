$(document).ready(function() {

	$('body').on('click', '.accord__button', function() {
		var _$ = $(this),
		Content = _$.closest('.accord__item').find('.accord__content');

		if (!_$.hasClass('accord__button_active')) {
			_$.closest('.accord').find('.accord__content').slideUp(321);
			_$.closest('.accord').find('.accord__button').removeClass('accord__button_active');
			Content.slideDown(321, function() {
				$('body,html').animate({scrollTop: (_$.offset().top - $('.header').innerHeight())}, 900, 'easeOutExpo');
			});
			_$.addClass('accord__button_active');
		} else {
			Content.slideUp(321);
			_$.removeClass('accord__button_active');
		}

		return false;
	});
});