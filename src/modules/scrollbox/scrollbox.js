// new Scrollbox('#hor-scroll');

; var Scrollbox;

(function () {
    'use strict';

    Scrollbox = function (elem, options) {
        const scrBoxEl = (typeof elem === 'string') ? document.querySelector(elem) : elem;

        if (!scrBoxEl) return;

        // options
        const opt = options || {};

        opt.horizontal = (opt.horizontal !== undefined) ? opt.horizontal : false;
        opt.fullWidthScroll = (opt.fullWidthScroll !== undefined) ? opt.fullWidthScroll : false;
        opt.scrollStep = (opt.scrollStep !== undefined) ? opt.scrollStep : null;
        opt.nestedScrollbox = (opt.nestedScrollbox !== undefined) ? opt.nestedScrollbox : null;
        opt.parentScrollbox = (opt.parentScrollbox !== undefined) ? opt.parentScrollbox : null;
        opt.childrenScrollbox = (opt.childrenScrollbox !== undefined) ? opt.childrenScrollbox : null;
        opt.evListenerEl = (opt.evListenerEl !== undefined) ? opt.evListenerEl : null;
        opt.duration = (opt.duration !== undefined) ? opt.duration : 1000;
        opt.bar = (opt.bar !== undefined) ? opt.bar : false;

        const winEl = scrBoxEl.querySelector('.scrollbox__window'),
            innerEl = scrBoxEl.querySelector('.scrollbox__inner');

        scrBoxEl.setAttribute('tabindex', '-1');

        this.scrBoxEl = scrBoxEl;
        this.winEl = winEl;
        this.horizontal = opt.horizontal;
        this.bar = opt.bar;
        this.nestedSbEls = null;
        this.parentEl = null;
        this.barSlEl = null;
        this.scrolled = 0;
        this.isScrolling = false;
        this.isBreak = false;
        this.delta = 0;
        this.initialized = false;
        this.ts = Date.now();
        this.params = null;

        if (opt.parentScrollbox) {
            this.parentEl = scrBoxEl.closest(opt.parentScrollbox);
        }



        // // init breakpoints
        // let breakpoints;

        // function initBreakpoints() {
        // 	breakpoints = [];

        // 	options.breakpoints.forEach(function (item) {
        // 		const bkPointEls = winEl.querySelectorAll('[' + item.attr + ']');

        // 		for (let i = 0; i < bkPointEls.length; i++) {
        // 			const bpEl = bkPointEls[i];

        // 			breakpoints.push({
        // 				el: bpEl,
        // 				left: bpEl.getBoundingClientRect().left - winEl.getBoundingClientRect().left,
        // 				attr: item.attr,
        // 				state: item.state
        // 			});
        // 		}
        // 	});
        // }

        // initBreakpoints();


        // // checkpoints
        // const checkbkPointEls = winEl.querySelectorAll('[data-scroll-checkpoint]'),
        // 	checkpoints = [];

        // for (let i = 0; i < checkbkPointEls.length; i++) {
        // 	const pEl = checkbkPointEls[i];

        // 	checkpoints.push({
        // 		el: pEl,
        // 		left: pEl.getBoundingClientRect().left - winEl.getBoundingClientRect().left
        // 	});
        // }

        let step, curStep;

        const init = () => {
            winEl.style.width = winEl.offsetWidth + 'px';
            winEl.style.height = winEl.offsetHeight + 'px';

            if (opt.horizontal) {
                const innerW = winEl.scrollWidth;

                this.endBreak = innerW - winEl.offsetWidth;

                if (innerEl && innerW > winEl.offsetWidth) {
                    this.innerEl = innerEl;

                    innerEl.style.width = innerW + 'px';

                    innerEl.classList.add('scrollbox__inner_init');
                }

            } else {
                setTimeout(() => {
                    const innerH = winEl.scrollHeight;

                    this.endBreak = innerH - winEl.offsetHeight;

                    if (innerEl && innerH > winEl.offsetHeight) {
                        this.innerEl = innerEl;

                        innerEl.style.height = innerH + 'px';

                        innerEl.classList.add('scrollbox__inner_init');
                    }

                    this.innerH = innerH;

                    this.scrollBar();
                }, 21);
            }

            scrBoxEl.setAttribute('data-position', 'atStart');

            if (opt.nestedScrollbox) {
                this.nestedSbEls = scrBoxEl.querySelectorAll(opt.nestedScrollbox);

                for (let i = 0; i < this.nestedSbEls.length; i++) {
                    const nEl = this.nestedSbEls[i];

                    if (!nEl.hasAttribute('data-offset')) {
                        if (opt.horizontal) {
                            nEl.setAttribute('data-offset', nEl.getBoundingClientRect().left - winEl.getBoundingClientRect().left);
                        } else {
                            nEl.setAttribute('data-offset', nEl.getBoundingClientRect().top - winEl.getBoundingClientRect().top);
                        }
                    }

                    nEl.setAttribute('data-scroll-able', 'false');
                }
            }

            this.actionEls = [];

            const actionEls = winEl.querySelectorAll('[data-action-points]');

            for (let i = 0; i < actionEls.length; i++) {
                const actEl = actionEls[i],
                    points = actEl.getAttribute('data-action-points').split(','),
                    actionProp = actEl.getAttribute('data-action-prop'),
                    actionRange = actEl.getAttribute('data-range').split(','),
                    reverse = actEl.getAttribute('data-reverse');

                let start, end, startFrom, endTo;

                points.forEach(function (item, i) {
                    const pts = item.split('-'),
                        rng = actionRange[i].split('-');

                    if (!i) {
                        start = +pts[0];
                        startFrom = +rng[0];
                    }

                    if (i == points.length - 1) {
                        end = +pts[1];
                        endTo = +rng[1];
                    }
                });

                points.forEach((item, i) => {
                    const pts = item.split('-'),
                        rng = actionRange[i].split('-');

                    this.actionEls.push({
                        el: actEl,
                        startAction: +pts[0],
                        endAction: +pts[1],
                        actionFrom: +rng[0],
                        actionTo: +rng[1],
                        actionProp,
                        start,
                        end,
                        startFrom,
                        endTo,
                        reverse
                    });

                    if (+pts[1] > this.endBreak) {
                        this.endBreak = +pts[1];
                    }
                });
            }

            // scroll step
            if (opt.fullWidthScroll) {
                let mod = null,
                    base;

                for (let i = 3; i < 10; i++) {
                    if (mod === null || winEl.offsetWidth % i < mod) {
                        mod = winEl.offsetWidth % i;
                        base = i;
                    }
                }

                step = winEl.offsetWidth / base;

                if (opt.scrollStep !== null) {
                    if (typeof opt.scrollStep === 'string') {
                        if (opt.scrollStep === 'windowWidth') {
                            step = winEl.offsetWidth;

                            if (this.scrolled > 0) {
                                const scrolledSteps = this.scrolled / curStep;

                                this.scrollTo(step * scrolledSteps, 0);
                            }
                        }
                    } else {
                        step = opt.scrollStep;
                    }
                }
            }

            curStep = step;

            setTimeout(() => {
                this.initialized = true;
            }, 121);
        }

        init();

        // scroll animation
        const scrollAnim = (scrTo, ev, duration, delta) => {
            if (this.isScrolling) return;

            this.isScrolling = true;

            this.delta = delta;

            const scrolled = this.scrolled;

            duration = (duration !== undefined) ? duration : opt.duration;

            if (duration == 0) {
                this.scroll((scrTo - scrolled) * 1 + scrolled, true, ev);
                this.isScrolling = false;
                return;
            }

            animate((progr) => {
                this.scroll((scrTo - scrolled) * progr + scrolled, false, ev);
            }, duration, 'easeInOutQuad', () => {
                this.scroll((scrTo - scrolled) * 1 + scrolled, true, ev);
                this.isScrolling = false;
            });
        }

        // wheel event handler
        const wheelHandler = (e) => {
            e.preventDefault();

            if (
                this.isScrolling ||
                (opt.childrenScrollbox && e.target.closest(opt.childrenScrollbox))
            ) return;

            let scrTo,
                delta;

            if (e.deltaX) {
                delta = e.deltaX;
            } else {
                delta = e.deltaY;
            }

            // scroll able
            if (scrBoxEl.hasAttribute('data-scroll-able')) {
                const atr = scrBoxEl.getAttribute('data-scroll-able');

                if (
                    (atr == 'toLeft' && delta < 0) ||
                    (atr == 'toRight' && delta > 0) ||
                    atr == 'false'
                ) return;
            }

            // // break before scroll
            // if (this.beforeScroll) {
            // 	const befRes = this.beforeScroll(delta);

            // 	if (befRes !== null) {
            // 		step = befRes;
            // 	} else {
            // 		step = curStep;
            // 	}
            // }

            if (opt.fullWidthScroll) {
                if (delta > 0) {
                    scrTo = this.scrolled + step;
                } else if (delta < 0) {
                    scrTo = this.scrolled - step;
                }
            } else {
                if (delta > 0) {
                    delta = 150;
                } else if (delta < 0) {
                    delta = -150;
                }

                delta *= 2;

                scrTo = this.scrolled + delta;
            }

            scrollAnim(scrTo, e, undefined, delta);
        }

        scrBoxEl.addEventListener('wheel', wheelHandler);

        // keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;

            let scrTo, delta;

            if (opt.horizontal) {
                if (e.code == 'ArrowRight') {
                    delta = 1;
                } else if (e.code == 'ArrowLeft') {
                    delta = -1;
                }
            } else {
                if (e.code == 'ArrowDown') {
                    delta = 1;
                } else if (e.code == 'ArrowUp') {
                    delta = -1;
                }
            }

            // scroll able
            if (scrBoxEl.hasAttribute('data-scroll-able')) {
                const atr = scrBoxEl.getAttribute('data-scroll-able');

                if (
                    (atr == 'toLeft' && delta < 0) ||
                    (atr == 'toRight' && delta > 0) ||
                    atr == 'false'
                ) return;
            }

            if (opt.fullWidthScroll) {
                if (delta > 0) {
                    scrTo = this.scrolled + step;
                } else if (delta < 0) {
                    scrTo = this.scrolled - step;
                }
            } else {
                if (delta > 0) {
                    delta = 150;
                } else if (delta < 0) {
                    delta = -150;
                }

                delta *= 2;

                scrTo = this.scrolled + delta;
            }

            if (delta) scrollAnim(scrTo, e, undefined, delta);
        });

        this.scrollTo = function (scrTo, dur, params) {
            this.params = params;

            scrollAnim(scrTo, 'scrollTo', dur);

            scrBoxEl.removeAttribute('data-scroll-able');

            this.isBreak = false;

            if (opt.nestedScrollboxObj && opt.nestedScrollboxObj.length) {
                opt.nestedScrollboxObj.forEach(function (item) {
                    item.scrBoxEl.setAttribute('data-scroll-able', 'false');
                    item.scrBoxEl.setAttribute('data-position', 'atStart');
                    item.scrolled = 0;
                    item.innerEl.style.left = '0';
                });
            }
        }

        this.setOptions = function (options) {
            // if (options.slipBreakpoints !== undefined) opt.slipBreakpoints = options.slipBreakpoints;
        }

        this.reInit = function () {
            winEl.style.width = '';
            winEl.style.height = '';

            if (innerEl) {
                innerEl.classList.remove('scrollbox__inner_init');
                innerEl.style.width = '';
                innerEl.style.height = '';
            }

            init();
        }

        this.destroy = function () {
            this.scrolled = 0;
            this.initialized = false;

            scrBoxEl.removeEventListener('wheel', wheelHandler);

            winEl.style.width = '';
            winEl.style.height = '';

            if (innerEl) {
                innerEl.classList.remove('scrollbox__inner_init');
                innerEl.style.width = '';
                innerEl.style.height = '';
            }

            this.actionEls.forEach(function (item) {
                item.el.style.transform = '';
            });
        }
    }

    Scrollbox.prototype.scroll = function (scrTo, aftScroll, ev) {
        if (!this.isBreak && this.nestedSbEls && ev != 'scrollTo') {
            for (let i = 0; i < this.nestedSbEls.length; i++) {
                const nEl = this.nestedSbEls[i],
                    left = +nEl.getAttribute('data-offset'),
                    pos = nEl.getAttribute('data-position');

                if (
                    left + nEl.offsetWidth > this.scrolled &&
                    left < this.scrolled + this.winEl.offsetWidth
                ) {
                    if (
                        this.delta > 0 && scrTo >= left &&
                        !nEl.classList.contains('disabled')
                    ) {
                        if (pos != 'atEnd') {
                            this.isBreak = true;

                            scrTo = left;
                            this.scrTo = left;

                            nEl.setAttribute('data-scroll-able', 'true');

                        } else {
                            nEl.setAttribute('data-scroll-able', 'false');
                        }

                    } else if (
                        this.delta < 0 && scrTo <= left &&
                        !nEl.classList.contains('disabled')
                    ) {
                        if (pos != 'atStart') {
                            this.isBreak = true;

                            scrTo = left;
                            this.scrTo = left;

                            nEl.setAttribute('data-scroll-able', 'true');

                        } else {
                            nEl.setAttribute('data-scroll-able', 'false');
                        }

                    }
                }
            }
        } else if (this.isBreak) {
            scrTo = this.scrTo;
        }

        this.actionEls.forEach(function (item) {
            let sign = '-';

            if (item.reverse === 'true') {
                sign = '';
            }

            if (scrTo >= item.startAction && scrTo <= item.endAction) {
                const progress = (scrTo - item.startAction) / ((item.endAction - item.startAction)),
                    moveTo = (item.actionTo - item.actionFrom) * progress + item.actionFrom;

                if (item.actionProp === 'left') {
                    item.el.style.left = sign + moveTo + '%';
                } else {
                    item.el.style.transform = 'translate(' + sign + moveTo + '%, 0)';
                }

            } else if (scrTo < item.start) {
                if (item.actionProp === 'left') {
                    item.el.style.left = sign + item.startFrom + '%';
                } else {
                    item.el.style.transform = 'translate(' + sign + item.startFrom + '%, 0)';
                }

            } else if (scrTo > item.end) {
                if (item.actionProp === 'left') {
                    item.el.style.left = sign + item.endTo + '%';
                } else {
                    item.el.style.transform = 'translate(' + sign + item.endTo + '%, 0)';
                }
            }
        });

        // borders
        let pos;

        if (scrTo >= this.endBreak) {
            scrTo = this.endBreak;

            pos = 'atEnd';

        } else if (scrTo <= 0) {
            scrTo = 0;

            pos = 'atStart';
        }

        if (pos) {
            this.scrBoxEl.setAttribute('data-position', pos);
        } else {
            this.scrBoxEl.removeAttribute('data-position');
        }

        if (this.parentEl) {
            if (this.delta > 0) {
                if (pos == 'atEnd') {
                    if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
                } else {
                    this.parentEl.setAttribute('data-scroll-able', 'false');
                }

            } else if (this.delta < 0) {
                if (pos == 'atStart') {
                    if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
                } else {
                    this.parentEl.setAttribute('data-scroll-able', 'false');
                }
            }
        }



        if (this.barSlEl) {
            if (this.horizontal) {
                // const bsrScrTo = scrTo / (innerW / 100);
                // barSlEl.style.left = Math.abs(bsrScrTo) + '%';
            } else {
                this.barSlEl.style.top = Math.abs(scrTo / (this.innerH / 100)) + '%';
            }
        }

        this.scrolled = scrTo;

        // move
        if (this.innerEl) {
            if (this.horizontal) {
                this.innerEl.style.left = -scrTo + 'px';
            } else {
                this.innerEl.style.top = -scrTo + 'px';
            }
        }

        if (this.onScroll) this.onScroll(this.scrBoxEl, pos, ev, scrTo, this.params);

        // after scroll
        if (aftScroll) {
            this.scrolled = scrTo;
            this.isBreak = false;

            if (this.afterScroll) this.afterScroll(this.scrBoxEl, pos, ev, scrTo, this.params);

            this.params = null;
        }
    }

    Scrollbox.prototype.scrollBar = function () {
        if (!this.bar) return;

        if (this.horizontal) {
            // barEl = scrBoxEl.querySelector('.scrollbox__horizontal-bar');
            // let barSlEl = null;

            // if (barEl) {
            // 	barSlEl = document.createElement('div');

            // 	barSlEl.style.width = (winW / (innerW / 100)) + '%';

            // 	barEl.appendChild(barSlEl);
            // }
        } else {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__vertical-bar');

            if (barEl) {
                if (!this.initialized) {
                    const barSlEl = document.createElement('div');

                    barEl.appendChild(barSlEl);

                    this.barSlEl = barSlEl;
                }

                this.barSlEl.style.height = (this.winEl.offsetHeight / (this.innerH / 100)) + '%';
            }
        }
    }

})();