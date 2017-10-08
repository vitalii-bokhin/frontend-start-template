var Popup = {
	show: function(id,fun) {
		var _popup = $(id);
		if (_popup.length && _popup.hasClass('popup__window')) {
			var pos = $(window).scrollTop();
			$('.popup').fadeIn(321).scrollTop(0);
			$('.popup__window').removeClass('popup__window_visible');
			_popup.addClass('popup__window_visible');
			$('body').css('top', -pos).attr('data-position', pos).addClass('is-popup-opened');
		}
		this.closeCallback = fun || function() {};
	},
	hide: function() {
		$('.popup__window').removeClass('popup__window_visible');
		$('.popup').fadeOut(321);
		$('.popup__message').remove();
		$('body').removeClass('is-popup-opened').removeAttr('style');
		$('html,body').scrollTop($('body').attr('data-position'));
		this.closeCallback();
	},
	message: function(id,msg,fun) {
		$(id).find('.popup__inner').prepend('<div class="popup__message">'+ msg +'</div>');
		this.show(id);
		this.closeCallback = fun || function() {};
	}
};


$(document).ready(function() {
	$('body').on('click', '.js-open-popup', function () {
		Popup.show($(this).attr('href'));
		return false;
	});

	$('body').on('click', '.js-open-msg-popup', function () {
		Popup.message('#message-popup', 'Это всплывашка с сообщением.<br> вызов: <span class="c-red">Popup.message("#id", "Текст или html");</span>', function() { alert('После закрытия'); });
		return false;
	});

	$('body').on('click', '.popup__close', function () {
		Popup.hide();
		return false;
	});

	$('body').on('click', '.popup', function(e) {
		if (!$(e.target).closest('.popup__window').length) {
			Popup.hide();
		}
	});

	if (window.location.hash) {
		Popup.show(window.location.hash);
	}

});