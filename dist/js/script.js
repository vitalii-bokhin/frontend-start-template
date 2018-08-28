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
	}(navigator.userAgent));

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
		}(Element.prototype));
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

}());
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

			if (!navElem) {
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
				closeElem = e.target.closest(options.closeBtn);

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (closeElem) {
					e.preventDefault();
					this.close();
				}
			});
		}
	};
}());
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
}());
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
}());
/*
Toggle.init(Str button selector[, Str toggle class, default: 'toggled']);

Toggle.role = function() {
	return {
		[data-role]: {
			on: function() {
				
			},
			off: function() {
					
			}
		},
	};
}
*/
; var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',
		role: null,

		toggle: function(elem) {
			var targetElements = document.querySelectorAll(elem.getAttribute('data-target-elements')),
			role = elem.getAttribute('data-role');

			if (!targetElements.length) {
				return;
			}

			if (elem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				elem.classList.remove(this.toggledClass);

				if (role && this.role) {
					this.role()[role].off();
				}

				if (elem.hasAttribute('data-first-text')) {
					elem.innerHTML = elem.getAttribute('data-first-text');
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				elem.classList.add(this.toggledClass);

				if (role && this.role) {
					this.role()[role].on();
				}

				if (elem.hasAttribute('data-secont-text')) {
					elem.setAttribute('data-first-text', elem.innerHTML);

					elem.innerHTML = elem.getAttribute('data-secont-text');
				}
			}
		},

		init: function(elementStr, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
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
}());
var FlexImg;

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
}());
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

}());
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
}());
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

}());



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
var Form, NextFieldset;

(function() {
	"use strict";

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

	//init forms
	Form = function(formSelector) {
		this.onSubmit = null;

		var form = document.querySelector(formSelector);

		if (!form) {
			return;
		}

		this.form = form;

		//clear form
		function clear() {
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				elem.value = '';
				CustomPlaceholder.hidePlaceholder(elem, false);
			}

			var textareaMirrors = form.querySelectorAll('.form__textarea-mirror');

			for (var i = 0; i < textareaMirrors.length; i++) {
				textareaMirrors[i].innerHTML = '';
			}
		}

		//submit button
		function actSubmitBtn(st) {
			var elements = form.querySelectorAll('button[type="submit"], input[type="submit"]');

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

		//submit
		form.addEventListener('submit', (e) => {
			if (!this.onSubmit) {
				return;
			}

			e.preventDefault();

			//call external method onSubmit
			var sending = this.onSubmit(form, function(obj) {
				obj = obj || {};

				actSubmitBtn(obj.unlockSubmitButton);

				form.classList.remove('form_sending');

				if (obj.clearForm == true) {
					clear();
				}
			});

			if (sending) {
				actSubmitBtn(false);

				form.classList.add('form_sending');
			}
		});
	}
	

}());
var CustomPlaceholder, CustomSelect;

(function() {
	"use strict";

	//bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
			label = elem.parentElement.querySelector('label'),
			forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-'+ i;

			if (!label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}

		}

	}

	//show element on checkbox change
	var ChangeCheckbox = {

		change: function(elem) {

			var targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

			if (!targetElements.length) {
				return;
			}

			for (var i = 0; i < targetElements.length; i++) {
				targetElements[i].style.display = (elem.checked) ? 'block' : 'none';
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

	//show element on radio button change
	var ChangeRadio = {

		change: function(checkedElem) {

			var elements = document.querySelectorAll('input[type="radio"][name="'+ checkedElem.name +'"]');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

				if (!targetElements.length) {
					continue;
				}

				for (var j = 0; j < targetElements.length; j++) {
					targetElements[j].style.display = (elem.checked) ? 'block' : 'none';
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

	//form custom placeholder
	CustomPlaceholder = {

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
					label.className = 'custom-placeholder';
					label.innerHTML = elem.placeholder;

					elem.parentElement.insertBefore(label, elem);

					elem.removeAttribute('placeholder');
					
					if (!elem.id) {
						elem.id = elemFor;
					}

				}

				if (elem.value.length) {
					this.hidePlaceholder(elem, true);
				}

			}

			//events
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, true);
				}

			}, true);


			document.addEventListener('blur', (e) => {

				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, false);
				}

			}, true);

		},
		
		hidePlaceholder: function(elem, hide) {

			var label = document.querySelector('label.custom-placeholder[for="'+ elem.id +'"]');

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

	//Form CustomSelect
	CustomSelect = {
		field: null,

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

					var textInputElement = targetElem.querySelector('input[type="text"]');

					if (textInputElement) {
						textInputElement.focus();
					}
				} else {
					targetElem.style.display = 'none';
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

				var lalueElements = this.field.querySelectorAll('.custom-select__val');

				for (var i = 0; i < lalueElements.length; i++) {
					lalueElements[i].classList.remove('custom-select__val_checked');
				}

				elem.classList.add('custom-select__val_checked');

				if (button) {
					button.innerHTML = toButtonValue;
				}

				input.value = toInputValue;
				
				this.close();

				CustomPlaceholder.hidePlaceholder(input, true);

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
					head = '<input type="text" name="'+ elem.name +'"'+ require + ((placeholder) ? ' placeholder="'+ placeholder +'" ' : '') +'class="custom-select__input custom-select__autocomplete form__text-input" value="'+ ((selectedOption) ? selectedOption.innerHTML : '') +'">';
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

			//click on select button event
			document.addEventListener('click', (e) => {
				var elem = e.target.closest('.custom-select__button');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				if (this.field.classList.contains('custom-select_opened')) {
					this.close();
				} else {
					this.close();

					this.open();
				}
			});

			//click on value button event
			document.addEventListener('click', (e) => {
				var elem = e.target.closest('.custom-select__val');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.selectVal(elem);
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

	//custom file
	var CustomFile = {
		field: null,

		loadPreview: function(file, i) {
			var itemBlock = this.field.querySelectorAll('.custom-file__item')[i],
			reader = new FileReader();

			reader.onload = function(e) {
				var preview = document.createElement('div');

				preview.className = 'custom-file__preview';
				preview.innerHTML = '<img src="'+ e.target.result +'">';

				itemBlock.insertBefore(preview, itemBlock.firstChild);
			}

			reader.readAsDataURL(file);
		},

		changeInput: function(elem) {
			var maxFiles = +elem.getAttribute('data-max-files');

			if (maxFiles && elem.files.length > maxFiles) {
				return;
			}

			this.field = elem.closest('.custom-file');

			var fileItems = this.field.querySelector('.custom-file__items');

			fileItems.innerHTML = '';

			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i],
				fileItem = document.createElement('div');

				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__name">'+ file.name +'</div>';

				fileItems.appendChild(fileItem);

				if (file.type.match(/image.*/)) {
					this.loadPreview(file, i);
				}
			}
		},

		init: function() {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="file"]');

				if (!elem) {
					return;
				}

				this.changeInput(elem);
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

	//init scripts
	document.addEventListener("DOMContentLoaded", function() {
		CustomSelect.init('select');
		CustomFile.init();
		varHeightTextarea.init();
		CustomPlaceholder.init('input[type="text"], input[type="password"], textarea');
		BindLabels('input[type="checkbox"], input[type="radio"]');
		ChangeCheckbox.init();
		ChangeRadio.init();
	});

}());
var ValidateForm;

(function() {
	"use strict";

	ValidateForm = {

		input: null,

		errorTip: function(err, errInd, errorTxt) {
			var field = this.input.parentElement,
			errTip = field.querySelector('.field-error-tip') || field.parentElement.querySelector('.field-error-tip');
			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');

				if (errInd) {
					if (!errTip.hasAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = (errInd != 'custom') ? errTip.getAttribute('data-error-text-'+ errInd) : errorTxt;
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

		name: function() {
			var err = false;

			if (!/^[a-zа-яё-]{3,21}(\s[a-zа-яё-]{3,21})?(\s[a-zа-яё-]{3,21})?$/i.test(this.input.value)) {
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

		file: function(e) {
			if (e) {
				var elem = e.target.closest('input[type="file"]');
				if (!elem) {
					return;
				} else {
					this.input = elem;
				}
			}

			var err = false,
			errCount = {ext: 0, size: 0},
			files = this.input.files,
			maxFiles = +this.input.getAttribute('data-max-files'),
			extensions = this.input.getAttribute('data-ext'),
			extRegExp = new RegExp('(?:\\.'+ extensions.replace(/,/g, '|\\.') +')$'),
			maxSize = +this.input.getAttribute('data-max-size');

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				if (!file.name.match(extRegExp)) {
					errCount.ext++;
					continue;
				}

				if (file.size > maxSize) {
					errCount.size++;
				}
			}
			
			if (maxFiles && files.length > maxFiles) {
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

		validateOnInputOrBlur: function(e) {

			var elem = e.target.closest('input[type="text"], input[type="password"], textarea');

			if (!elem) {
				return;
			}

			this.input = elem;

			if (e.type == 'blur') {
				elem.setAttribute('data-tested', 'true');
			} else if (e.type == 'input' && !elem.getAttribute('data-tested')) {
				return;
			}

			var type = elem.getAttribute('data-type'),
			val = elem.value;

			if (elem.getAttribute('data-required') && !val.length) {
				this.errorTip(true);
			} else if (val.length && type) {
				this[type]();
			} else {
				this.errorTip(false);
			}
			
		},

		validate: function(form) {
			var err = 0;

			//text, password, textarea
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				var inpType = elem.getAttribute('data-type');

				if (elem.value.length) {
					if (inpType && this[inpType]()) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//select
			var elements = form.querySelectorAll('.custom-select__input');

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
			var elements = form.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//checkbox group
			var groups = form.querySelectorAll('.form__chbox-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElements = 0;

				if (group.elementIsHidden()) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="checkbox"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
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
			var groups = form.querySelectorAll('.form__radio-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElement = false;

				if (group.elementIsHidden()) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="radio"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
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
			var elements = form.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (elem.files.length) {
					if (this.file()) {
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
			var elements = form.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				var val = elem.value;

				if (val.length) {
					var compElemVal = form.querySelector(elem.getAttribute('data-pass-compare-input')).value;

					if (val !== compElemVal) {
						this.errorTip(true, 2);
						err++;
					} else {
						this.errorTip(false);
					}

				}

			}

			return (err) ? false : true;
		},

		submit: function(form) {
			return this.validate(form);
		},

		init: function(form) {
			if (!form) {
				return;
			}

			form.addEventListener('input', this.validateOnInputOrBlur.bind(this));

			form.addEventListener('blur', this.validateOnInputOrBlur.bind(this), true);

			form.addEventListener('change', this.file.bind(this));

			form.addEventListener('submit', (e) => {
				if (this.validate(form)) {
					form.classList.remove('form-error');
				} else {
					e.preventDefault();

					form.classList.add('form-error');
				}
			});
		}

	};

}());
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
}());
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
}());
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
}());
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
}());
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
}());
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
}());


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
}());
; var Timer;

(function() {
	"use strict";

	Timer = function(setTime, elemId) {
		var elem = document.getElementById(elemId);

		this.time = setTime;
		this.interval = null;
		this.onStop = null;

		function setCookies() {
			document.cookie = 'lastTimer'+ elemId +'='+ Date.now() +'; expires='+ new Date(Date.now() + 86400000).toUTCString();
		}

		var timerCookieValue = (function() {
			if (document.cookie) {
				var cokArr = document.cookie.replace(/(\s)+/g, '').split(';');

				for (var i = 0; i < cokArr.length; i++) {
					var keyVal = cokArr[i].split('=');
					if (keyVal[0] == 'lastTimer'+ elemId) {
						return keyVal[1];
					}
				}
			}
		}());

		if (timerCookieValue) {
			var delta = Math.round((Date.now() - timerCookieValue) / 1000);
			if (delta < this.time) {
				this.time = this.time - delta;
			} else {
				setCookies();
			}
		} else {
			setCookies();
		}

		function output(time) {
			var min = (time > 60) ? Math.floor(time / 60) : 0,
			sec = (time > 60) ? Math.round(time % 60) : time,
			minOut  = '',
			secTxt = 'секунд';

			if (min != 0) {
				if (min == 1) {
					minOut = min +' минуту';
				} else if (min < 5) {
					minOut = min +' минуты';
				}
			}

			if (sec == 1 || sec == 21) {
				secTxt = 'секунду';
			} else if (sec < 5) {
				secTxt = 'секунды';
			} else if (sec < 21) {
				secTxt = 'секунд';
			}

			var secNum = (sec < 10) ? '0'+ sec : sec;

			elem.innerHTML = [minOut, secNum, secTxt].join(' ');
		}

		var stop = () => {
			clearInterval(this.interval);

			if (this.onStop) {
				setTimeout(this.onStop);
			}
		}

		this.start = function() {
			if (!elem) {
				return;
			}
			
			this.interval = setInterval(() => {
				this.time--;

				output(this.time);

				if (this.time == 0) {
					stop();
				}
			}, 1000);
		}
	}
}());
//# sourceMappingURL=script.js.map
