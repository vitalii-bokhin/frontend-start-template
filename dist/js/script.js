//global variables
; var browser, ajax, animate;

(function() {
	"use strict";

	//Get useragent
	document.documentElement.setAttribute('data-useragent', navigator.userAgent);

	//Browser identify
	browser = (function(userAgent) {
		userAgent = userAgent.toLowerCase();

		if (/(msie|rv:11\.0)/.test(userAgent)) {
			return 'ie';
		}
	})(navigator.userAgent);

	//Add support CustomEvent constructor for IE
	try {
		new CustomEvent("IE has CustomEvent, but doesn't support constructor");
	} catch (e) {
		window.CustomEvent = function(event, params) {
			var evt;

			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};

			evt = document.createEvent("CustomEvent");

			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

			return evt;
		}

		CustomEvent.prototype = Object.create(window.Event.prototype);
	}

	//Window Resized Event
	var winResizedEvent = new CustomEvent('winResized'),
	rsz = true;

	window.addEventListener('resize', function() {
		if (rsz) {
			rsz = false;

			setTimeout(function() {
				window.dispatchEvent(winResizedEvent);
				rsz = true;
			}, 1021);
		}
	});

	//Closest polyfill
	if (!Element.prototype.closest) {
		(function(ElProto) {
			ElProto.matches = ElProto.matches || ElProto.mozMatchesSelector || ElProto.msMatchesSelector || ElProto.oMatchesSelector || ElProto.webkitMatchesSelector;

			ElProto.closest = ElProto.closest || function closest(selector) {
				if (!this) {
					return null;
				}

				if (this.matches(selector)) {
					return this;
				}

				if (!this.parentElement) {
					return null;
				} else {
					return this.parentElement.closest(selector);
				}
			};
		})(Element.prototype);
	}

	//Check element for hidden
	Element.prototype.elementIsHidden = function() {
		var elem = this;

		while (elem) {
			if (!elem) {
				break;
			}

			var compStyles = getComputedStyle(elem);

			if (compStyles.display == 'none' || compStyles.visibility == 'hidden' || compStyles.opacity == '0') {
				return true;
			}

			elem = elem.parentElement;
		}

		return false;
	}

	//Ajax
	ajax = function(options) {
		var xhr = new XMLHttpRequest();

		xhr.open('POST', options.url);

		if (typeof options.send == 'string') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				options.success(xhr.response);
			} else if (xhr.readyState == 4 && xhr.status != 200) {
				options.error(xhr.response);
			}
		}

		xhr.send(options.send);
	}

	/*
	Animation
	animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
	*/
	animate = function(draw, duration, ease, complete) {
		var start = performance.now();

		requestAnimationFrame(function anim(time) {
			var timeFraction = (time - start) / duration;

			if (timeFraction > 1) {
				timeFraction = 1;
			}

			var progress = (ease) ? easing(timeFraction, ease) : timeFraction;

			draw(progress);

			if (timeFraction < 1) {
				requestAnimationFrame(anim);
			} else {
				if (complete != undefined) {
					complete();
				}
			}
		});
	}

	function easing(timeFraction, ease) {
		if (ease == 'easeInOutQuad') {
			if (timeFraction <= 0.5) {
				return quad(2 * timeFraction) / 2;
			} else {
				return (2 - quad(2 * (1 - timeFraction))) / 2;
			}
		}
	}

	function quad(timeFraction) {
		return Math.pow(timeFraction, 2)
	}

})();
; var MobNav;

(function() {
	"use strict";

	//fix header
	var headerElem = document.querySelector('.header');

	window.addEventListener('scroll', function() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else if (!document.body.classList.contains('popup-is-opened') && !document.body.classList.contains('mob-nav-is-opened')) {
			headerElem.classList.remove('header_fixed');
		}
	});

	//mob menu
	MobNav = {
		options: null,
		winScrollTop: 0,

		fixBody: function(st) {
			if (st) {
				this.winScrollTop = window.pageYOffset;

				document.body.classList.add('mob-nav-is-opened');
				document.body.style.top = -this.winScrollTop +'px';
			} else {
				document.body.classList.remove('mob-nav-is-opened');

				window.scrollTo(0, this.winScrollTop);
			}
		},

		open: function(elem) {
			var navElem = document.getElementById(this.options.navId);

			if (!navElem) {
				return;
			}

			if (elem.classList.contains('opened')) {
				this.close();
			} else {
				elem.classList.add('opened');
				navElem.classList.add('opened');
				this.fixBody(true);
			}
		},

		close: function() {
			var navElem = document.getElementById(this.options.navId);

			if (!navElem || !navElem.classList.contains('opened')) {
				return;
			}

			navElem.classList.remove('opened');

			var openBtnElements = document.querySelectorAll(this.options.openBtn);

			for (var i = 0; i < openBtnElements.length; i++) {
				openBtnElements[i].classList.remove('opened');
			}

			this.fixBody(false);
		},

		init: function(options) {
			this.options = options;

			document.addEventListener('click', (e) => {
				var openElem = e.target.closest(options.openBtn),
				closeElem = e.target.closest(options.closeBtn),
				menuLinkElem = e.target.closest('#'+ options.navId +' a');

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (closeElem) {
					e.preventDefault();
					this.close();
				} else if (menuLinkElem || (!e.target.closest('#'+ options.navId) && document.getElementById(options.navId).classList.contains('opened'))) {
					this.close();
				}
			});
		}
	};
})();
/*
* call Menu.init(Str menu item selector, Str sub menu selector);
*/
var Menu;

(function() {
	"use strict";

	Menu = {
		toggle: function(elem, elementStr, subMenuStr) {
			var subMenuElem = elem.querySelector(subMenuStr);

			if (!subMenuElem) {
				return;
			}

			if (elem.classList.contains('active')) {
				subMenuElem.style.height = 0;

				elem.classList.remove('active');
			} else {
				var mainElem = elem.closest('.menu'),
				itemElements = mainElem.querySelectorAll(elementStr),
				subMenuElements = mainElem.querySelectorAll(subMenuStr);

				for (var i = 0; i < itemElements.length; i++) {
					itemElements[i].classList.remove('accord__button_active');
					subMenuElements[i].style.height = 0;
				}

				subMenuElem.style.height = subMenuElem.scrollHeight +'px';

				elem.classList.add('active');
			}
		},

		init: function(elementStr, subMenuStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				this.toggle(elem, elementStr, subMenuStr);
			});
		}
	};
})();
/*
FsScroll.init({
	container: Str selector,
	screen: Str selector,
	duration: Int milliseconds
});
*/

; var FsScroll;

(function() {
	"use strict";

	FsScroll = {
		options: null,
		contElem: null,
		scrolling: false,
		delta: 0,

		current: function() {
			var midWinScrollTop = window.pageYOffset + window.innerHeight / 2,
			screenElements = this.contElem.querySelectorAll(this.options.screen);

			for (var i = 0; i < screenElements.length; i++) {
				screenElements[i].classList.remove('fsscroll__screen_current');
			}

			for (var i = 0; i < screenElements.length; i++) {
				var screenOffsetTop = screenElements[i].getBoundingClientRect().top + window.pageYOffset;

				if (screenOffsetTop <= midWinScrollTop && (screenOffsetTop + screenElements[i].offsetHeight) >= midWinScrollTop) {

					screenElements[i].classList.add('fsscroll__screen_current');
				}
			}
		},

		scroll: function(scrollTo, scroll) {
			this.scrolling = true;
			
			var duration = this.options.duration || 1000,
			easing = 'easeInOutQuad';

			if (scroll) {
				duration = 500;
				easing = 'easeInOutQuad';
			}

			animate(function(progress) {
				window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
			}, duration, easing, () => {
				setTimeout(() => {
					this.current();

					this.scrolling = false;
					this.delta = 0;
				}, 321);
			});
		},

		mouseScroll: function(delta) {
			var currentScreenElem = this.contElem.querySelector('.fsscroll__screen_current'),
			winScrollBottom = window.pageYOffset + window.innerHeight;

			if (delta > 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.nextElementSibling : null;

				if (currentScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_last')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((window.pageYOffset + 21) < currentScreenOffsetTop) {
							this.scroll(currentScreenOffsetTop);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && (winScrollBottom > nextScreenOffsetTop)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;

						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			} else if (delta < 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.previousElementSibling : null;

				if (nextScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_first')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((winScrollBottom - 21) > (currentScreenOffsetTop + currentScreenElem.offsetHeight)) {
							this.scroll(currentScreenOffsetTop + currentScreenElem.offsetHeight - window.innerHeight);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset + nextScreenElem.offsetHeight - window.innerHeight);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && ((nextScreenOffsetTop + nextScreenElem.offsetHeight) > window.pageYOffset)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;
						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			}
		},

		init: function(options) {
			var contElem = document.querySelector(options.container);

			if (!contElem) {
				return;
			}

			this.options = options;
			this.contElem = contElem;

			var screenElements = contElem.querySelectorAll(options.screen);

			screenElements[0].classList.add('fsscroll__screen_first');
			screenElements[0].classList.add('fsscroll__screen_current');
			screenElements[screenElements.length - 1].classList.add('fsscroll__screen_last');

			if ('onwheel' in document) {
				document.addEventListener('wheel', (e) => {
					e.preventDefault();

					this.mouseScroll(e.deltaY);
				});
			}
			
			window.addEventListener('scroll', () => {
				if (!this.scrolling) {
					this.current();
				}
			});
		}
	};
})();
/*
Toggle.init(Str toggleSelector[, Str toggledClass (default - 'toggled')]);

Toggle.on = function(tglElem) {
	// code...
}

Toggle.off = function(tglElem) {
	// code...
}
*/

; var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',
		on: null,
		off: null,

		toggle: function(toggleElem) {
			var targetElements = document.querySelectorAll(toggleElem.getAttribute('data-target-elements'));

			if (!targetElements.length) {
				return;
			}

			if (toggleElem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				toggleElem.classList.remove(this.toggledClass);

				if (this.off) {
					this.off(toggleElem);
				}

				if (toggleElem.hasAttribute('data-first-text')) {
					toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				toggleElem.classList.add(this.toggledClass);

				if (this.on) {
					this.on(toggleElem);
				}

				if (toggleElem.hasAttribute('data-second-text')) {
					toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);

					toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
				}

				if (toggleElem.hasAttribute('data-dependence-target-elements')) {
					var dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

					for (var i = 0; i < dependenceTargetElements.length; i++) {
						dependenceTargetElements[i].classList.remove(this.toggledClass);
					}
				}
			}
		},

		init: function(toggleSelector, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
			document.addEventListener('click', (e) => {
				var toggleElem = e.target.closest(toggleSelector);

				if (toggleElem) {
					e.preventDefault();

					this.toggle(toggleElem);
				}
			});
		}
	};
})();
; var FlexImg;

(function() {
	"use strict";

	FlexImg = function(elementsStr) {

		function load(elem) {

			if (!elem.hasAttribute('data-images')) {
				return;
			}

			var images = elem.getAttribute('data-images').split(',');

			images.forEach(function(image) {

				var imageProp = image.split('->');

				if (window.innerWidth < (+imageProp[0])) {
					elem.src = imageProp[1];
				}

			});

		}

		//init
		var elements = document.querySelectorAll(elementsStr);

		if (elements.length) {

			for (var i = 0; i < elements.length; i++) {
				load(elements[i]);
			}

		}

	}
})();
var CoverImg;

(function() {
	"use strict";

	CoverImg = {
		cover: function(e) {
			var img = e.currentTarget,
			imgWrap = img.closest('.cover-img-wrap'),
			imgProportion = img.offsetWidth/img.offsetHeight,
			imgWrapProportion = imgWrap.offsetWidth/imgWrap.offsetHeight;

			if (imgWrapProportion != Infinity && imgWrapProportion < 21) {

				if (imgProportion <= imgWrapProportion) {
					var margin = Math.round(-(imgWrap.offsetWidth / imgProportion - imgWrap.offsetHeight) / 2);

					img.classList.add('cover-img_w');
					img.style.marginTop = margin +'px';

				} else {
					var margin = Math.round(-(imgWrap.offsetHeight * imgProportion - imgWrap.offsetWidth) / 2);

					img.classList.add('cover-img_h');
					img.style.marginLeft = margin +'px';

				}

			} else {
				img.classList.add('cover-img_w');
			}

		},

		reInit: function(parentElementStr) {

			var elements;

			if (parentElementStr) {
				if (typeof parentElementStr == 'string') {
					elements = document.querySelectorAll(parentElementStr +' .cover-img');
				} else {
					elements = parentElementStr.querySelectorAll('.cover-img');
				}
			} else {
				elements = document.querySelectorAll('.cover-img');
			}

			for (var i = 0; i < elements.length; i++) {
				var img = elements[i];

				img.classList.remove('cover-img_w');
				img.classList.remove('cover-img_h');
				img.style.marginTop = '';
				img.style.marginLeft = '';
				img.src = (browser == 'ie') ? (img.src +'?'+ new Date().getTime()) : img.src;
			}

		},

		init: function(parentElementStr) {
			var elements = (parentElementStr) ? document.querySelectorAll(parentElementStr +' .cover-img, '+ parentElementStr +' .cover-img-wrap') : document.querySelectorAll('.cover-img, .cover-img-wrap');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				img;

				if (elem.classList.contains('cover-img-wrap')) {

					img = elem.querySelector('img');

					img.classList.add('cover-img');

				} else if (elem.classList.contains('cover-img')) {

					img = elem;

					img.parentElement.classList.add('cover-img-wrap');

				}

				if (!img.hasAttribute('data-event')) {

					img.addEventListener('load', this.cover);

					img.setAttribute('data-event', 'true');

				}

				if (browser == 'ie') {
					img.src = img.src +'?'+ new Date().getTime();
				}

			}

		}

	};

})();
/*
call to init:
Video.init(Str button selector);
*/
var Video;

(function() {
	"use strict";

	Video = {
		play: function(elem) {
			elem.nextElementSibling.classList.add('video__frame_visible');

			var iFrame = document.createElement('iframe');

			iFrame.src = elem.getAttribute('data-src') +'?autoplay=1&rel=0&amp;showinfo=0';
			iFrame.allow = 'autoplay; encrypted-media';
			iFrame.allowFullscreen = true;

			iFrame.addEventListener('load', function() {
				iFrame.classList.add('visible');
			});

			elem.nextElementSibling.appendChild(iFrame);
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.play(elem);
			});
		}
	};
})();
var Popup, MediaPopup;

(function() {
	"use strict";

	//popup core
	Popup = {
		winScrollTop: 0,
		onClose: null,
		headerSelector: '.header',

		fixBody: function(st) {
			var headerElem = document.querySelector(this.headerSelector);

			if (st && !document.body.classList.contains('popup-is-opened')) {
				this.winScrollTop = window.pageYOffset;

				var offset = window.innerWidth - document.documentElement.clientWidth;

				document.body.classList.add('popup-is-opened');

				if (headerElem) {
					headerElem.style.right = offset +'px';
				}

				document.body.style.right = offset +'px';

				document.body.style.top = (-this.winScrollTop) +'px';
			} else if (!st) {
				if (headerElem) {
					headerElem.style.right = '';
				}
				
				document.body.classList.remove('popup-is-opened');

				window.scrollTo(0, this.winScrollTop);
			}
		},

		open: function(elementStr, callback) {
			var elem = document.querySelector(elementStr);

			if (!elem || !elem.classList.contains('popup__window')) {
				return;
			}

			this.close();

			var elemParent = elem.parentElement;
			
			elemParent.classList.add('popup_visible');

			elem.classList.add('popup__window_visible');

			if (callback) {
				this.onClose = callback;
			}

			this.fixBody(true);

			return elem;
		},

		message: function(elementStr, msg, callback) {
			var elem = this.open(elementStr, callback);

			elem.querySelector('.popup__inner').innerHTML = '<div class="popup__message">'+ msg +'</div>';
		},

		close: function() {
			var elements = document.querySelectorAll('.popup__window');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.classList.contains('popup__window_visible')) {
					continue;
				}

				elem.classList.remove('popup__window_visible');
				elem.parentElement.classList.remove('popup_visible');
			}

			if (this.onClose) {
				this.onClose();
				this.onClose = null;
			}
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var element = e.target.closest(elementStr),
				closeElem = e.target.closest('.js-popup-close');

				if (element) {
					e.preventDefault();

					this.open(element.getAttribute('data-popup'));
				} else if (closeElem || (!e.target.closest('.popup__window') && e.target.closest('.popup'))) {
					this.fixBody(false);

					this.close();
				}
			});

			if (window.location.hash) {
				this.open(window.location.hash);
			}
		}
	};

	//popup media
	MediaPopup = {
		image: function(args) {
			var elemPopup = Popup.open(args.popupStr),
			elemImg = elemPopup.querySelector('.popup-media__image');

			Popup.onClose = function() {
				elemImg.src = '#';
				elemImg.classList.remove('popup-media__image_visible'); 
			}

			elemImg.src = args.href;
			elemImg.classList.add('popup-media__image_visible');
			
		},

		video: function(args) {

		},

		next: function(elem) {
			if (!elem.hasAttribute('data-group')) {
				return;
			}

			var group = elem.getAttribute('data-group'),
			index = [].slice.call(document.querySelectorAll('[data-group="'+ group +'"]')).indexOf(elem);
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var element = e.target.closest(elementStr);

				if (!element) {
					return;
				}

				e.preventDefault();

				var type = element.getAttribute('data-type'),
				args = {
					href: element.href,
					caption: element.getAttribute('data-caption'),
					group: element.getAttribute('data-group'),
					popupStr: element.getAttribute('data-popup')
				};

				if (type == 'image') {
					this.image(args);
				} else if (type == 'video') {
					this.video(args);
				}

				this.next(element);
			});
		}
	};

})();



/*var pPopup = {
	closeCallback: function() {},
	play: null,
	ind: 0,
	group: null,
	position: 0,

	show: function(id, fun) {
		var _ = this,
		$popWin = $(id),
		$popup = $popWin.closest('.popup');
		
		if ($popWin.length && $popWin.hasClass('popup__window')) {

			_.position = $(window).scrollTop();
			$popup.fadeIn(321).scrollTop(0);
			$('.popup__window').removeClass('popup__window_visible');
			$popWin.addClass('popup__window_visible');
			$('body').css('top', -_.position).addClass('is-popup-opened');

			setTimeout(function() {
				CoverImg.reInit('#media-popup');
			}, 721);

		}

		_.closeCallback = fun || function() {};
	},

	hide: function() {
		var _ = this;
		$('.popup__window').removeClass('popup__window_visible');
		$('.popup').fadeOut(321);
		$('.popup__message').remove();
		$('body').removeClass('is-popup-opened').removeAttr('style');
		$('html, body').scrollTop(_.position);
		_.closeCallback();
	},

	message: function(id,msg,fun) {
		var _ = this;
		$(id).find('.popup__inner').prepend('<div class="popup__message">'+ msg +'</div>');
		_.show(id);
		_.closeCallback = fun || function() {};
	},

	resize: function($pop, $img) {
		var popH = $pop.innerHeight();
		if (popH > window.innerHeight) {
			$pop.css('max-width', (window.innerHeight * ($pop.innerWidth() / popH)));
		}
	},

	media: function(_$,args,show) {
		var _ = this,
		id = $(_$).attr('data-popup'),
		Pop = $(id),
		$box = Pop.find('.popup-media__box'),
		Img = Pop.find('.popup-media__image'),
		BtnPlay = Pop.find('.popup-media__play'),
		Iframe = Pop.find('.popup-media__iframe');

		if (args.data) {
			Pop.find('.popup-media__bar').css('display', 'block');
			var data = JSON.parse( args.data );
			for (var i = 0; i < data.length; i++) {
				Pop.find('.popup-media__data-'+ i).html(data[i]);
			}
		}

		if (args.imgSize) {
			var imgSize = JSON.parse(args.imgSize);
			Img.attr('width', imgSize[0]).attr('height', imgSize[1]);
		} else {
			Img.attr('width', '').attr('height', '');
		}

		if (args.img) {
			Img.css({visibility: 'visible', marginLeft: '', marginTop: ''}).removeClass('cover-img_w cover-img_h').attr('src', args.img);
		}
		
		//Pop.css('max-width', '');
		Iframe.css('visibility', 'hidden').attr('src', '');
		BtnPlay.css('visibility', 'hidden');
		
		if (args.vid) {
			$box.removeClass('middle').addClass('cover-img-wrap');
			Img.removeClass('middle__img').addClass('cover-img');
			BtnPlay.css('visibility', 'visible').attr('href', args.vid);

			_.play = function() {
				var utm = args.vid.match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i),
				ifrSrc = 'https://www.youtube.com/embed/'+ utm[1] +'?autoplay=1';
				BtnPlay.css('visibility', 'hidden');
				Img.css('visibility', 'hidden');
				Iframe.css('visibility', 'visible').attr('src', ifrSrc);
			}

			if (!args.img) {
				_.play();
			} else {
				setTimeout(function() {
					CoverImg.init(id);
					Img.attr('src', args.img);
				}, 721);
			}

			

		} else {
			$box.removeClass('cover-img-wrap').addClass('middle');
			Img.removeClass('cover-img').addClass('middle__img');
		}



		if (args.group) {
			Pop.find('.popup-media__arr').css('display', 'block');
			_.group =  $(_$).attr('data-group');
			_.ind = $('[data-group="'+ _.group +'"]').index(_$);
		}

		if (show) {
			_.show(id);
		}

		if (!args.vid) {
			setTimeout(function() {
				_.resize(Pop, Img);
			}, 721);
		}

		_.closeCallback = function() {
			Img.css('visibility', 'hidden').attr('src', '');
			Iframe.css('visibility', 'hidden').attr('src', '');
			BtnPlay.css('visibility', 'hidden');
		}

	},

	next: function(dir) {
		var _ = this,
		$next,
		ind = _.ind;

		if (dir == 'next') {
			ind++;
			if ($('[data-group="'+ _.group +'"]').eq(ind).length) {
				$next = $('[data-group="'+ _.group +'"]').eq(ind);
			}
		} else if (dir == 'prev' && ind > 0) {
			ind--;
			if ($('[data-group="'+ _.group +'"]').eq(ind).length) {
				$next = $('[data-group="'+ _.group +'"]').eq(ind);
			}
		}

		if ($next) {
			var args;

			if ($next.hasClass('js-open-popup-image')) {
				args = {
					img: $next.attr('href'),
					imgSize: $next.attr('data-image-size'),
					group: $next.attr('data-group'),
					data: $next.attr('data-data')
				};
			} else if ($next.hasClass('js-open-popup-video')) {
				args = {
					vid: $next.attr('href'),
					img: $next.attr('data-preview'),
					imgSize: $next.attr('data-preview-size'),
					group: $next.attr('data-group'),
					data: $next.attr('data-data')
				};
			}

			_.media($next, args);
			
		}

	}

};*/


/*$(document).ready(function() {
	$('body').on('click', '.js-open-popup', function () {
		Popup.show($(this).attr('data-popup'));
		return false;
	});

	$('body').on('click', '.js-open-popup-image', function () {
		var args = {
			img: $(this).attr('href'),
			imgSize: $(this).attr('data-image-size'),
			group: $(this).attr('data-group'),
			data: $(this).attr('data-data')
		};
		Popup.media(this, args, true);
		return false;
	});

	$('body').on('click', '.js-open-popup-video', function () {
		var args = {
			vid: $(this).attr('href'),
			img: $(this).attr('data-preview'),
			imgSize: $(this).attr('data-preview-size'),
			group: $(this).attr('data-group'),
			data: $(this).attr('data-data')
		};
		Popup.media(this, args, true);
		return false;
	});

	$('body').on('click', '.popup-media__play', function () {
		Popup.play();
		return false;
	});

	$('body').on('click', '.popup-media__arr', function () {
		Popup.next($(this).attr('data-dir'));
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
		var hash = window.location.hash;
		if($(hash).length && $(hash).hasClass('popup__window')){
			Popup.show(hash);
		}
	}

});*/
(function() {
	"use strict";

	//show element on checkbox change
	var ChangeCheckbox = {
		hideCssClass: 'hidden',

		change: function(elem) {
			var targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

			if (!targetElements.length) {
				return;
			}

			for (var i = 0; i < targetElements.length; i++) {
				var targetElem = targetElements[i];

				targetElem.style.display = (elem.checked) ? 'block' : 'none';
				
				if (elem.checked) {
					targetElem.classList.remove(this.hideCssClass);
				} else {
					targetElem.classList.add(this.hideCssClass);
				}
			}
		},

		init: function() {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="checkbox"]');

				if (elem) {
					this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		ChangeCheckbox.init();
	});
})();
(function() {
	"use strict";

	//show element on radio button change
	var ChangeRadio = {
		hideCssClass: 'hidden',
		
		change: function(checkedElem) {
			var elements = document.querySelectorAll('input[type="radio"][name="'+ checkedElem.name +'"]');

			if (!elements.length) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				var elem = elements[i],
				targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

				if (!targetElements.length) {
					continue;
				}

				for (let i = 0; i < targetElements.length; i++) {
					var targetElem = targetElements[i];

					targetElem.style.display = (elem.checked) ? 'block' : 'none';

					if (elem.checked) {
						targetElem.classList.remove(this.hideCssClass);
					} else {
						targetElem.classList.add(this.hideCssClass);
					}
				}
			}
		},

		init: function() {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		ChangeRadio.init();
	});
})();
var CustomSelect;

(function() {
	"use strict";

	//custom select
	CustomSelect = {
		field: null,
		hideCssClass: 'hidden',

		reset: function() {
			var buttonElements = document.querySelectorAll('.custom-select__button'),
			inputElements = document.querySelectorAll('.custom-select__input'),
			valueElements = document.querySelectorAll('.custom-select__val');

			for (var i = 0; i < buttonElements.length; i++) {
				buttonElements[i].innerHTML = buttonElements[i].getAttribute('data-placeholder');
			}

			for (var i = 0; i < inputElements.length; i++) {
				inputElements[i].value = '';
			}

			for (var i = 0; i < valueElements.length; i++) {
				valueElements[i].classList.remove('custom-select__val_checked');
			}
		},

		close: function() {
			var fieldElements = document.querySelectorAll('.custom-select');

			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('custom-select_opened');
			}

			var listItemElements = document.querySelectorAll('.custom-select__options li');

			for (var i = 0; i < listItemElements.length; i++) {
				listItemElements[i].classList.remove('hover');
			}
		},

		open: function() {
			this.field.classList.add('custom-select_opened');

			this.field.querySelector('.custom-select__options').scrollTop = 0;
		},

		selectMultipleVal: function(elem, button, input) {
			var toButtonValue = [],
			toInputValue = [],
			inputsBlock = this.field.querySelector('.custom-select__multiple-inputs');

			elem.classList.toggle('custom-select__val_checked');

			var checkedElements = this.field.querySelectorAll('.custom-select__val_checked');

			for (var i = 0; i < checkedElements.length; i++) {
				var elem = checkedElements[i];

				toButtonValue[i] = elem.innerHTML;
				toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

			}

			if (toButtonValue.length) {
				button.innerHTML = toButtonValue.join(', ');

				input.value = toInputValue[0];

				inputsBlock.innerHTML = '';

				if (toInputValue.length > 1) {

					for (var i = 1; i < toInputValue.length; i++) {
						var yetInput = document.createElement('input');

						yetInput.type = 'hidden';
						yetInput.name = input.name;
						yetInput.value = toInputValue[i];

						inputsBlock.appendChild(yetInput);
					}

				}

			} else {
				button.innerHTML = button.getAttribute('data-placeholder');
				input.value = '';
				this.close();
			}
		},

		targetAction: function() {
			var elements = this.field.querySelectorAll('.custom-select__val');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.hasAttribute('data-target-elements')) {
					continue;
				}

				var targetElem = document.querySelector(elem.getAttribute('data-target-elements'));

				if (elem.classList.contains('custom-select__val_checked')) {
					targetElem.style.display = 'block';
					targetElem.classList.remove(this.hideCssClass);

					var textInputElement = targetElem.querySelector('input[type="text"]');

					if (textInputElement) {
						textInputElement.focus();
					}
				} else {
					targetElem.style.display = 'none';
					targetElem.classList.add(this.hideCssClass);
				}
			}
		},

		selectVal: function(elem) {
			var button = this.field.querySelector('.custom-select__button'),
			input = this.field.querySelector('.custom-select__input');

			if (this.field.classList.contains('custom-select_multiple')) {
				
				this.selectMultipleVal(elem, button, input);

			} else {
				var toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

				var valueElements = this.field.querySelectorAll('.custom-select__val');

				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].classList.remove('custom-select__val_checked');
				}

				elem.classList.add('custom-select__val_checked');

				if (button) {
					button.innerHTML = toButtonValue;
				}

				input.value = toInputValue;
				
				this.close();

				Placeholder.hidePlaceholder(input, true);
			}

			this.targetAction();

			if (input.classList.contains('var-height-textarea__textarea')) {
				varHeightTextarea.setHeight(input);
			}

			this.field.classList.add('custom-select_changed');

			ValidateForm.select(input);
		},

		autocomplete: function(elem) {
			var match = false,
			reg = new RegExp(elem.value, 'gi'),
			valueElements = this.field.querySelectorAll('.custom-select__val');

			if (elem.value.length) {
				for (var i = 0; i < valueElements.length; i++) {
					var valueElem = valueElements[i];

					valueElem.classList.remove('custom-select__val_checked');
					
					if (valueElem.innerHTML.match(reg)) {
						valueElem.parentElement.classList.remove('hidden');

						match = true;
					} else {
						valueElem.parentElement.classList.add('hidden');
					}
				}
			}

			if (!match) {
				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].parentElement.classList.remove('hidden');
				}
			}
		},

		setOptions: function(fieldStr, optObj, val, name) {
			var fields = document.querySelectorAll(fieldStr);

			for (var i = 0; i < fields.length; i++) {
				var options = fields[i].querySelector('.custom-select__options');

				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li');

					li.innerHTML = '<button type="button" class="custom-select__val" data-value="'+ optObj[i][val] +'">'+ optObj[i][name] +'</button>';

					options.appendChild(li);
				}
			}
		},

		keyboard: function(key) {
			var options = this.field.querySelector('.custom-select__options'),
			hoverItem = options.querySelector('li.hover');

			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = function(item) {
						var elem = item.nextElementSibling;

						while (elem) {
							if (!elem) {
								break;
							}

							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.nextElementSibling;
							}
						}
					}(hoverItem);

					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');

						options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
					}
				} else {
					var elem = options.firstElementChild;

					while (elem) {
						if (!elem) {
							break;
						}

						if (!elem.elementIsHidden()) {
							elem.classList.add('hover');
							break;
						} else {
							elem = elem.nextElementSibling;
						}
					}
				}
				break;

				case 38:
				if (hoverItem) {
					var nextItem = function(item) {
						var elem = item.previousElementSibling;

						while (elem) {
							if (!elem) {
								break;
							}

							if (!elem.elementIsHidden()) {
								return elem;
							} else {
								elem = elem.previousElementSibling;
							}
						}
					}(hoverItem);

					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');

						options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
					}
				} else {
					var elem = options.lastElementChild;

					while (elem) {
						if (!elem) {
							break;
						}

						if (!elem.elementIsHidden()) {
							elem.classList.add('hover');
							options.scrollTop = 9999;
							break;
						} else {
							elem = elem.previousElementSibling;
						}
					}
				}
				break;

				case 13:
				this.selectVal(hoverItem.querySelector('.custom-select__val'));
				break;
			}
		},

		build: function(elementStr) {
			var elements = document.querySelectorAll(elementStr);

			if (!elements.length) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				var elem = elements[i],
				options = elem.querySelectorAll('option'),
				parent = elem.parentElement,
				optionsList = '',
				selectedOption = null;
				
				//option list
				for (let i = 0; i < options.length; i++) {
					var opt = options[i];

					if (opt.hasAttribute('selected')) {
						selectedOption = opt;
					}

					optionsList += '<li><button type="button" class="custom-select__val'+ ((opt.hasAttribute('selected')) ? ' custom-select__val_checked' : '') +'"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '' ) + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '' ) +'>'+ opt.innerHTML +'</button></li>';
				}

				var require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',
				placeholder = elem.getAttribute('data-placeholder'),
				head;

				if (elem.getAttribute('data-type') == 'autocomplete') {
					head = '<button type="button" class="custom-select__arr"></button><input type="text" name="'+ elem.name +'"'+ require + ((placeholder) ? ' placeholder="'+ placeholder +'" ' : '') +'class="custom-select__input custom-select__autocomplete form__text-input" value="'+ ((selectedOption) ? selectedOption.innerHTML : '') +'">';
				} else {
					head = '<button type="button"'+ ((placeholder) ? ' data-placeholder="'+ placeholder +'"' : '') +' class="custom-select__button">'+ ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') +'</button>';
				}

				var multiple = {
					class: (elem.multiple) ? ' custom-select_multiple' : '',
					inpDiv: (elem.multiple) ? '<div class="custom-select__multiple-inputs"></div>' : ''
				},
				hiddenInp = (elem.getAttribute('data-type') != 'autocomplete') ? '<input type="hidden" name="'+ elem.name +'"'+ require +'class="custom-select__input" value="'+ ((selectedOption) ? selectedOption.value : '') +'">' : '';

				//output select
				var customElem = document.createElement('div');
				customElem.className = 'custom-select'+ multiple.class + ((selectedOption) ? ' custom-select_changed' : '');
				customElem.innerHTML = head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv;
				parent.insertBefore(customElem, parent.firstChild);
				parent.removeChild(parent.children[1]);
			}
		},

		init: function(elementStr) {
			this.build(elementStr);

			//click on select or value or arrow button
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest('.custom-select__button'),
				valElem = e.target.closest('.custom-select__val'),
				arrElem = e.target.closest('.custom-select__arr');

				if (btnElem) {
					this.field = btnElem.closest('.custom-select');

					if (this.field.classList.contains('custom-select_opened')) {
						this.close();
					} else {
						this.close();

						this.open();
					}
				} else if (valElem) {
					this.field = valElem.closest('.custom-select');

					this.selectVal(valElem);
				} else if (arrElem) {
					if (!arrElem.closest('.custom-select_opened')) {
						arrElem.closest('.custom-select').querySelector('.custom-select__autocomplete').focus();
					} else {
						this.close();
					}
				}
			});

			//focus autocomplete
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.close();

				this.open();
			}, true);

			//input autocomplete
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.autocomplete(elem);

				if (!this.field.classList.contains('custom-select_opened')) {
					this.open();
				}
			});

			//keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.custom-select_opened');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				var key = e.which || e.keyCode || 0;

				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();

					this.keyboard(key);
				}
			});

			//close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.custom-select_opened')) {
					this.close();
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		CustomSelect.init('select');
	});
})();
var CustomFile;

(function() {
	"use strict";

	//custom file
	CustomFile = {
		input: null,
		filesObj: {},
		filesArrayObj: {},

		loadPreview: function(file, fileItem) {
			var reader = new FileReader(),
			previewDiv = document.createElement('div');

			previewDiv.className = 'custom-file__preview';

			fileItem.insertBefore(previewDiv, fileItem.firstChild);

			reader.onload = function(e) {
				setTimeout(function() {
					var imgDiv = document.createElement('div');

					imgDiv.innerHTML = '<img src="'+ e.target.result +'">';

					previewDiv.appendChild(imgDiv);
				}, 121);
			}

			reader.readAsDataURL(file);
		},

		changeInput: function(elem) {
			var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');

			fileItems.innerHTML = '';

			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i],
				fileItem = document.createElement('div');

				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__name">'+ file.name +'</div><button type="button" class="custom-file__del-btn" data-ind="'+ file.name +'"></button>';

				fileItems.appendChild(fileItem);

				if (file.type.match(/image.*/)) {
					this.loadPreview(file, fileItem);
				}
			}

			this.setFilesObj(elem.files);
		},

		setFilesObj: function(filesList, objKey) {
			var inputElem = this.input;

			if (!inputElem.id.length) {
				inputElem.id = 'custom-file-input-'+ new Date().valueOf();
			}

			if (filesList) {
				this.filesObj[inputElem.id] = {};

				for (var i = 0; i < filesList.length; i++) {
					this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
				}
			} else {
				delete this.filesObj[inputElem.id][objKey];
			}

			this.filesArrayObj[inputElem.id] = [];

			for (var key in this.filesObj[inputElem.id]) {
				this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
			}

			ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
		},

		inputFiles: function(inputElem) {
			return this.filesArrayObj[inputElem.id] || [];
		},

		files: function(formElem) {
			var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
			filesArr = [];

			if (inputFileElements.length == 1) {
				filesArr = this.filesArrayObj[inputFileElements[0].id];
			} else {
				for (var i = 0; i < inputFileElements.length; i++) {
					if (this.filesArrayObj[inputFileElements[i].id]) {
						filesArr.push({name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id]});
					}
				}
			}

			return filesArr;
		},

		init: function() {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="file"]');

				if (!elem) {
					return;
				}

				this.input = elem;

				this.changeInput(elem);
			});

			document.addEventListener('click', (e) => {
				var delBtnElem = e.target.closest('.custom-file__del-btn'),
				inputElem = e.target.closest('input[type="file"]');

				if (inputElem) {
					inputElem.value = null;
				}

				if (!delBtnElem) {
					return;
				}

				this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');

				delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));

				this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		CustomFile.init();
	});
})();
var Placeholder;

(function() {
	"use strict";

	Placeholder = {
		init: function(elementsStr) {
			var elements = document.querySelectorAll(elementsStr);

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.placeholder) {

					var elemFor = (elem.id) ? elem.id : 'placeholder-index-'+ i,
					label = document.createElement('label');

					label.htmlFor = elemFor;
					label.className = 'placeholder';
					label.innerHTML = elem.placeholder;

					elem.parentElement.insertBefore(label, elem);

					elem.removeAttribute('placeholder');
					
					if (!elem.id) {
						elem.id = elemFor;
					}

				}

				if (elem.value.length) {
					this.hide(elem, true);
				}
			}

			//events
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hide(elem, true);
				}
			}, true);

			document.addEventListener('blur', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hide(elem, false);
				}
			}, true);
		},
		
		hide: function(elem, hide) {
			var label = document.querySelector('label.placeholder[for="'+ elem.id +'"]');

			if (!label) {
				return;
			}

			var lSt = label.style;

			if (hide) {

				lSt.textIndent = '-9999px';
				lSt.paddingLeft = '0px';
				lSt.paddingRight = '0px';

			} else {

				if (!elem.value.length) {
					lSt.textIndent = '';
					lSt.paddingLeft = '';
					lSt.paddingRight = '';
				}

			}
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		Placeholder.init('input[type="text"], input[type="password"], textarea');
	});
})();
var Maskinput;

(function() {
	"use strict";

	Maskinput = function(inputElem, type) {
		if (!inputElem) {
			return;
		}

		var defValue = '';

		this.tel = function() {
			if (!/[\+\d\(\)\-]*/.test(inputElem.value)) {
				inputElem.value = defValue;
			} else {
				var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
				cursPos = inputElem.selectionStart;

				if (!reg.test(inputElem.value)) {
					inputElem.value = inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function(str, p1, p2, p3, p4) {
						var res = '';

						if (p4 != '') {
							res = '+7('+ p1 +')'+ p2 +'-'+ p3 +'-'+ p4;
						} else if (p3 != '') {
							res = '+7('+ p1 +')'+ p2 +'-'+ p3;
						} else if (p2 != '') {
							res = '+7('+ p1 +')'+ p2;
						} else if (p1 != '') {
							res = '+7('+ p1;
						}

						return res;
					});
				}

				if (!reg.test(inputElem.value)) {
					inputElem.value = defValue;
				} else {
					defValue = inputElem.value;
				}
			}
		}

		inputElem.addEventListener('input', () => {
			this[type]();
		});
	}
})();
var ValidateForm, NextFieldset, Form;

(function() {
	"use strict";

	//validate form
	ValidateForm = {
		input: null,

		errorTip: function(err, errInd, errorTxt) {
			var field = this.input.closest('.form__field') || this.input.parentElement,
			errTip = field.querySelector('.field-error-tip');

			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');

				if (!errTip) {
					return;
				}

				if (errInd) {
					if (!errTip.hasAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = (errInd != 'custom') ? errTip.getAttribute('data-error-text-'+ errInd) : errorTxt;
				} else if (errTip.hasAttribute('data-error-text')) {
					errTip.innerHTML = errTip.getAttribute('data-error-text');
				}
			} else {
				field.classList.remove('field-error');
				field.classList.add('field-success');
			}
		},

		customErrorTip: function(input, errorTxt) {
			if (!input) {
				return;
			}

			this.input = input;

			this.errorTip(true, 'custom', errorTxt);
		},

		txt: function() {
			var err = false;

			if (!/^[0-9a-zа-яё_,.:-\s]*$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		name: function() {
			var err = false;

			if (!/^[a-zа-яё'-]{3,21}(\s[a-zа-яё'-]{3,21})?(\s[a-zа-яё'-]{3,21})?$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		date: function() {
			var err = false, 
			errDate = false, 
			matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

			if (!matches) {
				errDate = 1;
			} else {
				var compDate = new Date(matches[3], (matches[2] - 1), matches[1]),
				curDate = new Date();

				if (this.input.hasAttribute('data-min-years-passed')) {
					var interval = curDate.valueOf() - new Date(curDate.getFullYear() - (+this.input.getAttribute('data-min-years-passed')), curDate.getMonth(), curDate.getDate()).valueOf();

					if (curDate.valueOf() < compDate.valueOf() || (curDate.getFullYear() - matches[3]) > 100) {
						errDate = 1;
					} else if ((curDate.valueOf() - compDate.valueOf()) < interval) {
						errDate = 2;
					}
				}

				if (compDate.getFullYear() != matches[3] || compDate.getMonth() != (matches[2] - 1) || compDate.getDate() != matches[1]) {
					errDate = 1;
				}
			}

			if (errDate == 1) {
				this.errorTip(true, 2);
				err = true;
			} else if (errDate == 2) {
				this.errorTip(true, 3);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		email: function() {
			var err = false;

			if (!/^[a-z0-9]+[\w\-\.]*@[\w\-]{2,}\.[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		tel: function() {
			var err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		pass: function() {
			var err = false,
			minLng = this.input.getAttribute('data-min-length');

			if (minLng && this.input.value.length < minLng) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},
		

		checkbox: function(elem) {
			this.input = elem;

			var group = elem.closest('.form__chbox-group');

			if (group && group.getAttribute('data-tested')) {
				var checkedElements = 0,
				elements = group.querySelectorAll('input[type="checkbox"]');

				for (var i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
						checkedElements++;
					}
				}

				if (checkedElements < group.getAttribute('data-min')) {
					group.classList.add('form__chbox-group_error');
				} else {
					group.classList.remove('form__chbox-group_error');
				}

			} else if (elem.getAttribute('data-tested')) {
				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
				} else {
					this.errorTip(false);
				}
			}
		},

		radio: function(elem) {
			this.input = elem;

			var checkedElement = false,
			group = elem.closest('.form__radio-group'),
			elements = group.querySelectorAll('input[type="radio"]');

			for (var i = 0; i < elements.length; i++) {
				if (elements[i].checked) {
					checkedElement = true;
				}
			}

			if (!checkedElement) {
				group.classList.add('form__radio-group_error');
			} else {
				group.classList.remove('form__radio-group_error');
			}
		},

		select: function(elem) {
			var err = false;

			this.input = elem;

			if (elem.getAttribute('data-required') && !elem.value.length) {
				this.errorTip(true);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		file: function(elem, filesArr) {
			this.input = elem;

			var err = false,
			errCount = {ext: 0, size: 0},
			maxFiles = +this.input.getAttribute('data-max-files'),
			extRegExp = new RegExp('(?:\\.'+ this.input.getAttribute('data-ext').replace(/,/g, '|\\.') +')$', 'i'),
			maxSize = +this.input.getAttribute('data-max-size'),
			fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');;

			for (var i = 0; i < filesArr.length; i++) {
				var file = filesArr[i];

				if (!file.name.match(extRegExp)) {
					errCount.ext++;

					if (fileItemElements[i]) {
						fileItemElements[i].classList.add('file-error');
					}

					continue;
				}

				if (file.size > maxSize) {
					errCount.size++;

					if (fileItemElements[i]) {
						fileItemElements[i].classList.add('file-error');
					}
				}
			}

			if (maxFiles && filesArr.length > maxFiles) {
				this.errorTip(true, 4);
				err = true;
			} else if (errCount.ext) {
				this.errorTip(true, 2);
				err = true;
			} else if (errCount.size) {
				this.errorTip(true, 3);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		validateOnInput: function(elem) {
			this.input = elem;

			var dataType = elem.getAttribute('data-type');

			if (elem.getAttribute('data-required') && !elem.value.length) {
				this.errorTip(true);
			} else if (elem.value.length) {
				if (dataType) {
					this[dataType]();
				} else {
					this.errorTip(false);
				}
			} else {
				this.errorTip(false);
			}
		},

		validate: function(formElem) {
			var err = 0;

			//text, password, textarea
			var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				var dataType = elem.getAttribute('data-type');

				if (elem.getAttribute('data-required') && !elem.value.length) {
					this.errorTip(true);
					err++;
				} else if (elem.value.length) {
					if (dataType) {
						if (this[dataType]()) {
							err++;
						}
					} else {
						this.errorTip(false);
					}
				} else {
					this.errorTip(false);
				}
			}

			//select
			var elements = formElem.querySelectorAll('.custom-select__input');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.parentElement.elementIsHidden()) {
					continue;
				}

				if (this.select(elem)) {
					err++;
				}
			}

			//checkboxes
			var elements = formElem.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}
			}

			//checkbox group
			var groups = formElem.querySelectorAll('.form__chbox-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElements = 0;

				if (group.elementIsHidden()) {
					continue;
				}

				group.setAttribute('data-tested', 'true');

				var elements = group.querySelectorAll('input[type="checkbox"]');

				for (let i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
						checkedElements++;
					}
				}

				if (checkedElements < group.getAttribute('data-min')) {
					group.classList.add('form__chbox-group_error');
					err++;
				} else {
					group.classList.remove('form__chbox-group_error');
				}
			}

			//radio group
			var groups = formElem.querySelectorAll('.form__radio-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElement = false;

				if (group.elementIsHidden()) {
					continue;
				}

				group.setAttribute('data-tested', 'true');

				var elements = group.querySelectorAll('input[type="radio"]');

				for (let i = 0; i < elements.length; i++) {
					if (elements[i].checked) {
						checkedElement = true;
					}
				}

				if (!checkedElement) {
					group.classList.add('form__radio-group_error');
					err++;
				} else {
					group.classList.remove('form__radio-group_error');
				}
			}

			//file
			var elements = formElem.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (CustomFile.inputFiles(elem).length) {
					if (this.file(elem, CustomFile.inputFiles(elem))) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}
			}

			//passwords compare
			var elements = formElem.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				var val = elem.value;

				if (val.length) {
					var compElemVal = formElem.querySelector(elem.getAttribute('data-pass-compare-input')).value;

					if (val !== compElemVal) {
						this.errorTip(true, 2);
						err++;
					} else {
						this.errorTip(false);
					}
				}
			}

			if (err) {
				formElem.classList.add('form-error');
			} else {
				formElem.classList.remove('form-error');
			}

			return (err) ? false : true;
		},

		init: function(formSelector) {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest(formSelector +' input[type="text"],'+ formSelector +' input[type="password"],'+ formSelector +' textarea');

				if (elem && elem.hasAttribute('data-tested')) {
					this.validateOnInput(elem);
				}
			});

			document.addEventListener('change', (e) => {
				var elem = e.target.closest(formSelector +' input[type="radio"],'+ formSelector +' input[type="checkbox"]');

				if (elem) {
					this[elem.type](elem);
				}
			});
		}
	};

	//variable height textarea
	var varHeightTextarea = {
		setHeight: function(elem) {
			var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
			mirrorOutput = elem.value.replace(/\n/g, '<br>');

			mirror.innerHTML = mirrorOutput +'&nbsp;';
		},

		init: function() {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.var-height-textarea__textarea');

				if (!elem) {
					return;
				}

				this.setHeight(elem);
			});
		}
	};

	//next fieldset
	NextFieldset = {
		next: function(elem) {
			var nextFieldset = (elem.hasAttribute('data-next-fieldset-item')) ? document.querySelector(elem.getAttribute('data-next-fieldset-item')) : false;

			if (!nextFieldset) {
				return;
			}

			var currentFieldset = elem.closest('.fieldset__item');

			if (ValidateForm.validate(currentFieldset)) {
				currentFieldset.classList.add('fieldset__item_hidden');
				nextFieldset.classList.remove('fieldset__item_hidden');
			}
		},

		init: function(form, elemStr) {
			if (form) {
				form.addEventListener('click', (e) => {
					var elem = e.target.closest(elemStr);

					if (elem) {
						this.next(elem);
					}
				});
			}
		}
	};

	//form
	Form = {
		onSubmit: null,

		submit: function(e, formElem) {
			formElem.classList.add('form_sending');

			if (!this.onSubmit) {
				return;
			}

			//clear form
			function clear() {
				var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');

				for (var i = 0; i < elements.length; i++) {
					var elem = elements[i];

					elem.value = '';

					if (window.Placeholder) {
						Placeholder.hide(elem, false);
					}
				}

				if (window.CustomSelect) {
					CustomSelect.reset();
				}

				var textareaMirrors = formElem.querySelectorAll('.form__textarea-mirror');

				for (var i = 0; i < textareaMirrors.length; i++) {
					textareaMirrors[i].innerHTML = '';
				}
			}

			//submit button
			function actSubmitBtn(st) {
				var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

				for (var i = 0; i < elements.length; i++) {
					var elem = elements[i];

					if (!elem.elementIsHidden()) {
						if (st) {
							elem.removeAttribute('disabled');
						} else {
							elem.setAttribute('disabled', 'disable');
						}
					}
				}
			}

			//call onSubmit
			var ret = this.onSubmit(formElem, function(obj) {
				obj = obj || {};

				actSubmitBtn(obj.unlockSubmitButton);

				formElem.classList.remove('form_sending');

				if (obj.clearForm == true) {
					clear();
				}
			});

			if (ret === false) {
				e.preventDefault();
			}
		},

		init: function(formSelector) {
			if (!document.querySelector(formSelector)) {
				return;
			}

			ValidateForm.init(formSelector);

			document.addEventListener('submit', (e) => {
				var formElem = e.target.closest(formSelector);

				if (!formElem) {
					return;
				}

				if (ValidateForm.validate(formElem)) {
					this.submit(e, formElem);
				} else {
					e.preventDefault();
				}
			});
		}
	};

	//bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
			label = elem.parentElement.querySelector('label'),
			forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-'+ i;

			if (label && !label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}
		}
	}

	//set tabindex
	/*function SetTabindex(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (let i = 0; i < elements.length; i++) {
			var elem = elements[i];

			if (!elem.elementIsHidden()) {
				elem.setAttribute('tabindex', i + 1);
			}
		}
	}*/

	//init scripts
	document.addEventListener('DOMContentLoaded', function() {
		BindLabels('input[type="text"], input[type="checkbox"], input[type="radio"]');
		//SetTabindex('input[type="text"], input[type="password"], textarea');
		varHeightTextarea.init();
	});
})();
/*
* call Accord.init(Str button selector);
*/
var Accord;

(function() {
	"use strict";

	Accord = {
		toggle: function(elem) {
			var contentElem = elem.nextElementSibling;

			if (elem.classList.contains('accord__button_active')) {
				contentElem.style.height = 0;

				elem.classList.remove('accord__button_active');
			} else {
				var mainElem = elem.closest('.accord'),
				allButtonElem = mainElem.querySelectorAll('.accord__button'),
				allContentElem = mainElem.querySelectorAll('.accord__content');

				for (var i = 0; i < allButtonElem.length; i++) {
					allButtonElem[i].classList.remove('accord__button_active');
					allContentElem[i].style.height = 0;
				}

				contentElem.style.height = contentElem.scrollHeight +'px';

				elem.classList.add('accord__button_active');
			}
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.toggle(elem);
			});
		}
	};
})();
/*
call to init:
More.init(Str button selector);
*/
var More;

(function() {
	"use strict";

	More = {
		toggle: function(elem) {
			var contentElem = elem.previousElementSibling;

			if (elem.classList.contains('active')) {
				contentElem.style.height = contentElem.getAttribute('data-height') +'px';

				elem.classList.remove('active');
			} else {
				contentElem.setAttribute('data-height', contentElem.offsetHeight);

				contentElem.style.height = contentElem.scrollHeight +'px';

				elem.classList.add('active');
			}

			setTimeout(function() {
				var btnTxt = elem.innerHTML;

				elem.innerHTML = elem.getAttribute('data-btn-text');

				elem.setAttribute('data-btn-text', btnTxt);
			}, 321);
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.toggle(elem);
			});
		}
	};
})();
/*
call to init:
Tab.init({
	container: '.tab',
	button: '.tab__button',
	item: '.tab__item'
});
*/
var Tab;

(function() {
	"use strict";

	Tab = {
		options: null,

		change: function(btnElem) {
			if (btnElem.classList.contains('active')) {
				return;
			}

			var contElem = btnElem.closest(this.options.container),
			btnElements = contElem.querySelectorAll(this.options.button),
			tabItemElements = contElem.querySelectorAll(this.options.item);

			//remove active state
			for (var i = 0; i < btnElements.length; i++) {
				btnElements[i].classList.remove('active');

				tabItemElements[i].classList.remove('active');
			}

			//get current tab item
			var tabItemElem = contElem.querySelector(this.options.item +'[data-index="'+ btnElem.getAttribute('data-index') +'"]');

			//set active state
			tabItemElem.classList.add('active');

			btnElem.classList.add('active');

			//set height
			this.setHeight(tabItemElem);
		},

		setHeight: function(tabItemElem) {
			tabItemElem.parentElement.style.height = tabItemElem.offsetHeight +'px';
		},

		reInit: function() {
			if (!this.options) {
				return;
			}
			
			var contElements = document.querySelectorAll(this.options.container);
			
			for (var i = 0; i < contElements.length; i++) {
				this.setHeight(contElements[i].querySelector(this.options.item +'.active'));
			}
		},

		init: function(options) {
			this.options = options;

			var contElements = document.querySelectorAll(options.container);

			if (!contElements.length) {
				return;
			}

			//init tabs
			for (let i = 0; i < contElements.length; i++) {
				var contElem = contElements[i],
				btnElements = contElem.querySelectorAll(options.button),
				tabItemElements = contElem.querySelectorAll(options.item),
				tabItemElemActive = contElem.querySelector(this.options.item +'.active');

				this.setHeight(tabItemElemActive);

				for (let i = 0; i < btnElements.length; i++) {
					btnElements[i].setAttribute('data-index', i);

					tabItemElements[i].setAttribute('data-index', i);
				}
			}

			//btn event
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest(options.button);

				if (!btnElem) {
					return;
				}

				e.preventDefault();

				this.change(btnElem);
			});
		}
	};
})();
/*
Bubble.init({
	element: '.js-bubble'
});
*/

; var Bubble;

(function() {
	"use strict";

	Bubble = {
		bubbleDiv: null,
		bubbleClass: null,
		canBeHidden: true,

		show: function(elem) {
			this.bubbleDiv.innerHTML = elem.getAttribute('data-bubble');

			this.bubbleClass = elem.getAttribute('data-bubble-class');

			if (this.bubbleClass) {
				this.bubbleDiv.classList.add(this.bubbleClass);
			}

			var bubleStyle = this.bubbleDiv.style, 
			bubbleMinWidth = 100,
			bubblePotentWidth = window.innerWidth - (elem.getBoundingClientRect().left + elem.offsetWidth) - 10,
			coordX = elem.getBoundingClientRect().left + elem.offsetWidth;

			if (bubblePotentWidth < bubbleMinWidth) {
				bubblePotentWidth = bubbleMinWidth;

				coordX = window.innerWidth - bubbleMinWidth - 10;
			}

			bubleStyle.width = bubblePotentWidth +'px';
			bubleStyle.left = coordX +'px';

			var coordY = elem.getBoundingClientRect().top + pageYOffset - this.bubbleDiv.offsetHeight;

			bubleStyle.top = coordY +'px';

			this.bubbleDiv.classList.add('bubble_visible');
		},

		hide: function() {
			this.bubbleDiv.classList.remove('bubble_visible');
			this.bubbleDiv.removeAttribute('style');
			this.bubbleDiv.innerHTML = '';

			if (this.bubbleClass) {
				this.bubbleDiv.classList.remove(this.bubbleClass);

				this.bubbleClass = null;
			}
		},

		init: function(opt) {
			var mouseOver, mouseOut;

			mouseOut = (e) => {
				setTimeout(() => {
					if (document.ontouchstart !== undefined) {
						this.hide();

						document.removeEventListener('touchstart', mouseOut);
					} else {
						if ((e.target.closest(opt.element) && this.canBeHidden) || e.target.closest('.bubble')) {
							this.hide();

							this.canBeHidden = true;
						}
					}
				}, 21);
			}

			mouseOver = (e) => {
				var elem = e.target.closest(opt.element);
				
				if (!elem) {
					return;
				}

				if (document.ontouchstart !== undefined) {
					
					this.show(elem);

					document.addEventListener('touchstart', mouseOut);
				} else {
					if (elem) {
						this.show(elem);
					} else if (e.target.closest('.bubble')) {
						this.canBeHidden = false;
					}
				}
			}

			if (document.ontouchstart !== undefined) {
				document.addEventListener('click', mouseOver);
			} else {
				document.addEventListener('mouseover', mouseOver);
				document.addEventListener('mouseout', mouseOut);
			}

			//add bubble to DOM
			this.bubbleDiv = document.createElement('div');
			this.bubbleDiv.className = 'bubble';

			document.body.appendChild(this.bubbleDiv);
		}
	};
})();
/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function() {
	"use strict";

	Anchor = {
		duration: 1000,
		shift: 0,

		scroll: function(anchorId, e) {
			var anchorSectionElem = document.getElementById(anchorId +'-anchor');

			if (!anchorSectionElem) {
				return;
			}

			if (e) {
				e.preventDefault();
			}

			var scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
			scrollTo = scrollTo - this.shift;

			animate(function(progress) {
				window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
			}, this.duration, 'easeInOutQuad');
		},

		init: function(elementStr, duration, shift) {
			if (duration) {
				this.duration = duration;
			}

			if (shift) {
				this.shift = shift;
			}

			//click anchor
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (elem) {
					this.scroll(elem.getAttribute('href').split('#')[1], e);
				}
			});

			//hash anchor
			if (window.location.hash) {
				window.addEventListener('load', () => {
					this.scroll(window.location.hash.split('#')[1]);
				});
			}
		}
	};
})();
/*
var diagram = new Diagram({
	canvasId: Str elem id,
	charts: [
	{
		value: Int,
		color: Str,
		width: Int px,
		numContId: Str elem id
	}
	],
	maxValue: Int,
	animate: true
});

diagram.animate(Int duration ms);
*/

; var Diagram;

(function() {
	"use strict";

	Diagram = function(options) {
		var canvasElement = document.getElementById(options.canvasId);

		this.animate = function(duration) {
			if (!canvasElement) {
				return;
			}

			const chartValues = options.charts.map((obj) => obj.value);
			
			animate((progress) => {
				this.ctx.clearRect(0, 0, (this.center.x * 2), (this.center.y * 2));
				this.prevChartsWidth = 0;

				options.charts.forEach((chart, i) => {
					chart.value = chartValues[i] * progress;

					drawChart(chart, i);
				});
				
			}, duration, 'easeInOutQuad');
		}

		if (!canvasElement) {
			return;
		}

		canvasElement.width = canvasElement.offsetWidth;
		canvasElement.height = canvasElement.offsetHeight;

		this.ctx = canvasElement.getContext('2d');
		this.canvasWidth = canvasElement.width;
		this.center = {x: canvasElement.width / 2, y: canvasElement.height / 2};
		this.prevChartsWidth = 0;

		const startAngle = 1.5 * Math.PI;

		var drawChart = (chart, i) => {
			var endAngle = 2 * Math.PI * chart.value / options.maxValue + startAngle,
			radius = this.canvasWidth / 2 - chart.width / 2 - (chart.offset || 0) - this.prevChartsWidth;

			this.prevChartsWidth += chart.width + (chart.offset || 0);

			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, radius, startAngle, endAngle);
			this.ctx.lineWidth = chart.width;
			this.ctx.strokeStyle = chart.color;
			this.ctx.stroke();

			outputNum(chart);
		}

		if (!options.animate) {
			options.charts.forEach((chart, i) => {
				drawChart(chart, i);
			});
		}

		function outputNum(chart) {
			var numElem = document.getElementById(chart.numContId);

			if (numElem) {
				numElem.innerHTML = chart.value.toFixed(0);
			}
		}
	}
})();
var Numberspin;

(function() {
	"use strict";

	Numberspin = function(elementsStr) {
		this.elements = document.querySelectorAll(elementsStr);
		this.values = [];

		for (var i = 0; i < this.elements.length; i++) {
			this.values[i] = +this.elements[i].innerHTML;
			this.elements[i].innerHTML = 0;
		}

		this.animate = function(duration) {
			animate((progress) => {
				for (var i = 0; i < this.elements.length; i++) {
					this.elements[i].innerHTML = Math.round(this.values[i] * progress);
				}
			}, duration);
		}
	}
})();


/*
function Numberspin(elem, opt) {
	var def = {
		animation: 1
	},
	opt = opt || {},
	options = $.extend({}, def, opt),
	interval = null,
	animate = false,
	$Elem = $(elem),
	curVal = 0,
	val = $Elem.html().replace(/[\s]/g, ''),
	pattern = val.match(/[\.,]/),
	endVal = +val.replace(/[\D]/g, '');

	$Elem.html(0);

	this.start = function() {
		
		if (!animate) {
			animate = true;
			spin();
		}
	}

	function spin() {

		interval = setTimeout(function run() {

				if (curVal < endVal) {

					if (options.animation == 1) {

						var d = endVal - curVal;

						if (d > 1213214321321) {
							curVal = curVal + 1213214321321;
						} else if (d > 3214321321) {
							curVal = curVal + 3214321321;
						} else if (d > 4321321) {
							curVal = curVal + 4321321;
						} else if (d > 321321) {
							curVal = curVal + 321321;
						} else if (d > 32321) {
							curVal = curVal + 32321;
						} else if (d > 2321) {
							curVal = curVal + 2321;
						} else if (d > 1321) {
							curVal = curVal + 1321;
						} else if (d > 321) {
							curVal = curVal + 321;
						} else if (d > 21) {
							curVal = curVal + 21;
						} else {
							curVal++;
						}


					} else if (options.animation == 2) {

						var endValArr = String(endVal).split(''),
						curValArr = String(curVal).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						curVal = curValArr.join('');

					}

					var output = String(curVal);

					if (pattern) {
						output = output.replace(new RegExp('(\\d{'+ pattern.index +'})'), '$1'+ pattern[0]);
						output = output.replace(new RegExp('(\\d)?(?=(\\d{3})+?\\'+ pattern[0] +')', 'g'), '$1 ');
					} else {
						output = output.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
					}
					
					$Elem.html(output);

					setTimeout(run, 85);

				} else {
					stop();
				}

		}, 1);

	}

	function stop() {
		clearTimeout(interval);
	}

}

var numberspinObj = [], i = 0, ind;
function numberspin(elem, opt) {
	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	if (!(numberspinObj[elem+ind] instanceof Numberspin)) {
		numberspinObj[elem+ind] = new Numberspin(elem, opt);
	}
	i++;

	return numberspinObj[elem+ind];
}
*/
/*
Share.init(Str button class);
*/

; var Share;

;(function() {
	"use strict";
	
	var encodedHref = encodeURIComponent(window.location.href);

	Share = {
		network: function(elem) {
			var net = elem.getAttribute('data-network');

			if (!net) {
				return;
			}

			var url;

			switch (net) {
				case 'vk':
				url = 'http://vkontakte.ru/share.php?url='+ encodedHref;
				break;

				case 'fb':
				url = 'http://www.facebook.com/sharer.php?u='+ encodedHref;
				break;

				case 'tw':
				url = 'http://twitter.com/share?url='+ encodedHref;
				break;

				case 'ok':
				url = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl='+ encodedHref;
				break;
			}

			this.popup(url);
		},

		popup: function(url) {
			window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.network(elem);
			});
		}
	};
})();
; var Timer;

(function() {
	"use strict";

	Timer = function(options) {
		var elem = document.getElementById(options.elemId);

		function setCookie() {
			document.cookie = 'lastTimestampValue-'+ options.elemId +'='+ Date.now() +'; expires='+ new Date(Date.now() + 259200000).toUTCString();
		}

		function output(time) {
			var min = (time > 60) ? Math.floor(time / 60) : 0,
			sec = (time > 60) ? Math.round(time % 60) : time,
			timerOut;

			if (options.format == 'extended') {
				function numToWord(num, wordsArr) {
					num %= 100;

					if (num > 20) {
						num %= 10;
					}

					switch (num) {
						case 1:
						return wordsArr[0];

						case 2:
						case 3: 
						case 4:
						return wordsArr[1];

						default:
						return wordsArr[2];
					}
				}

				var minTxt = numToWord(min, ['минуту', 'минуты', 'минут']), 
				secTxt = numToWord(sec, ['секунду', 'секунды', 'секунд']);

				var minOut = (min != 0) ? min +' '+ minTxt : '',
				secNum = (sec < 10) ? '0'+ sec : sec;

				timerOut = ((min) ? min +' '+ minTxt +' ' : '')+''+ sec +' '+ secTxt;
			} else {
				var minNum =  (min < 10) ? '0'+ min : min,
				secNum = (sec < 10) ? '0'+ sec : sec;

				timerOut = minNum +':'+ secNum;
			}

			elem.innerHTML = timerOut;
		}

		this.stop = function() {
			clearInterval(this.interval);

			if (this.onStop) {
				setTimeout(this.onStop);
			}
		}

		this.start = function(startTime) {
			if (!elem) {
				return;
			}
			
			this.time = startTime;

			var lastTimestampValue = (function(cookie) {
				if (cookie) {
					var reg = new RegExp('lastTimestampValue-'+ options.elemId +'=(\\d+)', 'i'),
					matchArr = cookie.match(reg);

					return matchArr ? matchArr[1] : null;
				}
			})(document.cookie);

			if (lastTimestampValue) {
				var delta = Math.round((Date.now() - lastTimestampValue) / 1000);

				if (options.stopwatch) {
					this.time += delta;
				} else {
					if (this.time > delta) {
						this.time -= delta;
					} else {
						setCookie();
					}
				}
			} else {
				setCookie();
			}
			
			this.interval = setInterval(() => {
				if (options.stopwatch) {
					this.time++;

					output(this.time);
				} else {
					this.time--;

					output(this.time);

					if (this.time == 0) {
						this.stop();
					}
				}
			}, 1000);
		}
	}
})();
; var GetContentAjax;

(function() {
	"use strict";

	GetContentAjax = function(options) {
		if (!document.querySelector(options.eventBtn)) {
			return;
		}

		this.output = null;

		var getContent = (eventBtnElem) => {
			var outputDivElem = document.querySelector(options.outputDiv);

			ajax({
				url: options.sourceFile,
				send: eventBtnElem.getAttribute('data-send'),
				success: (response) => {
					if (this.output === null) {
						outputDivElem.innerHTML = response;
					} else {
						outputDivElem.innerHTML = this.output(response);
					}
				},
				error: (response) => {
					console.log(response);
				}
			});
		}

		if (options.event == 'click') {
			document.addEventListener('click', (e) => {
				var eventBtnElem = e.target.closest(options.eventBtn);

				if (eventBtnElem) {
					e.preventDefault();

					getContent(eventBtnElem);
				}
			});
		}
	}
})();


/*var Ajax = {
	take: function(url,data,id,fun) {
		var _ = this;

		$.ajax({
			url: url,
			type:"POST",
			dataType:"html",
			data: data,
			success: function(response){
				if (response) {
					_.put(response, id);
					setTimeout(fun, 721);
				}
			},
			error: function() {
				alert('Send Error');
			}
		});
	},
	put: function(resp,id) {
		var Block = $(id);
		if (Block.hasClass('popup__window')) {
			Block.find('.popup__inner').html(resp);
			Popup.show(id);
		} else {
			Block.append(resp);
			coverImg();
		}
	}

};

$(document).ready(function() {

	$('body').on('click', '.js-ajax', function () {
		var _$ = $(this);

		if (!_$.hasClass('lock')) {
			_$.addClass('lock');

			var id = _$.attr('href') || '#'+ _$.attr('data-id'),
			url = _$.attr('data-url'),
			data = _$.attr('data-data');

			if (_$.attr('data-page')) {
				var page = +_$.attr('data-page');

				data += '&page='+ page;

				Ajax.take(url, data, id, function() {
					page++;
					_$.attr('data-page', page).removeClass('lock');
				});

			} else {
				Ajax.take(url, data, id, function() {
					_$.removeClass('lock');
				});
			}
		}

		return false;
	});

	if ($('.js-ajax-scroll').length && $(window).width() > 1000) {
		var i = 0;

		$(window).scroll(function() {
			var winScrTop = $(window).scrollTop(),
			Point = $('.js-ajax-scroll');

			if (Point.offset().top < window.innerHeight && !Point.hasClass('lock')) {
				Point.addClass('lock');

				var id = '#'+ Point.attr('data-id'),
				url = Point.attr('data-url'),
				data = Point.attr('data-data'),
				page = +Point.attr('data-page');

				data += '&page='+ page;

				Ajax.take(url, data, id, function() {
					page++;
					Point.attr('data-page', page).removeClass('lock');
				});

			}

		});

	}

	

});*/
//# sourceMappingURL=script.js.map
