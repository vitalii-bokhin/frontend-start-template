var FsScroll = {
	winH: null,
	scrolling: false,
	factor: 0,

	init: function() {
		var _ = this;
		_.winH =  winH;

		$('.fsscroll__screen').removeClass('fsscroll__screen_scroll').css('height', 'auto');

		$('.fsscroll__screen').each(function() {
			var _item = $(this),
			itemH = _item.innerHeight();
			if (itemH <= _.winH) {
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

		$(window).scroll(function() {
			if (!_.scrolling) {
				_.current();
			}
		});

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
		winScrollBottom = winScrollTop + _.winH,
		$nextScr;

		if (delta < 0) {
			$nextScr = $curScr.next('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_last')) {
				if (!_.scrolling) {
					if (winScrollTop < $curScr.offset().top) {
						_.move($curScr.offset().top);
					} else {
						_.move($nextScr.offset().top);
					}
				}
			} else {
				if ($nextScr.length && winScrollBottom > $nextScr.offset().top) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop + _.factor, true);
				}
			}

		} else {

			$nextScr = $curScr.prev('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_first')) {
				if (!_.scrolling) {
					if (winScrollBottom > ($curScr.offset().top + $curScr.innerHeight())) {
						_.move($curScr.offset().top + $curScr.innerHeight() - _.winH);
					} else {
						_.move($nextScr.offset().top + $nextScr.innerHeight() - _.winH);
					}
				}
			} else {
				if ($nextScr.length && ($nextScr.offset().top + $nextScr.innerHeight()) > winScrollTop) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop - _.factor, true);
				}
			}

		}
		
	}

};


$(document).ready(function() {

	if ($('.fsscroll').length) {
		$('.fsscroll').attr('id', 'js-fsscroll');

		(function initFsS() {

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

			$(window).on('winResized', initFsS);

		})();

	}

});