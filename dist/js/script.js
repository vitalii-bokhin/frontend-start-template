// global variables
;var browser, elemIsHidden, ajax, LocStor;

(function () {
    'use strict';

    // Get useragent

    document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());

    // Browser identify
    browser = function (userAgent) {
        userAgent = userAgent.toLowerCase();

        if (/(msie|rv:11\.0)/.test(userAgent)) {
            return 'ie';
        } else if (/firefox/.test(userAgent)) {
            return 'ff';
        }
    }(navigator.userAgent);

    // Add support CustomEvent constructor for IE
    try {
        new CustomEvent("IE has CustomEvent, but doesn't support constructor");
    } catch (e) {
        window.CustomEvent = function (event, params) {
            var evt = document.createEvent("CustomEvent");

            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

            return evt;
        };

        CustomEvent.prototype = Object.create(window.Event.prototype);
    }

    // Window Resized Event
    var winResizedEvent = new CustomEvent('winResized'),
        winWidthResizedEvent = new CustomEvent('winWidthResized');

    var rsz = true,
        beginWidth = window.innerWidth;

    window.addEventListener('resize', function () {
        if (rsz) {
            rsz = false;

            setTimeout(function () {
                window.dispatchEvent(winResizedEvent);

                if (beginWidth != window.innerWidth) {
                    window.dispatchEvent(winWidthResizedEvent);

                    beginWidth = window.innerWidth;
                }

                rsz = true;
            }, 1021);
        }
    });

    // Closest polyfill
    if (!Element.prototype.closest) {
        (function (ElProto) {
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
    elemIsHidden = function elemIsHidden(elem, exclude) {
        exclude = exclude || [];

        while (elem) {
            if (!elem) break;

            var compStyle = getComputedStyle(elem);

            if (compStyle.display == 'none' || compStyle.visibility == 'hidden' || !exclude.includes('opacity') && compStyle.opacity == '0') return true;

            elem = elem.parentElement;
        }

        return false;
    };

    // Ajax
    ajax = function ajax(options) {
        var xhr = new XMLHttpRequest();

        if (options.method == 'GET') {
            xhr.open('GET', options.url);

            options.send = null;
        } else {
            xhr.open('POST', options.url);

            if (typeof options.send == 'string') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (options.success) {
                    options.success(xhr.response);
                }
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                if (options.error) {
                    options.error(xhr.response);
                }
            }
        };

        xhr.send(options.send);
    };

    // Local Storage
    LocStor = {
        set: function set(prop, val) {
            window.localStorage.setItem(prop, val);
        },

        get: function get(prop) {
            var val = window.localStorage.getItem(prop);

            return val !== null ? val : false;
        }
    };
})();
/*
animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
*/

;var animate;

(function () {
    'use strict';

    animate = function animate(draw, duration, ease, complete) {
        var start = performance.now();

        requestAnimationFrame(function anim(time) {
            var timeFraction = (time - start) / duration;

            if (timeFraction > 1) {
                timeFraction = 1;
            }

            draw(ease ? easing(timeFraction, ease) : timeFraction);

            if (timeFraction < 1) {
                requestAnimationFrame(anim);
            } else {
                if (complete !== undefined) {
                    complete();
                }
            }
        });
    };

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
        return Math.pow(timeFraction, 2);
    }
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;var template;

(function () {
    'use strict';

    template = function template(data, _template, sign) {
        var s = sign || '%',
            tplEl = document.getElementById(_template);

        if (tplEl) {
            _template = tplEl.innerHTML;
        }

        var result = _template;

        result = result.replace(new RegExp('<' + s + 'for (\\w+) as (\\w+)' + s + '>(.*?)<' + s + 'endfor' + s + '>', 'gs'), function (match, p1, p2, p3, offset, input) {

            if (!data[p1]) return '';

            return data[p1].map(function (item) {
                var res = p3;

                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                    for (var key in item) {
                        if (item.hasOwnProperty(key)) {
                            res = res.replace(new RegExp('<' + s + p2 + '.' + key + s + '>', 'g'), item[key]);
                        }
                    }
                } else {
                    res = res.replace(new RegExp('<' + s + p2 + s + '>', 'g'), item);
                }

                return res;
            }).join('');
        });

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            var m = data[p1];

            if (m === '' || m === false || m == undefined || m == null || Array.isArray(m) && !m.length) {
                return '';
            } else {
                return p2;
            }
        });

        result = result.replace(new RegExp('<' + s + '{2}if (\\w+)' + s + '>(.*?)<' + s + '{2}endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            var m = data[p1];

            if (m === '' || m === false || m == undefined || m == null || Array.isArray(m) && !m.length) {
                return '';
            } else {
                return p2;
            }
        });

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        return result;
    };
})();
/* 
    MobNav.init({
        openBtn: '.js-open-menu',
        closeBtn: '.js-close-menu',
        headerId: 'header',
        closeLink: '.menu a.js-anchor'
    });
*/

;var MobNav;

(function () {
    'use strict';

    // fix header

    document.addEventListener('DOMContentLoaded', function () {
        var headerElem = document.getElementById('header');

        var scrTop = 0,
            scrAccUp = 0,
            scrAccDown = 0;

        function fixHeader() {
            if (headerElem) {
                if (window.pageYOffset > 21) {
                    headerElem.classList.add('header_fixed');

                    if (window.pageYOffset > scrTop) {
                        scrAccDown++;
                        scrAccUp = 0;
                    } else {
                        scrAccUp++;
                        scrAccDown = 0;
                    }

                    scrTop = window.pageYOffset;

                    if (scrAccDown > 2 && window.pageYOffset > headerElem.offsetHeight) {
                        headerElem.classList.add('header_hide');
                    } else if (scrAccUp > 1) {
                        headerElem.classList.remove('header_hide');
                    }
                } else if (!document.body.classList.contains('popup-is-opened') && !document.body.classList.contains('mob-nav-is-opened')) {
                    headerElem.classList.remove('header_fixed');
                    headerElem.classList.remove('header_hide');
                }
            }
        }

        fixHeader();

        window.addEventListener('scroll', fixHeader);
    });

    //mob menu
    MobNav = {
        options: null,
        winScrollTop: 0,

        fixBody: function fixBody(st) {
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

        open: function open(btnElem) {
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

        close: function close() {
            var headerElem = document.getElementById(this.options.headerId);

            if (!headerElem) return;

            headerElem.classList.remove('opened');

            var openBtnElements = document.querySelectorAll(this.options.openBtn);

            for (var i = 0; i < openBtnElements.length; i++) {
                openBtnElements[i].classList.remove('opened');
            }

            this.fixBody(false);
        },

        init: function init(options) {
            var _this = this;

            this.options = options;

            document.addEventListener('click', function (e) {
                var openElem = e.target.closest(options.openBtn);

                if (openElem) {
                    e.preventDefault();
                    _this.open(openElem);
                } else if (e.target.closest(options.closeBtn)) {
                    e.preventDefault();
                    _this.close();
                } else if (e.target.closest(options.closeLink)) {
                    _this.close();
                }
            });
        }
    };
})();
/*
* call Menu.init(Str menu item selector, Str sub menu selector);
*/
var Menu;

(function () {
    'use strict';

    Menu = {
        toggle: function toggle(elem, elementStr, subMenuStr) {
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

                subMenuElem.style.height = subMenuElem.scrollHeight + 'px';

                elem.classList.add('active');
            }
        },

        init: function init(elementStr, subMenuStr, viewport) {
            var _this = this;

            document.addEventListener('click', function (e) {
                var elem = e.target.closest(elementStr);

                if (!elem || window.innerWidth > viewport) return;

                if (e.target.getAttribute('href') == '#') e.preventDefault();

                _this.toggle(elem, elementStr, subMenuStr);
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

;var FsScroll;

(function () {
	'use strict';

	FsScroll = {
		options: null,
		contElem: null,
		scrolling: false,
		delta: 0,

		current: function current() {
			var midWinScrollTop = window.pageYOffset + window.innerHeight / 2,
			    screenElements = this.contElem.querySelectorAll(this.options.screen);

			for (var i = 0; i < screenElements.length; i++) {
				screenElements[i].classList.remove('fsscroll__screen_current');
			}

			for (var i = 0; i < screenElements.length; i++) {
				var screenOffsetTop = screenElements[i].getBoundingClientRect().top + window.pageYOffset;

				if (screenOffsetTop <= midWinScrollTop && screenOffsetTop + screenElements[i].offsetHeight >= midWinScrollTop) {

					screenElements[i].classList.add('fsscroll__screen_current');
				}
			}
		},

		scroll: function scroll(scrollTo, _scroll) {
			var _this = this;

			this.scrolling = true;

			var duration = this.options.duration || 1000,
			    easing = 'easeInOutQuad';

			if (_scroll) {
				duration = 500;
				easing = 'easeInOutQuad';
			}

			animate(function (progress) {
				window.scrollTo(0, scrollTo * progress + (1 - progress) * window.pageYOffset);
			}, duration, easing, function () {
				setTimeout(function () {
					_this.current();

					_this.scrolling = false;
					_this.delta = 0;
				}, 321);
			});
		},

		mouseScroll: function mouseScroll(delta) {
			var currentScreenElem = this.contElem.querySelector('.fsscroll__screen_current'),
			    winScrollBottom = window.pageYOffset + window.innerHeight;

			if (delta > 0) {
				var nextScreenElem = currentScreenElem ? currentScreenElem.nextElementSibling : null;

				if (currentScreenElem && currentScreenElem.offsetHeight - 21 < window.innerHeight && !currentScreenElem.classList.contains('fsscroll__screen_last')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if (window.pageYOffset + 21 < currentScreenOffsetTop) {
							this.scroll(currentScreenOffsetTop);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset);
						}
					}
				} else {
					var nextScreenOffsetTop = nextScreenElem ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && winScrollBottom > nextScreenOffsetTop) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;

						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			} else if (delta < 0) {
				var nextScreenElem = currentScreenElem ? currentScreenElem.previousElementSibling : null;

				if (nextScreenElem && currentScreenElem.offsetHeight - 21 < window.innerHeight && !currentScreenElem.classList.contains('fsscroll__screen_first')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if (winScrollBottom - 21 > currentScreenOffsetTop + currentScreenElem.offsetHeight) {
							this.scroll(currentScreenOffsetTop + currentScreenElem.offsetHeight - window.innerHeight);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset + nextScreenElem.offsetHeight - window.innerHeight);
						}
					}
				} else {
					var nextScreenOffsetTop = nextScreenElem ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && nextScreenOffsetTop + nextScreenElem.offsetHeight > window.pageYOffset) {
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

		init: function init(options) {
			var _this2 = this;

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
				document.addEventListener('wheel', function (e) {
					e.preventDefault();

					_this2.mouseScroll(e.deltaY);
				});
			}

			window.addEventListener('scroll', function () {
				if (!_this2.scrolling) {
					_this2.current();
				}
			});
		}
	};
})();
;var Screens;

(function () {
	'use strict';

	Screens = {
		wrapHeight: 0,
		wrapEl: 0,
		screenElems: null,
		screenProps: null,
		curScreenInd: 0,
		screenChanging: false,
		lastEvenSrc: 'win',
		onChange: null,
		opt: {},

		screenHadChanged: function screenHadChanged() {
			if (this.lastEvenSrc == 'fun') return;

			this.lastEvenSrc = 'fun';

			this.scrollHandler(window.pageYOffset);

			if (this.onChange) {
				this.onChange();
			}
		},

		goToScreen: function goToScreen(ind) {
			var _this = this;

			if (ind == this.curScreenInd) return;

			this.screenChanging = true;

			this.screenElems[this.curScreenInd].classList.remove('screen_current');

			if (ind < this.curScreenInd) {
				this.screenElems[this.curScreenInd].classList.remove('screen_top');
			}

			this.screenElems[ind].classList.add('screen_top');
			this.screenElems[ind].classList.add('screen_current');

			this.curScreenInd = ind;

			setTimeout(function () {
				_this.screenChanging = false;
				_this.screenHadChanged();
			}, 1000);
		},

		scrollInner: function scrollInner(scrTop) {
			for (var i = 0; i < this.screenElems.length; i++) {
				var scrEl = this.screenElems[i];

				if (!scrEl.classList.contains('screen_inner-scroll')) continue;

				var inScrollEl = scrEl.querySelector('.screen_inner-scroll__in'),
				    sP = this.screenProps[i];

				// let top = sP.topEdge - scrTop;
				var top = (inScrollEl.offsetHeight - window.innerHeight) / 100 * (scrTop / ((sP.bottomEdge - sP.topEdge - window.innerHeight) / 100)) * -1;

				if (top > 0) {
					top = 0;
				} else if (top < scrEl.offsetHeight - inScrollEl.offsetHeight) {
					top = scrEl.offsetHeight - inScrollEl.offsetHeight;
				}

				inScrollEl.style.top = top.toFixed(0) + 'px';
			}
		},

		scrollHandler: function scrollHandler(scrTop) {
			var _this2 = this;

			var scrBot = scrTop + window.innerHeight;

			this.scrollInner(scrTop);

			if (this.screenChanging) return;

			this.screenProps.forEach(function (sP, i) {
				if (scrTop >= sP.topEdge && scrTop < sP.bottomEdge) {
					_this2.goToScreen(i);
				}

				if (scrBot + window.innerHeight / 3 >= sP.bottomEdge) {
					_this2.screenElems[i].classList.add('screen_bottom-edge');
				} else {
					_this2.screenElems[i].classList.remove('screen_bottom-edge');
				}
			});
		},

		setProps: function setProps() {
			if (!this.screenElems) return;

			var heightSum = 0;

			this.screenProps = [];

			this.screenElems[0].classList.add('screen_top');
			this.screenElems[0].classList.add('screen_first');

			for (var i = 0; i < this.screenElems.length; i++) {
				var sEl = this.screenElems[i];

				var screenVirtHeight = void 0;

				sEl.style.height = window.innerHeight + 'px';

				if (sEl.scrollHeight > sEl.offsetHeight) {
					screenVirtHeight = sEl.scrollHeight + sEl.scrollTop;

					sEl.classList.add('screen_inner-scroll');

					sEl.innerHTML = '<div class="screen_inner-scroll__in">' + sEl.innerHTML + '</div>';
				} else {
					screenVirtHeight = window.innerWidth > 1200 ? 121 : sEl.scrollHeight + sEl.scrollTop;
				}

				if (i == 1) {
					screenVirtHeight = screenVirtHeight * 2;
				}

				heightSum += screenVirtHeight;

				this.screenProps[i] = {
					topEdge: !i ? 0 : this.screenProps[i - 1].bottomEdge + 1,
					bottomEdge: heightSum,
					divider: i == 1 ? 2 : 1
				};
			}

			if (this.opt.horizontal != true) {
				this.wrapHeight = heightSum;
				this.wrapEl.style.height = heightSum + 'px';
			} else {
				this.wrapEl.classList.add('screen-horisontal');
			}
		},

		init: function init(opt) {
			var _this3 = this;

			var wrapEl = document.querySelector('.screen-wrap');

			this.opt = opt || {};

			if (!wrapEl) return;

			var contEl = document.querySelector('.screen-container'),
			    screenElems = contEl.querySelectorAll('.screen');

			this.wrapEl = wrapEl;
			this.screenElems = screenElems;

			this.setProps();

			window.addEventListener('scroll', function () {
				_this3.lastEvenSrc = 'win';
				_this3.scrollHandler(window.pageYOffset);
			});
		}
	};
})();
/* 
Screens.init({
	container: '.main',
	duration: 700 // default - 1000,
	menuCurrentClass: 'current' // default - 'menu__item_current'
});

Screens.setHeight(); // call on window resize

Screens.onChange = function (nextScreenElem) {}
*/

;var Screens2;

(function () {
	'use strict';

	Screens2 = {
		options: {},
		contElem: null,
		scrolling: false,
		scrollSum: 0,
		onChange: null,

		menu: function menu(currentScreenElem) {
			var menuElements = document.querySelectorAll('.js-change-screen-menu'),
			    curMenuItElem = document.querySelector('.js-change-screen-menu[data-screen="#' + currentScreenElem.id + '"]'),
			    curClass = this.options.menuCurrentClass || 'current';

			for (var i = 0; i < menuElements.length; i++) {
				var mEl = menuElements[i];

				mEl.parentElement.classList.remove(curClass);
			}

			if (curMenuItElem) {
				curMenuItElem.parentElement.classList.add(curClass);
			}
		},

		changeScreen: function changeScreen(nextScreenElem) {
			var _this2 = this;

			var currentScreenElem = this.contElem.querySelector('.screen_visible');

			if (nextScreenElem === currentScreenElem) return;

			if (nextScreenElem.offsetHeight < window.innerHeight) {
				nextScreenElem.style.height = window.innerHeight + 'px';
			}

			this.scrolling = true;
			this.scrollSum = 0;

			var duration = this.options.duration || 1000;

			currentScreenElem.classList.remove('screen_active');

			nextScreenElem.classList.add('screen_visible');

			setTimeout(function () {
				_this2.menu(nextScreenElem);
			}, duration / 2);

			animate(function (progress) {
				currentScreenElem.style.opacity = 1 - progress;

				nextScreenElem.style.opacity = progress;
			}, duration, false, function () {
				setTimeout(function () {
					currentScreenElem.classList.remove('screen_visible');

					nextScreenElem.classList.add('screen_active');

					_this2.scrolling = false;
				}, 21);
			});

			window.location.hash = '#' + nextScreenElem.id.split('-')[0];

			if (this.onChange) {
				this.onChange(nextScreenElem);
			}
		},

		nextScreen: function nextScreen(delta) {
			var currentScreenElem = this.contElem.querySelector('.screen_visible');

			var nextScreenElem = null;

			if (delta > 0) {
				if (currentScreenElem && currentScreenElem.nextElementSibling && currentScreenElem.nextElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.nextElementSibling;
				}
			} else if (delta < 0) {
				if (currentScreenElem && currentScreenElem.previousElementSibling && currentScreenElem.previousElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.previousElementSibling;
				}
			}

			if (nextScreenElem) {
				this.changeScreen(nextScreenElem);
			}
		},

		setHeight: function setHeight() {
			if (!this.contElem) return;

			var screenElements = this.contElem.querySelectorAll('.screen'),
			    actScreenElem = this.contElem.querySelector('.screen_active');

			for (var i = 0; i < screenElements.length; i++) {
				var scEl = screenElements[i];

				scEl.style.height = 'auto';
			}

			if (actScreenElem.offsetHeight < window.innerHeight) {
				actScreenElem.style.height = window.innerHeight + 'px';
			}
		},

		init: function init(options) {
			var _this3 = this;

			var contElem = document.querySelector(options.container);

			if (!contElem) return;

			this.options = options;
			this.contElem = contElem;

			this.setHeight();

			// scroll or swipe event
			if ('ontouchstart' in document) {
				var _this = this;

				$(contElem).swipe({
					allowPageScroll: "vertical",
					swipe: function swipe(event, direction, distance, duration, fingerCount, fingerData) {
						if (direction == 'down') {
							if (!_this.scrolling) {
								_this.nextScreen(-1);
							}
						} else if (direction == 'up') {
							if (!_this.scrolling) {
								_this.nextScreen(1);
							}
						}
					}
				});
			} else {
				contElem.addEventListener('wheel', function (e) {
					if (document.documentElement.offsetHeight >= document.documentElement.scrollHeight) {
						e.preventDefault();

						if (!_this3.scrolling) {
							_this3.nextScreen(e.deltaY);
						}
					} else {
						var dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

						if (e.deltaY > 0 && window.pageYOffset >= dS || e.deltaY < 0 && window.pageYOffset == 0) {
							e.preventDefault();

							var absDelta = Math.abs(e.deltaY);

							_this3.scrollSum += absDelta;

							if (!_this3.scrolling && _this3.scrollSum > absDelta * 3) {
								_this3.nextScreen(e.deltaY);
							}
						}
					}
				});
			}

			// click event
			document.addEventListener('click', function (e) {
				var chngSecBtn = e.target.closest('.js-change-screen-menu');

				if (chngSecBtn) {
					e.preventDefault();

					var curClass = _this3.options.menuCurrentClass || 'current';

					if (!_this3.scrolling && !chngSecBtn.parentElement.classList.contains(curClass)) {
						_this3.changeScreen(document.querySelector(chngSecBtn.getAttribute('data-screen')));
					}
				}
			});

			// change by hash url
			if (window.location.hash) {
				var screenElem = document.getElementById(window.location.hash.split('#')[1] + '-screen');

				if (screenElem) {
					this.changeScreen(screenElem);
				}
			}
		}
	};
})();

// (function () {
// 	'use strict';

// 	Screens = {
// 		options: null,
// 		contElem: null,
// 		scrolling: false,
// 		scrollSum: 0,

// 		menu: function (currentScreenElem) {
// 			const menuElements = document.querySelectorAll('.js-change-screen-menu'),
// 				curMenuItElem = document.querySelector('.js-change-screen-menu[data-screen="#' + currentScreenElem.id + '"]'),
// 				curClass = this.options.menuCurrentClass || 'menu__item_current';

// 			for (let i = 0; i < menuElements.length; i++) {
// 				const mEl = menuElements[i];

// 				mEl.parentElement.classList.remove(curClass);
// 			}

// 			if (curMenuItElem) {
// 				curMenuItElem.parentElement.classList.add(curClass);
// 			}
// 		},

// 		changeScreen: function (nextScreenElem) {
// 			const currentScreenElem = this.contElem.querySelector('.screen_visible');

// 			if (nextScreenElem === currentScreenElem) return;

// 			this.scrolling = true;
// 			this.scrollSum = 0;

// 			const duration = this.options.duration || 1000;

// 			currentScreenElem.classList.remove('screen_active');

// 			nextScreenElem.classList.add('screen_visible');

// 			setTimeout(() => {
// 				this.menu(nextScreenElem);
// 			}, duration / 2);

// 			animate(function (progress) {
// 				currentScreenElem.style.opacity = 1 - progress;

// 				nextScreenElem.style.opacity = progress;
// 			}, duration, false, () => {
// 				setTimeout(() => {
// 					currentScreenElem.classList.remove('screen_visible');

// 					nextScreenElem.classList.add('screen_active');

// 					this.scrolling = false;
// 				}, 21);
// 			});

// 			window.location.hash = '#' + nextScreenElem.id.split('-')[0];

// 			if (window.Video && Video.stop != undefined) {
// 				Video.stop();
// 			}
// 		},

// 		nextScreen: function (delta) {
// 			const currentScreenElem = this.contElem.querySelector('.screen_visible');

// 			let nextScreenElem = null;

// 			if (delta > 0) {
// 				if (currentScreenElem && currentScreenElem.nextElementSibling && currentScreenElem.nextElementSibling.classList.contains('screen')) {
// 					nextScreenElem = currentScreenElem.nextElementSibling;
// 				}
// 			} else if (delta < 0) {
// 				if (currentScreenElem && currentScreenElem.previousElementSibling && currentScreenElem.previousElementSibling.classList.contains('screen')) {
// 					nextScreenElem = currentScreenElem.previousElementSibling;
// 				}
// 			}

// 			if (nextScreenElem) {
// 				this.changeScreen(nextScreenElem);
// 			}
// 		},

// 		init: function (options) {
// 			const contElem = document.querySelector(options.container);

// 			if (!contElem) return;

// 			this.options = options;
// 			this.contElem = contElem;

// 			// const screenElements = contElem.querySelectorAll('.screen');

// 			// for (let i = 0; i < screenElements.length; i++) {
// 			// 	const scrElem = screenElements[i];

// 			// 	scrElem.setAttribute('data-height', scrElem.scrollHeight);

// 			// 	if (!i) {
// 			// 		contElem.style.height = scrElem.scrollHeight + 'px';
// 			// 	}
// 			// }

// 			if ('ontouchstart' in document) {
// 				const _this = this;

// 				$(contElem).swipe({
// 					allowPageScroll: "vertical",
// 					swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
// 						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

// 						if (direction == 'down' && window.pageYOffset == 0) {
// 							if (!_this.scrolling) {
// 								_this.nextScreen(-1);
// 							}
// 						} else if (direction == 'up') {
// 							if (!_this.scrolling) {
// 								_this.nextScreen(1);
// 							}
// 						}
// 					}
// 				});
// 			} else if ('onwheel' in document) {
// 				contElem.addEventListener('wheel', (e) => {
// 					if (document.documentElement.offsetHeight >= document.documentElement.scrollHeight) {
// 						e.preventDefault();

// 						if (!this.scrolling) {
// 							this.nextScreen(e.deltaY);
// 						}
// 					} else {
// 						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

// 						if ((e.deltaY > 0 && window.pageYOffset >= dS) || e.deltaY < 0 && window.pageYOffset == 0) {
// 							e.preventDefault();

// 							const absDelta = Math.abs(e.deltaY);

// 							this.scrollSum += absDelta;

// 							if (!this.scrolling && this.scrollSum > (absDelta * 3)) {
// 								this.nextScreen(e.deltaY);
// 							}
// 						}
// 					}

// 				});
// 			}

// 			document.addEventListener('click', (e) => {
// 				const chngSecBtn = e.target.closest('.js-change-screen-menu');

// 				if (chngSecBtn) {
// 					e.preventDefault();

// 					if (!this.scrolling && !chngSecBtn.parentElement.classList.contains('menu__item_current')) {
// 						this.changeScreen(document.querySelector(chngSecBtn.getAttribute('data-screen')));
// 					}
// 				}
// 			});

// 			if (window.location.hash) {
// 				this.changeScreen(document.querySelector(window.location.hash + '-screen'));
// 			}
// 		}
// 	};
// })();
/*
ScrollSmooth.init();
*/

;var ScrollSmooth;

(function () {
	"use strict";

	ScrollSmooth = {
		scrolling: false,
		delta: 0,
		scrollTo: 0,
		startPageYOffset: window.pageYOffset,

		scroll: function scroll() {
			var _this = this;

			this.scrolling = true;

			var duration = 3500,
			    easing = 'easeInOutQuad';

			animate(function (progress) {
				window.scrollTo(0, _this.scrollTo * progress + (1 - progress) * window.pageYOffset);
				console.log(_this.scrollTo);
			}, duration, easing, function () {
				_this.scrolling = false;
				_this.delta = 0;
				_this.startPageYOffset = window.pageYOffset;
			});
		},

		init: function init() {
			var _this2 = this;

			if ('onwheel' in document) {
				document.addEventListener('wheel', function (e) {
					e.preventDefault();

					_this2.delta += e.deltaY;

					_this2.scrollTo = _this2.delta + _this2.startPageYOffset;

					if (!_this2.scrolling) {
						_this2.scroll();
					}
				});
			}
		}
	};
})();
/*
Toggle.init({
    button: '.js-tgl-btn',
    offButton: '.js-tgl-off',
    toggledClass: 'some-class' // def: toggled,
    targetsToggledClass: 'some-class' // def: toggled
});

Toggle.onChange(function (btnEl, targetElems, state) {
    // code...
});
*/

;var Toggle;

(function () {
    'use strict';

    Toggle = {
        toggledClass: 'toggled',
        targetsToggledClass: 'toggled',
        onChangeSubscribers: [],

        init: function init(opt) {
            var _this = this;

            if (opt.toggledClass) {
                this.toggledClass = opt.toggledClass;
            }

            if (opt.targetsToggledClass) {
                this.targetsToggledClass = opt.targetsToggledClass;
            }

            document.addEventListener('click', function (e) {
                var btnEl = e.target.closest(opt.button),
                    offBtnEl = e.target.closest(opt.offButton);

                if (btnEl) {
                    e.preventDefault();

                    if (btnEl.hasAttribute('data-switch')) {
                        _this.switchBtns(btnEl);
                    } else {
                        _this.toggle(btnEl);
                    }
                } else if (offBtnEl) {
                    e.preventDefault();

                    _this.toggleOff(offBtnEl);
                }

                _this.onDocClickOff(e, btnEl);
            });
        },

        toggle: function toggle(toggleElem, off) {
            var state = void 0;

            if (toggleElem.classList.contains(this.toggledClass)) {
                toggleElem.classList.remove(this.toggledClass);

                state = false;

                if (toggleElem.hasAttribute('data-first-text')) {
                    toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
                }
            } else if (!off) {
                if (toggleElem.getAttribute('data-type') != 'button') {
                    toggleElem.classList.add(this.toggledClass);
                }

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

            if (!state) {
                return;
            }

            //dependence elements
            if (toggleElem.hasAttribute('data-dependence-target-elements')) {
                var dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

                for (var i = 0; i < dependenceTargetElements.length; i++) {
                    var el = dependenceTargetElements[i];

                    dependenceTargetElements[i].classList.remove(this.toggledClass);

                    if (el.hasAttribute('data-target-elements')) {
                        this.target(el, false);
                    }
                }
            }
        },

        switchBtns: function switchBtns(btnEl) {
            if (btnEl.classList.contains(this.toggledClass)) {
                return;
            }

            var btnElems = document.querySelectorAll('[data-switch="' + btnEl.getAttribute('data-switch') + '"]');

            for (var i = 0; i < btnElems.length; i++) {
                var bEl = btnElems[i];

                bEl.classList.remove(this.toggledClass);

                if (bEl.hasAttribute('data-target-elements')) {
                    this.target(bEl, false);
                }
            }

            btnEl.classList.add(this.toggledClass);

            if (btnEl.hasAttribute('data-target-elements')) {
                this.target(btnEl, true);
            }
        },

        target: function target(btnEl, state) {
            var target = btnEl.getAttribute('data-target-elements');

            var targetElements = void 0;

            if (target.indexOf('->') !== -1) {
                var selArr = target.split('->');

                targetElements = btnEl.closest(selArr[0]).querySelectorAll(selArr[1]);
            } else {
                targetElements = document.querySelectorAll(target);
            }

            if (!targetElements.length) return;

            if (state) {
                for (var i = 0; i < targetElements.length; i++) {
                    targetElements[i].classList.add(this.targetsToggledClass);
                }
            } else {
                for (var _i = 0; _i < targetElements.length; _i++) {
                    targetElements[_i].classList.remove(this.targetsToggledClass);
                }
            }

            //call onChange
            if (this.onChangeSubscribers.length) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(btnEl, targetElements, state);
                });
            }
        },

        toggleOff: function toggleOff(btnEl) {
            var targetEls = btnEl.getAttribute('data-target-elements'),
                toggleBtnEls = document.querySelectorAll('.' + this.toggledClass + '[data-target-elements*="' + targetEls + '"]');

            this.target(btnEl, false);

            for (var i = 0; i < toggleBtnEls.length; i++) {
                toggleBtnEls[i].classList.remove(this.toggledClass);
            }
        },

        onDocClickOff: function onDocClickOff(e, targetBtnEl) {
            var toggleElements = document.querySelectorAll('[data-toggle-off="document"].' + this.toggledClass);

            for (var i = 0; i < toggleElements.length; i++) {
                var elem = toggleElements[i];

                if (targetBtnEl === elem) continue;

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

        onChange: function onChange(fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
;var FlexImg;

(function () {
    'use strict';

    FlexImg = function FlexImg(elementsStr) {

        function load(elem) {

            if (!elem.hasAttribute('data-images')) {
                return;
            }

            var images = elem.getAttribute('data-images').split(',');

            images.forEach(function (image) {

                var imageProp = image.split('->');

                if (window.innerWidth < +imageProp[0]) {
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
    };
})();
/* 
CoverImg.init([Str parent element selector]);

CoverImg.reInit([Str parent element selector]);
*/
;var CoverImg;

(function () {
    'use strict';

    CoverImg = {
        cover: function cover(e) {
            var img = e.currentTarget,
                imgWrap = img.closest('.cover-img-wrap'),
                imgProportion = img.offsetWidth / img.offsetHeight,
                imgWrapProportion = imgWrap.offsetWidth / imgWrap.offsetHeight;

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

        reInit: function reInit(parentElementStr) {

            var elements;

            if (parentElementStr) {
                if (typeof parentElementStr == 'string') {
                    elements = document.querySelectorAll(parentElementStr + ' .cover-img');
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
                img.src = browser == 'ie' ? img.src + '?' + new Date().getTime() : img.src;
            }
        },

        init: function init(parentElementStr) {
            var elements = parentElementStr ? document.querySelectorAll(parentElementStr + ' .cover-img, ' + parentElementStr + ' .cover-img-wrap') : document.querySelectorAll('.cover-img, .cover-img-wrap');

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
                    img.src = img.src + '?' + new Date().getTime();
                }
            }
        }

    };
})();
/* 
new LazyLoad({
   selector: @Str,
   event: false,
   flexible: true
});

const lazy = new LazyLoad().load;
lazy('.el-sel');
*/

;var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function LazyLoad(opt) {
        var _this = this;

        opt = opt || {};

        this.opt = opt;

        this.opt.flexible = this.opt.flexible || false;

        var elements = document.querySelectorAll(opt.selector);

        if (elements) {
            if (opt.event) {
                if (opt.event == 'scroll') {
                    window.addEventListener('scroll', function (e) {
                        for (var i = 0; i < elements.length; i++) {
                            var el = elements[i];
                        }
                    });
                }
            } else {
                setTimeout(function () {
                    _this.doLoad(elements);
                }, 1000);
            }
        }

        return {
            load: function load(sel) {
                _this.doLoad(document.querySelectorAll(sel));
            }
        };
    };

    LazyLoad.prototype.doLoad = function (elems) {
        var _this2 = this;

        var _loop = function _loop(i) {
            var elem = elems[i];

            if (_this2.opt.flexible) {
                if (elem.hasAttribute('data-src')) {
                    var arr = elem.getAttribute('data-src').split(',');

                    arr.forEach(function (arrItem) {
                        var props = arrItem.split('->');

                        if (window.innerWidth < +props[0]) {
                            elem.src = props[1];
                        }
                    });
                } else if (elem.hasAttribute('data-bg-url')) {
                    var _arr = elem.getAttribute('data-bg-url').split(',');

                    _arr.forEach(function (arrItem) {
                        var props = arrItem.split('->');

                        if (window.innerWidth < +props[0]) {
                            elem.style.backgroundImage = 'url(' + props[1] + ')';
                        }
                    });
                }
            } else {
                if (elem.hasAttribute('data-src')) {
                    elem.src = elem.getAttribute('data-src');
                } else if (elem.hasAttribute('data-bg-url')) {
                    elem.style.backgroundImage = 'url(' + elem.getAttribute('data-bg-url') + ')';
                }
            }
        };

        for (var i = 0; i < elems.length; i++) {
            _loop(i);
        }
    };
})();
/*
Video.init(Str button selector);

Video.onPlay = function (videoEl) {}

Video.onStop = function (videoEl) {}
*/
var Video;

(function () {
    'use strict';

    Video = {
        init: function init(elementStr) {
            var _this = this;

            if (!document.querySelectorAll('.video').length) return;

            document.addEventListener('click', function (e) {
                var elem = e.target.closest(elementStr);

                if (elem) {
                    _this.play(elem);
                }
            });
        },

        play: function play(elem, vSrc, parEl) {
            var _this2 = this;

            var vidFrameWrapEl = void 0,
                autoplay = true;

            if (elem) {
                vidFrameWrapEl = elem.nextElementSibling;
                vSrc = elem.getAttribute('data-src');
            } else {
                vidFrameWrapEl = parEl.querySelector('.video__frame');
                autoplay = false;
            }

            vidFrameWrapEl.classList.add('video__frame_visible');

            if (vSrc.indexOf('youtube') !== -1 || vSrc.indexOf('youtu.be') !== -1) {
                var iFrame = document.createElement('iframe'),
                    vId = vSrc.match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i)[1];

                iFrame.src = 'https://www.youtube.com/embed/' + vId + '?' + (autoplay ? 'autoplay=1' : '') + '&rel=0&amp;showinfo=0';
                iFrame.allow = (autoplay ? 'autoplay; ' : '') + 'encrypted-media';
                iFrame.allowFullscreen = true;

                iFrame.addEventListener('load', function () {
                    iFrame.classList.add('visible');

                    vidFrameWrapEl.classList.add('video__frame_played');

                    if (this.onPlay) {
                        this.onPlay(vidFrameWrapEl.closest('.video'));
                    }
                });

                vidFrameWrapEl.appendChild(iFrame);
            } else {
                var videoEl = document.createElement('video');

                videoEl.src = vSrc;
                videoEl.autoplay = autoplay;
                videoEl.controls = true;

                vidFrameWrapEl.appendChild(videoEl);

                videoEl.classList.add('visible');

                vidFrameWrapEl.classList.add('video__frame_played');

                videoEl.addEventListener('ended', function () {
                    _this2.stop(videoEl);
                });

                if (this.onPlay) {
                    this.onPlay(vidFrameWrapEl.closest('.video'));
                }
            }
        },

        stop: function stop(videoEl) {
            var frameBlockEls = document.querySelectorAll('.video__frame_played');

            for (var i = 0; i < frameBlockEls.length; i++) {
                var el = frameBlockEls[i];

                el.innerHTML = '';
                el.classList.remove('video__frame_visible');
                el.classList.remove('video__frame_played');
            }

            if (this.onStop) {
                this.onStop(videoEl && videoEl.closest('.video'));
            }
        }
    };
})();
var Popup;

(function () {
    'use strict';

    Popup = {
        winScrollTop: 0,
        onClose: null,
        _onclose: null,
        onOpenSubscribers: [],
        headerSelector: '.header',
        delay: 300,

        init: function init(elementStr) {
            var _this = this;

            document.addEventListener('click', function (e) {
                var btnElem = e.target.closest(elementStr),
                    closeBtnElem = e.target.closest('.js-popup-close');

                if (btnElem) {
                    e.preventDefault();
                    _this.open(btnElem.getAttribute('data-popup') || btnElem.getAttribute('href'), false, btnElem);
                } else if (closeBtnElem || !e.target.closest('.popup__window') && e.target.closest('.popup') && !e.target.closest('.popup[data-btn-close-only="true"]')) {
                    _this.close('closeButton');
                }
            });

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        open: function open(elementStr, callback, btnElem) {
            var winEl = document.querySelector(elementStr);

            if (!winEl || !winEl.classList.contains('popup__window')) return;

            this.close('openPopup', winEl);

            var elemParent = winEl.parentElement;

            elemParent.style.display = 'block';

            setTimeout(function () {
                elemParent.style.opacity = '1';
            }, 121);

            elemParent.scrollTop = 0;

            setTimeout(function () {
                winEl.style.display = 'inline-block';

                if (winEl.offsetHeight < window.innerHeight) {
                    winEl.style.top = (window.innerHeight - winEl.offsetHeight) / 2 + 'px';
                }

                winEl.style.opacity = '1';

                setTimeout(function () {
                    winEl.classList.add('popup__window_visible');
                }, this.delay);
            }, this.delay);

            if (callback) this._onclose = callback;

            this.fixBody(true);

            this.onOpenSubscribers.forEach(function (item) {
                item(elementStr, btnElem);
            });

            return winEl;
        },

        onOpen: function onOpen(fun) {
            if (typeof fun === 'function') {
                this.onOpenSubscribers.push(fun);
            }

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        message: function message(msg, winSel, callback) {
            var winEl = this.open(winSel || '#message-popup', callback);

            winEl.querySelector('.popup__message').innerHTML = msg.replace(/\[(\/?\w+)\]/gi, '<$1>');
        },

        close: function close(evInit, openedWinEl) {
            var _this2 = this;

            var visWinElems = document.querySelectorAll('.popup__window_visible');

            if (!visWinElems.length) return;

            var _loop = function _loop(i) {
                var winEl = visWinElems[i];

                if (!winEl.classList.contains('popup__window_visible')) return 'continue';

                winEl.style.opacity = '0';

                var samePop = openedWinEl ? winEl.parentElement === openedWinEl.parentElement : false;

                setTimeout(function () {
                    winEl.classList.remove('popup__window_visible');
                    winEl.style.display = 'none';

                    if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.opacity = '0';

                    setTimeout(function () {
                        if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.display = 'none';

                        if (evInit == 'closeButton') _this2.fixBody(false);
                    }, _this2.delay);
                }, _this2.delay);
            };

            for (var i = 0; i < visWinElems.length; i++) {
                var _ret = _loop(i);

                if (_ret === 'continue') continue;
            }

            if (this._onclose) {
                this._onclose();
                this._onclose = null;
            } else if (this.onClose) {
                this.onClose();
            }
        },

        fixBody: function fixBody(st) {
            var headerElem = document.querySelector(this.headerSelector);

            if (st && !document.body.classList.contains('popup-is-opened')) {
                this.winScrollTop = window.pageYOffset;

                var offset = window.innerWidth - document.documentElement.clientWidth;

                document.body.classList.add('popup-is-opened');

                if (headerElem) {
                    headerElem.style.transition = '0s';
                    headerElem.style.right = offset + 'px';
                }

                document.body.style.right = offset + 'px';

                document.body.style.top = -this.winScrollTop + 'px';
            } else if (!st) {
                if (headerElem) {
                    headerElem.style.right = '';
                    setTimeout(function () {
                        headerElem.style.transition = '';
                    }, 321);
                }

                document.body.classList.remove('popup-is-opened');

                window.scrollTo(0, this.winScrollTop);
            }
        }
    };
})();
var MediaPopup;

(function () {
    'use strict';

    MediaPopup = {
        groupBtnElems: null,
        curGroupBtnIndex: null,
        popupEl: null,

        init: function init(btnSel) {
            var _this = this;

            document.addEventListener('click', function (e) {
                var btnEl = e.target.closest(btnSel),
                    arrBtnEl = e.target.closest('.popup-media__arr'),
                    dotBtnEl = e.target.closest('.popup-media__dots-btn');

                if (btnEl) {
                    e.preventDefault();

                    _this.popupEl = Popup.open(btnEl.getAttribute('data-popup') || '#media-popup', null, btnEl);

                    _this.show(btnEl);
                    _this.group(btnEl);
                } else if (arrBtnEl) {
                    _this.next(arrBtnEl.getAttribute('data-dir'));
                } else if (dotBtnEl) {
                    if (!dotBtnEl.classList.contains('active')) {
                        var dotBtnElems = document.querySelectorAll('.popup-media__dots-btn');

                        for (var i = 0; i < dotBtnElems.length; i++) {
                            dotBtnElems[i].classList.remove('active');
                        }

                        dotBtnEl.classList.add('active');

                        _this.goTo(+dotBtnEl.getAttribute('data-ind'));
                    }
                }
            });
        },

        show: function show(btnEl) {
            var type = btnEl.getAttribute('data-type'),
                caption = btnEl.getAttribute('data-caption'),
                args = {
                href: btnEl.href,
                preview: btnEl.getAttribute('data-preview')
            },
                captEl = this.popupEl.querySelector('.popup-media__caption');

            if (caption) {
                captEl.innerHTML = caption.replace(/\[(\/?\w+)\]/gi, '<$1>');
                captEl.style.display = '';
            } else {
                captEl.style.display = 'none';
            }

            if (type == 'image') {
                this.image(args);
            } else if (type == 'video') {
                this.video(args);
            }
        },

        image: function image(args) {
            var elemImg = this.popupEl.querySelector('.popup-media__image');

            Popup.onClose = function () {
                elemImg.src = '#';
                elemImg.classList.remove('popup-media__image_visible');
            };

            elemImg.src = args.href;
            elemImg.classList.add('popup-media__image_visible');
        },

        video: function video(args) {
            var videoEl = this.popupEl.querySelector('.popup-media__video'),
                previewEl = videoEl.querySelector('.popup-media__preview'),
                btnPlayEl = videoEl.querySelector('.popup-media__btn-play');

            Popup.onClose = function () {
                Video.stop();
                previewEl.src = '#';
                videoEl.classList.remove('popup-media__video_visible');
            };

            previewEl.src = args.preview;
            btnPlayEl.setAttribute('data-src', args.href);
            videoEl.classList.add('popup-media__video_visible');
        },

        group: function group(elem) {
            var group = elem.getAttribute('data-group'),
                arrBtnElems = document.querySelectorAll('.popup-media__arr'),
                dotsEl = this.popupEl.querySelector('.popup-media__dots');

            if (!group) {
                this.groupBtnElems = null;
                this.curGroupBtnIndex = null;

                for (var i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = 'none';
                }

                dotsEl.style.display = 'none';

                return;
            }

            this.groupBtnElems = document.querySelectorAll('[data-group="' + group + '"]');
            this.curGroupBtnIndex = [].slice.call(this.groupBtnElems).indexOf(elem);

            if (this.groupBtnElems.length) {
                for (var _i = 0; _i < arrBtnElems.length; _i++) {
                    arrBtnElems[_i].style.display = '';
                }

                dotsEl.style.display = '';
                dotsEl.innerHTML = '';

                for (var _i2 = 0; _i2 < this.groupBtnElems.length; _i2++) {
                    var dot = document.createElement('li');
                    dot.innerHTML = '<button class="popup-media__dots-btn' + (_i2 == this.curGroupBtnIndex ? ' active' : '') + '" data-ind="' + _i2 + '"></button>';

                    dotsEl.appendChild(dot);
                }
            } else {
                for (var _i3 = 0; _i3 < arrBtnElems.length; _i3++) {
                    arrBtnElems[_i3].style.display = 'none';
                }

                dotsEl.style.display = 'none';
            }
        },

        next: function next(dir) {
            var btnEl = void 0;

            var dotBtnEls = this.popupEl.querySelectorAll('.popup-media__dots-btn');

            for (var i = 0; i < dotBtnEls.length; i++) {
                dotBtnEls[i].classList.remove('active');
            }

            if (dir == 'next') {
                this.curGroupBtnIndex++;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];
                } else {
                    this.curGroupBtnIndex = 0;
                    btnEl = this.groupBtnElems[0];
                }
            } else {
                this.curGroupBtnIndex--;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];
                } else {
                    this.curGroupBtnIndex = this.groupBtnElems.length - 1;
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];
                }
            }

            dotBtnEls[this.curGroupBtnIndex].classList.add('active');

            this.show(btnEl);
        },

        goTo: function goTo(ind) {
            this.curGroupBtnIndex = ind;

            var btnEl = this.groupBtnElems[ind];

            this.show(btnEl);
        }
    };
})();
var ValidateForm;

(function () {
    'use strict';

    ValidateForm = {
        input: null,
        formSelector: null,

        init: function init(formSelector) {
            this.formSelector = formSelector;

            document.removeEventListener('input', this.inpH);
            document.removeEventListener('change', this.chH);

            this.inpH = this.inpH.bind(this);
            this.chH = this.chH.bind(this);

            document.addEventListener('input', this.inpH);
            document.addEventListener('change', this.chH);
        },

        inpH: function inpH(e) {
            var _this = this;

            var elem = e.target.closest(this.formSelector + ' input[type="text"],' + this.formSelector + ' input[type="password"],' + this.formSelector + ' input[type="number"],' + this.formSelector + ' input[type="tel"],' + this.formSelector + ' textarea, input[type="text"][form]');

            if (elem /* && elem.hasAttribute('data-tested') */) {
                    setTimeout(function () {
                        _this.validateOnInput(elem);
                    }, 121);
                }
        },

        chH: function chH(e) {
            var elem = e.target.closest(this.formSelector + ' input[type="radio"],' + this.formSelector + ' input[type="checkbox"]');

            if (elem) {
                this[elem.type](elem);
            }
        },

        validateOnInput: function validateOnInput(elem) {
            this.input = elem;

            var dataType = elem.getAttribute('data-type');

            if (elem.hasAttribute('data-tested')) {
                this.formError(elem.closest('form'), false);

                if (elem.getAttribute('data-required') === 'true' && (!elem.value.length || /^\s+$/.test(elem.value))) {
                    this.successTip(false);
                    this.errorTip(true);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            var tE = this[dataType]();

                            if (tE) {
                                this.successTip(false);
                                this.errorTip(true, tE);
                                err++;
                                errElems.push(elem);
                            } else {
                                this.errorTip(false);
                                this.successTip(true);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType);
                        }
                    } else {
                        this.errorTip(false);
                        this.successTip(true);
                    }
                } else {
                    this.errorTip(false);
                    this.successTip(false);
                }
            } else {
                if (!elem.value.length || /^\s+$/.test(elem.value)) {
                    this.successTip(false);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            if (this[dataType]() === null) {
                                this.successTip(true);
                            } else {
                                this.successTip(false);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType);
                        }
                    } else {
                        this.successTip(true);
                    }
                }
            }
        },

        validate: function validate(formElem) {
            var _this2 = this;

            var errElems = [];

            var err = 0;

            // text, password, textarea
            var elements = formElem.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], input[type="tel"], textarea');

            var checkElems = function checkElems(elements) {
                for (var _i = 0; _i < elements.length; _i++) {
                    var _elem = elements[_i];

                    if (elemIsHidden(_elem)) {
                        continue;
                    }

                    _this2.input = _elem;

                    _elem.setAttribute('data-tested', 'true');

                    var dataType = _elem.getAttribute('data-type');

                    if (_elem.getAttribute('data-required') === 'true' && (!_elem.value.length || /^\s+$/.test(_elem.value))) {
                        _this2.errorTip(true);
                        err++;
                        errElems.push(_elem);
                    } else if (_elem.value.length) {
                        if (_elem.hasAttribute('data-custom-error')) {
                            err++;
                            errElems.push(_elem);
                        } else if (dataType) {
                            try {
                                var tE = _this2[dataType]();

                                if (tE) {
                                    _this2.errorTip(true, tE);
                                    err++;
                                    errElems.push(_elem);
                                } else {
                                    _this2.errorTip(false);
                                }
                            } catch (error) {
                                console.log('Error while process', dataType);
                            }
                        } else {
                            _this2.errorTip(false);
                        }
                    } else {
                        _this2.errorTip(false);
                    }
                }
            };

            checkElems(elements);

            if (formElem.id) {
                var _elements = document.querySelectorAll('input[form="' + formElem.id + '"]');

                checkElems(_elements);
            }

            // select
            var selectElements = formElem.querySelectorAll('.select__input');

            for (var _i2 = 0; _i2 < selectElements.length; _i2++) {
                var selectElem = selectElements[_i2];

                if (elemIsHidden(selectElem.parentElement)) continue;

                if (this.select(selectElem)) {
                    err++;
                    errElems.push(selectElem.parentElement);
                }
            }

            // checkboxes
            var chboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (var _i3 = 0; _i3 < chboxEls.length; _i3++) {
                var _elem2 = chboxEls[_i3];

                if (elemIsHidden(_elem2)) {
                    continue;
                }

                this.input = _elem2;

                _elem2.setAttribute('data-tested', 'true');

                if (_elem2.getAttribute('data-required') === 'true' && !_elem2.checked) {
                    this.errorTip(true);
                    err++;
                    errElems.push(_elem2);
                } else {
                    this.errorTip(false);
                }
            }

            // checkbox group
            var chboxGrEls = formElem.querySelectorAll('.form__chbox-group');

            for (var _i4 = 0; _i4 < chboxGrEls.length; _i4++) {
                var group = chboxGrEls[_i4],
                    checkedElements = 0;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                var chboxInGrEls = group.querySelectorAll('input[type="checkbox"]');

                for (var _i5 = 0; _i5 < chboxInGrEls.length; _i5++) {
                    if (chboxInGrEls[_i5].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__chbox-group_error');
                }
            }

            // radio group
            var radGrEls = formElem.querySelectorAll('.form__radio-group');

            for (var _i6 = 0; _i6 < radGrEls.length; _i6++) {
                var group = radGrEls[_i6],
                    checkedElement = false;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                var radInGrEls = group.querySelectorAll('input[type="radio"]');

                for (var _i7 = 0; _i7 < radInGrEls.length; _i7++) {
                    if (radInGrEls[_i7].checked) {
                        checkedElement = true;
                    }
                }

                if (!checkedElement) {
                    group.classList.add('form__radio-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__radio-group_error');
                }
            }

            // file
            var fileEls = formElem.querySelectorAll('input[type="file"]');

            for (var i = 0; i < fileEls.length; i++) {
                var elem = fileEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                if (CustomFile.inputFiles(elem).length) {
                    if (this.file(elem, CustomFile.inputFiles(elem))) {
                        err++;
                        errElems.push(elem);
                    }
                } else if (elem.getAttribute('data-required') === 'true') {
                    this.errorTip(true);
                    err++;
                    errElems.push(elem);
                } else {
                    this.errorTip(false);
                }
            }

            // passwords compare
            var pwdCompEls = formElem.querySelectorAll('input[data-pass-compare-input]');

            for (var i = 0; i < pwdCompEls.length; i++) {
                var elem = pwdCompEls[i];

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
                        errElems.push(elem);
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            this.formError(formElem, err);

            if (err) {
                this.scrollToErrElem(errElems);
            }

            return err ? false : true;
        },

        successTip: function successTip(state) {
            var field = this.input.closest('.form__field') || this.input.parentElement;

            if (state) {
                field.classList.add('field-success');
            } else {
                field.classList.remove('field-success');
            }
        },

        errorTip: function errorTip(err, errInd, errorTxt) {
            var field = this.input.closest('.form__field') || this.input.parentElement,
                tipEl = field.querySelector('.field-error-tip');

            if (err) {
                this.successTip(false);

                field.classList.add('field-error');

                if (errInd) {
                    if (tipEl) {
                        if (!tipEl.hasAttribute('data-error-text')) {
                            tipEl.setAttribute('data-error-text', tipEl.innerHTML);
                        }
                        tipEl.innerHTML = errInd != 'custom' ? tipEl.getAttribute('data-error-text-' + errInd) : errorTxt;
                    }

                    field.setAttribute('data-error-index', errInd);
                } else {
                    if (tipEl && tipEl.hasAttribute('data-error-text')) {
                        tipEl.innerHTML = tipEl.getAttribute('data-error-text');
                    }

                    field.removeAttribute('data-error-index');
                }
            } else {
                field.classList.remove('field-error');
                field.removeAttribute('data-error-index');
            }
        },

        customErrorTip: function customErrorTip(input, errorTxt, isLockForm) {
            if (!input) return;

            this.input = input;

            if (errorTxt) {
                this.errorTip(true, 'custom', errorTxt);

                if (isLockForm) {
                    input.setAttribute('data-custom-error', 'true');
                }
            } else {
                this.errorTip(false);
                input.removeAttribute('data-custom-error');

                this.validate(input.closest('form'));
            }
        },

        formError: function formError(formElem, err, errTxt) {
            var errTipElem = formElem.querySelector('.form-error-tip');

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

        customFormErrorTip: function customFormErrorTip(formElem, errorTxt) {
            if (!formElem) return;

            if (errorTxt) {
                this.formError(formElem, true, errorTxt);
            } else {
                this.formError(formElem, false);
            }
        },

        scrollToErrElem: function scrollToErrElem(elems) {
            var offsetTop = 99999;

            var headerHeight = document.querySelector('.header').offsetHeight;

            for (var i = 0; i < elems.length; i++) {
                var el = elems[i],
                    epOffsetTop = el.getBoundingClientRect().top;

                if (epOffsetTop < headerHeight && epOffsetTop < offsetTop) {
                    offsetTop = epOffsetTop;
                }
            }

            if (offsetTop != 99999) {
                var scrTo = offsetTop + window.scrollY - headerHeight;

                animate(function (progress) {
                    window.scrollTo(0, scrTo * progress + (1 - progress) * window.scrollY);
                }, 1000, 'easeInOutQuad');
            }
        },

        txt: function txt() {
            if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        num: function num() {
            if (!/^[0-9.,-]*$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        cardNumber: function cardNumber() {
            if (!/^\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        name: function name() {
            if (!/^[a-zа-яё'\s-]{2,21}(\s[a-zа-яё'\s-]{2,21})?(\s[a-zа-яё'\s-]{2,21})?$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        date: function date() {
            var errDate = false,
                matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

            if (!matches) {
                errDate = 1;
            } else {
                var compDate = new Date(matches[3], matches[2] - 1, matches[1]),
                    curDate = new Date();

                if (this.input.hasAttribute('data-min-years-passed')) {
                    var interval = curDate.valueOf() - new Date(curDate.getFullYear() - +this.input.getAttribute('data-min-years-passed'), curDate.getMonth(), curDate.getDate()).valueOf();

                    if (curDate.valueOf() < compDate.valueOf() || curDate.getFullYear() - matches[3] > 100) {
                        errDate = 1;
                    } else if (curDate.valueOf() - compDate.valueOf() < interval) {
                        errDate = 2;
                    }
                }

                if (compDate.getFullYear() != matches[3] || compDate.getMonth() != matches[2] - 1 || compDate.getDate() != matches[1]) {
                    errDate = 1;
                }
            }

            if (errDate == 1) {
                return 2;
            } else if (errDate == 2) {
                return 3;
            }

            return null;
        },

        time: function time() {
            var matches = this.input.value.match(/^(\d{1,2}):(\d{1,2})$/);

            if (!matches || Number(matches[1]) > 23 || Number(matches[2]) > 59) {
                return 2;
            }

            return null;
        },

        email: function email() {
            if (!/^[a-z0-9]+[\w\-\.]*@([\w\-]{2,}\.)+[a-z]{2,}$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        url: function url() {
            if (!/^(https?\:\/\/)?[а-я\w-.]+\.[a-zа-я]{2,11}[/?а-я\w/=-]+$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        tel: function tel() {
            if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        pass: function pass() {
            var err = false,
                minLng = this.input.getAttribute('data-min-length');

            if (minLng && this.input.value.length < minLng) {
                return 2;
            }

            return null;
        },

        checkbox: function checkbox(elem) {
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
                if (elem.getAttribute('data-required') === 'true' && !elem.checked) {
                    this.errorTip(true);
                } else {
                    this.errorTip(false);
                }
            }
        },

        radio: function radio(elem) {
            this.input = elem;

            var checkedElement = false,
                group = elem.closest('.form__radio-group');

            if (!group) return;

            var elements = group.querySelectorAll('input[type="radio"]');

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

        select: function select(elem) {
            var err = false;

            this.input = elem;

            if (elem.getAttribute('data-required') === 'true' && !elem.value.length) {
                this.errorTip(true);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        file: function file(elem, filesArr) {
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
        }
    };
})();
/* 
*   Checkbox.onChange(function(el, state) {
*       // body
*   }); 
*/

var Checkbox;

(function () {
    'use strict';

    Checkbox = {
        hideCssClass: 'hidden',
        opt: {},
        onChangeSubscribers: [],

        init: function init(options) {
            options = options || {};

            this.opt.focusOnTarget = options.focusOnTarget !== undefined ? options.focusOnTarget : false;

            var elems = document.querySelectorAll('input[type="checkbox"]');

            for (var i = 0; i < elems.length; i++) {
                this.change(elems[i], true);
            }

            // change event
            document.removeEventListener('change', this.changeHandler);

            this.changeHandler = this.changeHandler.bind(this);
            document.addEventListener('change', this.changeHandler);
        },

        changeHandler: function changeHandler(e) {
            var elem = e.target.closest('input[type="checkbox"]');

            if (elem) {
                this.change(elem);
            }
        },

        change: function change(elem, onInit) {
            if (!onInit) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(elem, elem.checked);
                });
            }

            var targetElements = elem.hasAttribute('data-target-elements') ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

            if (!targetElements.length) return;

            for (var i = 0; i < targetElements.length; i++) {
                var targetElem = targetElements[i];

                targetElem.style.display = elem.checked ? 'block' : 'none';

                if (elem.checked) {
                    targetElem.classList.remove(this.hideCssClass);

                    var inpEls = targetElem.querySelectorAll('input[type="text"]');

                    for (var j = 0; j < inpEls.length; j++) {
                        var inpEl = inpEls[j];

                        inpEl.focus();
                    }
                } else {
                    targetElem.classList.add(this.hideCssClass);
                }
            }
        },

        onChange: function onChange(fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
(function () {
	'use strict';

	//show element on radio button change

	var ChangeRadio = {
		hideCssClass: 'hidden',

		change: function change(checkedElem) {
			var elements = document.querySelectorAll('input[type="radio"][name="' + checkedElem.name + '"]');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				    targetElements = elem.hasAttribute('data-target-elements') ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : [],
				    hideElems = elem.hasAttribute('data-hide-elements') ? document.querySelectorAll(elem.getAttribute('data-hide-elements')) : [];

				if (!targetElements.length && !hideElems.length) continue;

				for (var _i = 0; _i < targetElements.length; _i++) {
					var targetElem = targetElements[_i];

					targetElem.style.display = elem.checked ? 'block' : 'none';

					if (elem.checked) {
						targetElem.classList.remove(this.hideCssClass);
					} else {
						targetElem.classList.add(this.hideCssClass);
					}
				}

				for (var _i2 = 0; _i2 < hideElems.length; _i2++) {
					var hideEl = hideElems[_i2];

					hideEl.style.display = elem.checked ? 'none' : 'block';

					if (elem.checked) {
						hideEl.classList.add(this.hideCssClass);
					} else {
						hideEl.classList.remove(this.hideCssClass);
					}
				}
			}
		},

		init: function init() {
			var _this = this;

			document.addEventListener('change', function (e) {
				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					_this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		ChangeRadio.init();
	});
})();
;var Select;

(function () {
    'use strict';

    // custom select

    Select = {
        field: null,
        hideCssClass: 'hidden',
        onSelectSubscribers: [],
        focusBlurIsDisabled: false,
        st: null,

        reset: function reset(parentElem) {
            var parElem = parentElem || document,
                fieldElements = parElem.querySelectorAll('.select'),
                buttonElements = parElem.querySelectorAll('.select__button'),
                inputElements = parElem.querySelectorAll('.select__input'),
                valueElements = parElem.querySelectorAll('.select__val');

            for (var i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_changed');
            }

            for (var _i = 0; _i < buttonElements.length; _i++) {
                buttonElements[_i].children[0].innerHTML = buttonElements[_i].getAttribute('data-placeholder');
            }

            for (var _i2 = 0; _i2 < inputElements.length; _i2++) {
                inputElements[_i2].value = '';
                inputElements[_i2].blur();
            }

            for (var _i3 = 0; _i3 < valueElements.length; _i3++) {
                valueElements[_i3].classList.remove('select__val_checked');
                valueElements[_i3].disabled = false;
            }
        },

        closeAll: function closeAll() {
            var fieldElements = document.querySelectorAll('.select'),
                optionsElements = document.querySelectorAll('.select__options');

            for (var i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_opened');

                optionsElements[i].classList.remove('ovfauto');
                optionsElements[i].style.height = 0;

                var listItemElements = optionsElements[i].querySelectorAll('li');

                for (var _i4 = 0; _i4 < listItemElements.length; _i4++) {
                    listItemElements[_i4].classList.remove('hover');
                }
            }
        },

        close: function close(fieldEl) {
            fieldEl = fieldEl || this.field;

            setTimeout(function () {
                fieldEl.classList.remove('select_opened');
            }, 210);

            var optionsElem = fieldEl.querySelector('.select__options'),
                listItemElements = optionsElem.querySelectorAll('li');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;

            for (var i = 0; i < listItemElements.length; i++) {
                listItemElements[i].classList.remove('hover');
            }
        },

        open: function open() {
            this.field.classList.add('select_opened');

            var optionsElem = this.field.querySelector('.select__options');

            setTimeout(function () {
                optionsElem.style.height = (optionsElem.scrollHeight > window.innerHeight - optionsElem.getBoundingClientRect().top ? window.innerHeight - optionsElem.getBoundingClientRect().top : optionsElem.scrollHeight + 2) + 'px';
                optionsElem.scrollTop = 0;

                setTimeout(function () {
                    optionsElem.classList.add('ovfauto');
                }, 621);
            }, 21);
        },

        selectMultipleVal: function selectMultipleVal(elem, button, input) {
            var toButtonValue = [],
                toInputValue = [],
                inputsBlock = this.field.querySelector('.select__multiple-inputs');

            elem.classList.toggle('select__val_checked');

            var checkedElements = this.field.querySelectorAll('.select__val_checked');

            for (var i = 0; i < checkedElements.length; i++) {
                var _elem = checkedElements[i];

                toButtonValue[i] = _elem.innerHTML;
                toInputValue[i] = _elem.hasAttribute('data-value') ? _elem.getAttribute('data-value') : _elem.innerHTML;
            }

            if (toButtonValue.length) {
                button.children[0].innerHTML = toButtonValue.join(', ');

                input.value = toInputValue[0];

                inputsBlock.innerHTML = '';

                if (toInputValue.length > 1) {
                    for (var _i5 = 1; _i5 < toInputValue.length; _i5++) {
                        var yetInput = document.createElement('input');

                        yetInput.type = 'hidden';
                        yetInput.name = input.name;
                        yetInput.value = toInputValue[_i5];

                        inputsBlock.appendChild(yetInput);
                    }
                }
            } else {
                button.children[0].innerHTML = button.getAttribute('data-placeholder');
                input.value = '';
                this.close();
            }
        },

        targetAction: function targetAction() {
            var valEls = this.field.querySelectorAll('.select__val');

            for (var i = 0; i < valEls.length; i++) {
                var vEl = valEls[i];

                if (vEl.hasAttribute('data-show-elements')) {
                    var showEls = document.querySelectorAll(vEl.getAttribute('data-show-elements'));

                    for (var _i6 = 0; _i6 < showEls.length; _i6++) {
                        var sEl = showEls[_i6];

                        sEl.style.display = 'none';
                        sEl.classList.add(this.hideCssClass);
                    }
                }

                if (vEl.hasAttribute('data-hide-elements')) {
                    var hideEls = document.querySelectorAll(vEl.getAttribute('data-hide-elements'));

                    for (var _i7 = 0; _i7 < hideEls.length; _i7++) {
                        var hEl = hideEls[_i7];

                        hEl.style.display = 'block';
                        hEl.classList.remove(this.hideCssClass);
                    }
                }
            }

            for (var _i8 = 0; _i8 < valEls.length; _i8++) {
                var _vEl = valEls[_i8];

                if (_vEl.hasAttribute('data-show-elements')) {
                    var _showEls = document.querySelectorAll(_vEl.getAttribute('data-show-elements'));

                    for (var _i9 = 0; _i9 < _showEls.length; _i9++) {
                        var _sEl = _showEls[_i9];

                        if (_vEl.classList.contains('select__val_checked')) {
                            _sEl.style.display = 'block';
                            _sEl.classList.remove(this.hideCssClass);

                            // focus on input
                            var txtInpEl = _sEl.querySelector('input[type="text"]');

                            if (txtInpEl) {
                                txtInpEl.focus();
                            }
                        }
                    }
                }

                if (_vEl.hasAttribute('data-hide-elements')) {
                    var _hideEls = document.querySelectorAll(_vEl.getAttribute('data-hide-elements'));

                    for (var _i10 = 0; _i10 < _hideEls.length; _i10++) {
                        var _hEl = _hideEls[_i10];

                        if (_vEl.classList.contains('select__val_checked')) {
                            _hEl.style.display = 'none';
                            _hEl.classList.add(this.hideCssClass);
                        }
                    }
                }
            }
        },

        selectVal: function selectVal(elem) {
            var button = this.field.querySelector('.select__button'),
                input = this.field.querySelector('.select__input');

            if (this.field.classList.contains('select_multiple')) {
                this.selectMultipleVal(elem, button, input);
            } else {
                var toButtonValue = elem.innerHTML,
                    toInputValue = elem.hasAttribute('data-value') ? elem.getAttribute('data-value') : elem.innerHTML;

                var valueElements = this.field.querySelectorAll('.select__val');

                for (var i = 0; i < valueElements.length; i++) {
                    var valElem = valueElements[i];

                    valElem.classList.remove('select__val_checked');
                    valElem.disabled = false;

                    valElem.parentElement.classList.remove('hidden');
                }

                elem.classList.add('select__val_checked');
                elem.disabled = true;

                if (this.field.classList.contains('select_hide-selected-option')) {
                    elem.parentElement.classList.add('hidden');
                }

                if (button) {
                    button.children[0].innerHTML = toButtonValue;
                }

                input.value = toInputValue;

                this.close();

                if (window.Placeholder) {
                    Placeholder.hide(input, true);
                }

                if (input.getAttribute('data-submit-form-onchange')) {
                    Form.submitForm(input.closest('form'));
                }

                this.onSelectSubscribers.forEach(function (item) {
                    item(input, toButtonValue, toInputValue, elem.getAttribute('data-second-value'));
                });
            }

            this.targetAction();

            if (input.classList.contains('var-height-textarea__textarea')) {
                varHeightTextarea.setHeight(input);
            }

            this.field.classList.add('select_changed');

            ValidateForm.select(input);
        },

        onSelect: function onSelect(fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        setOptions: function setOptions(fieldSelector, optObj, nameKey, valKey, secValKey) {
            var fieldElements = document.querySelectorAll(fieldSelector + ' .select');

            for (var i = 0; i < fieldElements.length; i++) {
                var optionsElem = fieldElements[i].querySelector('.select__options');

                optionsElem.innerHTML = '';

                for (var _i11 = 0; _i11 < optObj.length; _i11++) {
                    var li = document.createElement('li'),
                        secValAttr = secValKey != undefined ? ' data-second-value="' + optObj[_i11][secValKey] + '"' : '';

                    li.innerHTML = '<button type="button" class="select__val" data-value="' + optObj[_i11][valKey] + '"' + secValAttr + '>' + optObj[_i11][nameKey] + '</button>';

                    optionsElem.appendChild(li);
                }
            }
        },

        keyboard: function keyboard(key) {
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
                        var _nextItem = function (item) {
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

                        if (_nextItem) {
                            hoverItem.classList.remove('hover');
                            _nextItem.classList.add('hover');

                            options.scrollTop = options.scrollTop + (_nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
                        }
                    } else {
                        var _elem2 = options.lastElementChild;

                        while (_elem2) {
                            if (!_elem2) break;

                            if (!elemIsHidden(_elem2)) {
                                _elem2.classList.add('hover');
                                options.scrollTop = 9999;
                                break;
                            } else {
                                _elem2 = _elem2.previousElementSibling;
                            }
                        }
                    }
                    break;

                case 13:
                    this.selectVal(hoverItem.querySelector('.select__val'));
            }
        },

        build: function build(elementStr) {
            var elements = document.querySelectorAll(elementStr);

            if (!elements.length) return;

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i],
                    options = elem.querySelectorAll('option'),
                    parent = elem.parentElement;

                var optionsList = '',
                    selectedOption = null;

                // option list
                for (var _i12 = 0; _i12 < options.length; _i12++) {
                    var opt = options[_i12];

                    var liClass = '';

                    if (opt.hasAttribute('selected')) {
                        selectedOption = opt;

                        if (elem.getAttribute('data-hide-selected-option') == 'true') {
                            liClass = 'hidden';
                        }
                    }

                    optionsList += '<li' + (liClass ? ' class="' + liClass + '"' : '') + '><button type="button" tabindex="-1" class="select__val' + (opt.hasAttribute('selected') ? ' select__val_checked' : '') + '"' + (opt.hasAttribute('value') ? ' data-value="' + opt.value + '"' : '') + (opt.hasAttribute('data-second-value') ? ' data-second-value="' + opt.getAttribute('data-second-value') + '"' : '') + (opt.hasAttribute('data-show-elements') ? ' data-show-elements="' + opt.getAttribute('data-show-elements') + '"' : '') + (opt.hasAttribute('data-hide-elements') ? ' data-hide-elements="' + opt.getAttribute('data-hide-elements') + '"' : '') + '>' + opt.innerHTML + '</button></li>';
                }

                var require = elem.hasAttribute('data-required') ? ' data-required="' + elem.getAttribute('data-required') + '" ' : '';

                var placeholder = elem.getAttribute('data-placeholder');

                var submitOnChange = elem.hasAttribute('data-submit-form-onchange') ? ' data-submit-form-onchange="' + elem.getAttribute('data-submit-form-onchange') + '" ' : '';

                var head = '<button type="button"' + (placeholder ? ' data-placeholder="' + placeholder + '"' : '') + ' class="select__button"><span>' + (selectedOption ? selectedOption.innerHTML : placeholder ? placeholder : '') + '</span></button>';

                var multiple = {
                    class: elem.multiple ? ' select_multiple' : '',
                    inpDiv: elem.multiple ? '<div class="select__multiple-inputs"></div>' : ''
                };

                var hiddenInp = '<input type="hidden" name="' + elem.name + '"' + require + submitOnChange + 'class="select__input" value="' + (selectedOption ? selectedOption.value : '') + '">';

                if (elem.hasAttribute('data-empty-text')) {
                    optionsList = '<li class="select__options-empty">' + elem.getAttribute('data-empty-text') + '</li>';
                }

                // output select
                var customElem = document.createElement('div');

                customElem.className = 'select' + multiple.class + (selectedOption ? ' select_changed' : '') + (elem.getAttribute('data-hide-selected-option') == 'true' ? ' select_hide-selected-option' : '');

                customElem.innerHTML = head + '<div class="select__options-wrap"><ul class="select__options">' + optionsList + '</ul></div>' + hiddenInp + multiple.inpDiv;

                parent.replaceChild(customElem, elem);
            }
        },

        init: function init(elementStr) {
            var _this = this;

            if (document.querySelector(elementStr)) this.build(elementStr);

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);

            // focus event
            document.removeEventListener('focus', this.focusHandler, true);

            this.focusHandler = this.focusHandler.bind(this);
            document.addEventListener('focus', this.focusHandler, true);

            // blur event
            document.removeEventListener('blur', this.blurHandler, true);

            this.blurHandler = this.blurHandler.bind(this);
            document.addEventListener('blur', this.blurHandler, true);

            // keydown event
            document.removeEventListener('keydown', this.keydownHandler);

            this.keydownHandler = this.keydownHandler.bind(this);
            document.addEventListener('keydown', this.keydownHandler);

            // close all
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.select')) {
                    _this.closeAll();
                }
            });
        },

        clickHandler: function clickHandler(e) {
            clearTimeout(this.st);

            var btnElem = e.target.closest('.select__button'),
                valElem = e.target.closest('.select__val');

            if (btnElem) {
                this.focusBlurIsDisabled = true;

                this.field = btnElem.closest('.select');

                if (this.field.classList.contains('select_opened')) {
                    this.close();
                } else {
                    this.closeAll();
                    this.open();
                }
            } else if (valElem) {
                this.focusBlurIsDisabled = true;

                this.field = valElem.closest('.select');
                this.selectVal(valElem);
            }

            this.st = setTimeout(function () {
                this.focusBlurIsDisabled = false;
            }, 521);
        },

        focusHandler: function focusHandler(e) {
            var _this2 = this;

            var inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(function () {
                    if (_this2.focusBlurIsDisabled) return;

                    _this2.field = inpElem.closest('.select');

                    if (!_this2.field.classList.contains('select_opened')) {
                        _this2.closeAll();
                        _this2.open();
                    }
                }, 321);
            }
        },

        blurHandler: function blurHandler(e) {
            var _this3 = this;

            var inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(function () {
                    if (_this3.focusBlurIsDisabled) return;

                    var fieldEl = inpElem.closest('.select');

                    if (fieldEl.classList.contains('select_opened')) {
                        _this3.close(fieldEl);
                    }
                }, 321);
            }
        },

        keydownHandler: function keydownHandler(e) {
            var elem = e.target.closest('.select_opened');

            if (!elem) return;

            this.field = elem.closest('.select');

            var key = e.which || e.keyCode || 0;

            if (key == 40 || key == 38 || key == 13) {
                e.preventDefault();
                this.keyboard(key);
            }
        }
    };
})();
var FormSlider;

(function () {
    'use strict';

    FormSlider = {
        mM: null,
        mU: null,
        dragElemObj: {},
        formsliderObj: {},
        track: null,
        edge: {},
        input: null,
        valUnit: 0,
        dragElemDistance: 0,
        dragSubscribers: [],
        dragEndSubscribers: [],
        formaters: {},

        init: function init() {
            var sliders = document.querySelectorAll('.formslider');

            for (var i = 0; i < sliders.length; i++) {
                var sliderEl = sliders[i],
                    isRange = sliders[i].getAttribute('data-range');

                var dragElem = void 0;

                if (isRange == 'true') {
                    dragElem = '<button type="button" class="formslider__drag" data-index="0" data-input="' + sliderEl.getAttribute('data-first-input') + '"></button><button type="button" class="formslider__drag" data-index="1" data-input="' + sliderEl.getAttribute('data-second-input') + '"></button>';
                } else {
                    dragElem = '<button type="button" class="formslider__drag" data-input="' + sliderEl.getAttribute('data-input') + '"></button>';
                }

                sliderEl.innerHTML = '<div class="formslider__bar"><div class="formslider__track"></div>' + dragElem + '</div>';

                this.setInitState(sliderEl);
            }

            document.addEventListener('mousedown', this.mouseDown.bind(this));
            document.addEventListener('touchstart', this.mouseDown.bind(this));
        },

        reInit: function reInit() {
            var sliders = document.querySelectorAll('.formslider');

            for (var i = 0; i < sliders.length; i++) {
                this.setInitState(sliders[i]);
            }
        },

        setInitState: function setInitState(slider) {
            var dragElems = slider.querySelectorAll('.formslider__drag'),
                trackEl = slider.querySelector('.formslider__track'),
                dragWidth = dragElems[0].offsetWidth,
                sliderW = slider.offsetWidth,
                min = +slider.getAttribute('data-min'),
                max = +slider.getAttribute('data-max'),
                isRange = slider.getAttribute('data-range'),
                isVertical = slider.getAttribute('data-vertical');

            if (isRange == 'true') {
                for (var i = 0; i < dragElems.length; i++) {
                    var dragEl = dragElems[i],
                        inpEl = document.getElementById(dragEl.getAttribute('data-input'));

                    var inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value;

                    if (inpVal > max) {
                        inpVal = max;
                    }

                    var left = (inpVal - min) / ((max - min) / 100) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';

                    if (i == 0) {
                        trackEl.style.left = left + dragWidth / 2 + 'px';
                    } else {
                        trackEl.style.right = sliderW - left - dragWidth / 2 + 'px';
                    }
                }
            } else {
                var _dragEl = dragElems[0],
                    _inpEl = document.getElementById(_dragEl.getAttribute('data-input'));

                var _inpVal = _inpEl.hasAttribute('data-value') ? +_inpEl.getAttribute('data-value') : +_inpEl.value;

                if (_inpVal > max) {
                    _inpVal = max;
                }

                if (isVertical) {} else {
                    var _left = (_inpVal - min) / ((max - min) / 100) * ((sliderW - dragWidth) / 100);

                    _dragEl.style.left = _left + 'px';
                }
            }
        },

        // on mouse down
        mouseDown: function mouseDown(e) {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            var elem = e.target.closest('.formslider__drag');

            if (!elem) {
                return;
            }

            this.mM = this.mouseMove.bind(this);
            this.mU = this.mouseUp.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('touchmove', this.mM, { passive: false });

            document.addEventListener('mouseup', this.mU);
            document.addEventListener('touchend', this.mU);

            var clientX = e.type == 'touchstart' ? e.targetTouches[0].clientX : e.clientX,
                clientY = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY;

            // formslider options
            var formslider = elem.closest('.formslider');
            this.formsliderObj.X = formslider.getBoundingClientRect().left;
            this.formsliderObj.Y = formslider.getBoundingClientRect().bottom;
            this.formsliderObj.width = formslider.offsetWidth;
            this.formsliderObj.height = formslider.offsetHeight;
            this.formsliderObj.isRange = formslider.getAttribute('data-range');
            this.formsliderObj.isVertical = formslider.getAttribute('data-vertical') === 'true' || false;
            this.formsliderObj.min = +formslider.getAttribute('data-min');

            // dragable options
            this.dragElemObj.elem = elem;
            this.dragElemObj.X = elem.getBoundingClientRect().left;
            this.dragElemObj.Y = elem.getBoundingClientRect().bottom;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftY = this.dragElemObj.Y - clientY;
            this.dragElemObj.index = elem.getAttribute('data-index');
            this.dragElemObj.width = elem.offsetWidth;
            this.dragElemObj.height = elem.offsetHeight;
            elem.setAttribute('data-active', 'true');

            // one unit of value
            if (this.formsliderObj.isVertical) {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetHeight - elem.offsetHeight);
            } else {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetWidth - elem.offsetWidth);
            }

            this.oneValPerc = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / 100;

            // track
            this.track = formslider.querySelector('.formslider__track');

            // get parameters of slider
            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="1"]');

                    this.edge.L = 0;

                    this.edge.R = siblElem.getBoundingClientRect().left - this.formsliderObj.X - siblElem.offsetWidth;
                } else if (this.dragElemObj.index == 1) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="0"]');

                    this.edge.L = siblElem.getBoundingClientRect().left - this.formsliderObj.X + siblElem.offsetWidth;

                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }
            } else {
                this.edge.L = 0;

                if (this.formsliderObj.isVertical) {
                    this.edge.R = this.formsliderObj.height - elem.offsetHeight;
                } else {
                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }
            }

            this.input = document.getElementById(elem.getAttribute('data-input'));
        },

        // on mouse move
        mouseMove: function mouseMove(e) {
            if (!this.dragElemObj.elem) {
                return;
            }

            e.preventDefault();

            var clientX = e.type == 'touchmove' ? e.targetTouches[0].clientX : e.clientX,
                clientY = e.type == 'touchmove' ? e.targetTouches[0].clientY : e.clientY;

            var dragElemDistance = 0;

            if (this.formsliderObj.isVertical) {
                dragElemDistance = this.formsliderObj.Y - clientY - this.dragElemObj.shiftY;
            } else {
                dragElemDistance = clientX - this.dragElemObj.shiftX - this.formsliderObj.X;
            }

            if (dragElemDistance < this.edge.L) {
                dragElemDistance = this.edge.L;
            } else if (dragElemDistance > this.edge.R) {
                dragElemDistance = this.edge.R;
            }

            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {
                    this.track.style.left = dragElemDistance + 5 + 'px';
                } else if (this.dragElemObj.index == 1) {
                    this.track.style.right = this.formsliderObj.width - dragElemDistance - 5 + 'px';
                }
            } else {
                if (this.formsliderObj.isVertical) {
                    this.track.style.height = dragElemDistance + 5 + 'px';
                } else {
                    this.track.style.width = dragElemDistance + 5 + 'px';
                }
            }

            if (this.formsliderObj.isVertical) {
                this.dragElemObj.elem.style.bottom = dragElemDistance + 'px';
            } else {
                this.dragElemObj.elem.style.left = dragElemDistance + 'px';
            }

            this.dragElemDistance = dragElemDistance;

            this.setInputVal();
        },

        // end drag
        mouseUp: function mouseUp() {
            document.removeEventListener('mousemove', this.mM);
            document.removeEventListener('touchmove', this.mM);

            document.removeEventListener('mouseup', this.mU);
            document.removeEventListener('touchend', this.mU);

            this.setInputVal();

            this.dragElemObj.elem.setAttribute('data-active', 'false');

            this.dragEndSubscribers.forEach(function (item) {
                item();
            });

            // reset properties
            this.dragElemObj = {};
            this.formsliderObj = {};
            this.track = null;
            this.edge = {};
            this.input = null;
            this.valUnit = 0;
            this.dragElemDistance = 0;
        },

        onDrag: function onDrag(fun) {
            if (typeof fun === 'function') {
                this.dragSubscribers.push(fun);
            }
        },

        onDragEnd: function onDragEnd(fun) {
            if (typeof fun === 'function') {
                this.dragEndSubscribers.push(fun);
            }
        },

        // set hidden input value
        setInputVal: function setInputVal() {
            var _this = this;

            var val = void 0;

            if (this.formsliderObj.isRange) {
                if (this.dragElemObj.index == 0) {
                    val = Math.round(this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100) * this.oneValPerc);
                } else {
                    val = Math.round((this.dragElemDistance - this.dragElemObj.width) / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100) * this.oneValPerc);
                }
            } else {
                if (this.formsliderObj.isVertical) {
                    val = Math.round(this.dragElemDistance / ((this.formsliderObj.height - this.dragElemObj.height) / 100) * this.oneValPerc);
                } else {
                    val = Math.round(this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width) / 100) * this.oneValPerc);
                }
            }

            var inpVal = val + this.formsliderObj.min,
                labelVal = val + this.formsliderObj.min;

            var formatId = this.input.getAttribute('data-format');

            if (formatId !== null && this.formaters[formatId]) {
                inpVal = this.formaters[formatId](inpVal);
            }

            this.input.value = inpVal;

            if (this.dragSubscribers.length) {
                this.dragSubscribers.forEach(function (item) {
                    item(_this.input, inpVal);
                });
            }

            var labelId = this.input.getAttribute('data-label-id');

            if (labelId) {
                var labelEl = document.getElementById(labelId),
                    _formatId = labelEl.getAttribute('data-format');

                if (_formatId !== null && this.formaters[_formatId]) {
                    labelVal = this.formaters[_formatId](labelVal);
                }

                labelEl.innerHTML = labelVal;
            }
        },

        format: function format(id, fun) {
            this.formaters[id] = fun;
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        FormSlider.init();

        window.addEventListener('winResized', function () {
            FormSlider.reInit();
        });
    });
})();
;var AutoComplete;

(function () {
    'use strict';

    AutoComplete = {
        fieldElem: null,
        inputElem: null,
        optionsElem: null,
        setValues: null,
        opt: {},
        onSelectSubscribers: [],

        open: function open(optH) {
            var _this = this;

            this.fieldElem.classList.add('autocomplete_opened');

            var optionsHeight = optH || 185;

            this.optionsElem.style.height = optionsHeight + 2 + 'px';
            this.optionsElem.scrollTop = 0;

            setTimeout(function () {
                _this.optionsElem.classList.add('ovfauto');
            }, 550);
        },

        close: function close(inputElem) {
            var inpElem = inputElem || this.inputElem,
                fieldElem = inpElem.closest('.autocomplete'),
                optionsElem = fieldElem.querySelector('.autocomplete__options');

            fieldElem.classList.remove('autocomplete_opened');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;
        },

        searchValue: function searchValue() {
            var _this2 = this;

            if (!this.setValues) return;

            var permOpened = this.inputElem.getAttribute('data-perm-opened') === 'true';

            var values = '';

            if (this.inputElem.value.length) {
                var preReg = new RegExp('(' + this.inputElem.value.replace(/(\(|\))/g, '\\$1') + ')', 'i');

                this.setValues(this.inputElem, function (valuesData, nameKey, valKey, secValKey) {
                    var searchMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

                    if (valuesData) {
                        for (var i = 0; i < valuesData.length; i++) {
                            var valData = valuesData[i];

                            if (!permOpened) {
                                if (nameKey !== undefined) {
                                    if (valData[nameKey].match(preReg) || !searchMode) {
                                        values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        _this2.optionsElem.innerHTML = '';
                                        _this2.close();
                                    }
                                } else {
                                    if (valData.match(preReg)) {
                                        values += '<li><button type="button" class="autocomplete__val">' + valData.replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        _this2.optionsElem.innerHTML = '';
                                        _this2.close();
                                    }
                                }
                            } else {
                                values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                            }
                        }
                    }

                    if (values == '') {
                        if (!valuesData || !valuesData.length) {
                            values = '<li class="autocomplete__options-empty">' + _this2.inputElem.getAttribute('data-empty-text') + '</li>';

                            _this2.optionsElem.innerHTML = values;

                            _this2.open(_this2.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
                        } else if (_this2.inputElem.hasAttribute('data-other-value')) {
                            values = '<li class="autocomplete__options-other"><button type="button" class="autocomplete__val">' + _this2.inputElem.getAttribute('data-other-value') + '</button></li>';

                            _this2.optionsElem.innerHTML = values;

                            _this2.open(_this2.optionsElem.querySelector('.autocomplete__options-other').offsetHeight);
                        } else if (_this2.inputElem.hasAttribute('data-nf-text')) {
                            values = '<li class="autocomplete__options-empty">' + _this2.inputElem.getAttribute('data-nf-text') + '</li>';

                            _this2.optionsElem.innerHTML = values;

                            _this2.open(_this2.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
                        }
                    } else {
                        _this2.optionsElem.innerHTML = values;
                        _this2.open();
                    }
                });
            } else {
                if (this.opt.getAllValuesIfEmpty) {
                    this.setValues(this.inputElem, function (valuesData, nameKey, valKey, secValKey) {
                        if (valuesData) {
                            for (var i = 0; i < valuesData.length; i++) {
                                var valData = valuesData[i];

                                if (nameKey !== undefined) {
                                    values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                                } else {
                                    values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                                }
                            }

                            _this2.optionsElem.innerHTML = values;
                            _this2.open();
                        }
                    });
                } else {
                    this.optionsElem.innerHTML = '';
                    this.close();
                }
            }
        },

        selectVal: function selectVal(itemElem, ev) {
            var _this3 = this;

            var valueElem = itemElem.querySelector('.autocomplete__val');

            if (!valueElem) {
                return;
            }

            if (window.Placeholder) {
                Placeholder.hide(this.inputElem, true);
            }

            var inpVal = valueElem.innerHTML.replace(/<\/?span>/g, '');

            this.inputElem.value = inpVal;

            if (ev == 'click' || ev == 'enter') {
                this.onSelectSubscribers.forEach(function (item) {
                    item(_this3.inputElem, inpVal, valueElem.getAttribute('data-value'), valueElem.getAttribute('data-second-value'));
                });
            }
        },

        onSelect: function onSelect(fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        keybinding: function keybinding(e) {
            var key = e.which || e.keyCode || 0;

            if (key != 40 && key != 38 && key != 13) return;

            e.preventDefault();

            var optionsElem = this.optionsElem,
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
                        this.selectVal(hoverItem, 'enter');

                        this.inputElem.blur();
                    }
            }
        },

        init: function init(options) {
            var _this4 = this;

            options = options || {};

            this.opt.getAllValuesIfEmpty = options.getAllValuesIfEmpty !== undefined ? options.getAllValuesIfEmpty : true;

            var acElems = document.querySelectorAll('.autocomplete');

            var _loop = function _loop(i) {
                var acEl = acElems[i],
                    inputElem = acEl.querySelector('.autocomplete__input');

                _this4.setValues(inputElem, function (valuesData, nameKey, valKey, secValKey, permOpened) {
                    if (!permOpened) return;

                    inputElem.setAttribute('data-perm-opened', true);

                    var optionsElem = acEl.querySelector('.autocomplete__options');

                    var values = '';

                    for (var _i = 0; _i < valuesData.length; _i++) {
                        var valData = valuesData[_i];

                        if (nameKey !== undefined) {
                            values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                        } else {
                            values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                        }
                    }

                    optionsElem.innerHTML = values;
                });
            };

            for (var i = 0; i < acElems.length; i++) {
                _loop(i);
            }

            // focus event
            document.addEventListener('focus', function (e) {
                var elem = e.target.closest('.autocomplete__input');

                if (!elem) return;

                _this4.fieldElem = elem.closest('.autocomplete');
                _this4.inputElem = elem;
                _this4.optionsElem = _this4.fieldElem.querySelector('.autocomplete__options');

                _this4.searchValue();
            }, true);

            // blur event
            document.addEventListener('blur', function (e) {
                var inpElem = e.target.closest('.autocomplete__input');

                if (inpElem) {
                    setTimeout(function () {
                        _this4.close(inpElem);
                    }, 321);
                }
            }, true);

            // input event
            document.addEventListener('input', function (e) {
                if (e.target.closest('.autocomplete__input')) {
                    _this4.searchValue();
                }
            });

            // click event
            document.addEventListener('click', function (e) {
                var valElem = e.target.closest('.autocomplete__val'),
                    arrElem = e.target.closest('.autocomplete__arr');

                if (valElem) {
                    _this4.inputElem = valElem.closest('.autocomplete').querySelector('.autocomplete__input');

                    _this4.selectVal(valElem.parentElement, 'click');
                } else if (arrElem) {
                    if (!arrElem.closest('.autocomplete_opened')) {
                        arrElem.closest('.autocomplete').querySelector('.autocomplete__input').focus();
                    } else {
                        _this4.close();
                    }
                }
            });

            // keyboard events
            document.addEventListener('keydown', function (e) {
                if (e.target.closest('.autocomplete_opened')) {
                    _this4.keybinding(e);
                }
            });
        }
    };
})();
;var CustomFile;

(function () {
    'use strict';

    //custom file

    CustomFile = {
        input: null,
        filesObj: {},
        filesArrayObj: {},
        filesIsReady: null,

        init: function init() {
            var _this = this;

            document.addEventListener('change', function (e) {
                var elem = e.target.closest('input[type="file"]');

                if (!elem) return;

                _this.input = elem;

                _this.changeInput(elem);
            });

            document.addEventListener('click', function (e) {
                var delBtnElem = e.target.closest('.custom-file__del-btn'),
                    clearBtnElem = e.target.closest('.custom-file__clear-btn'),
                    inputElem = e.target.closest('input[type="file"]');

                if (inputElem && inputElem.multiple) inputElem.value = null;

                if (delBtnElem) {
                    _this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    _this.input.value = null;

                    delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));

                    _this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));

                    if (_this.filesDeleted) _this.filesDeleted(_this.input);
                }

                if (clearBtnElem) {
                    var _inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    _inputElem.value = null;

                    _this.clear(_inputElem);
                }
            });
        },

        clear: function clear(inpEl, resetVal) {
            if (inpEl.hasAttribute('data-preview-elem')) {
                document.querySelector(inpEl.getAttribute('data-preview-elem')).innerHTML = '';
            }

            var itemsEl = inpEl.closest('.custom-file').querySelector('.custom-file__items');

            if (itemsEl) {
                itemsEl.innerHTML = '';
            }

            if (resetVal !== false) inpEl.value = null;

            this.filesObj[inpEl.id] = {};
            this.filesArrayObj[inpEl.id] = [];

            this.labelText(inpEl);
        },

        fieldClass: function fieldClass(inputElem) {
            var fieldElem = inputElem.closest('.custom-file');

            if (this.filesArrayObj[inputElem.id].length) {
                fieldElem.classList.add('custom-file_loaded');

                if (this.filesArrayObj[inputElem.id].length >= +inputElem.getAttribute('data-max-files')) {
                    fieldElem.classList.add('custom-file_max-loaded');
                } else {
                    fieldElem.classList.remove('custom-file_max-loaded');
                }
            } else {
                fieldElem.classList.remove('custom-file_loaded');
                fieldElem.classList.remove('custom-file_max-loaded');
            }
        },

        lockUpload: function lockUpload(inputElem) {
            if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= +inputElem.getAttribute('data-max-files')) {
                inputElem.setAttribute('disabled', 'disable');
            } else {
                inputElem.removeAttribute('disabled');
            }
        },

        labelText: function labelText(inputElem) {
            var labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');

            if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) {
                return;
            }

            var maxFiles = inputElem.multiple ? +this.input.getAttribute('data-max-files') : 1;

            if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
                if (!labTxtElem.hasAttribute('data-label-text')) {
                    labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
                }

                if (labTxtElem.getAttribute('data-label-text-2') == '%filename%') {
                    labTxtElem.innerHTML = inputElem.files[0].name;
                } else {
                    labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
                }
            } else if (labTxtElem.hasAttribute('data-label-text')) {
                labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
            }
        },

        loadPreview: function loadPreview(file, fileItem) {
            var reader = new FileReader(),
                previewDiv;

            if (this.input.hasAttribute('data-preview-elem')) {
                previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
            } else {
                previewDiv = document.createElement('div');

                previewDiv.className = 'custom-file__preview';

                fileItem.insertBefore(previewDiv, fileItem.firstChild);
            }

            reader.onload = function (e) {
                setTimeout(function () {
                    var imgDiv = document.createElement('div');

                    imgDiv.innerHTML = file.type.match(/image.*/) ? '<img src="' + e.target.result + '">' : '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg==">';

                    previewDiv.appendChild(imgDiv);

                    previewDiv.classList.add('custom-file__preview_loaded');
                }, 121);
            };

            reader.readAsDataURL(file);
        },

        changeInput: function changeInput(elem) {
            var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');

            if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
                this.clear(elem, false);
            }

            for (var i = 0; i < elem.files.length; i++) {
                var file = elem.files[i];

                if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;

                var fileItem = document.createElement('div');

                fileItem.className = 'custom-file__item';
                fileItem.innerHTML = '<div class="custom-file__name">' + file.name + '</div><button type="button" class="custom-file__del-btn" data-ind="' + file.name + '"></button>';

                if (fileItems) {
                    fileItems.appendChild(fileItem);
                }

                this.loadPreview(file, fileItem);
            }

            this.setFilesObj(elem.files);

            if (this.filesIsReady) {
                this.filesIsReady(elem);
            }
        },

        setFilesObj: function setFilesObj(filesList, objKey) {
            var inputElem = this.input;

            if (!inputElem.id.length) {
                inputElem.id = 'custom-file-input-' + new Date().valueOf();
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

        inputFiles: function inputFiles(inputElem) {
            return this.filesArrayObj[inputElem.id] || [];
        },

        getFiles: function getFiles(formElem) {
            var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
                filesArr = [];

            if (inputFileElements.length == 1) {
                filesArr = this.filesArrayObj[inputFileElements[0].id];
            } else {
                for (var i = 0; i < inputFileElements.length; i++) {
                    if (this.filesArrayObj[inputFileElements[i].id]) {
                        filesArr.push({ name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id] });
                    }
                }
            }

            return filesArr;
        }
    };

    //init script
    document.addEventListener('DOMContentLoaded', function () {
        CustomFile.init();
    });
})();
;var Placeholder;

(function () {
    'use strict';

    Placeholder = {
        elementsStr: null,

        init: function init(elementsStr) {
            var elements = document.querySelectorAll(elementsStr);

            if (!elements.length) {
                return;
            }

            this.elementsStr = elementsStr;

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i];

                if (elem.placeholder) {

                    var elemFor = elem.id ? elem.id : 'placeholder-index-' + i,
                        label = document.createElement('label');

                    label.htmlFor = elemFor;
                    label.className = 'placeholder';
                    label.innerHTML = elem.placeholder;

                    if (elem.hasAttribute('data-hide-placeholder')) {
                        label.setAttribute('data-hide-placeholder', elem.getAttribute('data-hide-placeholder'));
                    }

                    elem.parentElement.insertBefore(label, elem);

                    elem.removeAttribute('placeholder');
                    elem.removeAttribute('data-hide-placeholder');

                    if (!elem.id) {
                        elem.id = elemFor;
                    }
                }

                if (elem.value.length) {
                    this.hide(elem, true);
                }
            }

            //events
            document.removeEventListener('input', this.iH);
            document.removeEventListener('focus', this.fH, true);
            document.removeEventListener('blur', this.bH, true);

            this.iH = this.iH.bind(this);
            this.fH = this.fH.bind(this);
            this.bH = this.bH.bind(this);

            document.addEventListener('input', this.iH);
            document.addEventListener('focus', this.fH, true);
            document.addEventListener('blur', this.bH, true);
        },

        iH: function iH(e) {
            var elem = e.target.closest(this.elementsStr);

            if (!elem) return;

            if (elem.value.length > 0) {
                this.hide(elem, true, 'input');
            } else {
                this.hide(elem, false, 'input');
            }
        },

        fH: function fH(e) {
            var elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, true, 'focus');
            }
        },

        bH: function bH(e) {
            var elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, false);
            }
        },

        hide: function hide(elem, _hide, ev) {
            var label = document.querySelector('label.placeholder[for="' + elem.id + '"]');

            if (!label) {
                return;
            }

            if (_hide) {
                if (ev == 'focus' && label.getAttribute('data-hide-placeholder') == 'input') return;

                label.style.display = 'none';
            } else if (!elem.value.length) {
                label.style.display = '';
            }
        },

        reInit: function reInit() {
            this.init(this.elementsStr);
        }
    };
})();
var Maskinput;

(function () {
    'use strict';

    Maskinput = function Maskinput(inputSel, type, opt) {
        var _this = this;

        opt = opt || {};

        var defValue = '';

        this.inputElem = null;

        document.addEventListener('input', function (e) {
            var inpEl = e.target.closest(inputSel);

            if (inpEl) {
                _this.inputElem = inpEl;

                try {
                    _this[type]();
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        });

        document.addEventListener('focus', function (e) {
            var inpEl = e.target.closest(inputSel);

            if (inpEl) {
                _this.inputElem = inpEl;

                defValue = inpEl.value;

                try {
                    _this[type]('focus');
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        }, true);

        this.tel = function (ev) {
            if (ev == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+7(';
            }

            if (!/[\+\d\(\)\-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
                    cursPos = this.inputElem.selectionStart;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function (str, p1, p2, p3, p4) {
                        var res = '';

                        if (p4 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3 + '-' + p4;
                        } else if (p3 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3;
                        } else if (p2 != '') {
                            res = '+7(' + p1 + ')' + p2;
                        } else if (p1 != '') {
                            res = '+7(' + p1;
                        }

                        return res;
                    });
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.date = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\.]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\.?(\d{0,2})\.?(\d{0,4})$/, function (str, p1, p2, p3) {
                        var res = void 0;

                        if (+p1[0] > 3 || Number(p1) > 31) return defValue;

                        if (p3 != '') {
                            res = p1 + '.' + p2 + '.' + p3;
                        } else if (p2 != '') {
                            if (+p2[0] > 1 || Number(p2) > 12) return defValue;

                            if (p2.length == 2) {
                                res = p1 + '.' + p2 + '.';
                            } else {
                                res = p1 + '.' + p2;
                            }
                        } else if (p1.length == 2) {
                            res = p1 + '.';
                        } else {
                            res = p1;
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\.\d{0,2}(\.\d{0,4})?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.time = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\:]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^\d{0,2}(\:\d{0,2})?$/;

                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\:?(\d{0,2})$/, function (str, p1, p2) {
                        var res = void 0;

                        if (p2 != '') {
                            if (+p2[0] > 5 || Number(p2) > 59) return defValue;

                            res = p1 + ':' + p2;
                        } else {
                            if (+p1[0] > 2 || Number(p1) > 23) return defValue;

                            res = p1;

                            if (p1.length == 2) res += ':';
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\:\d{0,2})?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.gmail = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/[@\w.-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^[\w.-]*(@gmail\.com)?$/;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^([\w.-]*)@(?:gmail\.com)?$/, '$1@gmail.com');
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.int = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else if (opt.maxValue && Number(this.inputElem.value) > Number(opt.maxValue)) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d*$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.float = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d?[\d.,]*?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };

        this.cyr = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[а-я\s]*$/i.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                defValue = this.inputElem.value;
            }
        };

        this.cardNumber = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\-]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})$/, function (str, p1, p2, p3, p4) {
                        var res = void 0;

                        if (p4 != '') {
                            res = p1 + '-' + p2 + '-' + p3 + '-' + p4;
                        } else if (p3 != '') {
                            res = p1 + '-' + p2 + '-' + p3;

                            if (p3.length == 4) res += '-';
                        } else if (p2 != '') {
                            res = p1 + '-' + p2;

                            if (p2.length == 4) res += '-';
                        } else {
                            res = p1;

                            if (p1.length == 4) res += '-';
                        }

                        return res;
                    });
                }

                if (!/^\d{0,4}(\-\d{0,4}(\-\d{0,4}(\-\d{0,4})?)?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        };
    };
})();
// NextFieldset.init(...params);

var NextFieldset;

(function () {
    'use strict';

    NextFieldset = {
        onChange: null,
        opt: {},

        next: function next(btnElem, fwd) {
            var currentFieldset = btnElem.closest('.fieldset__item');

            var nextFieldset = null;

            if (fwd) {
                if (this.opt.nextPending) {
                    var nextEl = currentFieldset.nextElementSibling;

                    if (!nextEl.classList.contains('pending')) {
                        while (nextEl && !nextEl.classList.contains('pending')) {
                            if (nextEl.nextElementSibling.classList.contains('pending')) {
                                nextFieldset = nextEl.nextElementSibling;
                            }

                            nextEl = nextEl.nextElementSibling;
                        }
                    } else {
                        nextFieldset = nextEl;
                    }
                } else {
                    nextFieldset = currentFieldset.nextElementSibling;
                }
            } else {
                nextFieldset = currentFieldset.previousElementSibling;
            }

            if (!nextFieldset) return;

            var goTo = fwd ? ValidateForm.validate(currentFieldset) : true;

            if (goTo) {
                currentFieldset.classList.add('fieldset__item_hidden');
                currentFieldset.classList.remove('pending');
                currentFieldset.classList.add('success');
                nextFieldset.classList.remove('fieldset__item_hidden');

                if (this.opt.focusInput) {
                    var inpEl = nextFieldset.querySelector('input[type="text"]');

                    if (inpEl) inpEl.focus();
                }

                $('html,body').stop().animate({
                    scrollTop: $(currentFieldset).closest('.fieldset').offset().top - $('.header').innerHeight() - 35
                }, 210);

                if (this.onChange) {
                    this.onChange(currentFieldset, nextFieldset);
                }
            }
        },

        /**
         * @param {string} nextBtnSelector
         * @param {string} prevBtnSelector
         * @param {object} options
         */
        init: function init(nextBtnSelector, prevBtnSelector, options) {
            var _this = this;

            var fsEls = document.querySelectorAll('.fieldset'),
                fsItemEls = document.querySelectorAll('.fieldset__item');

            for (var i = 0; i < fsItemEls.length; i++) {
                var itEl = fsItemEls[i];
                itEl.classList.add('pending');

                if (i > 0) {
                    itEl.classList.add('fieldset__item_hidden');
                }
            }

            for (var _i = 0; _i < fsEls.length; _i++) {
                var fEl = fsEls[_i];
                fEl.classList.add('initialized');
            }

            options = options || {};

            this.opt.nextPending = options.nextPending !== undefined ? options.nextPending : false;
            this.opt.focusInput = options.focusInput !== undefined ? options.focusInput : false;

            document.addEventListener('click', function (e) {
                var nextBtnElem = e.target.closest(nextBtnSelector),
                    prevBtnElem = e.target.closest(prevBtnSelector);

                if (nextBtnElem) {
                    _this.next(nextBtnElem, true);
                } else if (prevBtnElem) {
                    _this.next(prevBtnElem, false);
                }
            });
        }
    };
})();
(function () {
    'use strict';

    var Number = {
        contEl: null,
        inputEl: null,
        defValue: 0,

        init: function init() {
            var _this = this;

            document.addEventListener('click', function (e) {
                var btnEl = e.target.closest('.number__btn');

                if (btnEl) _this.clickHandler(btnEl);
            });

            document.addEventListener('input', function (e) {
                var inpEl = e.target.closest('.number__input');

                if (inpEl) _this.inputHandler(inpEl);
            });

            document.addEventListener('blur', function (e) {
                var inpEl = e.target.closest('.number__input');

                if (inpEl) _this.blurHandler(inpEl);
            }, true);
        },

        clickHandler: function clickHandler(btnEl) {
            this.contEl = btnEl.closest('.number');
            this.inputEl = this.contEl.querySelector('.number__input');

            var action = +btnEl.getAttribute('data-action');

            var val = void 0;

            if (action > 0) {
                val = +this.inputEl.value + 1;
            } else {
                val = +this.inputEl.value - 1;

                if (val < 0) {
                    val = 0;
                }
            }

            this.inputEl.value = val;
            this.defValue = val;
        },

        inputHandler: function inputHandler(inpEl) {
            this.inputEl = inpEl;

            if (!/^\d*$/.test(this.inputEl.value)) {
                this.inputEl.value = this.defValue;
            } else {
                if (/^0+$/.test(this.inputEl.value)) {
                    this.inputEl.value = 0;
                }

                this.defValue = this.inputEl.value;
            }
        },

        blurHandler: function blurHandler(inpEl) {
            this.inputEl = inpEl;

            if (!this.inputEl.value.length) {
                this.inputEl.value = 0;
                this.defValue = 0;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        Number.init();
    });
})();
var Form, DuplicateForm;

(function () {
    'use strict';

    // variable height textarea

    var varHeightTextarea = {
        setHeight: function setHeight(elem) {
            var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
                mirrorOutput = elem.value.replace(/\n/g, '<br>');

            mirror.innerHTML = mirrorOutput + '&nbsp;';
        },

        init: function init() {
            var _this = this;

            document.addEventListener('input', function (e) {
                var elem = e.target.closest('.var-height-textarea__textarea');

                if (!elem) {
                    return;
                }

                _this.setHeight(elem);
            });
        }
    };

    // form
    Form = {
        formSelector: null,
        onSubmitSubscribers: [],

        init: function init(formSelector) {
            if (!document.querySelector(formSelector)) return;

            this.formSelector = formSelector;

            initFormScripst();

            ValidateForm.init(formSelector);

            // submit event
            document.removeEventListener('submit', this.sH);

            this.sH = this.sH.bind(this);
            document.addEventListener('submit', this.sH);

            // keyboard event
            document.removeEventListener('keydown', this.kH);

            this.kH = this.kH.bind(this);
            document.addEventListener('keydown', this.kH);
        },

        sH: function sH(e) {
            var formElem = e.target.closest(this.formSelector);

            if (formElem) {
                this.submitForm(formElem, e);
            }
        },

        kH: function kH(e) {
            var formElem = e.target.closest(this.formSelector);

            if (!formElem) return;

            var key = e.code;

            if (e.target.closest('.fieldset__item') && key == 'Enter') {
                e.preventDefault();
                e.target.closest('.fieldset__item').querySelector('.js-next-fieldset-btn').click();
            } else if (e.ctrlKey && key == 'Enter') {
                e.preventDefault();
                this.submitForm(formElem, e);
            }
        },

        submitForm: function submitForm(formElem, e) {
            var _this2 = this;

            if (this.beforeSubmit) {
                this.beforeSubmit(formElem);
            }

            if (!ValidateForm.validate(formElem)) {
                if (e) e.preventDefault();

                var errFieldEl = formElem.querySelector('.field-error');

                if (errFieldEl.hasAttribute('data-error-index')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text-' + errFieldEl.getAttribute('data-error-index')));
                } else if (errFieldEl.hasAttribute('data-form-error-text')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text'));
                }

                return;
            }

            formElem.classList.add('form_sending');

            if (!this.onSubmitSubscribers.length) {
                formElem.submit();
                return;
            }

            var fReturn = void 0;

            this.onSubmitSubscribers.forEach(function (item) {
                fReturn = item(formElem, function (obj) {
                    obj = obj || {};

                    setTimeout(function () {
                        _this2.actSubmitBtn(obj.unlockSubmitButton, formElem);
                    }, 321);

                    formElem.classList.remove('form_sending');

                    if (obj.clearForm == true) {
                        _this2.clearForm(formElem);
                    }
                });
            });

            if (fReturn === true) {
                formElem.submit();
            } else {
                if (e) e.preventDefault();
                this.actSubmitBtn(false, formElem);
            }
        },

        onSubmit: function onSubmit(fun) {
            if (typeof fun === 'function') {
                this.onSubmitSubscribers.push(fun);
            }
        },

        clearForm: function clearForm(formElem) {
            var elements = formElem.querySelectorAll('input[type="text"], input[type="number"],input[type="tel"], input[type="password"], textarea');

            for (var _i = 0; _i < elements.length; _i++) {
                var elem = elements[_i];
                elem.value = '';

                if (window.Placeholder) {
                    Placeholder.hide(elem, false);
                }
            }

            var checkboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (var _i2 = 0; _i2 < checkboxEls.length; _i2++) {
                checkboxEls[_i2].checked = false;
            }

            if (window.Select) {
                Select.reset();
            }

            if (window.CustomFile) {
                var inpFileEls = formElem.querySelectorAll('.custom-file__input');

                for (var _i3 = 0; _i3 < inpFileEls.length; _i3++) {
                    CustomFile.clear(inpFileEls[_i3]);
                }
            }

            var textareaMirrors = formElem.querySelectorAll('.var-height-textarea__mirror');

            for (var i = 0; i < textareaMirrors.length; i++) {
                textareaMirrors[i].innerHTML = '';
            }
        },

        actSubmitBtn: function actSubmitBtn(state, formElem) {
            var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i];

                if (state) {
                    elem.removeAttribute('disabled');
                } else {
                    elem.setAttribute('disabled', 'disable');
                }
            }
        }
    };

    // bind labels
    function BindLabels(elementsStr) {
        var elements = document.querySelectorAll(elementsStr);

        for (var i = 0; i < elements.length; i++) {
            var elem = elements[i],
                label = elem.parentElement.querySelector('label'),
                forID = elem.hasAttribute('id') ? elem.id : 'keylabel-' + i;

            if (label && !label.hasAttribute('for')) {
                label.htmlFor = forID;
                elem.id = forID;
            }
        }
    }

    // duplicate form
    DuplicateForm = {
        add: function add(btnElem) {
            var modelElem = btnElem.hasAttribute('data-form-model') ? document.querySelector(btnElem.getAttribute('data-form-model')) : null,
                destElem = btnElem.hasAttribute('data-duplicated-dest') ? document.querySelector(btnElem.getAttribute('data-duplicated-dest')) : null;

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

            if (window.Select) Select.init('.custom-select');

            if (this.onChange) this.onChange();
        },

        remove: function remove(btnElem) {
            var duplElem = btnElem.closest('.duplicated');

            if (duplElem) {
                duplElem.innerHTML = '';
            }

            if (this.onChange) this.onChange();
        },

        init: function init(addBtnSelector, removeBtnSelector) {
            this.addBtnSelector = addBtnSelector;
            this.removeBtnSelector = removeBtnSelector;

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);
        },

        clickHandler: function clickHandler(e) {
            var addBtnElem = e.target.closest(this.addBtnSelector),
                removeBtnElem = e.target.closest(this.removeBtnSelector);

            if (addBtnElem) {
                this.add(addBtnElem);
            } else if (removeBtnElem) {
                this.remove(removeBtnElem);
            }
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
    function initFormScripst() {
        BindLabels('input[type="text"], input[type="number"], input[type="tel"], input[type="checkbox"], input[type="radio"]');
        if (window.Placeholder) Placeholder.init('input[type="text"], input[type="number"], input[type="tel"], input[type="password"], textarea');
        // SetTabindex('input[type="text"], input[type="password"], textarea');
        varHeightTextarea.init();
        DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
        if (window.Select) Select.init('.custom-select');
        if (window.Checkbox) Checkbox.init({ focusOnTarget: true });
    }
})();
/*
new Accord({
    btnSelector: '.accord__button',
    autoScrollOnViewport: 700, // def: false
    maxViewport: 1000, // def: false
    collapseSiblings: false // def: true
});
*/
var Accord;

(function () {
    'use strict';

    Accord = function Accord(options) {
        var _this = this;

        var opt = options || {};

        this.btnSel = opt.btnSelector;
        this.autoScroll = opt.autoScrollOnViewport || false;
        this.collapseSiblings = opt.collapseSiblings !== undefined ? opt.collapseSiblings : true;

        opt.maxViewport = opt.maxViewport || false;

        this.initialized = false;

        if (!this.initialized && document.querySelectorAll('.accord').length) {
            this.initialized = true;

            document.addEventListener('click', function (e) {
                var btnEl = e.target.closest(_this.btnSel);

                if (!btnEl || btnEl.closest('.accord_closed') || opt.maxViewport && window.innerWidth > opt.maxViewport) {
                    return;
                }

                e.preventDefault();

                _this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            var _this2 = this;

            var contentElem = elem.closest('.accord__item').querySelector('.accord__content');

            if (elem.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = '0';
                }, 21);

                elem.classList.remove('active');
            } else {
                var mainElem = elem.closest('.accord');

                if (this.collapseSiblings) {
                    (function () {
                        var allButtonElem = mainElem.querySelectorAll(_this2.btnSel),
                            allContentElem = mainElem.querySelectorAll('.accord__content');

                        for (var i = 0; i < allButtonElem.length; i++) {
                            if (allButtonElem[i] != elem) {
                                allButtonElem[i].classList.remove('active');
                            }
                        }

                        var _loop = function _loop(_i) {
                            if (allContentElem[_i] != contentElem) {
                                allContentElem[_i].style.height = allContentElem[_i].offsetHeight + 'px';

                                setTimeout(function () {
                                    allContentElem[_i].style.height = '0';
                                }, 21);
                            }
                        };

                        for (var _i = 0; _i < allContentElem.length; _i++) {
                            _loop(_i);
                        }
                    })();
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = 'auto';

                    if (_this2.autoScroll && window.innerWidth <= _this2.autoScroll) {
                        _this2.scroll(elem);
                    }
                }, 300);

                elem.classList.add('active');
            }
        };

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop().animate({ scrollTop: $(elem).offset().top - $('.header').innerHeight() - 5 }, 721);
            }, 21);
        };
    };
})();
/*
Ajax.init(Str button selector);

Ajax.success = function(response) {
    // code...
}
*/

;var Ajax;

(function () {
    "use strict";

    Ajax = {
        success: null,

        send: function send(elem) {
            ajax({
                url: elem.getAttribute('data-action'),
                send: elem.getAttribute('data-send'),
                success: function success(response) {
                    if (this.success) {
                        this.success(response);
                    }
                },
                error: function error(response) {}
            });
        },

        init: function init(elementStr) {
            var _this = this;

            document.addEventListener('click', function (e) {
                var elem = e.target.closest(elementStr);

                if (!elem) {
                    return;
                }

                e.preventDefault();

                _this.send(elem);
            });
        }
    };
})();
/*
call to init:
More.init(Str button selector[, transition ms]);
*/
var More;

(function () {
    'use strict';

    More = {
        speed: 500,

        init: function init(elementStr, speed) {
            var _this = this;

            if (speed) {
                this.speed = speed;
            }

            document.addEventListener('click', function (e) {
                var btnEl = e.target.closest(elementStr);

                if (!btnEl) {
                    return;
                }

                e.preventDefault();

                _this.toggle(btnEl);
            });
        },

        toggle: function toggle(btnEl) {
            var contentElem = btnEl.closest('.more').querySelector('.more__content');

            contentElem.style.transition = this.speed + 'ms';

            if (btnEl.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.overflow = 'hidden';

                    contentElem.style.height = contentElem.getAttribute('data-height') + 'px';

                    btnEl.classList.remove('active');

                    btnEl.closest('.more').classList.remove('more_toggled');

                    if (elem.closest('.more').getAttribute('data-scroll-after-collapse') !== 'false') {
                        $('html,body').stop().animate({ scrollTop: $(btnEl).attr('data-scroll-top') }, 210);
                    }
                }, 21);
            } else {
                btnEl.setAttribute('data-scroll-top', $(window).scrollTop());

                contentElem.setAttribute('data-height', contentElem.offsetHeight);

                contentElem.style.height = contentElem.scrollHeight + 'px';

                btnEl.classList.add('active');

                btnEl.closest('.more').classList.add('more_toggled');

                setTimeout(function () {
                    contentElem.style.height = 'auto';
                    contentElem.style.overflow = 'visible';
                }, this.speed);
            }

            setTimeout(function () {
                var btnTxt = btnEl.innerHTML;

                if (btnEl.hasAttribute('data-btn-text')) {
                    btnEl.innerHTML = btnEl.getAttribute('data-btn-text');

                    btnEl.setAttribute('data-btn-text', btnTxt);
                }
            }, this.speed / 2);
        }
    };
})();
/*
Tab.init({
    container: '.tab',
    button: '.tab__button',
    item: '.tab__item',
    hash: true, // default: false
    changeOnHover: true // default: false
});

Tab.onChange(function(btnElem) {
    // body
});
*/

var Tab;

(function () {
    'use strict';

    Tab = {
        options: null,
        onChangeSubscribers: [],
        changing: false,

        init: function init(options) {
            var _this = this;

            var contElements = document.querySelectorAll(options.container);

            if (!contElements.length) return;

            this.options = options;

            //init tabs
            for (var i = 0; i < contElements.length; i++) {
                var contElem = contElements[i],
                    btnElements = contElem.querySelectorAll(options.button),
                    tabItemElements = contElem.querySelectorAll(options.item);

                for (var _i = 0; _i < btnElements.length; _i++) {
                    btnElements[_i].setAttribute('data-index', _i);
                    tabItemElements[_i].setAttribute('data-index', _i);
                }

                btnElements[0].classList.add('active');
                tabItemElements[0].classList.add('active');

                var tabItemElemActive = contElem.querySelector(this.options.item + '.active');

                if (options.hash && window.location.hash) {
                    var btnElem = contElem.querySelector(options.button + '[href*="' + window.location.hash + '"]');

                    if (btnElem) {
                        this.change(btnElem, true);
                    } else {
                        tabItemElemActive.style.position = 'relative';
                    }
                } else {
                    tabItemElemActive.style.position = 'relative';
                }
            }

            //btn event
            if (options.changeOnHover) {
                document.addEventListener('mouseover', function (e) {
                    var btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    _this.change(btnElem);
                });
            } else {
                document.addEventListener('click', function (e) {
                    var btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    if (!_this.options.hash) {
                        e.preventDefault();
                    }

                    _this.change(btnElem);
                });
            }
        },

        onChange: function onChange(fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        },

        change: function change(btnElem, immly) {
            var _this2 = this;

            if (btnElem.classList.contains('active') && !immly || this.changing) {
                return;
            }

            this.changing = true;

            var contElem = btnElem.closest(this.options.container),
                btnElements = contElem.querySelectorAll(this.options.button),
                tabItemElements = contElem.querySelectorAll(this.options.item);

            //remove active state
            for (var i = 0; i < btnElements.length; i++) {
                btnElements[i].classList.remove('active');
            }

            if (!immly) {
                tabItemElements[0].parentElement.style.height = tabItemElements[0].parentElement.offsetHeight + 'px';
            }

            for (var _i2 = 0; _i2 < tabItemElements.length; _i2++) {
                tabItemElements[_i2].classList.remove('active');
                tabItemElements[_i2].style.position = '';
            }

            //get current tab item
            var tabItemElem = contElem.querySelector(this.options.item + '[data-index="' + btnElem.getAttribute('data-index') + '"]');

            //set active state
            tabItemElem.style.transition = immly ? '0s' : '.21s';
            tabItemElem.classList.add('active');

            btnElem.classList.add('active');

            //set height
            if (immly) {
                tabItemElem.style.position = 'relative';
                this.changing = false;
            } else {
                setTimeout(function () {
                    tabItemElem.parentElement.style.transition = 'height .5s';
                    tabItemElem.parentElement.style.height = tabItemElem.offsetHeight + 'px';

                    setTimeout(function () {
                        tabItemElem.parentElement.style.transition = '';
                        tabItemElem.parentElement.style.height = '';
                        tabItemElem.style.position = 'relative';

                        _this2.changing = false;
                    }, 500);
                }, 210);
            }

            // on change
            this.onChangeSubscribers.forEach(function (item) {
                item(btnElem);
            });
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

;var Alert;

(function () {
    'use strict';

    var alertIndex = 0;

    Alert = function Alert(opt) {
        opt = opt || {};

        opt.closeBtn = opt.closeBtn !== undefined ? opt.closeBtn : true;

        var alertId = 'alert-id-' + alertIndex++;

        if (opt.showOnce) {
            var hiddenAlert = window.localStorage.getItem('notShowAlert=' + alertId);

            if (hiddenAlert !== null && hiddenAlert === 'true') {
                return false;
            }
        }

        //add alert to DOM
        var alertElem = document.createElement('div');

        alertElem.className = 'alert';

        alertElem.id = alertId;

        alertElem.innerHTML = '<div></div>' + (opt.closeBtn ? '<button class="js-alert-close alert__close-btn"></button>' : '');

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
        };

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
    };
})();
/*
const tt = new ToolTip({
    btnSelector: '.js-tooltip',
    notHide: true, // def: false
    clickEvent: true, // def: false
    tipElClass: 'some-class', // def: null
    positionX: 'left' | 'right', // def: 'center'
    positionY: 'bottom', // def: 'top'
    fadeSpeed: 1500 // def: 1000
});

tt.beforeShow = function(btnEl, tooltipDivEl) {
    # code...
}

tt.onShow = function(btnEl, tooltipDivEl) {
    # code...
}

tt.onHide = function() {
    # code...
}
*/

var ToolTip;

(function () {
    'use strict';

    ToolTip = function ToolTip(options) {
        var _this = this;

        this.opt = options || {};

        this.tooltipDiv = null;
        this.tooltipClass = null;
        this.canBeHidden = false;
        this.position = {};
        this.onShow = null;
        this.mO = null;

        this.opt.notHide = this.opt.notHide !== undefined ? this.opt.notHide : false;
        this.opt.evClick = this.opt.clickEvent !== undefined ? this.opt.clickEvent : false;
        this.opt.tipElClass = this.opt.tipElClass !== undefined ? this.opt.tipElClass : null;
        this.opt.fadeSpeed = this.opt.fadeSpeed !== undefined ? this.opt.fadeSpeed : 1000;

        this.position.X = this.opt.positionX !== undefined ? this.opt.positionX : 'center';
        this.position.Y = this.opt.positionY !== undefined ? this.opt.positionY : 'top';

        var mouseOver = function mouseOver(e) {
            if (_this.canBeHidden) {
                if (!e.target.closest(_this.opt.btnSelector) && !e.target.closest('.tooltip')) {
                    _this.hide();

                    _this.canBeHidden = false;
                }
            } else {
                var elem = e.target.closest(_this.opt.btnSelector);

                if (elem) {
                    _this.show(elem);
                }
            }
        };

        var mouseClick = function mouseClick(e) {
            var elem = e.target.closest(_this.opt.btnSelector);

            if (elem) {
                e.preventDefault();

                _this.hide();

                _this.canBeHidden = false;

                _this.show(elem);
            }
        };

        if (document.ontouchstart !== undefined || this.opt.evClick) {
            document.addEventListener('click', mouseClick);
        } else {
            document.addEventListener('mouseover', mouseOver);

            document.addEventListener('click', function (e) {
                if (e.target.closest(_this.opt.btnSelector)) e.preventDefault();
            });
        }

        this.tooltipDiv = document.createElement('div');
        this.tooltipDiv.className = 'tooltip' + (this.opt.tipElClass ? ' ' + this.opt.tipElClass : '');

        document.body.appendChild(this.tooltipDiv);

        document.addEventListener('click', function (e) {
            var closeBtn = e.target.closest('.tooltip__close');

            if (closeBtn || _this.canBeHidden && !e.target.closest('.tooltip')) {
                _this.hide();
            }
        });
    };

    ToolTip.prototype.show = function (elem) {
        var _this2 = this;

        clearTimeout(this.hideTimeout);

        var html = elem.hasAttribute('data-tooltip') ? elem.getAttribute('data-tooltip').replace(/\[(\/?\w+)\]/gi, '<$1>') : '';

        if (this.opt.evClick) html += '<button type="button" class="tooltip__close"></button>';

        this.tooltipDiv.innerHTML = html;

        if (this.beforeShow) {
            this.beforeShow(elem, this.tooltipDiv);
        }

        this.tooltipClass = elem.getAttribute('data-tooltip-class');

        if (this.tooltipClass) {
            this.tooltipDiv.classList.add(this.tooltipClass);
        }

        var bubleStyle = this.tooltipDiv.style,
            elemRect = elem.getBoundingClientRect();

        var coordX = void 0,
            coordY = void 0,
            posX = this.position.X,
            posY = this.position.Y;

        if (elem.hasAttribute('data-tip-position-x')) {
            posX = elem.getAttribute('data-tip-position-x');
        }

        if (elem.hasAttribute('data-tip-position-y')) {
            posY = elem.getAttribute('data-tip-position-y');
        }

        if (posX == 'center') {
            coordX = elemRect.left + (elemRect.right - elemRect.left) / 2 - this.tooltipDiv.offsetWidth / 2;
        } else if (posX == 'left') {
            coordX = elemRect.left - this.tooltipDiv.offsetWidth;
        } else if (posX == 'right') {
            coordX = elemRect.right;
        }

        if (posY == 'top') {
            coordY = elemRect.top + window.pageYOffset - this.tooltipDiv.offsetHeight;
        } else if (posY == 'bottom') {
            coordY = elemRect.bottom + window.pageYOffset;
        }

        bubleStyle.left = coordX + 'px';
        bubleStyle.top = coordY + 'px';

        var tipElRect = this.tooltipDiv.getBoundingClientRect();

        if (tipElRect.top < 0) {
            bubleStyle.top = coordY - tipElRect.top + 'px';
        }

        if (this.onShow) {
            this.onShow(elem, this.tooltipDiv);
        }

        this.tooltipDiv.style.transition = 'opacity ' + this.opt.fadeSpeed + 'ms';
        this.tooltipDiv.style.opacity = '1';

        setTimeout(function () {
            _this2.canBeHidden = true;
        }, 21);

        this.mO = this.mouseOut.bind(this);

        if (document.ontouchstart !== undefined) {
            document.addEventListener('touchstart', this.mO);
        } else if (this.opt.evClick) {
            document.addEventListener('wheel', this.mO);
        }
    };

    ToolTip.prototype.hide = function () {
        var _this3 = this;

        if (this.opt.notHide) {
            return;
        }

        this.tooltipDiv.style.opacity = '0';

        this.hideTimeout = setTimeout(function () {
            _this3.tooltipDiv.removeAttribute('style');
            _this3.tooltipDiv.innerHTML = '';

            if (_this3.tooltipClass) {
                _this3.tooltipDiv.classList.remove(_this3.tooltipClass);

                _this3.tooltipClass = null;
            }

            if (_this3.onHide) {
                _this3.onHide();
            }
        }, this.opt.fadeSpeed);
    };

    ToolTip.prototype.mouseOut = function (e) {
        if (this.canBeHidden && !e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
            this.hide();

            this.canBeHidden = false;

            document.removeEventListener('touchstart', this.mO);
            document.removeEventListener('wheel', this.mO);
        }
    };
})();
/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function () {
    "use strict";

    Anchor = {
        duration: 1000,
        shift: 0,

        scroll: function scroll(anchorId, e) {
            var anchorSectionElem = document.getElementById(anchorId + '-anchor');

            if (!anchorSectionElem) {
                return;
            }

            if (e) {
                e.preventDefault();
            }

            var scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
                ownShift = +anchorSectionElem.getAttribute('data-shift') || 0;

            if (window.innerWidth < 1000 && anchorSectionElem.hasAttribute('data-sm-shift')) {
                ownShift = +anchorSectionElem.getAttribute('data-sm-shift');
            }

            scrollTo = scrollTo - this.shift - ownShift;

            animate(function (progress) {
                window.scrollTo(0, scrollTo * progress + (1 - progress) * window.pageYOffset);
            }, this.duration, 'easeInOutQuad');
        },

        init: function init(elementStr, duration, shift) {
            var _this = this;

            if (duration) {
                this.duration = duration;
            }

            if (shift) {
                this.shift = shift;
            }

            //click anchor
            document.addEventListener('click', function (e) {
                var elem = e.target.closest(elementStr);

                if (elem) {
                    var anchId = elem.hasAttribute('href') ? elem.getAttribute('href').split('#')[1] : elem.getAttribute('data-anchor-id');

                    _this.scroll(anchId, e);
                }
            });

            //hash anchor
            if (window.location.hash) {
                window.addEventListener('load', function () {
                    _this.scroll(window.location.hash.split('#')[1]);
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

;var Diagram;

(function () {
    'use strict';

    Diagram = function Diagram(options) {
        var _this2 = this;

        var canvasElement = document.getElementById(options.canvasId);

        this.animate = function (duration) {
            var _this = this;

            if (!canvasElement) {
                return;
            }

            var chartValues = options.charts.map(function (obj) {
                return obj.value;
            });

            animate(function (progress) {
                _this.ctx.clearRect(0, 0, _this.center.x * 2, _this.center.y * 2);
                _this.prevChartsWidth = 0;

                options.charts.forEach(function (chart, i) {
                    chart.value = chartValues[i] * progress;

                    drawChart(chart, i);
                });
            }, duration, 'easeInOutQuad');
        };

        if (!canvasElement) {
            return;
        }

        canvasElement.width = canvasElement.offsetWidth;
        canvasElement.height = canvasElement.offsetHeight;

        this.ctx = canvasElement.getContext('2d');
        this.canvasWidth = canvasElement.width;
        this.center = { x: canvasElement.width / 2, y: canvasElement.height / 2 };
        this.prevChartsWidth = 0;

        var startAngle = 1.5 * Math.PI;

        var drawChart = function drawChart(chart, i) {
            var endAngle = 2 * Math.PI * chart.value / options.maxValue + startAngle,
                radius = _this2.canvasWidth / 2 - chart.width / 2 - (chart.offset || 0) - _this2.prevChartsWidth;

            _this2.prevChartsWidth += chart.width + (chart.offset || 0);

            _this2.ctx.beginPath();
            _this2.ctx.arc(_this2.center.x, _this2.center.y, radius, startAngle, endAngle);
            _this2.ctx.lineWidth = chart.width;
            _this2.ctx.strokeStyle = chart.color;
            _this2.ctx.stroke();

            outputNum(chart);
        };

        if (!options.animate) {
            options.charts.forEach(function (chart, i) {
                drawChart(chart, i);
            });
        }

        function outputNum(chart) {
            var numElem = document.getElementById(chart.numContId);

            if (numElem) {
                numElem.innerHTML = chart.value.toFixed(0);
            }
        }
    };
})();
var Numberspin;

(function () {
	'use strict';

	Numberspin = function Numberspin(options) {
		var opt = options || {};

		this.elements = document.querySelectorAll(opt.elemSelectors);
		this.values = [];

		for (var i = 0; i < this.elements.length; i++) {
			this.values[i] = +this.elements[i].getAttribute('data-value');
			this.elements[i].innerHTML = 0;
		}

		function draw(elem, num) {
			if (opt.format) {
				var numStr = String(num);

				elem.innerHTML = numStr.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
			} else {
				elem.innerHTML = num;
			}
		}

		this.animate = function (duration) {
			var _this = this;

			animate(function (progress) {
				for (var i = 0; i < _this.elements.length; i++) {
					var num = Math.round(_this.values[i] * progress);

					if (num < 0) {
						num = 0;
					}

					draw(_this.elements[i], num);
				}
			}, duration);
		};
	};
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

;var Share;

;(function () {
	'use strict';

	Share = {
		network: function network(elem) {
			var net = elem.getAttribute('data-network');

			if (!net) {
				return;
			}

			var encodedHref = elem.hasAttribute('data-share-url') ? encodeURIComponent(elem.getAttribute('data-share-url')) : encodeURIComponent(window.location.href),
			    encodedImageUrl = elem.hasAttribute('data-share-img') ? encodeURIComponent(elem.getAttribute('data-share-img')) : null,
			    title = elem.hasAttribute('data-share-tit') ? encodeURIComponent(elem.getAttribute('data-share-tit')) : null,
			    url = void 0;

			switch (net) {
				case 'vk':
					url = 'https://vk.com/share.php?url=' + encodedHref + (encodedImageUrl ? '&image=' + encodedImageUrl : '') + (title ? '&title=' + title : '');
					break;

				case 'fb':
					url = 'https://www.facebook.com/sharer.php?u=' + encodedHref;
					break;

				case 'tw':
					url = 'http://twitter.com/share?url=' + encodedHref + (title ? '&text=' + title : '');
					break;

				case 'ok':
					url = 'https://connect.ok.ru/offer?url=' + encodedHref + (encodedImageUrl ? '&imageUrl=' + encodedImageUrl : '') + (title ? '&title=' + title : '');
					break;

				case 'tg':
					url = 'https://telegram.me/share/url?url=' + encodedHref;
					break;
			}

			this.popup(url);
		},

		popup: function popup(url) {
			window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
		},

		init: function init(elementStr) {
			var _this = this;

			document.addEventListener('click', function (e) {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				_this.network(elem);
			});
		}
	};
})();
/* 
var timer = new Timer({
    elemId: 'timer', // Str element id,
    format: 'extended', // default - false
    stopwatch: true, // default - false
    continue: false // default - false
});

timer.onStop = function () {
	
}

timer.start(Int interval in seconds);
*/

;var Timer, numToWord;

(function () {
    'use strict';

    numToWord = function numToWord(num, wordsArr) {
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
    };

    Timer = function Timer(options) {
        options = options || {};

        options.continue = options.continue !== undefined ? options.continue : false;

        this.opt = options;

        this.elem = document.getElementById(options.elemId);

        this.tickSubscribers = [];

        this.setCookie = function () {
            document.cookie = 'lastTimestampValue-' + options.elemId + '=' + Date.now() + '; expires=' + new Date(Date.now() + 259200000).toUTCString();
        };

        this.onTick = function (fun) {
            if (typeof fun === 'function') {
                this.tickSubscribers.push(fun);
            }
        };

        this.stop = function () {
            clearInterval(this.interval);

            if (this.onStop) {
                setTimeout(this.onStop);
            }
        };

        this.pause = function () {
            clearInterval(this.interval);
        };
    };

    Timer.prototype.output = function (time) {
        var day = time > 86400 ? Math.floor(time / 86400) : 0,
            hour = time > 3600 ? Math.floor(time / 3600) : 0,
            min = time > 60 ? Math.floor(time / 60) : 0,
            sec = time > 60 ? Math.round(time % 60) : time;

        if (hour > 24) {
            hour = hour % 24;
        }

        if (min > 60) {
            min = min % 60;
        }

        var timerOut = void 0;

        if (this.opt.format == 'extended') {
            var minTxt = numToWord(min, ['минуту', 'минуты', 'минут']),
                secTxt = numToWord(sec, ['секунду', 'секунды', 'секунд']);

            var minOut = min != 0 ? min + ' ' + minTxt : '',
                secNum = sec < 10 ? '0' + sec : sec;

            timerOut = (min ? min + ' ' + minTxt + ' ' : '') + '' + sec + ' ' + secTxt;
        } else {
            var minNum = min < 10 ? '0' + min : min,
                secNum = sec < 10 ? '0' + sec : sec;

            timerOut = minNum + ':' + secNum;
        }

        if (this.elem) {
            this.elem.innerHTML = timerOut;
        }

        if (this.tickSubscribers.length) {
            this.tickSubscribers.forEach(function (item) {
                item(time, { day: day, hour: hour, min: min, sec: sec });
            });
        }
    };

    Timer.prototype.start = function (startTime) {
        var _this = this;

        this.time = +startTime || 0;

        var lastTimestampValue = function (cookie) {
            if (_this.opt.continue) {
                return false;
            }

            if (cookie) {
                var reg = new RegExp('lastTimestampValue-' + _this.opt.elemId + '=(\\d+)', 'i'),
                    matchArr = cookie.match(reg);

                return matchArr ? matchArr[1] : null;
            }
        }(document.cookie);

        if (lastTimestampValue) {
            var delta = Math.round((Date.now() - lastTimestampValue) / 1000);

            if (this.opt.stopwatch) {
                this.time += delta;
            } else {
                if (this.time > delta) {
                    this.time -= delta;
                } else {
                    this.setCookie();
                }
            }
        } else if (this.opt.continue) {
            this.setCookie();
        }

        this.output(this.time);

        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(function () {
            if (_this.opt.stopwatch) {
                _this.time++;

                _this.output(_this.time);
            } else {
                _this.time--;

                if (_this.time <= 0) {
                    _this.stop();
                } else {
                    _this.output(_this.time);
                }
            }
        }, 1000);
    };
})();
;var GetContentAjax;

(function () {
    'use strict';

    GetContentAjax = function GetContentAjax(options) {
        var _this = this;

        if (!document.querySelector(options.eventBtn)) {
            return;
        }

        this.output = null;

        var getContent = function getContent(eventBtnElem) {
            var outputDivElem = document.querySelector(options.outputDiv);

            ajax({
                url: options.sourceFile,
                send: eventBtnElem.getAttribute('data-send'),
                success: function success(response) {
                    if (_this.output === null) {
                        outputDivElem.innerHTML = response;
                    } else {
                        outputDivElem.innerHTML = _this.output(response);
                    }
                },
                error: function error(response) {
                    console.log(response);
                }
            });
        };

        if (options.event == 'click') {
            document.addEventListener('click', function (e) {
                var eventBtnElem = e.target.closest(options.eventBtn);

                if (eventBtnElem) {
                    e.preventDefault();

                    getContent(eventBtnElem);
                }
            });
        }
    };
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
(function () {
   'use strict';

   // animate when is visible

   var animationOnVisible = {
      animElements: null,

      scroll: function scroll() {
         console.log('scr');
         console.log(this.animElements);
         var winBotEdge = window.pageYOffset + window.innerHeight;

         for (var i = 0; i < this.animElements.length; i++) {
            var animElem = this.animElements[i],
                animElemOffsetTop = animElem.getBoundingClientRect().top + window.pageYOffset,
                animElemOffsetBot = animElemOffsetTop + animElem.offsetHeight;

            if (animElemOffsetTop < winBotEdge && animElemOffsetBot > window.pageYOffset) {
               animElem.classList.add('animated');
            } else {
               animElem.classList.remove('animated');
            }
         }
      },

      init: function init() {
         var animElements = document.querySelectorAll('.js-animate');

         if (animElements.length) {
            this.animElements = animElements;

            this.scroll();
         }
      }
   };

   // document ready
   document.addEventListener('DOMContentLoaded', function () {
      animationOnVisible.init();

      if (animationOnVisible.animElements) {
         window.addEventListener('scroll', animationOnVisible.scroll.bind(animationOnVisible));
      }
   });

   // onload animate
   window.onload = function () {
      var animElems = document.querySelectorAll('.js-onload-animate');

      for (var i = 0; i < animElems.length; i++) {
         animElems[i].classList.add('animated');
      }
   };
})();


function FramesAnimate(elemId, options) {
    var _this2 = this;

    var contEl = document.getElementById(elemId);

    if (!contEl) return;

    var opt = options || {},
        count = +contEl.getAttribute('data-count'),
        path = contEl.getAttribute('data-path'),
        _this = this;

    opt.fps = opt.fps !== undefined ? opt.fps : 30;
    opt.autoplay = opt.autoplay !== undefined ? opt.autoplay : true;
    opt.backward = opt.backward !== undefined ? opt.backward : false;
    opt.infinite = opt.infinite !== undefined ? opt.infinite : true;

    this.opt = opt;
    this.contEl = contEl;
    this.loadedImages = [];
    this.fps = opt.fps;
    this.autoplay = opt.autoplay;
    this.infinite = opt.infinite;
    this.animated = false;
    this.onStop = null;
    this.onLoad = null;
    this.loaded = false;
    this.loadedImages = [];
    this.count = count;

    try {
        this.ctx = contEl.getContext('2d');
    } catch (error) {
        console.log(error, 'Elem Id: ' + elemId);
    }

    this.img = { W: 0, H: 0 };
    this.imgDims = { W: 0, H: 0 };
    this.viewportDims = { W: 0, H: 0, X: 0 };

    var init = function init() {
        _this2.contElWidth = contEl.offsetWidth;
        _this2.contElHeight = contEl.offsetHeight;

        contEl.width = _this2.contElWidth;
        contEl.height = _this2.contElHeight;

        _this2.imgDims.W = _this2.img.W / count;
        _this2.imgDims.H = _this2.img.H;

        _this2.viewportDims.W = _this2.contElHeight * _this2.imgDims.W / _this2.img.H;
        _this2.viewportDims.H = _this2.contElHeight;
        _this2.viewportDims.X = _this2.contElWidth / 2 - _this2.viewportDims.W / 2;
    };

    var imgEl = new Image();

    imgEl.onload = function () {
        _this.loadedImg = this;

        _this.img.W = this.width;
        _this.img.H = this.height;

        init();

        _this.loaded = true;

        if (_this.onLoad) {
            _this.onLoad();
        }

        if (_this.autoplay) {
            _this.play();
        }
    };

    imgEl.src = path;

    this.reInit = function () {
        if (this.loaded) init();
    };
}

FramesAnimate.prototype.animate = function (dir) {
    this.animated = true;

    var i = 0,
        back = false;

    if (dir == 'back') {
        back = true;
        i = this.count - 1;
    }

    var start = performance.now();

    requestAnimationFrame(function anim(time) {
        if (time - start > 1000 / this.fps) {
            this.ctx.clearRect(0, 0, this.contElWidth, this.contElHeight);

            var sx = this.imgDims.W * i;

            this.ctx.drawImage(this.loadedImg, sx, 0, this.imgDims.W, this.imgDims.H, this.viewportDims.X, 0, this.viewportDims.W, this.viewportDims.H);

            if (!this.infinite) {
                if (back && !i || !back && i == this.count - 1) {
                    this.stop();
                    return;
                }
            }

            if (this.opt.backward) {
                // if (i == this.count) {
                //     back = true;
                //     i = this.count - 1;
                // } else if (i < 0) {
                //     back = false;
                //     i = 0;
                // }
            } else {
                if (this.opt.infinite && !back && i == this.count - 1) {
                    i = -1;
                }
            }

            if (back) {
                i--;
            } else {
                i++;
            }

            start = time;
        }

        if (this.animated) requestAnimationFrame(anim.bind(this));
    }.bind(this));
};

FramesAnimate.prototype.play = function (dir) {
    if (this.loaded) {
        this.animate(dir);
    } else {
        setTimeout(this.play.bind(this), 121);
    }
};

FramesAnimate.prototype.stop = function () {
    this.autoplay = false;
    this.animated = false;

    if (this.onStop) {
        this.onStop();
    }
};
;var WEBGL;

(function () {
   WEBGL = {
      VSTxt: null,
      FSTxt: null,

      loadTxtRes: function loadTxtRes(url, successFun) {
         ajax({
            url: url,
            success: function success(response) {
               successFun(response);
            },
            error: function error(response) {}
         });
      },

      start: function start() {},

      init: function init() {
         var _this = this;

         this.loadTxtRes('/shaders/vertexShader.glsl', function (response) {
            _this.VSTxt = response;

            _this.loadTxtRes('/shaders/fragmentShader.glsl', function (response) {
               _this.FSTxt = response;

               _this.start();
            });
         });
      }
   };
})();
/**
 * @constructor
 * @this {Mouseparallax}
 * @param {string} elSel
 * @param {object} [options={}]
 * @param {number} [options.deltaX=21]
 * @param {number} [options.deltaY=21]
 * @param {object[]} [options.rangeX=[]]
 * @param {number} options.rangeX[]
 * @param {number} options.rangeX[]
 * @param {object[]} [options.rangeY=[]]
 * @param {number} options.rangeY[0]
 * @param {number} options.rangeY[1]
 */

function Mouseparallax(elSel, options) {
	var _ = this,
	    defaultOpt = {
		listener: document,
		deltaX: 21,
		deltaY: 21,
		rangeX: [],
		rangeY: []
	},
	    options = options || {},
	    opt = $.extend({}, defaultOpt, options),
	    startMousePos = { X: 0, Y: 0 },
	    listenerW = $(opt.listener).innerWidth(),
	    listenerH = $(opt.listener).innerHeight(),
	    cursorPos = { X: 0, Y: 0 },
	    direct = {},
	    elems = [];

	_.disabled = false;

	$(elSel).each(function () {
		var $el = $(this);

		elems.push({
			$el: $el,
			translateElement: { X: 0, Y: 0 },
			startElementPos: { X: 0, Y: 0 },
			deltaX: $el.attr('data-delta-x') !== undefined ? +$el.attr('data-delta-x') : opt.deltaX,
			deltaY: $el.attr('data-delta-y') !== undefined ? +$el.attr('data-delta-y') : opt.deltaY,
			rangeX: $el.attr('data-range-x') !== undefined ? $el.attr('data-range-x').split(',') : opt.rangeX,
			rangeY: $el.attr('data-range-y') !== undefined ? $el.attr('data-range-y').split(',') : opt.rangeY
		});
	});

	$(document).on('mouseenter', opt.listener, function (e) {
		if (_.disabled) return;

		startMousePos.X = e.clientX;
		startMousePos.Y = e.clientY;
	});

	$(opt.listener).on('mousemove', opt.listener, function (e) {
		if (_.disabled) return;

		if (e.clientX > cursorPos.X) {
			direct.X = 'right';
		} else {
			direct.X = 'left';
		}
		cursorPos.X = e.clientX;

		if (e.clientY > cursorPos.Y) {
			direct.Y = 'up';
		} else {
			direct.Y = 'down';
		}
		cursorPos.Y = e.clientY;

		var deltaMouse = {
			X: e.clientX - startMousePos.X,
			Y: e.clientY - startMousePos.Y
		};

		elems.forEach(function (el) {
			el.translateElement = {
				X: deltaMouse.X * (el.deltaX / listenerW) + el.startElementPos.X,
				Y: deltaMouse.Y * (el.deltaY / listenerH) + el.startElementPos.Y
			};

			if (el.startMousePosX) {
				el.translateElement.X = (e.clientX - el.startMousePosX) * (el.deltaX / listenerW) + el.startElementPos.X;
			}

			if (el.startMousePosY) {
				el.translateElement.Y = (e.clientY - el.startMousePosY) * (el.deltaY / listenerH) + el.startElementPos.Y;
			}

			var translateX = el.translateElement.X,
			    translateY = el.translateElement.Y;

			if (el.rangeX) {
				if (el.translateElement.X <= el.rangeX[0] * -1) {
					if (direct.X == 'left') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[0] * -1;
					}
					translateX = el.rangeX[0] * -1;
				} else if (el.translateElement.X >= el.rangeX[1]) {
					if (direct.X == 'right') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[1];
					}
					translateX = el.rangeX[1];
				}
			}

			if (el.rangeY) {
				if (el.translateElement.Y >= el.rangeY[1]) {
					if (direct.Y == 'down') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[1];
					}
					translateY = el.rangeY[1];
				} else if (el.translateElement.Y <= +el.rangeY[0] * -1) {
					if (direct.Y == 'up') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[0] * -1;
					}
					translateY = +el.rangeY[0] * -1;
				}
			}

			el.$el.css('transform', 'translate(' + translateX + 'px, ' + translateY + 'px)');
		});
	});

	$(document).on('mouseleave', opt.listener, function (e) {
		if (_.disabled) return;

		elems.forEach(function (el) {
			el.startElementPos.X = el.translateElement.X;
			el.startElementPos.Y = el.translateElement.Y;
			el.startMousePosX = null;
			el.startMousePosY = null;
		});
	});
}
// new Scrollbox('#hor-scroll');

;var Scrollbox;

(function () {
    'use strict';

    Scrollbox = function Scrollbox(elem, options) {
        var _this = this;

        var scrBoxEl = typeof elem === 'string' ? document.querySelector(elem) : elem;

        if (!scrBoxEl) {
            return;
        }

        // options
        var opt = options || {};

        opt.horizontal = opt.horizontal !== undefined ? opt.horizontal : false;

        if (opt.horizontal && !opt.vertical) {
            opt.vertical = false;
        } else {
            opt.vertical = true;
        }

        opt.scrollStep = opt.scrollStep !== undefined ? opt.scrollStep : false;
        opt.fullSizeStep = opt.fullSizeStep !== undefined ? opt.fullSizeStep : false;
        opt.childScrollboxesObjects = opt.childScrollboxesObjects !== undefined ? opt.childScrollboxesObjects : null;
        opt.nestedScrBoxSelector = opt.nestedScrBoxSelector !== undefined ? opt.nestedScrBoxSelector : null;
        opt.evListenerEl = opt.evListenerEl !== undefined ? opt.evListenerEl : null;
        opt.duration = opt.duration !== undefined ? opt.duration : 1000;
        opt.bar = opt.bar !== undefined ? opt.bar : false;
        opt.barSize = opt.barSize !== undefined ? opt.barSize : null;
        opt.drag = opt.drag !== undefined ? opt.drag : false;
        opt.mouseWheel = opt.mouseWheel !== undefined ? opt.mouseWheel : true;
        opt.actionPoints = opt.actionPoints !== undefined ? opt.actionPoints : [];
        opt.freezePoints = opt.freezePoints !== undefined ? opt.freezePoints : [];
        opt.windowScrollEvent = opt.windowScrollEvent !== undefined ? opt.windowScrollEvent : false;

        var winEl = scrBoxEl.querySelector('.scrollbox__window');
        var innerEl = scrBoxEl.querySelector('.scrollbox__inner'),
            wheelHandler = void 0,
            scrollHandler = void 0;

        if (innerEl && innerEl.parentElement !== winEl) {
            innerEl = null;
        }

        scrBoxEl.setAttribute('tabindex', '-1');

        var init = function init(cb) {
            _this.scrBoxEl = scrBoxEl;
            _this.winEl = winEl;
            _this.winSize = { X: 0, Y: 0 };
            _this.horizontal = opt.horizontal;
            _this.vertical = opt.vertical;
            _this.bar = opt.bar;
            _this.barSize = opt.barSize;
            _this.nestedScrBoxSelector = opt.nestedScrBoxSelector;
            _this.childScrollboxesObjects = opt.childScrollboxesObjects;
            _this.parentEl = null;
            _this.verticalBarSlEl = null;
            _this.horizontalBarSlEl = null;
            _this.verticalBarSlElSize = 0;
            _this.horizontalBarSlElSize = 0;
            _this.scrolled = { X: 0, Y: 0 };
            _this.isScrolling = false;
            _this.breakOnNested = false;
            _this.delta = 0;
            _this.initialized = false;
            _this.ts = Date.now();
            _this.params = null;
            _this.innerEl = innerEl || null;
            _this.innerSize = { X: null, Y: null };
            _this.endBreak = { X: null, Y: null };
            _this.scrollStep = opt.scrollStep;
            _this.actionElems = {};
            _this.actionPoints = opt.actionPoints;
            _this.freezePoints = opt.freezePoints;
            _this.mouseWheel = opt.mouseWheel;
            _this.windowScrollEvent = opt.windowScrollEvent;

            if (opt.horizontal) {
                scrBoxEl.classList.add('scrollbox_horizontal');

                setTimeout(function () {
                    if (_this.innerEl) {
                        var innerW = winEl.scrollWidth,
                            winW = winEl.offsetWidth;

                        if (innerW > winW) {
                            scrBoxEl.classList.add('srollbox_scrollable-horizontal');
                        }

                        _this.winSize.X = winW;
                        _this.innerSize.X = innerW;
                        _this.endBreak.X = innerW - winW;
                    }

                    _this.scrollBar(false, 'horizontal');
                }, 21);

                scrBoxEl.setAttribute('data-position-horizontal', 'atStart');
            }

            if (opt.vertical) {
                scrBoxEl.classList.add('scrollbox_vertical');

                setTimeout(function () {
                    var winH = winEl.offsetHeight;

                    var innerH = 0;

                    if (_this.innerEl) {
                        innerH = winEl.scrollHeight;
                    }

                    opt.actionPoints.forEach(function (pointItem) {
                        if (pointItem.breakpoints[1] >= innerH) {
                            innerH = pointItem.breakpoints[1];
                        }
                    });

                    if (innerH > winH) {
                        scrBoxEl.classList.add('srollbox_scrollable-vertical');

                        if (_this.mouseWheel && !_this.windowScrollEvent) {
                            scrBoxEl.addEventListener('wheel', wheelHandler);
                        }

                        if (_this.windowScrollEvent) {
                            window.addEventListener('scroll', scrollHandler);
                        }
                    }

                    _this.winSize.Y = winH;
                    _this.innerSize.Y = innerH;

                    if (_this.innerEl) {
                        _this.endBreak.Y = innerH - winH;
                    } else {
                        _this.endBreak.Y = innerH;
                    }

                    if (_this.windowScrollEvent) {
                        scrBoxEl.style.height = innerH + 'px';
                        scrBoxEl.style.minHeight = innerH + 'px';
                        scrBoxEl.style.maxHeight = innerH + 'px';
                    }

                    _this.scrollBar(false, 'vertical');
                }, 21);

                scrBoxEl.setAttribute('data-position-vertical', 'atStart');
            }

            if (_this.childScrollboxesObjects) {
                setTimeout(function () {
                    _this.childScrollboxesObjects.forEach(function (obj) {
                        _this.endBreak.X += obj.endBreak.X;
                        _this.endBreak.Y += obj.endBreak.Y;

                        if (_this.windowScrollEvent) {
                            scrBoxEl.style.height = _this.innerSize.Y + obj.endBreak.Y + 'px';
                            scrBoxEl.style.minHeight = _this.innerSize.Y + obj.endBreak.Y + 'px';
                            scrBoxEl.style.maxHeight = _this.innerSize.Y + obj.endBreak.Y + 'px';
                        }

                        obj.offset = {
                            Y: obj.scrBoxEl.getBoundingClientRect().top - winEl.getBoundingClientRect().top
                        };

                        obj.setOptions({ mouseWheel: false });
                    });
                }, 21);
            }

            var actionEls = winEl.querySelectorAll('[data-action-element]');

            for (var i = 0; i < actionEls.length; i++) {
                var actEl = actionEls[i];

                _this.actionElems[actEl.getAttribute('data-action-element')] = actEl;
            }

            if (opt.drag) {
                _this.drag();
            }

            setTimeout(function () {
                _this.initialized = true;

                if (cb) {
                    cb();
                }
            }, 21);
        };

        init();

        // scroll animation
        var scrollAnim = function scrollAnim(scrTo, ev, duration) {
            if (_this.isScrolling) {
                return;
            }

            _this.isScrolling = true;

            var scrolled = _this.scrolled;

            duration = duration !== undefined && duration !== null ? duration : opt.duration;

            if (duration == 0) {
                _this.scroll(scrTo, true, ev);
                _this.isScrolling = false;
                return;
            }

            if (_this.freezePoints.length && ev !== 'scrollTo') {
                var scr = scrTo.Y;

                _this.freezePoints.forEach(function (point) {
                    var from = point - Math.abs(_this.delta / 2),
                        to = point + Math.abs(_this.delta / 2);

                    if (from < scrTo.Y && scrTo.Y < to) {
                        scr = point;
                    }
                });

                scrTo.Y = scr;
            }

            animate(function (progr) {
                _this.scroll({ Y: (scrTo.Y - scrolled.Y) * progr + scrolled.Y }, false, ev);
            }, duration, 'easeInOutQuad', function () {
                _this.scroll({ Y: (scrTo.Y - scrolled.Y) * 1 + scrolled.Y }, true, ev);
                _this.isScrolling = false;
            });
        };

        // wheel event handler
        var wheelDelta = 0,
            wheelAccumulating = false;

        wheelHandler = function wheelHandler(e) {
            if (_this.nestedScrBoxSelector && e.target.closest(_this.nestedScrBoxSelector)) {
                return;
            }

            e.preventDefault();

            if (_this.isScrolling) {
                return;
            }

            var delta = void 0,
                scrTo = void 0;

            if (e.deltaX) {
                delta = e.deltaX;
            } else {
                delta = e.deltaY;
            }

            if (_this.scrollStep || opt.fullSizeStep) {
                if (scrBoxEl.hasAttribute('data-scroll-able')) {
                    var atr = scrBoxEl.getAttribute('data-scroll-able');

                    if (atr == 'toLeft' && delta < 0 || atr == 'toRight' && delta > 0 || atr == 'false') return;
                }

                if (_this.scrollStep) {
                    if (delta > 0) {
                        scrTo = _this.scrolled.Y + _this.scrollStep;
                    } else if (delta < 0) {
                        scrTo = _this.scrolled.Y - _this.scrollStep;
                    }
                } else if (opt.fullSizeStep) {
                    if (delta > 0) {
                        scrTo = _this.scrolled.Y + _this.winSize.Y;
                    } else if (delta < 0) {
                        scrTo = _this.scrolled.Y - _this.winSize.Y;
                    }
                }

                _this.delta = delta;

                scrollAnim({ Y: scrTo }, e, null);
            } else {
                if (delta > 0) {
                    delta = _this.winSize.Y / 7;
                } else if (delta < 0) {
                    delta = -_this.winSize.Y / 7;
                }

                wheelDelta += delta;

                if (wheelAccumulating) {
                    return;
                }

                wheelAccumulating = true;

                setTimeout(function () {
                    if (scrBoxEl.hasAttribute('data-scroll-able')) {
                        var _atr = scrBoxEl.getAttribute('data-scroll-able');

                        if (_atr == 'toLeft' && wheelDelta < 0 || _atr == 'toRight' && wheelDelta > 0 || _atr == 'false') return;
                    }

                    if (Math.abs(wheelDelta) > _this.winSize.Y) {
                        if (wheelDelta > 0) {
                            wheelDelta = _this.winSize.Y;
                        } else if (wheelDelta < 0) {
                            wheelDelta = -_this.winSize.Y;
                        }
                    }

                    scrTo = _this.scrolled.Y + wheelDelta;

                    _this.delta = wheelDelta;

                    scrollAnim({ Y: scrTo }, e, null);

                    wheelDelta = 0;
                    wheelAccumulating = false;
                }, 221);
            }
        };

        // window scroll handler
        var winScroll = 0;

        scrollHandler = function scrollHandler() {
            _this.delta = window.scrollY - winScroll;
            winScroll = window.scrollY;
            _this.scroll({ Y: window.scrollY }, null);
        };

        // keyboard events
        // document.addEventListener('keydown', (e) => {
        //     if (this.isScrolling) return;

        //     let scrTo, delta;

        //     if (opt.horizontal) {
        //         if (e.code == 'ArrowRight') {
        //             delta = 1;
        //         } else if (e.code == 'ArrowLeft') {
        //             delta = -1;
        //         }
        //     } else {
        //         if (e.code == 'ArrowDown') {
        //             delta = 1;
        //         } else if (e.code == 'ArrowUp') {
        //             delta = -1;
        //         }
        //     }

        //     // scroll able
        //     if (scrBoxEl.hasAttribute('data-scroll-able')) {
        //         const atr = scrBoxEl.getAttribute('data-scroll-able');

        //         if (
        //             (atr == 'toLeft' && delta < 0) ||
        //             (atr == 'toRight' && delta > 0) ||
        //             atr == 'false'
        //         ) return;
        //     }

        //     if (opt.fullSizeStep) {
        //         if (delta > 0) {
        //             scrTo = this.scrolled + step;
        //         } else if (delta < 0) {
        //             scrTo = this.scrolled - step;
        //         }
        //     } else {
        //         if (delta > 0) {
        //             delta = 150;
        //         } else if (delta < 0) {
        //             delta = -150;
        //         }

        //         delta *= 2;

        //         scrTo = this.scrolled + delta;
        //     }

        //    this.delta = delta;

        //     if (delta) scrollAnim(scrTo, e, undefined);
        // });

        this.scrollTo = function (scrTo, dur, params) {
            this.params = params;

            this.delta = scrTo.Y - this.scrolled.Y;

            scrollAnim(scrTo, 'scrollTo', dur);

            scrBoxEl.removeAttribute('data-scroll-able');
        };

        this.setOptions = function (options) {
            for (var key in options) {
                if (Object.hasOwnProperty.call(options, key)) {
                    var val = options[key];

                    opt[key] = val;
                }
            }

            this.reInit();
        };

        this.reInit = function () {
            var _this2 = this;

            ['scrollbox_vertical', 'scrollbox_horizontal', 'srollbox_scrollable-vertical', 'srollbox_scrollable-horizontal', 'srollbox_dragging'].forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            if (this.innerEl) {
                this.innerEl.style = '';
            }

            for (var key in this.actionElems) {
                if (Object.hasOwnProperty.call(this.actionElems, key)) {
                    var elSt = this.actionElems[key].style;

                    elSt.transform = '';
                    elSt.opacity = '';
                    elSt.visibility = '';
                }
            }

            if (this.bar) {
                this.scrollBar(true);
            }

            scrBoxEl.removeEventListener('wheel', wheelHandler);
            window.removeEventListener('scroll', scrollHandler);

            var scrolled = Object.assign({}, this.scrolled);

            init(function () {
                _this2.scrollTo(scrolled, 0);
            });
        };

        this.destroy = function () {
            this.scrolled = { X: 0, Y: 0 };
            this.initialized = false;

            scrBoxEl.removeEventListener('wheel', wheelHandler);

            ['scrollbox_vertical', 'scrollbox_horizontal', 'srollbox_scrollable-vertical', 'srollbox_scrollable-horizontal', 'srollbox_dragging'].forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            if (this.innerEl) {
                this.innerEl.style = '';
            }

            for (var key in this.actionElems) {
                if (Object.hasOwnProperty.call(this.actionElems, key)) {
                    this.actionElems[key].removeAttribute('style');
                }
            }

            this.scrollBar(true);
            this.drag(true);
        };
    };

    Scrollbox.prototype.scroll = function (scrTo, aftScroll, ev) {
        var _this3 = this;

        if (scrTo.X === undefined) {
            scrTo.X = this.scrolled.X;
        }

        if (scrTo.Y === undefined) {
            scrTo.Y = this.scrolled.Y;
        }

        // if (this.nestedSbEls && this.nestedSbEls.length) {
        //     if (!this.breakOnNested && ev !== 'scrollTo') {
        //         for (let i = 0; i < this.nestedSbEls.length; i++) {
        //             const nEl = this.nestedSbEls[i],
        //                 left = +nEl.getAttribute('data-offset'),
        //                 pos = nEl.getAttribute('data-position');

        //             if (
        //                 left + nEl.offsetWidth > this.scrolled &&
        //                 left < this.scrolled + this.winEl.offsetWidth
        //             ) {
        //                 if (
        //                     this.delta > 0 && scrTo >= left &&
        //                     !nEl.classList.contains('disabled')
        //                 ) {
        //                     if (pos != 'atEnd') {
        //                         this.breakOnNested = true;

        //                         scrTo = left;
        //                         this.scrTo = left;

        //                         nEl.setAttribute('data-scroll-able', 'true');

        //                     } else {
        //                         nEl.setAttribute('data-scroll-able', 'false');
        //                     }

        //                 } else if (
        //                     this.delta < 0 && scrTo <= left &&
        //                     !nEl.classList.contains('disabled')
        //                 ) {
        //                     if (pos != 'atStart') {
        //                         this.breakOnNested = true;

        //                         scrTo = left;
        //                         this.scrTo = left;

        //                         nEl.setAttribute('data-scroll-able', 'true');

        //                     } else {
        //                         nEl.setAttribute('data-scroll-able', 'false');
        //                     }

        //                 }
        //             }
        //         }
        //     } else if (this.breakOnNested) {
        //         scrTo = this.scrTo;
        //     }
        // }

        // break path
        var posX = void 0,
            posY = void 0;

        if (scrTo.X >= this.endBreak.X) {
            scrTo.X = this.endBreak.X;

            posX = 'atEnd';
        } else if (scrTo.X <= 0) {
            scrTo.X = 0;

            posX = 'atStart';
        }

        if (scrTo.Y >= this.endBreak.Y) {
            scrTo.Y = this.endBreak.Y;

            posY = 'atEnd';
        } else if (scrTo.Y <= 0) {
            scrTo.Y = 0;

            posY = 'atStart';
        }

        if (posX) {
            this.scrBoxEl.setAttribute('data-position-horizontal', posX);
        } else {
            this.scrBoxEl.removeAttribute('data-position-horizontal');
        }

        if (posY) {
            this.scrBoxEl.setAttribute('data-position-vertical', posY);
        } else {
            this.scrBoxEl.removeAttribute('data-position-vertical');
        }

        // if (this.parentEl) {
        //     if (this.delta > 0) {
        //         if (pos == 'atEnd') {
        //             if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
        //         } else {
        //             this.parentEl.setAttribute('data-scroll-able', 'false');
        //         }

        //     } else if (this.delta < 0) {
        //         if (pos == 'atStart') {
        //             if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
        //         } else {
        //             this.parentEl.setAttribute('data-scroll-able', 'false');
        //         }
        //     }
        // }

        // move bars
        if ((this.horizontalBarSlEl || this.verticalBarSlEl) && ev != 'bar') {
            if (this.horizontal) {
                var barW = this.horizontalBarSlEl.parentElement.offsetWidth;

                this.horizontalBarSlEl.style.transform = 'translateX(' + (barW - this.horizontalBarSlElSize) / 100 * (scrTo.X / (this.endBreak.X / 100)) + 'px)';
            }

            if (this.vertical) {
                var barH = this.verticalBarSlEl.parentElement.offsetHeight;

                this.verticalBarSlEl.style.transform = 'translateY(' + (barH - this.verticalBarSlElSize) / 100 * (scrTo.Y / (this.endBreak.Y / 100)) + 'px)';
            }
        }

        // child scrolboxes
        var scrToInner = { X: scrTo.X, Y: scrTo.Y };

        if (this.childScrollboxesObjects && this.childScrollboxesObjects.length) {
            var shift = { X: 0, Y: 0 };

            this.childScrollboxesObjects.forEach(function (obj) {
                if (_this3.horizontal) {
                    if (obj.offset.X < scrTo.X && scrTo.X < obj.offset.X + obj.endBreak.X) {
                        scrToInner.X = obj.offset.X;
                    } else if (scrTo.X > obj.offset.X + obj.endBreak.X) {
                        shift.X += obj.endBreak.X;
                    }
                } else {
                    obj.scrollTo({ Y: scrTo.Y - obj.offset.Y }, 0);

                    if (obj.offset.Y < scrTo.Y && scrTo.Y < obj.offset.Y + obj.endBreak.Y) {
                        scrToInner.Y = obj.offset.Y;
                    } else if (scrTo.Y > obj.offset.Y + obj.endBreak.Y) {
                        shift.Y += obj.endBreak.Y;
                    }
                }
            });

            scrToInner.Y -= shift.X;
            scrToInner.Y -= shift.Y;
        }

        // inner element
        if (this.innerEl) {
            if (this.horizontal && this.vertical) {
                this.innerEl.style.transform = 'translate(' + -scrToInner.X + 'px, ' + -scrToInner.Y + 'px)';
            } else {
                if (this.horizontal) {
                    this.innerEl.style.transform = 'translateX(' + -scrToInner.X + 'px)';
                } else {
                    this.innerEl.style.transform = 'translateY(' + -scrToInner.Y + 'px)';
                }
            }
        }

        // action points
        if (this.actionPoints.length) {
            var currentActionPoints = [],
                prevActionPoints = [],
                nextActionPoints = [],
                lastUsedElemsProps = [];

            this.actionPoints.forEach(function (pointItem) {
                if (pointItem.breakpoints[0] < scrTo.Y && scrTo.Y < pointItem.breakpoints[1]) {
                    currentActionPoints.push(pointItem);
                } else if (_this3.delta > 0 && pointItem.breakpoints[1] <= scrTo.Y) {
                    prevActionPoints.push(pointItem);
                } else if (_this3.delta < 0 && scrTo.Y <= pointItem.breakpoints[0]) {
                    nextActionPoints.push(pointItem);
                }
            });

            currentActionPoints.forEach(function (pointItem) {
                var progress = (scrTo.Y - pointItem.breakpoints[0]) / (pointItem.breakpoints[1] - pointItem.breakpoints[0]);

                for (var elKey in pointItem.elements) {
                    var elemProps = pointItem.elements[elKey];

                    for (var property in elemProps) {
                        if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                            continue;
                        }

                        lastUsedElemsProps.push(elKey + '_' + property);

                        var propsRange = elemProps[property],
                            goTo = (propsRange[1] - propsRange[0]) * progress + propsRange[0];

                        if (_this3.actionElems[elKey]) {
                            if (propsRange[2]) {
                                _this3.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                            } else {
                                _this3.actionElems[elKey].style[property] = goTo;

                                if (property == 'opacity') {
                                    if (goTo > 0) {
                                        _this3.actionElems[elKey].style.visibility = 'visible';
                                    } else {
                                        _this3.actionElems[elKey].style.visibility = 'hidden';
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (this.delta > 0) {
                prevActionPoints.sort(function (a, b) {
                    return b.breakpoints[1] - a.breakpoints[1];
                });

                prevActionPoints.forEach(function (pointItem) {
                    for (var elKey in pointItem.elements) {
                        var elemProps = pointItem.elements[elKey];

                        for (var property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            var propsRange = elemProps[property],
                                goTo = propsRange[1];

                            if (_this3.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    _this3.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    _this3.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            _this3.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            _this3.actionElems[elKey].style.visibility = 'hidden';
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            if (this.delta < 0) {
                nextActionPoints.sort(function (a, b) {
                    return a.breakpoints[0] - b.breakpoints[0];
                });

                nextActionPoints.forEach(function (pointItem) {
                    for (var elKey in pointItem.elements) {
                        var elemProps = pointItem.elements[elKey];

                        for (var property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            var propsRange = elemProps[property],
                                goTo = propsRange[0];

                            if (_this3.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    _this3.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    _this3.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            _this3.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            _this3.actionElems[elKey].style.visibility = 'hidden';
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // scrolled
        this.scrolled = scrTo;

        if (this.onScroll) {
            this.onScroll(this.scrBoxEl, { posX: posX, posY: posY }, ev, scrTo, this.params);
        }

        // after scroll
        if (aftScroll) {
            this.scrolled = scrTo;
            // this.breakOnNested = false;

            if (this.onScroll) {
                this.onScroll(this.scrBoxEl, { posX: posX, posY: posY }, ev, scrTo, this.params);
            }

            if (this.afterScroll) {
                this.afterScroll(this.scrBoxEl, { posX: posX, posY: posY }, ev, scrTo, this.params);
            }

            if (this.windowScrollEvent) {
                window.scroll(0, scrTo.Y);
            }

            this.params = null;
        }
    };

    Scrollbox.prototype.scrollBar = function (destroy, initDirection) {
        var _this4 = this;

        if (!this.bar) {
            return;
        }

        if (this.horizontal) {
            var barEl = this.scrBoxEl.querySelector('.scrollbox__horizontal-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';
                } else {
                    if (!this.initialized && initDirection == 'horizontal') {
                        var el = document.createElement('div');

                        barEl.appendChild(el);

                        this.horizontalBarSlEl = el;
                    }

                    if (this.endBreak.X) {
                        if (this.barSize === null) {
                            this.horizontalBarSlEl.style.width = this.winSize.X / (this.innerSize.X / 100) + '%';

                            setTimeout(function () {
                                _this4.horizontalBarSlElSize = _this4.horizontalBarSlEl.offsetWidth;
                            }, 21);
                        } else if (this.barSize === true) {
                            this.horizontalBarSlElSize = this.horizontalBarSlEl.offsetWidth;
                        } else {
                            this.horizontalBarSlEl.style.width = this.barSize + 'px';
                            this.horizontalBarSlElSize = this.barSize;
                        }

                        barEl.style.display = '';
                    } else {
                        barEl.style.display = 'none';
                    }
                }
            }
        }

        if (this.vertical) {
            var _barEl = this.scrBoxEl.querySelector('.scrollbox__vertical-bar');

            if (_barEl) {
                if (destroy) {
                    _barEl.innerHTML = '';
                } else {
                    if (!this.initialized && initDirection == 'vertical') {
                        var _el = document.createElement('div');

                        _barEl.appendChild(_el);

                        this.verticalBarSlEl = _el;
                    }

                    if (this.endBreak.Y) {
                        if (this.barSize === null) {
                            this.verticalBarSlEl.style.height = this.winSize.Y / (this.innerSize.Y / 100) + '%';

                            setTimeout(function () {
                                _this4.verticalBarSlElSize = _this4.verticalBarSlEl.offsetHeight;
                            }, 21);
                        } else if (this.barSize === true) {
                            this.verticalBarSlElSize = this.verticalBarSlEl.offsetHeight;
                        } else {
                            this.verticalBarSlEl.style.height = this.barSize + 'px';
                            this.verticalBarSlElSize = this.barSize;
                        }

                        _barEl.style.display = '';
                    } else {
                        _barEl.style.display = 'none';
                    }
                }
            }
        }

        var mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            bar = { X: 0, Y: 0, W: 0, H: 0 },
            barSlStart = { X: 0, Y: 0 };

        var barSlEl = null;

        var mouseMove = function mouseMove(e) {
            e.preventDefault();

            if (barSlEl === _this4.horizontalBarSlEl) {
                var clientX = e.type == 'touchmove' ? e.targetTouches[0].clientX : e.clientX;

                mouseDelta.X = clientX - mouseStart.X;

                _this4.delta = mouseDelta.X;

                var shift = mouseDelta.X + barSlStart.X - bar.X;

                var limit = bar.W - _this4.horizontalBarSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                _this4.horizontalBarSlEl.style.transform = 'translateX(' + shift + 'px)';

                var X = shift / (limit / 100) * (_this4.endBreak.X / 100);

                _this4.scroll({ X: X }, null, 'bar');
            } else if (barSlEl === _this4.verticalBarSlEl) {
                var clientY = e.type == 'touchmove' ? e.targetTouches[0].clientY : e.clientY;

                mouseDelta.Y = clientY - mouseStart.Y;

                _this4.delta = mouseDelta.Y;

                var _shift = mouseDelta.Y + barSlStart.Y - bar.Y;

                var _limit = bar.H - _this4.verticalBarSlElSize;

                if (_shift <= 0) {
                    _shift = 0;
                } else if (_shift >= _limit) {
                    _shift = _limit;
                }

                _this4.verticalBarSlEl.style.transform = 'translateY(' + _shift + 'px)';

                var Y = _shift / (_limit / 100) * (_this4.endBreak.Y / 100);

                _this4.scroll({ Y: Y }, null, 'bar');
            }
        };

        var mouseUp = function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', mouseMove);

            _this4.scrBoxEl.classList.remove('scrollbox_dragging');

            barSlEl = null;
        };

        var mouseDown = function mouseDown(e) {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            barSlEl = e.target.closest('div');

            if (barSlEl === _this4.horizontalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.X = e.type == 'touchstart' ? e.targetTouches[0].clientX : e.clientX;

                bar.X = barSlEl.parentElement.getBoundingClientRect().left;
                bar.W = barSlEl.parentElement.offsetWidth;

                barSlStart.X = barSlEl.getBoundingClientRect().left;

                _this4.scrBoxEl.classList.add('scrollbox_dragging');
            } else if (barSlEl === _this4.verticalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.Y = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY;

                bar.Y = barSlEl.parentElement.getBoundingClientRect().top;
                bar.H = barSlEl.parentElement.offsetHeight;

                barSlStart.Y = barSlEl.getBoundingClientRect().top;

                _this4.scrBoxEl.classList.add('scrollbox_dragging');
            }
        };

        if (!this.initialized && !destroy) {
            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('touchstart', mouseDown, { passive: false });

            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('touchend', mouseUp);
        } else if (destroy) {
            document.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('touchstart', mouseDown);

            document.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('touchend', mouseUp);
        }
    };

    Scrollbox.prototype.drag = function (destroy) {
        var _this5 = this;

        var mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            lastScroll = { X: 0, Y: 0 };

        var dragTimeout = null;

        var mouseMove = function mouseMove(e) {
            e.preventDefault();

            var clientX = e.type == 'touchmove' ? e.targetTouches[0].clientX : e.clientX,
                clientY = e.type == 'touchmove' ? e.targetTouches[0].clientY : e.clientY;

            mouseDelta.X = clientX - mouseStart.X;
            mouseDelta.Y = clientY - mouseStart.Y;

            var scrTo = {};

            if (_this5.horizontal) {
                scrTo.X = lastScroll.X - mouseDelta.X;
            }

            if (_this5.vertical) {
                scrTo.Y = lastScroll.Y - mouseDelta.Y;
            }

            _this5.scroll(scrTo, null);
        };

        var mouseUp = function mouseUp() {
            _this5.scrBoxEl.removeEventListener('mousemove', mouseMove);
            _this5.scrBoxEl.removeEventListener('touchmove', mouseMove);

            _this5.scrBoxEl.classList.remove('scrollbox_cursor-drag');

            window.clearTimeout(dragTimeout);
        };

        var mouseDown = function mouseDown(e) {
            if (e.type == 'mousedown' && e.which != 1) return;

            var winEl = e.target.closest('.scrollbox__window');

            if (winEl) {
                var clientX = e.type == 'touchstart' ? e.targetTouches[0].clientX : e.clientX,
                    clientY = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY;

                mouseStart.X = clientX;
                mouseStart.Y = clientY;

                lastScroll.X = _this5.scrolled.X;
                lastScroll.Y = _this5.scrolled.Y;

                _this5.scrBoxEl.addEventListener('mousemove', mouseMove);
                _this5.scrBoxEl.addEventListener('touchmove', mouseMove, { passive: false });

                dragTimeout = setTimeout(function () {
                    _this5.scrBoxEl.classList.add('scrollbox_cursor-drag');
                }, 721);
            }
        };

        if (!this.initialized && !destroy) {
            this.scrBoxEl.addEventListener('mousedown', mouseDown);
            this.scrBoxEl.addEventListener('touchstart', mouseDown, { passive: false });

            this.scrBoxEl.addEventListener('mouseup', mouseUp);
            this.scrBoxEl.addEventListener('touchend', mouseUp);
        } else if (destroy) {
            this.scrBoxEl.removeEventListener('mousedown', mouseDown);
            this.scrBoxEl.removeEventListener('touchstart', mouseDown);

            this.scrBoxEl.removeEventListener('mouseup', mouseUp);
            this.scrBoxEl.removeEventListener('touchend', mouseUp);
        }
    };
})();
var FlSlider = {

    animation: false,
    count: 0,
    isLine: false,
    t: null,

    init: function init() {
        var _ = this;

        _.count = $('.float-slider__float-item').length;

        $('.float-slider__float-item').first().addClass('float-slider__float-item_curr');
        $('.float-slider__fade-item').first().addClass('float-slider__fade-item_curr');

        if (_.count > 1) {

            $('.float-slider__float-item').last().addClass('float-slider__float-item_prev');

            $('.float-slider__float-item').first().next('.float-slider__float-item').removeClass('float-slider__float-item_prev').addClass('float-slider__float-item_next');

            var dots = '';
            for (var i = 0; i < _.count; i++) {
                dots += '<li' + (i == 0 ? ' class="float-slider__dots-active"' : '') + '><button type="button" data-index="' + i + '"></button></li>';
            }

            $('.float-slider__float').append('<ul class="float-slider__dots">' + dots + '</ul>');

            if ($('.float-slider').attr('data-line')) {
                _.isLine = true;
            }
        } else {
            $('.float-slider__arrow').remove();
        }
    },

    dots: function dots(ind) {
        var _ = this;
        function dotC() {
            if (!$('.float-slider__float-item[data-index="' + ind + '"]').hasClass('float-slider__float-item_curr')) {

                if (_.count == 2 && ind === 0) {
                    _.change('prev');
                } else {
                    _.change('next');
                }

                setTimeout(dotC, 1121);
            }
        }
        dotC();
    },

    activeDot: function activeDot() {
        var _ = this;
        var ind = $('.float-slider__float-item_curr').attr('data-index');
        $('.float-slider__dots li').removeClass('float-slider__dots-active');
        $('.float-slider__dots').find('button[data-index="' + ind + '"]').parent().addClass('float-slider__dots-active');
        $('.float-slider-control__btn').removeClass('float-slider-control__btn_active');
        $('#float-sl-cont-' + ind).addClass('float-slider-control__btn_active');
        if (_.isLine) {
            clearTimeout(_.t);
            _.line();
        }
    },

    line: function line() {
        var _ = this;
        $('.float-slider-control__line span').removeClass('crawl');
        $('.float-slider-control__btn_active .float-slider-control__line span').addClass('crawl');
        _.t = setTimeout(function () {
            _.change('next');
        }, 5000);
    },

    change: function change(dir) {

        var _ = this,
            Curr = $('.float-slider__float-item_curr'),
            Next = $('.float-slider__float-item_next'),
            Prev = $('.float-slider__float-item_prev'),
            ToNext,
            ToPrev;

        if (_.count > 3) {
            ToNext = Next.next('.float-slider__float-item').length ? Next.next('.float-slider__float-item') : $('.float-slider__float-item').first();
            ToPrev = Prev.prev('.float-slider__float-item').length ? Prev.prev('.float-slider__float-item') : $('.float-slider__float-item').last();
        }

        if (_.count == 2) {
            if (Next.attr('data-index') === '1') {
                if (dir == 'prev') {
                    return false;
                }
            } else if (Prev.attr('data-index') === '0') {
                if (dir == 'next') {
                    return false;
                }
            }
        } else if (_.count == 1) {
            return false;
        }

        if (!_.animation) {

            if (dir == 'next') {
                _.animation = true;

                Next.addClass('next-to-curr');
                Curr.addClass('curr-to-prev');

                if (_.count > 3) {
                    ToNext.addClass('to-next');
                    Prev.addClass('from-prev');
                } else {
                    Prev.addClass('prev-to-next');
                }

                $('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');

                setTimeout(function () {

                    $('.float-slider__fade-item[data-index="' + Next.attr('data-index') + '"]').addClass('float-slider__fade-item_curr');

                    if (_.count > 3) {
                        ToNext.addClass('float-slider__float-item_next').removeClass('to-next');
                        Prev.removeClass('float-slider__float-item_prev from-prev');
                    } else {
                        Prev.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_prev prev-to-next');
                    }

                    Curr.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_curr curr-to-prev');

                    Next.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_next next-to-curr');

                    _.animation = false;
                    _.activeDot();
                }, 1021);
            } else if (dir == 'prev') {
                _.animation = true;

                Prev.addClass('prev-to-curr');
                Curr.addClass('curr-to-next');

                if (_.count > 3) {
                    ToPrev.addClass('to-prev');
                    Next.addClass('from-next');
                } else {
                    Next.addClass('next-to-prev');
                }

                $('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');

                setTimeout(function () {

                    $('.float-slider__fade-item[data-index="' + Prev.attr('data-index') + '"]').addClass('float-slider__fade-item_curr');

                    Prev.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_prev prev-to-curr');

                    Curr.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_curr curr-to-next');

                    if (_.count > 3) {
                        ToPrev.addClass('float-slider__float-item_prev').removeClass('to-prev');
                        Next.removeClass('float-slider__float-item_next from-next');
                    } else {
                        Next.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_next next-to-prev');
                    }

                    _.animation = false;
                    _.activeDot();
                }, 1021);
            }
        }
    }

};

$('document').ready(function () {

    FlSlider.init();

    if ($('.float-slider-control').length) {
        var s = true;
        $(window).scroll(function () {
            if ($('.float-slider-control').offset().top < $(window).height() / 2 + $(window).scrollTop()) {
                if (s) {
                    s = false;
                    FlSlider.line();
                }
            }
        });
    }

    $('body').on('click', '.float-slider-control__btn-btn', function () {
        if (!$(this).parent().hasClass('float-slider-control__btn_active')) {
            var ind = +$(this).attr('data-index');
            FlSlider.dots(ind);
        }
    });

    $('body').on('click', '.float-slider__dots button', function () {
        if (!$(this).parent().hasClass('float-slider__dots-active')) {
            var ind = +$(this).attr('data-index');
            FlSlider.dots(ind);
        }
    });

    $('body').on('click', '.float-slider__arrow', function () {
        var dir = $(this).attr('data-direct');
        FlSlider.change(dir);
    });

    if (window.innerWidth < 1200) {
        // $('.float-slider').swipe({
        //     swipe: function(event, direction) {
        //         if (direction == 'right') {
        //             FlSlider.change('prev');
        //         } else if(direction == 'left') {
        //             FlSlider.change('next');
        //         }
        //     },
        //     triggerOnTouchEnd: false,
        //     excludedElements: '',
        //     threshold: 21,
        // });
    }
});
// Zoom.init('.js-zoom-container');

var Zoom;

(function () {
            'use strict';

            Zoom = {
                        contSel: '',
                        contEl: null,
                        contPos: { X: 0, Y: 0, X2: 0, Y2: 0 },
                        zoomEl: null,
                        zoomInnerEl: null,
                        mOver: null,
                        mMove: null,

                        build: function build() {
                                    this.zoomInnerEl = document.createElement('div');

                                    this.zoomInnerEl.className = 'zoom__inner';

                                    this.zoomInnerEl.style.width = this.contEl.offsetWidth + 'px';
                                    this.zoomInnerEl.style.height = this.contEl.offsetHeight + 'px';

                                    this.zoomInnerEl.innerHTML = this.contEl.innerHTML;

                                    this.zoomEl.appendChild(this.zoomInnerEl);

                                    this.zoomEl.style.display = 'block';
                        },

                        start: function start(e) {
                                    this.contEl = e.target.closest(this.contSel);

                                    if (!this.contEl) return;

                                    document.removeEventListener('mouseover', this.mOver);

                                    this.contPos.X = this.contEl.getBoundingClientRect().left + window.pageXOffset;
                                    this.contPos.Y = this.contEl.getBoundingClientRect().top + window.pageYOffset;
                                    this.contPos.X2 = this.contEl.getBoundingClientRect().right + window.pageXOffset;
                                    this.contPos.Y2 = this.contEl.getBoundingClientRect().bottom + window.pageYOffset;

                                    this.build();

                                    this.mMove = this.move.bind(this);

                                    document.addEventListener('mousemove', this.mMove);
                        },

                        move: function move(e) {
                                    this.zoomEl.style.left = e.pageX - 131 + 'px';
                                    this.zoomEl.style.top = e.pageY - 131 + 'px';

                                    var sX = (e.pageX - this.contPos.X) * 2 - 131,
                                        sY = (e.pageY - this.contPos.Y) * 2 - 131;

                                    this.zoomInnerEl.style.left = -sX + 'px';
                                    this.zoomInnerEl.style.top = -sY + 'px';

                                    if (e.pageX < this.contPos.X || e.pageY < this.contPos.Y || e.pageX > this.contPos.X2 || e.pageY > this.contPos.Y2) {
                                                this.end();
                                    }
                        },

                        end: function end() {
                                    this.zoomEl.style.display = 'none';
                                    this.zoomEl.innerHTML = '';

                                    document.removeEventListener('mousemove', this.mMove);
                                    document.addEventListener('mouseover', this.mOver);
                        },

                        init: function init(contSel) {
                                    this.contSel = contSel;
                                    this.mOver = this.start.bind(this);

                                    document.addEventListener('mouseover', this.mOver);

                                    this.zoomEl = document.createElement('div');
                                    this.zoomEl.className = 'zoom';
                                    document.body.appendChild(this.zoomEl);
                        }
            };
})();
var Cursor;

(function () {
            'use strict';

            Cursor = {
                        elObj: null,
                        cursorEl: null,
                        mOver: null,
                        mMove: null,
                        mOut: null,
                        opt: null,

                        init: function init(options) {
                                    this.opt = options;

                                    this.mOver = this.start.bind(this);

                                    document.addEventListener('mouseover', this.mOver);

                                    var cursWrap = document.createElement('div');
                                    cursWrap.className = 'cursor-wrap';

                                    document.body.appendChild(cursWrap);

                                    this.cursorEl = document.createElement('div');
                                    this.cursorEl.className = 'cursor';

                                    cursWrap.appendChild(this.cursorEl);
                        },

                        start: function start(e) {
                                    var el = void 0;

                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                                for (var _iterator = this.opt[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                            var it = _step.value;

                                                            el = e.target.closest(it.selector);

                                                            if (el) {
                                                                        this.elObj = { el: el, cursCl: it.class };
                                                                        break;
                                                            }
                                                }
                                    } catch (err) {
                                                _didIteratorError = true;
                                                _iteratorError = err;
                                    } finally {
                                                try {
                                                            if (!_iteratorNormalCompletion && _iterator.return) {
                                                                        _iterator.return();
                                                            }
                                                } finally {
                                                            if (_didIteratorError) {
                                                                        throw _iteratorError;
                                                            }
                                                }
                                    }

                                    if (!el) return;

                                    if (this.elObj.cursCl) {
                                                this.cursorEl.setAttribute('data-class', this.elObj.cursCl);
                                    } else {
                                                this.cursorEl.removeAttribute('data-class');
                                    }

                                    this.cursorEl.classList.add('cursor_visible');

                                    this.mMove = this.move.bind(this);
                                    document.addEventListener('mousemove', this.mMove);

                                    this.mOut = this.end.bind(this);
                                    document.addEventListener('mouseout', this.mOut);
                        },

                        move: function move(e) {
                                    var x = e.clientX - this.cursorEl.offsetWidth / 2,
                                        y = e.clientY - this.cursorEl.offsetHeight / 2;

                                    this.cursorEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                        },

                        end: function end() {
                                    this.cursorEl.classList.remove('cursor_visible');

                                    document.removeEventListener('mousemove', this.mMove);
                                    document.removeEventListener('mouseout', this.mOut);
                        }
            };
})();
var SPA;

(function () {
    'use strict';

    SPA = function SPA(opt) {
        var _this2 = this;

        this.opt = opt || {};
        this.routeSubscribers = [];

        this.route = function (path, fun) {
            if (typeof fun === 'function') {
                this.routeSubscribers.push({ path: path, fun: fun });
            }

            return this;
        };

        this.changeTemplate = function () {
            var _this = this;

            var hash = window.location.hash;

            var fun = void 0,
                matches = void 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.routeSubscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if (!hash && !item.path) {
                        fun = item.fun;
                        break;
                    } else if (hash && item.path) {
                        matches = hash.match(new RegExp(item.path));

                        if (matches) {
                            fun = item.fun;

                            break;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (!fun) return;

            fun(matches, function (data, cb) {
                var contEl = document.getElementById(data.container),
                    tplEl = document.getElementById(data.template);

                if (!contEl || !tplEl) return;

                contEl.innerHTML = template(data, tplEl.innerHTML, _this.opt.tplSign);

                if (cb) cb();
            });
        };

        window.addEventListener('popstate', function () {
            // if (link) return;

            setTimeout(function () {
                _this2.changeTemplate();
            }, 121);
        });

        this.changeTemplate();
    };

    // SPA = {
    //     opt: null,
    //     routeSubscribers: [],

    //     init: function (opt) {
    //         this.opt = opt || {};

    //         // let link;

    //         // document.addEventListener('click', (e) => {
    //         //     link = e.target.closest(this.opt.link);

    //         //     if (link) {
    //         //         setTimeout(() => {
    //         //             this.changeTemplate();
    //         //             link = null;
    //         //         }, 121);
    //         //     }
    //         // });

    //         window.addEventListener('popstate', () => {
    //             // if (link) return;

    //             setTimeout(() => {
    //                 this.changeTemplate();
    //             }, 121);
    //         });

    //         this.changeTemplate();
    //     },

    //     route: function (path, fun) {
    //         if (typeof fun === 'function') {
    //             this.routeSubscribers.push({ path, fun });
    //         }

    //         return this;
    //     },

    //     changeTemplate: function () {
    //         const hash = window.location.hash;

    //         let fun, matches;

    //         for (const item of this.routeSubscribers) {
    //             if (!hash && !item.path) {
    //                 fun = item.fun;
    //                 break;

    //             } else if (hash && item.path) {
    //                 matches = hash.match(new RegExp(item.path));

    //                 if (matches) {
    //                     fun = item.fun;

    //                     break;
    //                 }
    //             }
    //         }

    //         if (!fun) return;

    //         fun(matches, (data, cb) => {
    //             const contEl = document.getElementById(data.container),
    //                 tplEl = document.getElementById(data.template);

    //             if (!contEl || !tplEl) return;

    //             contEl.innerHTML = template(data, tplEl.innerHTML, this.opt.tplSign);

    //             if (cb) cb();
    //         });
    //     }
    // };
})();
var DragAndDrop;
/* 
DragAndDrop.onDragged(function () {
    // code
});
*/

(function () {
            'use strict';

            DragAndDrop = {
                        opt: null,
                        dragElemObj: {},
                        parentDropElem: null,
                        curentDropElem: null,
                        maskDiv: null,
                        lastInsertPos: '',
                        onDragSubscribers: [],

                        init: function init(opt) {
                                    this.opt = opt || {};

                                    document.removeEventListener('mousedown', this.mD);

                                    this.mD = this.mD.bind(this);

                                    document.addEventListener('mousedown', this.mD);

                                    this.setInd();
                        },

                        setInd: function setInd() {
                                    var dropEls = document.querySelectorAll('.dropable');

                                    for (var i = 0; i < dropEls.length; i++) {
                                                var dropEl = dropEls[i];

                                                var dragEls = dropEl.querySelectorAll('.dragable');

                                                for (var _i = 0; _i < dragEls.length; _i++) {
                                                            var dragEl = dragEls[_i];

                                                            dragEl.setAttribute('data-index', _i);
                                                }
                                    }
                        },

                        mD: function mD(e) {
                                    if (e.type == 'mousedown' && e.which != 1) return;

                                    var dragEl = e.target.closest('.dragable');

                                    if (!dragEl) return;

                                    this.mM = this.mM.bind(this);
                                    this.mU = this.mU.bind(this);

                                    document.addEventListener('mousemove', this.mM);
                                    document.addEventListener('mouseup', this.mU);

                                    var clientX = e.type == 'touchstart' ? e.targetTouches[0].clientX : e.clientX,
                                        clientY = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY;

                                    // dragable options 
                                    this.dragElemObj.elem = dragEl;
                                    this.dragElemObj.X = dragEl.getBoundingClientRect().left;
                                    this.dragElemObj.Y = dragEl.getBoundingClientRect().top;
                                    this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
                                    this.dragElemObj.shiftY = clientY - this.dragElemObj.Y;
                                    this.dragElemObj.width = dragEl.offsetWidth;
                                    this.dragElemObj.height = dragEl.offsetHeight;

                                    dragEl.style.width = this.dragElemObj.width + 'px';
                                    dragEl.style.height = this.dragElemObj.height + 'px';
                                    dragEl.style.left = this.dragElemObj.X + 'px';
                                    dragEl.style.top = this.dragElemObj.Y + 'px';

                                    dragEl.classList.add('dragable_active');

                                    this.parentDropElem = dragEl.closest('.dropable');

                                    this.maskDiv = document.createElement('div');

                                    this.maskDiv.className = 'dropable__mask';
                                    this.maskDiv.style.height = this.dragElemObj.height + 'px';

                                    this.dragElemObj.elem.after(this.maskDiv);
                        },

                        mM: function mM(e) {
                                    var clientX = e.type == 'touchmove' ? e.targetTouches[0].clientX : e.clientX,
                                        clientY = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY;

                                    var moveX = clientX - this.dragElemObj.shiftX,
                                        moveY = clientY - this.dragElemObj.shiftY;

                                    this.dragElemObj.elem.style.left = moveX + 'px';
                                    this.dragElemObj.elem.style.top = moveY + 'px';

                                    var dropEl = e.target.closest('.dropable');

                                    if (dropEl && dropEl !== this.curentDropElem) {
                                                this.curentDropElem = dropEl;

                                                dropEl.querySelector('.dropable__inner').prepend(this.maskDiv);

                                                this.lastInsertPos = '';
                                    }

                                    var siblingDragEl = e.target.closest('.dragable');

                                    if (siblingDragEl) {
                                                var siblingDragElCenter = siblingDragEl.getBoundingClientRect().top + siblingDragEl.offsetHeight / 2;

                                                if (clientY >= siblingDragElCenter) {
                                                            if (this.maskDiv && this.lastInsertPos != 'after') {
                                                                        this.lastInsertPos = 'after';
                                                                        siblingDragEl.after(this.maskDiv);
                                                            }
                                                } else {
                                                            if (this.maskDiv && this.lastInsertPos != 'before') {
                                                                        this.lastInsertPos = 'before';
                                                                        siblingDragEl.before(this.maskDiv);
                                                            }
                                                }
                                    }
                        },

                        mU: function mU() {
                                    document.removeEventListener('mousemove', this.mM);

                                    if (this.dragElemObj.elem && this.maskDiv) {
                                                this.dragElemObj.elem.classList.remove('dragable_active');

                                                this.dragElemObj.elem.style = '';

                                                this.maskDiv.replaceWith(this.dragElemObj.elem);

                                                this.setInd();

                                                this.onDragSubscribers.forEach(function (fun) {
                                                            fun();
                                                });
                                    }

                                    this.dragElemObj = {};
                                    this.maskDiv = null;
                                    this.curentDropElem = null;
                        },

                        onDragged: function onDragged(fun) {
                                    if (typeof fun === 'function') {
                                                this.onDragSubscribers.push(fun);
                                    }
                        }
            };
})();