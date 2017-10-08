$(document).ready(function() {

	$('body').find('.more').each(function() {
		var _ = $(this),
		moreHeight = _.height(),
		content = _.html();

		_.html('<div class="more__inner">'+ content +'</div>');

		var _inner = _.find('.more__inner'),
		innerHeight = _inner.innerHeight();

		if (moreHeight < innerHeight) {
			_.addClass('more_apply').append('<button class="more__button">Показать</button>');
			_inner.css({height: moreHeight}).attr('data-min-height', moreHeight).attr('data-max-height', innerHeight);
		}

	});

	$('body').on('click', '.more__button', function() {
		var _ = $(this),
		_moreInner = _.parent('.more').find('.more__inner'),
		minH = _moreInner.attr('data-min-height'),
		maxH = _moreInner.attr('data-max-height');
		if (!_.hasClass('more__button_active')) {
			_moreInner.css('height', maxH);
			_.addClass('more__button_active').html('Скрыть');
		} else {
			_moreInner.css('height', minH);
			_.removeClass('more__button_active').html('Показать');
		}
		return false;
	});

});