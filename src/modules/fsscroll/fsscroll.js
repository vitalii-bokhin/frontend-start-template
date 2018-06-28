var FsScroll = {
	winH: null,
	scrolling: false,
	factor: 0,
	scrChangedEv: null,
	beforeScrChangeEv: null,

	init: function() {
		var _ = this;
		_.winH =  window.innerHeight;

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
			_.current();
		}, 21);

		$(window).scroll(function() {
			if (!_.scrolling) {
				_.current();
			}
		});

		_.scrChangedEv = new CustomEvent('scrChanged');
		_.beforeScrChangeEv = new CustomEvent('beforeScrChange');

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
				window.dispatchEvent(_.scrChangedEv);
			}

		});

	},
	
	move: function(moveTo, scroll) {
		var _ = this,
		duration = 1500,
		easing = 'easeInOutCubic';

		_.scrolling = true;

		if (scroll) {
			duration = 900;
			easing = 'easeInOutCubic';
		}

		window.dispatchEvent(_.beforeScrChangeEv);

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
					if ((winScrollTop + 21) < $curScr.offset().top) {
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
			
		} else if (delta > 0) {

			$nextScr = $curScr.prev('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_first')) {
				if (!_.scrolling) {
					if ((winScrollBottom - 21) > ($curScr.offset().top + $curScr.innerHeight())) {
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

			if (window.innerWidth > 1030) {

				FsScroll.init();

				$('#js-fsscroll').on('mousewheel', function(e) {
					e.preventDefault ? e.preventDefault() : (e.returnValue = false);
					FsScroll.mouseScroll(e.deltaY, e.deltaFactor);
				});

			} else {

				$('#js-fsscroll').off('mousewheel');

				if (window.innerWidth > 1000) {

					FsScroll.init();

					$('.wrapper_fsscroll').swipe({
						swipe: function(e, direct, factor) {
							var delta;
							switch (direct) {
								case 'down': delta = 1;
								break;
								case 'up': delta = -1;
								break;
								default: delta = 0;
								break;
							}

							FsScroll.mouseScroll(delta, factor);

						},
						allowPageScroll: 'none',
						excludedElements: '',
						threshold: 21,
					});

				}

			}

			$(window).on('winResized', initFsS);

		})();

	}

});