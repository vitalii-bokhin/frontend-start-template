var FsScroll = {
	winH: null,
	scrolling: false,
	factor: 0,

	init: function() {
		var _ = this;
		_.winH =  winH;

		$('.fsscroll__screen').each(function() {
			var _item = $(this),
			itemH = _item.innerHeight();
			if (itemH < _.winH) {
				_item.css('height', _.winH);
			} else {
				_item.addClass('fsscroll__screen_scroll');
			}
		});
		
		$('.fsscroll__screen').first().addClass('fsscroll__screen_first fsscroll__screen_current');
		$('.fsscroll__screen').last().addClass('fsscroll__screen_last');

		setTimeout(function() {
			$(window).scrollTop(0);
		}, 1);

	},

	current: function() {
		var _ = this,
		midWinScrollTop = $(window).scrollTop() + _.winH / 2;

		$('.fsscroll__screen').removeClass('fsscroll__screen_current');

		$('.fsscroll__screen').each(function() {
			var $item = $(this),
			itemOfsTop = $item.offset().top,
			itemH = $item.innerHeight();

			if (itemOfsTop <= midWinScrollTop && (itemOfsTop + itemH) >= midWinScrollTop) {
				$item.addClass('fsscroll__screen_current');
			}

		});

	},
	
	move: function(moveTo, scroll) {
		var _ = this,
		duration = 900,
		easing = 'easeOutExpo';

		_.scrolling = true;

		if (scroll) {
			duration = 900;
			easing = 'easeInOutCubic';
		}

		$('body, html').stop().animate({scrollTop: moveTo}, duration, easing, function() {
			setTimeout(function() {
				_.current();
				_.scrolling = false;
				_.factor = 0;
			}, 21);
		});
	},

	mouseScroll: function(delta, factor, fun) {
		var _ = this,
		$curScr = $('.fsscroll__screen_current'),
		winScrollTop = $(window).scrollTop(),
		$nextScr;

		if (delta < 0) {
			$nextScr = $curScr.next('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_last')) {
				if (!_.scrolling) {
					if (($curScr.offset().top - 21) > winScrollTop) {
						_.move($curScr.offset().top);
					} else {
						_.move($curScr.next('.fsscroll__screen').offset().top);
					}
				}
			} else {
				if ($nextScr.length && ($nextScr.offset().top - _.winH) < winScrollTop) {
					_.move($nextScr.offset().top);
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop + _.factor, true);
					console.log(_.factor);
				}
			}
		} else {

		}
		
	}

	/*mouseScroll: function(delta, factor, fun) {
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
			
		},*/

	};


	$(document).ready(function() {

		if ($('.fsscroll').length) {
			$('.fsscroll').attr('id', 'js-fsscroll');

			function initFsS() {
				$('.fsscroll__screen').css('height', 'auto');
				if (winW > 1030) {
					FsScroll.init();
					$('#js-fsscroll').on('mousewheel', function(e) {
						e.preventDefault ? e.preventDefault() : (e.returnValue = false);
						FsScroll.mouseScroll(e.deltaY, e.deltaFactor);
					});
				} else {
					$('#js-fsscroll').off('mousewheel');
					$('.fsscroll__screen_vw1000').each(function() {
						var _item = $(this),
						itemH = _item.innerHeight();
						if (itemH < winH) {
							_item.css('height', winH);
						}
					});
				}
			}

			initFsS();

			$(window).on('winResized', initFsS);

		}

	});