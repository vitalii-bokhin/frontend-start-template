// global variables
; var browser, elemIsHidden, ajax, animate;

(function() {
	'use strict';
	
	// Get useragent
	document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());
	
	// Browser identify
	browser = (function(userAgent) {
		userAgent = userAgent.toLowerCase();
		
		if (/(msie|rv:11\.0)/.test(userAgent)) {
			return 'ie';
		} else if (/firefox/.test(userAgent)) {
			return 'ff';
		}
	})(navigator.userAgent);
	
	// Add support CustomEvent constructor for IE
	try {
		new CustomEvent("IE has CustomEvent, but doesn't support constructor");
	} catch (e) {
		window.CustomEvent = function(event, params) {
			var evt = document.createEvent("CustomEvent");

			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};

			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			
			return evt;
		}
		
		CustomEvent.prototype = Object.create(window.Event.prototype);
	}
	
	// Window Resized Event
	const winResizedEvent = new CustomEvent('winResized'),
	winWidthResizedEvent = new CustomEvent('winWidthResized');

	let rsz = true,
	beginWidth = window.innerWidth;
	
	window.addEventListener('resize', function() {
		if (rsz) {
			rsz = false;
			
			setTimeout(function() {
				window.dispatchEvent(winResizedEvent);
				
				if (beginWidth != window.innerWidth) {
					window.dispatchEvent(winWidthResizedEvent);

					beginWidth = window.innerWidth
				}

				rsz = true;
			}, 1021);
		}
	});
	
	// Closest polyfill
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
	
	// Check element for hidden
	elemIsHidden = function(elem) {
		while (elem) {
			if (!elem) break;
			
			const compStyle = getComputedStyle(elem);
			
			if (compStyle.display == 'none' || compStyle.visibility == 'hidden' || compStyle.opacity == '0') return true;
			
			elem = elem.parentElement;
		}
		
		return false;
	}
	
	// Ajax
	ajax = function(options) {
		const xhr = new XMLHttpRequest();
		
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
		const start = performance.now();
		
		requestAnimationFrame(function anim(time) {
			let timeFraction = (time - start) / duration;
			
			if (timeFraction > 1) {
				timeFraction = 1;
			}
			
			draw((ease) ? easing(timeFraction, ease) : timeFraction);
			
			if (timeFraction < 1) {
				requestAnimationFrame(anim);
			} else {
				if (complete !== undefined) {
					complete();
				}
			}
		});
	}
	
	function easing(timeFraction, ease) {
		switch (ease) {
			case 'easeInQuad':
			return quad(timeFraction);
			
			case 'easeOutQuad':
			return 1 - quad(1 - timeFraction);
			
			case 'easeInOutQuad':
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
/* 
	MobNav.init({
		openBtn: '.js-open-menu',
		closeBtn: '.js-close-menu',
		headerId: 'header',
		closeLink: '.menu a.js-anchor'
	});
*/

; var MobNav;

(function () {
	'use strict';

	// fix header
	const headerElem = document.getElementById('header');

	function fixHeader() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else if (!document.body.classList.contains('popup-is-opened') && !document.body.classList.contains('mob-nav-is-opened')) {
			headerElem.classList.remove('header_fixed');
		}
	}

	fixHeader();

	window.addEventListener('scroll', fixHeader);

	//mob menu
	MobNav = {
		options: null,
		winScrollTop: 0,

		fixBody: function (st) {
			if (st) {
				this.winScrollTop = window.pageYOffset;

				document.body.classList.add('mob-nav-is-opened');
				document.body.style.top = -this.winScrollTop + 'px';
			} else {
				document.body.classList.remove('mob-nav-is-opened');

				if (this.winScrollTop > 0) {
					window.scrollTo(0, this.winScrollTop);
				}
			}
		},

		open: function (btnElem) {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			if (btnElem.classList.contains('opened')) {
				this.close();
			} else {
				btnElem.classList.add('opened');
				headerElem.classList.add('opened');
				this.fixBody(true);
			}
		},

		close: function () {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			headerElem.classList.remove('opened');

			var openBtnElements = document.querySelectorAll(this.options.openBtn);

			for (var i = 0; i < openBtnElements.length; i++) {
				openBtnElements[i].classList.remove('opened');
			}

			this.fixBody(false);
		},

		init: function (options) {
			this.options = options;

			document.addEventListener('click', (e) => {
				const openElem = e.target.closest(options.openBtn);

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (e.target.closest(options.closeBtn)) {
					e.preventDefault();
					this.close();
				} else if (e.target.closest(options.closeLink)) {
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
	'use strict';

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
	'use strict';

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
Toggle.init(Str toggleSelector[, onDocClickToggleOffSelecor[, Str toggledClass (default - 'toggled')]]);

Toggle.onChange = function(toggleElem, state) {
	// code...
}
*/

; var Toggle;

(function() {
	'use strict';
	
	Toggle = {
		toggledClass: 'toggled',
		onChange: null,
		
		target: function(toggleElem, state) {
			var targetElements = document.querySelectorAll(toggleElem.getAttribute('data-target-elements'));
			
			if (!targetElements.length) return;
			
			if (state) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}
				
				//dependence elements
				if (toggleElem.hasAttribute('data-dependence-target-elements')) {
					var dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));
					
					for (var i = 0; i < dependenceTargetElements.length; i++) {
						dependenceTargetElements[i].classList.remove(this.toggledClass);
					}
				}
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}
			}
		},
		
		toggle: function(toggleElem, off) {
			var state;
			
			if (toggleElem.classList.contains(this.toggledClass)) {
				toggleElem.classList.remove(this.toggledClass);
				
				state = false;
				
				if (toggleElem.hasAttribute('data-first-text')) {
					toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
				}
			} else if (!off) {
				toggleElem.classList.add(this.toggledClass);
				
				state = true;
				
				if (toggleElem.hasAttribute('data-second-text')) {
					toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);
					
					toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
				}
			}
			
			//target
			if (toggleElem.hasAttribute('data-target-elements')) {
				this.target(toggleElem, state);
			}
			
			//call onChange
			if (this.onChange) {
				this.onChange(toggleElem, state);
			}
		},
		
		onDocClickOff: function (e, onDocClickOffSelector, curEl) {
			var toggleElements = document.querySelectorAll(onDocClickOffSelector + '.' +this.toggledClass);
			
			for (var i = 0; i < toggleElements.length; i++) {
				var elem = toggleElements[i];

				if (curEl === elem) continue;

				if (elem.hasAttribute('data-target-elements')) {
					var targetSelectors = elem.getAttribute('data-target-elements');
					
					if (!e.target.closest(targetSelectors)) {
						this.toggle(elem, true);
					}
				} else {
					this.toggle(elem, true);
				}
			}
		},
		
		init: function(toggleSelector, onDocClickOffSelector, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
			document.addEventListener('click', (e) => {
				var toggleElem = e.target.closest(toggleSelector);
				
				if (toggleElem) {
					e.preventDefault();
					
					this.toggle(toggleElem);
				}
				
				this.onDocClickOff(e, onDocClickOffSelector, toggleElem);
			});
		}
	};
})();
; var FlexImg;

(function() {
	'use strict';

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
/* 
CoverImg.init([Str parent element selector]);

CoverImg.reInit([Str parent element selector]);
*/
; var CoverImg;

(function() {
	'use strict';

	CoverImg = {
		cover: function(e) {
			var img = e.currentTarget,
			imgWrap = img.closest('.cover-img-wrap'),
			imgProportion = img.offsetWidth/img.offsetHeight,
			imgWrapProportion = imgWrap.offsetWidth/imgWrap.offsetHeight;

			if (imgWrapProportion != Infinity && imgWrapProportion < 21) {

				if (imgProportion <= imgWrapProportion) {
					// var margin = Math.round(-(imgWrap.offsetWidth / imgProportion - imgWrap.offsetHeight) / 2);

					img.classList.add('cover-img_w');
					// img.style.marginTop = margin +'px';

				} else {
					// var margin = Math.round(-(imgWrap.offsetHeight * imgProportion - imgWrap.offsetWidth) / 2);

					img.classList.add('cover-img_h');
					// img.style.marginLeft = margin +'px';

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
				// img.style.marginTop = '';
				// img.style.marginLeft = '';
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
new LazyLoad({
   selector: @Str,
   event: false
});
*/

; var LazyLoad;

(function() {
   'use strict';
   
   LazyLoad = function(opt) {
      opt = opt || {};
      
      const elements = document.querySelectorAll(opt.selector);
      
      if (!elements.length) return;
      
      function doLoad() {
         for (let i = 0; i < elements.length; i++) {
            const elem = elements[i],
            src = elem.getAttribute('data-src') || null;
            
            if (src) {
               elem.src = src;
            }
         }
      }
      
      // do load
      if (opt.event && opt.event == 'scroll') {} else {
         setTimeout(doLoad, 1000);
      }
   }
})();
/*
Video.init(Str button selector);
*/
var Video;

(function() {
	'use strict';
	
	Video = {
		play: function(elem) {
			elem.nextElementSibling.classList.add('video__frame_visible');
			
			const iFrame = document.createElement('iframe'),
			vId = elem.getAttribute('data-src').match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i)[1];
			
			iFrame.src = 'https://www.youtube.com/embed/'+ vId +'?autoplay=1&rel=0&amp;showinfo=0';
			iFrame.allow = 'autoplay; encrypted-media';
			iFrame.allowFullscreen = true;
			
			iFrame.addEventListener('load', function() {
				iFrame.classList.add('visible');

				elem.nextElementSibling.classList.add('video__frame_played');
			});
			
			elem.nextElementSibling.appendChild(iFrame);
		},
		
		init: function(elementStr) {
			if (!document.querySelectorAll('.video').length) return;
			
			document.addEventListener('click', (e) => {
				const elem = e.target.closest(elementStr);
				
				if (elem) {
					this.play(elem);
				}
			});
		}
	};
})();
var Popup, MediaPopup;

(function() {
	'use strict';

	//popup core
	Popup = {
		winScrollTop: 0,
		onClose: null,
		_onclose: null,
		onOpen: null,
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

		open: function(elementStr, callback, btnElem) {
			var elem = document.querySelector(elementStr);

			if (!elem || !elem.classList.contains('popup__window')) {
				return;
			}

			this.close();

			var elemParent = elem.parentElement;
			
			elemParent.classList.add('popup_visible');

			elem.classList.add('popup__window_visible');

			if (callback) {
				this._onclose = callback;
			}

			this.fixBody(true);

			if (this.onOpen) {
				this.onOpen(elementStr, btnElem);
			}

			return elem;
		},

		message: function(msg, elementStr, callback) {
			const elemStr = elementStr || '#message-popup',
			elem = this.open(elemStr, callback);

			elem.querySelector('.popup__inner').innerHTML = '<div class="popup__message m-0">'+ msg +'</div>';
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

			if (this._onclose) {
				this._onclose();
				this._onclose = null;
			} else if (this.onClose) {
				this.onClose();
			}
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var btnElem = e.target.closest(elementStr),
				closeBtnElem = e.target.closest('.js-popup-close');

				if (btnElem) {
					e.preventDefault();
					this.open(btnElem.getAttribute('data-popup'), false, btnElem);
				} else if (closeBtnElem || (!e.target.closest('.popup__window') && e.target.closest('.popup'))) {
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
	'use strict';

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
	'use strict';

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
; var Select;

(function () {
	'use strict';
	
	// custom select
	Select = {
		field: null,
		hideCssClass: 'hidden',
		onSelect: null,
		
		reset: function(parentElem) {
			var parElem = parentElem || document, 
			fieldElements = parElem.querySelectorAll('.select'),
			buttonElements = parElem.querySelectorAll('.select__button'),
			inputElements = parElem.querySelectorAll('.select__input'),
			valueElements = parElem.querySelectorAll('.select__val');
			
			for (var i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('select_changed');
			}
			
			for (var i = 0; i < buttonElements.length; i++) {
				buttonElements[i].innerHTML = buttonElements[i].getAttribute('data-placeholder');
			}
			
			for (var i = 0; i < inputElements.length; i++) {
				inputElements[i].value = '';
				inputElements[i].blur();
			}
			
			for (var i = 0; i < valueElements.length; i++) {
				valueElements[i].classList.remove('select__val_checked');
			}
		},
		
		close: function() {
			const fieldElements = document.querySelectorAll('.select'),
			optionsElements = document.querySelectorAll('.select__options');
			
			for (let i = 0; i < fieldElements.length; i++) {
				fieldElements[i].classList.remove('select_opened');

				optionsElements[i].classList.remove('ovfauto');
				optionsElements[i].style.height = 0;
			}
			
			var listItemElements = document.querySelectorAll('.select__options li');
			
			for (var i = 0; i < listItemElements.length; i++) {
				listItemElements[i].classList.remove('hover');
			}
		},
		
		open: function() {
			this.field.classList.add('select_opened');
			
			const optionsElem = this.field.querySelector('.select__options');
			
			optionsElem.style.height = ((optionsElem.scrollHeight > 222) ? 222 : (optionsElem.scrollHeight + 2)) +'px';
			optionsElem.scrollTop = 0;
			
			setTimeout(function () {
				optionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		selectMultipleVal: function(elem, button, input) {
			var toButtonValue = [],
			toInputValue = [],
			inputsBlock = this.field.querySelector('.select__multiple-inputs');
			
			elem.classList.toggle('select__val_checked');
			
			var checkedElements = this.field.querySelectorAll('.select__val_checked');
			
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
			const elements = this.field.querySelectorAll('.select__val');
			
			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i];
				
				if (!elem.hasAttribute('data-target-elements')) continue;
				
				const targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
				
				if (elem.classList.contains('select__val_checked')) {
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
			const button = this.field.querySelector('.select__button'),
			input = this.field.querySelector('.select__input');
			
			if (this.field.classList.contains('select_multiple')) {
				this.selectMultipleVal(elem, button, input);
			} else {
				const toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
				
				const valueElements = this.field.querySelectorAll('.select__val');
				
				for (let i = 0; i < valueElements.length; i++) {
					const valElem = valueElements[i];

					valElem.classList.remove('select__val_checked');
					valElem.disabled = false;
				}
				
				elem.classList.add('select__val_checked');
				elem.disabled = true;
				
				if (button) {
					button.innerHTML = toButtonValue;
				}
				
				input.value = toInputValue;
				
				this.close();
				
				if (window.Placeholder) {
					Placeholder.hide(input, true);
				}
				
				if (input.getAttribute('data-submit-form-onchange')) {
					Form.submitForm(input.closest('form'));
				}
				
				if (this.onSelect) {
					this.onSelect(input, toInputValue, elem.getAttribute('data-second-value'));
				}
			}
			
			this.targetAction();
			
			if (input.classList.contains('var-height-textarea__textarea')) {
				varHeightTextarea.setHeight(input);
			}
			
			this.field.classList.add('select_changed');
			
			ValidateForm.select(input);
		},
		
		setOptions: function(fieldSelector, optObj, nameKey, valKey, secValKey) {
			var fieldElements = document.querySelectorAll(fieldSelector +' .select');
			
			for (var i = 0; i < fieldElements.length; i++) {
				var optionsElem = fieldElements[i].querySelector('.select__options');
				
				optionsElem.innerHTML = '';
				
				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li'),
					secValAttr = (secValKey != undefined) ? ' data-second-value="'+ optObj[i][secValKey] +'"' : '';
					
					li.innerHTML = '<button type="button" class="select__val" data-value="'+ optObj[i][valKey] +'"'+ secValAttr +'>'+ optObj[i][nameKey] +'</button>';
					
					optionsElem.appendChild(li);
				}
			}
		},
		
		keyboard: function(key) {
			var options = this.field.querySelector('.select__options'),
			hoverItem = options.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = function (item) {
						var elem = item.nextElementSibling;
						
						while (elem) {
							if (!elem) break;
							
							if (!elemIsHidden(elem)) {
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
						if (!elem) break;
						
						if (!elemIsHidden(elem)) {
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
					var nextItem = function (item) {
						var elem = item.previousElementSibling;
						
						while (elem) {
							if (!elem) break;
							
							if (!elemIsHidden(elem)) {
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
						if (!elem) break;
						
						if (!elemIsHidden(elem)) {
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
				this.selectVal(hoverItem.querySelector('.select__val'));
			}
		},
		
		build: function(elementStr) {
			const elements = document.querySelectorAll(elementStr);
			
			if (!elements.length) return;
			
			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i],
				options = elem.querySelectorAll('option'),
				parent = elem.parentElement;
				
				let optionsList = '',
				selectedOption = null;
				
				// option list
				for (let i = 0; i < options.length; i++) {
					const opt = options[i];
					
					if (opt.hasAttribute('selected')) {
						selectedOption = opt;
					}
					
					optionsList += '<li><button type="button" class="select__val'+ ((opt.hasAttribute('selected')) ? ' select__val_checked' : '') +'"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '') + ((opt.hasAttribute('data-second-value')) ? ' data-second-value="'+ opt.getAttribute('data-second-value') +'"' : '') + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '') +'>'+ opt.innerHTML +'</button></li>';
				}
				
				const require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',

				placeholder = elem.getAttribute('data-placeholder'),

				submitOnChange = (elem.hasAttribute('data-submit-form-onchange')) ? ' data-submit-form-onchange="'+ elem.getAttribute('data-submit-form-onchange') +'" ' : '',

				head = '<button type="button"'+ ((placeholder) ? ' data-placeholder="'+ placeholder +'"' : '') +' class="select__button">'+ ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') +'</button>',

				multiple = {
					class: (elem.multiple) ? ' select_multiple' : '',
					inpDiv: (elem.multiple) ? '<div class="select__multiple-inputs"></div>' : ''
				},

				hiddenInp = '<input type="hidden" name="'+ elem.name +'"'+ require + submitOnChange +'class="select__input" value="'+ ((selectedOption) ? selectedOption.value : '') +'">';

				if (elem.hasAttribute('data-empty-text')) {
					optionsList = '<li class="select__options-empty">'+ elem.getAttribute('data-empty-text') +'</li>';
				}
				
				// output select
				const customElem = document.createElement('div');

				customElem.className = 'select'+ multiple.class + ((selectedOption) ? ' select_changed' : '');

				customElem.innerHTML = head +'<ul class="select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv;

				parent.insertBefore(customElem, parent.firstChild);
				parent.removeChild(parent.children[1]);
			}
		},
		
		init: function (elementStr) {
			this.build(elementStr);
			
			// click on select or value or arrow button
			document.addEventListener('click', (e) => {
				const btnElem = e.target.closest('.select__button'),
				valElem = e.target.closest('.select__val');
				
				if (btnElem) {
					this.field = btnElem.closest('.select');
					
					if (this.field.classList.contains('select_opened')) {
						this.close();
					} else {
						this.close();
						this.open();
					}
				} else if (valElem) {
					this.field = valElem.closest('.select');
					this.selectVal(valElem);
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.select_opened');
				
				if (!elem) return;
				
				this.field = elem.closest('.select');
				
				var key = e.which || e.keyCode || 0;
				
				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();
					this.keyboard(key);
				}
			});
			
			// close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.select_opened')) {
					this.close();
				}
			});
		}
	};
	
	// init script
	document.addEventListener('DOMContentLoaded', function () {
		Select.init('select');
	});
})();
; var AutoComplete;

(function () {
	'use strict';
	
	AutoComplete = {
		fieldElem: null,
		inputElem: null,
		optionsElem: null,
		getValues: null,
		opt: {},
		
		open: function (optH) {
			this.fieldElem.classList.add('autocomplete_opened');
			
			const optionsHeight = optH || 185;
			
			this.optionsElem.style.height = (optionsHeight + 2) +'px';
			this.optionsElem.scrollTop = 0;
			
			setTimeout(() => {
				this.optionsElem.classList.add('ovfauto');
			}, 550);
		},
		
		close: function (inputElem) {
			const inpElem = inputElem || this.inputElem,
			fieldElem = inpElem.closest('.autocomplete'),
			optionsElem = fieldElem.querySelector('.autocomplete__options');
			
			fieldElem.classList.remove('autocomplete_opened');
			
			optionsElem.classList.remove('ovfauto');
			optionsElem.style.height = 0;
		},
		
		searchValue: function() {
			if (!this.getValues) return;
			
			let values = '';
			
			if (this.inputElem.value.length) {
				const preReg = new RegExp('('+ this.inputElem.value +')', 'i');
				
				this.getValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
					for (let i = 0; i < valuesData.length; i++) {
						const valData = valuesData[i];
						
						if (nameKey !== undefined) {
							if (valData[nameKey].match(preReg)) {
								values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey].replace(preReg, '<span>$1</span>') +'</button></li>';
							}
						} else {
							if (valData.match(preReg)) {
								values += '<li><button type="button" class="autocomplete__val">'+ valData.replace(preReg, '<span>$1</span>') +'</button></li>';
							}
						}
					}
					
					if (values == '') {
						if (this.inputElem.hasAttribute('data-other-value')) {
							values = '<li class="autocomplete__options-other"><button type="button" class="autocomplete__val">'+ this.inputElem.getAttribute('data-other-value') +'</button></li>';

							this.optionsElem.innerHTML = values;
							
							this.open(this.optionsElem.querySelector('.autocomplete__options-other').offsetHeight);
						} else {
							values = '<li class="autocomplete__options-empty">'+ this.inputElem.getAttribute('data-nf-text') +'</li>';
							
							this.optionsElem.innerHTML = values;
							
							this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
						}
						
						
					} else {
						this.optionsElem.innerHTML = values;
						this.open();
					}
				});
			} else {
				if (this.opt.getAllValuesIfEmpty) {
					this.getValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
						for (let i = 0; i < valuesData.length; i++) {
							const valData = valuesData[i];
							
							if (nameKey !== undefined) {
								values += '<li><button type="button" data-value="'+ valData[valKey] +'" data-second-value="'+ valData[secValKey] +'" class="autocomplete__val">'+ valData[nameKey] +'</button></li>';
							} else {
								values += '<li><button type="button" class="autocomplete__val">'+ valData +'</button></li>';
							}
						}
						
						this.optionsElem.innerHTML = values;
						this.open();
					});
				} else {
					this.optionsElem.innerHTML = '';
					this.close();
				}
			}
		},
		
		selectVal: function(itemElem) {
			const valueElem = itemElem.querySelector('.autocomplete__val');
			
			if (!valueElem) return;
			
			if (window.Placeholder) {
				Placeholder.hide(this.inputElem, true);
			}
			
			this.inputElem.value = valueElem.innerHTML.replace(/<\/?span>/g, '');
		},
		
		keybinding: function(e) {
			const key = e.which || e.keyCode || 0;
			
			if (key != 40 && key != 38 && key != 13) return;
			
			e.preventDefault();
			
			const optionsElem = this.optionsElem,
			hoverItem = optionsElem.querySelector('li.hover');
			
			switch (key) {
				case 40:
				if (hoverItem) {
					var nextItem = hoverItem.nextElementSibling;
					
					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);
						
						this.selectVal(nextItem);
					}
				} else {
					var nextItem = optionsElem.firstElementChild;
					
					if (nextItem) {
						nextItem.classList.add('hover');
						
						this.selectVal(nextItem);
					}
				}
				break;
				
				case 38:
				if (hoverItem) {
					var nextItem = hoverItem.previousElementSibling;
					
					if (nextItem) {
						hoverItem.classList.remove('hover');
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);
						
						this.selectVal(nextItem);
					}
				} else {
					var nextItem = optionsElem.lastElementChild;
					
					if (nextItem) {
						nextItem.classList.add('hover');
						
						optionsElem.scrollTop = 9999;
						
						this.selectVal(nextItem);
					}
				}
				break;
				
				case 13:
				if (hoverItem) {
					this.selectVal(hoverItem);
					
					this.inputElem.blur();
				}
			}
		},
		
		init: function(options) {
			options = options || {};
			
			this.opt.getAllValuesIfEmpty = (options.getAllValuesIfEmpty !== undefined) ? options.getAllValuesIfEmpty : true;
			
			// focus event
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest('.autocomplete__input');
				
				if (!elem) return;
				
				this.fieldElem = elem.closest('.autocomplete');
				this.inputElem = elem;
				this.optionsElem = this.fieldElem.querySelector('.autocomplete__options');
				
				this.searchValue();
			}, true);
			
			// blur event
			document.addEventListener('blur', (e) => {
				const inpElem = e.target.closest('.autocomplete__input');
				
				if (inpElem) {
					setTimeout(() => {
						this.close(inpElem);
					}, 321);
				}
			}, true);
			
			// input event
			document.addEventListener('input', (e) => {
				if (e.target.closest('.autocomplete__input')) {
					this.searchValue();
				}
			});
			
			// click event
			document.addEventListener('click', (e) => {
				const valElem = e.target.closest('.autocomplete__val'),
				arrElem = e.target.closest('.autocomplete__arr');
				
				if (valElem) {
					this.selectVal(valElem.parentElement);
				} else if (arrElem) {
					if (!arrElem.closest('.autocomplete_opened')) {
						arrElem.closest('.autocomplete').querySelector('.autocomplete__input').focus();
					} else {
						this.close();
					}
				}
			});
			
			// keyboard events
			document.addEventListener('keydown', (e) => {
				if (e.target.closest('.autocomplete_opened')) {
					this.keybinding(e);
				}
			});
		}
	};
	
	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		AutoComplete.init();
	});
})();
; var CustomFile;

(function() {
	'use strict';
	
	//custom file
	CustomFile = {
		input: null,
		filesObj: {},
		filesArrayObj: {},
		
		clear: function(elem) {
			if (elem.hasAttribute('data-preview-elem')) {
				document.querySelector(elem.getAttribute('data-preview-elem')).innerHTML = '';
			}
			
			elem.closest('.custom-file').querySelector('.custom-file__items').innerHTML = '';
			
			this.filesObj[elem.id] = {};
			this.filesArrayObj[elem.id] = [];
			
			this.labelText(elem);
		},
		
		fieldClass: function(inputElem) {
			const fieldElem = inputElem.closest('.custom-file');
			
			if (this.filesArrayObj[inputElem.id].length) {
				fieldElem.classList.add('custom-file_loaded');
				
				if (this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
					fieldElem.classList.add('custom-file_max-loaded');
				} else {
					fieldElem.classList.remove('custom-file_max-loaded');
				}
			} else {
				fieldElem.classList.remove('custom-file_loaded');
				fieldElem.classList.remove('custom-file_max-loaded');
			}
		},

		lockUpload: function(inputElem) {
			if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
				inputElem.setAttribute('disabled', 'disable');
			} else {
				inputElem.removeAttribute('disabled');
			}
		},
		
		labelText: function(inputElem) {
			const labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');
			
			if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) return;
			
			const maxFiles = (inputElem.multiple) ? (+this.input.getAttribute('data-max-files')) : 1;
			
			if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
				if (!labTxtElem.hasAttribute('data-label-text')) {
					labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
				}
				labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
			} else if (labTxtElem.hasAttribute('data-label-text')) {
				labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
			}
		},
		
		loadPreview: function(file, fileItem) {
			var reader = new FileReader(),
			previewDiv;
			
			if (this.input.hasAttribute('data-preview-elem')) {
				previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
			} else {
				previewDiv = document.createElement('div');
				
				previewDiv.className = 'custom-file__preview';
				
				fileItem.insertBefore(previewDiv, fileItem.firstChild);
			}
			
			reader.onload = function(e) {
				setTimeout(function() {
					var imgDiv = document.createElement('div');
					
					imgDiv.innerHTML = (file.type.match(/image.*/)) ? '<img src="'+ e.target.result +'">' : '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg==">';
					
					previewDiv.appendChild(imgDiv);
				}, 121);
			}
			
			reader.readAsDataURL(file);
		},
		
		changeInput: function(elem) {
			var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');
			
			if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
				this.clear(elem);
			}
			
			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i];
				
				if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;
				
				var fileItem = document.createElement('div');
				
				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__name">'+ file.name +'</div><button type="button" class="custom-file__del-btn" data-ind="'+ file.name +'"></button>';
				
				fileItems.appendChild(fileItem);
				
				this.loadPreview(file, fileItem);
			}
			
			this.setFilesObj(elem.files);
		},
		
		setFilesObj: function(filesList, objKey) {
			var inputElem = this.input;
			
			if (!inputElem.id.length) {
				inputElem.id = 'custom-file-input-'+ new Date().valueOf();
			}
			
			if (filesList) {
				this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};
				
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
			
			this.fieldClass(inputElem);
			
			this.labelText(inputElem);

			this.lockUpload(inputElem);
			
			ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
		},
		
		inputFiles: function(inputElem) {
			return this.filesArrayObj[inputElem.id] || [];
		},
		
		getFiles: function(formElem) {
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
				
				if (!elem) return;
				
				this.input = elem;
				
				this.changeInput(elem);
			});
			
			document.addEventListener('click', (e) => {
				var delBtnElem = e.target.closest('.custom-file__del-btn'),
				clearBtnElem = e.target.closest('.custom-file__clear-btn'),
				inputElem = e.target.closest('input[type="file"]');
				
				if (inputElem && inputElem.multiple) {
					inputElem.value = null;
				}
				
				if (delBtnElem) {
					this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');
					
					delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));
					
					this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));
				}
				
				if (clearBtnElem) {
					var inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');
					
					inputElem.value = null;
					
					this.clear(inputElem);
				}
			});
		}
	};
	
	//init script
	document.addEventListener('DOMContentLoaded', function() {
		CustomFile.init();
	});
})();
; var Placeholder;

(function() {
	'use strict';

	Placeholder = {
		init: function(elementsStr) {
			var elements = document.querySelectorAll(elementsStr);

			if (!elements.length) return;

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
	'use strict';
	
	Maskinput = function(inputElem, type) {
		if (!inputElem) {
			return;
		}

		var defValue = '';

		this.tel = function(evStr) {
			if (evStr == 'focus' && !inputElem.value.length) {
				inputElem.value = '+7(';
			}

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

		inputElem.addEventListener('focus', () => {
			this[type]('focus');
		}, true);
	}
})();
var ValidateForm, Form;

(function () {
	'use strict';

	// validate form
	ValidateForm = {
		input: null,

		errorTip: function (err, errInd, errorTxt) {
			const field = this.input.closest('.form__field') || this.input.parentElement,
				errTip = field.querySelector('.field-error-tip');

			if (err) {
				field.classList.remove('field-success');
				field.classList.add('field-error');

				if (!errTip) return;

				if (errInd) {
					if (!errTip.hasAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = (errInd != 'custom') ? errTip.getAttribute('data-error-text-' + errInd) : errorTxt;
				} else if (errTip.hasAttribute('data-error-text')) {
					errTip.innerHTML = errTip.getAttribute('data-error-text');
				}
			} else {
				field.classList.remove('field-error');
				field.classList.add('field-success');
			}
		},

		customErrorTip: function (input, errorTxt) {
			if (!input) return;

			this.input = input;

			this.errorTip(true, 'custom', errorTxt);
		},

		formError: function (formElem, err, errTxt) {
			const errTipElem = formElem.querySelector('.form-error-tip');

			if (err) {
				formElem.classList.add('form-error');

				if (!errTipElem) return;

				if (errTxt) {
					if (!errTipElem.hasAttribute('data-error-text')) {
						errTipElem.setAttribute('data-error-text', errTipElem.innerHTML);
					}

					errTipElem.innerHTML = errTxt;
				} else if (errTipElem.hasAttribute('data-error-text')) {
					errTipElem.innerHTML = errTipElem.getAttribute('data-error-text');
				}
			} else {
				formElem.classList.remove('form-error');
			}
		},

		customFormErrorTip: function (formElem, errorTxt) {
			if (!formElem) return;

			this.formError(formElem, true, errorTxt);
		},

		txt: function () {
			var err = false;

			if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		num: function () {
			var err = false;

			if (!/^[0-9.,-]*$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		name: function () {
			var err = false;

			if (!/^[a-zа-яё'-]{3,21}(\s[a-zа-яё'-]{3,21})?(\s[a-zа-яё'-]{3,21})?$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		date: function () {
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

		email: function () {
			var err = false;

			if (!/^[a-z0-9]+[\w\-\.]*@[\w\-]{2,}\.[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		url: function () {
			var err = false;

			if (!/^(https?\:\/\/)?[a-zа-я0-9\-\.]+\.[a-zа-я]{2,11}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		tel: function () {
			var err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		pass: function () {
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

		checkbox: function (elem) {
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

		radio: function (elem) {
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

		select: function (elem) {
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

		file: function (elem, filesArr) {
			this.input = elem;

			var err = false,
				errCount = { ext: 0, size: 0 },
				maxFiles = +this.input.getAttribute('data-max-files'),
				extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
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

		validateOnInput: function (elem) {
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

		validate: function (formElem) {
			var err = 0;

			// text, password, textarea
			var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
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

			// select
			const selectElements = formElem.querySelectorAll('.select__input');

			for (let i = 0; i < selectElements.length; i++) {
				const selectElem = selectElements[i];

				if (elemIsHidden(selectElem.parentElement)) continue;

				if (this.select(selectElem)) {
					err++;
				}
			}

			// checkboxes
			var elements = formElem.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
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

			// checkbox group
			var groups = formElem.querySelectorAll('.form__chbox-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
					checkedElements = 0;

				if (elemIsHidden(group)) {
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

			// radio group
			var groups = formElem.querySelectorAll('.form__radio-group');

			for (let i = 0; i < groups.length; i++) {
				var group = groups[i],
					checkedElement = false;

				if (elemIsHidden(group)) {
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

			// file
			var elements = formElem.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
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

			// passwords compare
			var elements = formElem.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elemIsHidden(elem)) {
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

			this.formError(formElem, err);

			return (err) ? false : true;
		},

		init: function (formSelector) {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest(formSelector + ' input[type="text"],' + formSelector + ' input[type="password"],' + formSelector + ' textarea');

				if (elem && elem.hasAttribute('data-tested')) {
					this.validateOnInput(elem);
				}
			});

			document.addEventListener('change', (e) => {
				var elem = e.target.closest(formSelector + ' input[type="radio"],' + formSelector + ' input[type="checkbox"]');

				if (elem) {
					this[elem.type](elem);
				}
			});
		}
	};

	// variable height textarea
	var varHeightTextarea = {
		setHeight: function (elem) {
			var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
				mirrorOutput = elem.value.replace(/\n/g, '<br>');

			mirror.innerHTML = mirrorOutput + '&nbsp;';
		},

		init: function () {
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.var-height-textarea__textarea');

				if (!elem) {
					return;
				}

				this.setHeight(elem);
			});
		}
	};

	// next fieldset
	var NextFieldset = {
		next: function (btnElem, fwd) {
			var nextFieldset = (btnElem.hasAttribute('data-go-to-fieldset')) ? document.querySelector(btnElem.getAttribute('data-go-to-fieldset')) : null;

			if (!nextFieldset) return;

			var currentFieldset = btnElem.closest('.fieldset__item'),
				goTo = (fwd) ? ValidateForm.validate(currentFieldset) : true;

			if (goTo) {
				currentFieldset.classList.add('fieldset__item_hidden');
				nextFieldset.classList.remove('fieldset__item_hidden');
			}
		},

		init: function (nextBtnSelector, prevBtnSelector) {
			document.addEventListener('click', (e) => {
				var nextBtnElem = e.target.closest(nextBtnSelector),
					prevBtnElem = e.target.closest(prevBtnSelector);

				if (nextBtnElem) {
					this.next(nextBtnElem, true);
				} else if (prevBtnElem) {
					this.next(prevBtnElem, false);
				}
			});
		}
	};

	// form
	Form = {
		onSubmit: null,

		clearForm: function (formElem) {
			var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				elem.value = '';

				if (window.Placeholder) {
					Placeholder.hide(elem, false);
				}
			}

			if (window.Select) {
				Select.reset();
			}

			var textareaMirrors = formElem.querySelectorAll('.form__textarea-mirror');

			for (var i = 0; i < textareaMirrors.length; i++) {
				textareaMirrors[i].innerHTML = '';
			}
		},

		actSubmitBtn: function (state, formElem) {
			var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (state) {
					elem.removeAttribute('disabled');
				} else {
					elem.setAttribute('disabled', 'disable');
				}
			}
		},

		submitForm: function (formElem, e) {
			if (!ValidateForm.validate(formElem)) {
				if (e) {
					e.preventDefault();
				}

				return;
			}

			formElem.classList.add('form_sending');

			if (!this.onSubmit) {
				formElem.submit();
				return;
			}

			// call onSubmit
			const ret = this.onSubmit(formElem, (obj) => {
				obj = obj || {};

				this.actSubmitBtn(obj.unlockSubmitButton, formElem);

				formElem.classList.remove('form_sending');

				if (obj.clearForm == true) {
					this.clearForm(formElem);
				}
			});

			if (ret === false) {
				if (e) {
					e.preventDefault();
				}

				this.actSubmitBtn(false, formElem);
			} else {
				formElem.submit();
			}
		},

		init: function (formSelector) {
			if (!document.querySelector(formSelector)) return;

			ValidateForm.init(formSelector);

			// submit event
			document.addEventListener('submit', (e) => {
				const formElem = e.target.closest(formSelector);

				if (formElem) {
					this.submitForm(formElem, e);
				}
			});

			// keyboard event
			document.addEventListener('keydown', (e) => {
				const formElem = e.target.closest(formSelector);

				if (!formElem) return;

				const key = e.which || e.keyCode || 0;

				if (e.ctrlKey && key == 13) {
					e.preventDefault();
					this.submitForm(formElem, e);
				}
			});
		}
	};

	// bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
				label = elem.parentElement.querySelector('label'),
				forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-' + i;

			if (label && !label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}
		}
	}

	// duplicate form
	var DuplicateForm = {
		add: function (btnElem) {
			var modelElem = (btnElem.hasAttribute('data-form-model')) ? document.querySelector(btnElem.getAttribute('data-form-model')) : null,
				destElem = (btnElem.hasAttribute('data-duplicated-dest')) ? document.querySelector(btnElem.getAttribute('data-duplicated-dest')) : null;

			if (!modelElem || !destElem) return;

			var duplicatedDiv = document.createElement('div');

			duplicatedDiv.className = 'duplicated';

			duplicatedDiv.innerHTML = modelElem.innerHTML;

			destElem.appendChild(duplicatedDiv);

			var dupicatedElements = destElem.querySelectorAll('.duplicated');

			for (var i = 0; i < dupicatedElements.length; i++) {
				var dupicatedElem = dupicatedElements[i],
					labelElements = dupicatedElem.querySelectorAll('label'),
					inputElements = dupicatedElem.querySelectorAll('input');

				for (var j = 0; j < labelElements.length; j++) {
					var elem = labelElements[j];

					if (elem.htmlFor != '') {
						elem.htmlFor += '-' + i + '-' + j;
					}
				}

				for (var j = 0; j < inputElements.length; j++) {
					var elem = inputElements[j];

					if (elem.id != '') {
						elem.id += '-' + i + '-' + j;
					}
				}
			}
		},

		remove: function (btnElem) {
			var duplElem = btnElem.closest('.duplicated');

			if (duplElem) {
				duplElem.innerHTML = '';
			}
		},

		init: function (addBtnSelector, removeBtnSelector) {
			document.addEventListener('click', (e) => {
				var addBtnElem = e.target.closest(addBtnSelector),
					removeBtnElem = e.target.closest(removeBtnSelector);

				if (addBtnElem) {
					this.add(addBtnElem);
				} else if (removeBtnElem) {
					this.remove(removeBtnElem);
				}
			});
		}
	};

	// set tabindex
	/*function SetTabindex(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);
		
		for (let i = 0; i < elements.length; i++) {
			var elem = elements[i];
			
			if (!elemIsHidden(elem)) {
				elem.setAttribute('tabindex', i + 1);
			}
		}
	}*/

	// init scripts
	document.addEventListener('DOMContentLoaded', function () {
		BindLabels('input[type="text"], input[type="checkbox"], input[type="radio"]');
		// SetTabindex('input[type="text"], input[type="password"], textarea');
		varHeightTextarea.init();
		NextFieldset.init('.js-next-fieldset-btn', '.js-prev-fieldset-btn');
		DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
	});
})();
/*
* call Accord.init(Str button selector);
*/
var Accord;

(function() {
	'use strict';

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
	'use strict';

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
	item: '.tab__item',
	changeOnHover: true // default: false
});
*/
; var Tab;

(function() {
	'use strict';
	
	Tab = {
		options: null,
		
		change: function(btnElem) {
			if (btnElem.classList.contains('active')) return;
			
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
			if (!this.options) return;
			
			var contElements = document.querySelectorAll(this.options.container);
			
			for (var i = 0; i < contElements.length; i++) {
				this.setHeight(contElements[i].querySelector(this.options.item +'.active'));
			}
		},
		
		init: function(options) {
			const contElements = document.querySelectorAll(options.container);
			
			if (!contElements.length) return;
			
			this.options = options;
			
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
			if (options.changeOnHover) {
				document.addEventListener('mouseover', (e) => {
					const btnElem = e.target.closest(options.button);
					
					if (!btnElem) return;
					
					this.change(btnElem);
				});
			} else {
				document.addEventListener('click', (e) => {
					const btnElem = e.target.closest(options.button);
					
					if (!btnElem) return;
					
					e.preventDefault();
					
					this.change(btnElem);
				});
			}
			
		}
	};
})();
/*
new Alert({
	content: 'We use coockie',
	position: 'top', // default - bottom
	showOnce: true, // default - false
	closeBtn: false // default - true
	addClass: 'alert-class'
});
*/

; var Alert;

(function () {
	'use strict';

	var alertIndex = 0;

	Alert = function (opt) {
		opt = opt || {};

		opt.closeBtn = (opt.closeBtn !== undefined) ? opt.closeBtn : true;

		var alertId = 'alert-id-' + (alertIndex++);

		if (opt.showOnce) {
			let hiddenAlert = window.localStorage.getItem('notShowAlert=' + alertId);

			if (hiddenAlert !== null && hiddenAlert === 'true') {
				return false;
			}
		}

		//add alert to DOM
		var alertElem = document.createElement('div');

		alertElem.className = 'alert';

		alertElem.id = alertId;

		alertElem.innerHTML = '<div></div>' + ((opt.closeBtn) ? '<button class="js-alert-close alert__close-btn"></button>' : '');

		document.body.appendChild(alertElem);

		if (opt.position == 'top') {
			alertElem.classList.add('alert_top');
		}

		if (opt.addClass) {
			alertElem.classList.add(opt.addClass);
		}

		// set content
		this.setContent = function (content) {
			alertElem.querySelector('div').innerHTML = content;
		}

		if (opt.content) {
			this.setContent(opt.content);
		}

		// hide permanently
		function hidePermanently() {
			window.localStorage.setItem('notShowAlert=' + alertId, 'true');
		}

		// hide
		function hide() {
			alertElem.classList.add('alert_hidden');

			if (opt.showOnce) {
				hidePermanently();
			}
		}

		alertElem.addEventListener('click', function (e) {
			if (e.target.closest('.js-alert-close')) {
				hide();
			}
		});
	}
})();
/*
tooltip.init({
	element: '.js-tooltip'
});
*/

; var ToolTip;

(function() {
	'use strict';

	ToolTip = {
		tooltipDiv: null,
		tooltipClass: null,
		canBeHidden: true,

		show: function(elem) {
			this.tooltipDiv.innerHTML = elem.getAttribute('data-tooltip');

			this.tooltipClass = elem.getAttribute('data-tooltip-class');

			if (this.tooltipClass) {
				this.tooltipDiv.classList.add(this.tooltipClass);
			}

			var bubleStyle = this.tooltipDiv.style, 
			tooltipMinWidth = 100,
			tooltipPotentWidth = window.innerWidth - (elem.getBoundingClientRect().left + elem.offsetWidth) - 10,
			coordX = elem.getBoundingClientRect().left + elem.offsetWidth;

			if (tooltipPotentWidth < tooltipMinWidth) {
				tooltipPotentWidth = tooltipMinWidth;

				coordX = window.innerWidth - tooltipMinWidth - 10;
			}

			bubleStyle.width = tooltipPotentWidth +'px';
			bubleStyle.left = coordX +'px';

			var coordY = elem.getBoundingClientRect().top + pageYOffset - this.tooltipDiv.offsetHeight;

			bubleStyle.top = coordY +'px';

			this.tooltipDiv.classList.add('tooltip_visible');
		},

		hide: function() {
			this.tooltipDiv.classList.remove('tooltip_visible');
			this.tooltipDiv.removeAttribute('style');
			this.tooltipDiv.innerHTML = '';

			if (this.tooltipClass) {
				this.tooltipDiv.classList.remove(this.tooltipClass);

				this.tooltipClass = null;
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
						if ((e.target.closest(opt.element) && this.canBeHidden) || e.target.closest('.tooltip')) {
							this.hide();

							this.canBeHidden = true;
						}
					}
				}, 21);
			}

			mouseOver = (e) => {
				var elem = e.target.closest(opt.element);
				
				if (!elem) return;

				if (document.ontouchstart !== undefined) {
					
					this.show(elem);

					document.addEventListener('touchstart', mouseOut);
				} else {
					if (elem) {
						this.show(elem);
					} else if (e.target.closest('.tooltip')) {
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

			//add tooltip to DOM
			this.tooltipDiv = document.createElement('div');
			this.tooltipDiv.className = 'tooltip';

			document.body.appendChild(this.tooltipDiv);
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
			const anchorSectionElem = document.getElementById(anchorId +'-anchor');

			if (!anchorSectionElem) {
				return;
			}

			if (e) {
				e.preventDefault();
			}

			let scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
			ownShift = +anchorSectionElem.getAttribute('data-shift') || 0;

			if (window.innerWidth < 1000 && anchorSectionElem.hasAttribute('data-sm-shift')) {
				ownShift = +anchorSectionElem.getAttribute('data-sm-shift');
			}
			
			scrollTo = scrollTo - this.shift - ownShift;

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
					const anchId = (elem.hasAttribute('href')) ? elem.getAttribute('href').split('#')[1] : elem.getAttribute('data-anchor-id');
					
					this.scroll(anchId, e);
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
	'use strict';

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
	'use strict';

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
	'use strict';
	
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
/* 
var timer = new Timer({
	elemId: 'timer', // Str element id,
	format: 'extended', // default - false
	stopwatch: true, // default - false
	continue: false // default - true
});

timer.onStop = function () {
	
}

timer.start(Int interval in seconds);
*/

; var Timer;

(function() {
	'use strict';

	Timer = function(options) {
		var elem = document.getElementById(options.elemId);

		options.continue = (options.continue !== undefined) ? options.continue : true;

		function setCookie() {
			if (options.continue) {
				document.cookie = 'lastTimestampValue-'+ options.elemId +'='+ Date.now() +'; expires='+ new Date(Date.now() + 259200000).toUTCString();
			}
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
			if (!elem) return;
			
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

			if (this.interval !== undefined) return;
			
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
	'use strict';

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
; var DragLine;

(function() {
	'use strict';
	
	DragLine = {
		
		dragStart: function(e) {
			if (e.type == 'mousedown' && e.which !== 1) return;
			
			
		},
		
		init: function(opt) {
			var dragLineElements = document.getElementsByClassName(opt.lineClass);
			
			if (!dragLineElements.length) return;
			
			for (let i = 0; i < dragLineElements.length; i++) {
				var dlElem = dragLineElements[i],
				itemElements = dlElem.getElementsByTagName('div');

				for (let i = 0; i < itemElements.length; i++) {
					itemElements[i].classList.add(opt.lineClass +'__item');
				}

				dlElem.innerHTML = '<div class="'+ opt.lineClass +'__dragable"><div class="'+ opt.lineClass +'__line">'+ dlElem.innerHTML +'</div></div>';
			}
			
			if (document.ontouchstart !== undefined) {
				document.addEventListener('touchstart', this.dragStart.bind(this));
			} else {
				document.addEventListener('mousedown', this.dragStart.bind(this));
			}
		}
	};
})();
; var WEBGL;

(function() {
   WEBGL = {
      VSTxt: null,
		FSTxt: null,
		
      loadTxtRes: function(url, successFun) {
         ajax({
            url: url,
            success: function(response) {
               successFun(response);
            },
            error: function(response) {
               
            }
         });
		},
		
		start: function() {
			
		},
      
      init: function() {
         this.loadTxtRes('/shaders/vertexShader.glsl', (response) => {
				this.VSTxt = response;
				
				this.loadTxtRes('/shaders/fragmentShader.glsl', (response) => {
					this.FSTxt = response;

					this.start();
				});
			});
      }
   };
})();


(function() {
   'use strict';
   
   // animate when is visible
   const animationOnVisible = {
      animElements: null,
      
      scroll: function() {
         const winBotEdge = window.pageYOffset + window.innerHeight;
         
         for (let i = 0; i < this.animElements.length; i++) {
            const animElem = this.animElements[i],
            animElemOffsetTop = animElem.getBoundingClientRect().top + window.pageYOffset,
            animElemOffsetBot = animElemOffsetTop + animElem.offsetHeight;
            
            if (winBotEdge > animElemOffsetBot && window.pageYOffset < animElemOffsetTop) {
               animElem.classList.add('animated');
            } else {
               animElem.classList.remove('animated');
            }
         }
      },
      
      init: function() {
         const animElements = document.querySelectorAll('.animate');
         
         if (animElements.length) {
            this.animElements = animElements;
            this.scroll();
         }
      }
   };
   
   // document ready
   document.addEventListener('DOMContentLoaded', function() {
      animationOnVisible.init();
      
      if (animationOnVisible.animElements) {
         window.addEventListener('scroll', animationOnVisible.scroll);
      }
   });
})();
//# sourceMappingURL=script.js.map
