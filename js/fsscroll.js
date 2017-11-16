var Fsscreen = {
	winH: null,
	scrolling: false,
	init: function() {
		var _ = this;

		 function setH() {
			_.winH =  $(window).height();
			$('.fsscroll__screen').each(function() {
				var _item = $(this),
				itemH = _item.innerHeight();
				if (itemH < _.winH) {
					_item.css('height', _.winH);
				} else {
					_item.addClass('fsscroll__screen_scroll');
				}
			});
		}
		setH();

		$('.fsscroll__screen').first().addClass('fsscroll__screen_current');
		$('.fsscroll__screen').last().addClass('fsscroll__screen_last');

		setTimeout(function() {
			$(window).scrollTop(0);
		}, 1);

		$(window).resize(function() {
			setH();
		});

	},
	
	move: function(moveTo,_nextScr) {
		var _ = this;
		_.scrolling = true;
		$('body,html').stop().animate({scrollTop: moveTo}, 900, 'easeOutExpo', function() {

			setTimeout(function() {
				_.scrolling = false;
			}, 121);
			
			if(_nextScr && _nextScr.length) {
				$('.fsscroll__screen').removeClass('fsscroll__screen_current');
				_nextScr.addClass('fsscroll__screen_current');
			}

		});
	},
	mouseScroll: function(delta, factor, fun) {
		var _ = this,
		_curScr = $('.fsscroll__screen_current'),
		lastPos = $('.fsscroll__screen_last').offset().top,
		_nextScr;

	
			var winScrTop = $(window).scrollTop();

			if (_.scrolling) {
				fun();
			}

			if (winScrTop < (lastPos+21)) {

				if (!_curScr.hasClass('fsscroll__screen_scroll')) {
					fun();

					if (!_.scrolling){
						if (delta < 0) {
							_nextScr = _curScr.next('.fsscroll__screen');

							if(_nextScr.length) {
								_.move(_nextScr.offset().top, _nextScr);
							} else {
								_.move(lastPos+_.winH);
							}

						} else {
							_nextScr = _curScr.prev('.fsscroll__screen');

							if(_nextScr.length) {
								if (!_nextScr.hasClass('fsscroll__screen_scroll')) {
									_.move(_nextScr.offset().top, _nextScr);
								} else {
									_.move(_nextScr.offset().top+_nextScr.innerHeight()-_.winH, _nextScr);
								}
								
							}
						}

					}

				} else {

					if (delta < 0) {
						_nextScr = _curScr.next('.fsscroll__screen');

						if ((winScrTop+_.winH) > (_curScr.offset().top+_curScr.innerHeight())) {
							fun();
							if(_nextScr.length) {
								if (!_.scrolling) {
									_.move(_nextScr.offset().top, _nextScr);
								}
							}
						}

					} else {
						_nextScr = _curScr.prev('.fsscroll__screen');

						if (winScrTop < _curScr.offset().top) {
							fun();
							if (!_.scrolling) {
								_.move(_nextScr.offset().top, _nextScr);
							}
						}

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

	var winW = $(window).width(),
	winH = $(window).height();

	if ($('.fsscroll').length) {
		$('.fsscroll').attr('id', 'js-fsscroll');

		if (winW > 1001) {
			Fsscreen.init();
		} else {
			$('.fsscroll__screen_vw1000').each(function() {
				var _item = $(this),
				itemH = _item.innerHeight();
				if (itemH < winH) {
					_item.css('height', winH);
				}
			});
		}

		if (winW > 1030) {
			$('#js-fsscroll').on('mousewheel', function(e) {
				var ev = e;
				Fsscreen.mouseScroll(e.deltaY, e.deltaFactor,  function() {
					ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
				});
			});
		}
	}

});