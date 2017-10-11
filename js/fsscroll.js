var Fsscreen = {
	winH: null,
	scrolling: false,
	init: function() {
		var _ = this;

		_.winH =  $(window).height();

		$('.wrapper__screen').css('height', _.winH);
		$('.wrapper__screen').first().addClass('wrapper__screen_current');
		$('.wrapper__screen').last().addClass('wrapper__screen_last');

		setTimeout(function() {
			$(window).scrollTop(0);
		}, 1);

		_.curScreen();
		//_.eventScroll();

	},
	curScreen: function() {
		var _ = this,
		zone = _.winH/2;

		$(window).scroll(function() {
			var winScrTop = $(window).scrollTop();

			$('.wrapper__screen').each(function() {
				var _screen = $(this),
				scrOffset = _screen.offset().top;
				if (!_screen.hasClass('wrapper__screen_current') && scrOffset > (winScrTop-zone) && scrOffset < (winScrTop+zone)) {
					$('.wrapper__screen').removeClass('wrapper__screen_current');
					_screen.addClass('wrapper__screen_current');
				}
			});

		});

	},
	move: function(moveTo) {
		var _ = this;
		_.scrolling = true;
		$('body,html').stop().animate({scrollTop: moveTo}, 521, 'easeInOutCubic', function() {
			_.scrolling = false;
		});
	},
	mouseScroll: function(delta, factor, fun) {
		var _ = this,
		_curScr = $('.wrapper__screen_current'),
		lastPos = $('.wrapper__screen_last').offset().top,
		_nextScr;

	
			var winScrTop = $(window).scrollTop();

			if (winScrTop < (lastPos+21)) {

				fun();

				if (!_.scrolling){
					if (delta < 0) {
						_nextScr = _curScr.next('.wrapper__screen');
					} else {
						_nextScr = _curScr.prev('.wrapper__screen');
					}

					if(_nextScr.length) {
						_.move(_nextScr.offset().top);
					} else if (delta < 0) {
						_.move(lastPos+_.winH-$('.header').innerHeight());
					}
				}

			} else {

				if (delta > 0 && winScrTop < (lastPos+_.winH)) {
					fun();
					if (!_.scrolling) {
						_.move(lastPos);
					}
				}

			}
			
		

		

	},
}

$(document).ready(function() {

	Fsscreen.init();

	$('#js-fsscroll').on('mousewheel', function(e) {
		var ev = e;
		Fsscreen.mouseScroll(e.deltaY, e.deltaFactor,  function() {
			ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
		});
	});



});