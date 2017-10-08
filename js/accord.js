$(document).ready(function() {

	$('body').on('click', '.accord__button', function() {
		var _ = $(this),
		_thisContent = _.closest('.accord__item').find('.accord__content'),
		_button = _.closest('.accord').find('.accord__button'),
		_content = _.closest('.accord').find('.accord__content');
		if (!_.hasClass('accord__button_active')) {
			_content.slideUp(321);
			_button.removeClass('accord__button_active');
			_thisContent.slideDown(321);
			_.addClass('accord__button_active');
		} else {
			_thisContent.slideUp(321);
			_.removeClass('accord__button_active');
		}
		return false;
	});

});