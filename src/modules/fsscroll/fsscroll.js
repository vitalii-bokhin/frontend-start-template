var FsScroll;

(function() {
	"use strict";

	FsScroll = {
		options: null,
		contElem: null,
		scrolling: false,

		current: function() {
			var midWinScrollTop = window.pageYOffset + window.innerHeight / 2,
			screenElements = this.contElem.querySelectorAll(this.options.screen);

			for (var i = 0; i < screenElements.length; i++) {
				screenElements[i].classList.remove('fsscroll__screen_current');
			}

			for (var i = 0; i < screenElements.length; i++) {
				var screenOffsetTop = screenElements[i].getBoundingClientRect().top + window.pageYOffset;
				console.log(window.innerHeight);

				if (screenOffsetTop <= midWinScrollTop && (screenOffsetTop + screenElements[i].offsetHeight) >= midWinScrollTop) {

					screenElements[i].classList.add('fsscroll__screen_current');
				}
			}
		},

		move: function(moveTo, scroll) {
			//console.log(moveTo, scroll);
			

			var duration = 1500,
			easing = 'easeInOutCubic';

			this.scrolling = true;

			if (scroll) {
				duration = 900;
				easing = 'easeInOutCubic';
			}


			window.scrollBy(0, moveTo);

			setTimeout(() => {
				this.current();

				this.scrolling = false;
			}, 321);
		},

		mouseScroll: function(delta) {
			var currentScreenElem = this.contElem.querySelector('.fsscroll__screen_current'),
			winScrollBottom = window.pageYOffset + window.innerHeight,
			nextScreenElem;

			if (delta > 0) {
				nextScreenElem = currentScreenElem.nextElementSibling;

				if (currentScreenElem && !currentScreenElem.classList.contains('fsscroll__screen_scroll') && !currentScreenElem.classList.contains('fsscroll__screen_last')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((window.pageYOffset + 21) < currentScreenOffsetTop) {
							this.move(currentScreenOffsetTop);
						} else {
							this.move(nextScreenElem.getBoundingClientRect().top + window.pageYOffset);
						}
					}
				} else {
					var nextScreenOffsetTop = nextScreenElem.getBoundingClientRect().top + window.pageYOffset;

					if (nextScreenElem && winScrollBottom > nextScreenOffsetTop) {
						if (!this.scrolling) {
							this.move(nextScreenOffsetTop);
						}
					} else {
						this.move(window.pageYOffset + delta, true);
					}
				}
			} else if (delta < 0) {
				nextScreenElem = currentScreenElem.previousElementSibling;

				if (nextScreenElem && !currentScreenElem.classList.contains('fsscroll__screen_scroll') && !currentScreenElem.classList.contains('fsscroll__screen_first')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((winScrollBottom - 21) > (currentScreenOffsetTop + currentScreenElem.offsetHeight)) {
							this.move(currentScreenOffsetTop + currentScreenElem.offsetHeight - window.innerHeight);
						} else {
							this.move(nextScreenElem.getBoundingClientRect().top + window.pageYOffset + nextScreenElem.offsetHeight - window.innerHeight);
						}
					}
				} else {
					var nextScreenOffsetTop = nextScreenElem.getBoundingClientRect().top + window.pageYOffset;

					if (nextScreenElem && (nextScreenOffsetTop + nextScreenElem.offsetHeight > window.pageYOffset)) {
						if (!this.scrolling) {
							this.move(nextScreenOffsetTop);
						}
					} else {
						this.move(window.pageYOffset - delta, true);
					}
				}
			}
		},

		init: function(options) {
			this.options = options;

			var contElem = document.querySelector(options.container);

			if (!contElem) {
				return;
			}

			this.contElem = contElem;

			contElem.querySelector(options.screen).classList.add('fsscroll__screen_current');

			contElem.addEventListener('wheel', (e) => {
				e.preventDefault();

				this.mouseScroll(e.deltaY);
			});
		}
	};
}());



/*
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

});*/