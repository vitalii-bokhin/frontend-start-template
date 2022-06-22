/*
animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
*/
;
var animate;

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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (obj) { return typeof obj === "undefined" ? "undefined" : _typeof(obj); } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj); }, _typeof(obj); }

;
var template;

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

        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === 'object') {
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
FsScroll.init({
	container: Str selector,
	screen: Str selector,
	duration: Int milliseconds
});
*/
;
var FsScroll;

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
;
var Screens;

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
            sP = this.screenProps[i]; // let top = sP.topEdge - scrTop;

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
;
var Screens2;

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
      this.setHeight(); // scroll or swipe event

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
      } // click event


      document.addEventListener('click', function (e) {
        var chngSecBtn = e.target.closest('.js-change-screen-menu');

        if (chngSecBtn) {
          e.preventDefault();
          var curClass = _this3.options.menuCurrentClass || 'current';

          if (!_this3.scrolling && !chngSecBtn.parentElement.classList.contains(curClass)) {
            _this3.changeScreen(document.querySelector(chngSecBtn.getAttribute('data-screen')));
          }
        }
      }); // change by hash url

      if (window.location.hash) {
        var screenElem = document.getElementById(window.location.hash.split('#')[1] + '-screen');

        if (screenElem) {
          this.changeScreen(screenElem);
        }
      }
    }
  };
})(); // (function () {
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
;
var ScrollSmooth;

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
;
var Toggle;

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
      } //target


      if (toggleElem.hasAttribute('data-target-elements')) {
        this.target(toggleElem, state);
      }

      if (!state) {
        return;
      } //dependence elements


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
      } //call onChange


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
;
var FlexImg;

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
    } //init


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
;
var CoverImg;

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
          img.classList.add('cover-img_w'); // img.style.marginTop = margin +'px';
        } else {
          // var margin = Math.round(-(imgWrap.offsetHeight * imgProportion - imgWrap.offsetWidth) / 2);
          img.classList.add('cover-img_h'); // img.style.marginLeft = margin +'px';
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
        img.classList.remove('cover-img_h'); // img.style.marginTop = '';
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
   onEvent: 'scrollTo',  // def: false
   flexible: true, // def: false
   onDemand: true // def: false
});
*/
;
var LazyLoad;

(function () {
  'use strict';

  LazyLoad = function LazyLoad(opt) {
    var _this = this;

    opt = opt || {};
    opt.event = opt.event || false;
    opt.flexible = opt.flexible || false;
    opt.onDemand = opt.onDemand || false;
    this.opt = opt;
    this.initialized = false;
    this.suff = '';

    var scrollHandler = function scrollHandler() {
      if (_this.scrollHandlerLocked) {
        return;
      }

      var _loop = function _loop(i) {
        var el = _this.elements[i];
        var elOffset = el.getBoundingClientRect();

        if (elOffset.width !== 0 || elOffset.height !== 0) {
          if (elOffset.top < window.innerHeight + 100 && elOffset.bottom > -100) {
            isWebpSupport(function (result) {
              var suff = '';

              if (result) {
                suff = '-webp';
              }

              _this.doLoad(el, suff);
            });
          }
        }
      };

      for (var i = 0; i < _this.elements.length; i++) {
        _loop(i);
      }
    };

    var init = function init() {
      _this.elements = document.querySelectorAll(opt.selector);
      _this.scrollHandlerLocked = false;

      if (_this.elements) {
        if (opt.onEvent) {
          if (opt.onEvent == 'scrollTo') {
            window.removeEventListener('scroll', scrollHandler);
            window.addEventListener('scroll', scrollHandler);
            scrollHandler();
            _this.initialized = true;
          }
        } else if (!opt.onDemand) {
          window.addEventListener('load', function () {
            isWebpSupport(function (result) {
              if (result) {
                _this.suff = '-webp';
              }

              _this.initialized = true;

              _this.doLoad();
            });
          });
        }
      }
    };

    init();

    this.reInit = function () {
      if (this.initialized) {
        init();
      }
    };

    this.disable = function () {
      this.scrollHandlerLocked = true;
    };
  };

  LazyLoad.prototype.doLoad = function (el, suff) {
    var elements = el ? [el] : this.elements;

    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];
      suff = suff !== undefined ? suff : this.suff;

      if (!elem.hasAttribute('data-src' + suff) && !elem.hasAttribute('data-bg-url' + suff)) {
        suff = '';
      }

      if (this.opt.flexible) {
        if (elem.hasAttribute('data-src' + suff)) {
          var arr = elem.getAttribute('data-src' + suff).split(',');
          var resultImg = void 0;
          arr.forEach(function (arrItem) {
            var props = arrItem.split('->');

            if (window.innerWidth < +props[0]) {
              resultImg = props[1];
            }
          });
          this.draw(elem, resultImg, true);
        } else if (elem.hasAttribute('data-bg-url' + suff)) {
          var _arr = elem.getAttribute('data-bg-url' + suff).split(',');

          var _resultImg = void 0;

          _arr.forEach(function (arrItem) {
            var props = arrItem.split('->');

            if (window.innerWidth < +props[0]) {
              _resultImg = props[1];
            }
          });

          this.draw(elem, _resultImg);
        }
      } else {
        if (elem.hasAttribute('data-src' + suff)) {
          this.draw(elem, elem.getAttribute('data-src' + suff), true);
        } else if (elem.hasAttribute('data-bg-url' + suff)) {
          this.draw(elem, elem.getAttribute('data-bg-url' + suff));
        }
      }
    }
  };

  LazyLoad.prototype.draw = function (elem, src, isImg) {
    if (isImg) {
      if (src !== elem.getAttribute('src')) {
        elem.src = src;
      }
    } else {
      elem.style.backgroundImage = 'url(' + src + ')';
    }
  };

  LazyLoad.prototype.load = function () {
    var _this2 = this;

    if (this.opt.onDemand) {
      this.elements = document.querySelectorAll(this.opt.selector);
      isWebpSupport(function (result) {
        if (result) {
          _this2.suff = '-webp';
        }

        _this2.initialized = true;

        _this2.doLoad();
      });
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
      var visWinElems = document.querySelectorAll('.popup__window_visible');
      if (!visWinElems.length) return;

      var _loop = function _loop(i) {
        var _this2 = this;

        var winEl = visWinElems[i];
        if (!winEl.classList.contains('popup__window_visible')) return "continue";
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
        }, this.delay);
      };

      for (var i = 0; i < visWinElems.length; i++) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
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

      if (elem
      /* && elem.hasAttribute('data-tested') */
      ) {
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
      var err = 0; // text, password, textarea

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
      } // select


      var selectElements = formElem.querySelectorAll('.select__input');

      for (var _i2 = 0; _i2 < selectElements.length; _i2++) {
        var selectElem = selectElements[_i2];
        if (elemIsHidden(selectElem.parentElement)) continue;

        if (this.select(selectElem)) {
          err++;
          errElems.push(selectElem.parentElement);
        }
      } // checkboxes


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
      } // checkbox group


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
      } // radio group


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
      } // file


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
      } // passwords compare


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
    int: function int() {
      if (!/^[0-9]*$/.test(this.input.value)) {
        return 2;
      }

      if (this.input.hasAttribute('data-min')) {
        if (+this.input.value < +this.input.getAttribute('data-min')) {
          return 3;
        }
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
      if (!/^\+?[\d)(\s-]+$/.test(this.input.value)) {
        return 2;
      }

      return null;
    },
    tel_RU: function tel_RU() {
      if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(this.input.value)) {
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
          errCount = {
        ext: 0,
        size: 0
      },
          maxFiles = +this.input.getAttribute('data-max-files'),
          extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
          maxSize = +this.input.getAttribute('data-max-size'),
          fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');
      ;

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
      } // change event


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
  'use strict'; //show element on radio button change

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
  }; //init scripts

  document.addEventListener('DOMContentLoaded', function () {
    ChangeRadio.init();
  });
})();
;
var Select;

(function () {
  'use strict'; // custom select

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

              _sEl.classList.remove(this.hideCssClass); // focus on input


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
            selectedOption = null; // option list

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
        } // output select


        var customElem = document.createElement('div');
        customElem.className = 'select' + multiple.class + (selectedOption ? ' select_changed' : '') + (elem.getAttribute('data-hide-selected-option') == 'true' ? ' select_hide-selected-option' : '');
        customElem.innerHTML = head + '<div class="select__options-wrap"><ul class="select__options">' + optionsList + '</ul></div>' + hiddenInp + multiple.inpDiv;
        parent.replaceChild(customElem, elem);
      }
    },
    init: function init(elementStr) {
      var _this = this;

      if (document.querySelector(elementStr)) this.build(elementStr); // click event

      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = this.clickHandler.bind(this);
      document.addEventListener('click', this.clickHandler); // focus event

      document.removeEventListener('focus', this.focusHandler, true);
      this.focusHandler = this.focusHandler.bind(this);
      document.addEventListener('focus', this.focusHandler, true); // blur event

      document.removeEventListener('blur', this.blurHandler, true);
      this.blurHandler = this.blurHandler.bind(this);
      document.addEventListener('blur', this.blurHandler, true); // keydown event

      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = this.keydownHandler.bind(this);
      document.addEventListener('keydown', this.keydownHandler); // close all

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
      document.addEventListener('touchmove', this.mM, {
        passive: false
      });
      document.addEventListener('mouseup', this.mU);
      document.addEventListener('touchend', this.mU);
      var clientX = e.type == 'touchstart' ? e.targetTouches[0].clientX : e.clientX,
          clientY = e.type == 'touchstart' ? e.targetTouches[0].clientY : e.clientY; // formslider options

      var formslider = elem.closest('.formslider');
      this.formsliderObj.X = formslider.getBoundingClientRect().left;
      this.formsliderObj.Y = formslider.getBoundingClientRect().bottom;
      this.formsliderObj.width = formslider.offsetWidth;
      this.formsliderObj.height = formslider.offsetHeight;
      this.formsliderObj.isRange = formslider.getAttribute('data-range');
      this.formsliderObj.isVertical = formslider.getAttribute('data-vertical') === 'true' || false;
      this.formsliderObj.min = +formslider.getAttribute('data-min'); // dragable options

      this.dragElemObj.elem = elem;
      this.dragElemObj.X = elem.getBoundingClientRect().left;
      this.dragElemObj.Y = elem.getBoundingClientRect().bottom;
      this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
      this.dragElemObj.shiftY = this.dragElemObj.Y - clientY;
      this.dragElemObj.index = elem.getAttribute('data-index');
      this.dragElemObj.width = elem.offsetWidth;
      this.dragElemObj.height = elem.offsetHeight;
      elem.setAttribute('data-active', 'true'); // one unit of value

      if (this.formsliderObj.isVertical) {
        this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetHeight - elem.offsetHeight);
      } else {
        this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetWidth - elem.offsetWidth);
      }

      this.oneValPerc = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / 100; // track

      this.track = formslider.querySelector('.formslider__track'); // get parameters of slider

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
      }); // reset properties

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
;
var AutoComplete;

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
        this.setValues(inputElem, function (valuesData, nameKey, valKey, secValKey, permOpened) {
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
      } // focus event


      document.addEventListener('focus', function (e) {
        var elem = e.target.closest('.autocomplete__input');
        if (!elem) return;
        _this4.fieldElem = elem.closest('.autocomplete');
        _this4.inputElem = elem;
        _this4.optionsElem = _this4.fieldElem.querySelector('.autocomplete__options');

        _this4.searchValue();
      }, true); // blur event

      document.addEventListener('blur', function (e) {
        var inpElem = e.target.closest('.autocomplete__input');

        if (inpElem) {
          setTimeout(function () {
            _this4.close(inpElem);
          }, 321);
        }
      }, true); // input event

      document.addEventListener('input', function (e) {
        if (e.target.closest('.autocomplete__input')) {
          _this4.searchValue();
        }
      }); // click event

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
      }); // keyboard events

      document.addEventListener('keydown', function (e) {
        if (e.target.closest('.autocomplete_opened')) {
          _this4.keybinding(e);
        }
      });
    }
  };
})();
;
var CustomFile;

(function () {
  'use strict'; //custom file

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
            filesArr.push({
              name: inputFileElements[i].name,
              files: this.filesArrayObj[inputFileElements[i].id]
            });
          }
        }
      }

      return filesArr;
    }
  }; //init script

  document.addEventListener('DOMContentLoaded', function () {
    CustomFile.init();
  });
})();