/*
const scrBox = new Scrollbox('#hor-scroll');

scrBox.setOptions({ duration: 2200 });

scrBox.onScroll = function (scrBoxEl, pos, ev, scrTo, params, delta) {}

scrBox.afterScroll = function (scrBoxEl, pos, ev, scrTo, params, delta) {}

scrBox.scrollTo(scrTo, duration, params);

scrBox.beforeScroll = function (scrBoxEl, delta, scrTo) {}
*/

var Scrollbox;

(function () {
    'use strict';

    Scrollbox = function (elem, options) {
        const scrBoxEl = (typeof elem === 'string') ? document.querySelector(elem) : elem;

        if (!scrBoxEl) return;

        // options
        const opt = options || {};

        opt.horizontal = (opt.horizontal !== undefined) ? opt.horizontal : false;
        opt.scrollStep = (opt.scrollStep !== undefined) ? opt.scrollStep : false;
        opt.fullSizeStep = (opt.fullSizeStep !== undefined) ? opt.fullSizeStep : false;
        opt.cssTransition = (opt.cssTransition !== undefined) ? opt.cssTransition : false;
        opt.nestedScrollbox = (opt.nestedScrollbox !== undefined) ? opt.nestedScrollbox : null;
        opt.parentScrollbox = (opt.parentScrollbox !== undefined) ? opt.parentScrollbox : null;
        opt.childrenScrollbox = (opt.childrenScrollbox !== undefined) ? opt.childrenScrollbox : null;
        opt.evListenerEl = (opt.evListenerEl !== undefined) ? opt.evListenerEl : null;
        opt.duration = (opt.duration !== undefined) ? opt.duration : 1000;
        opt.bar = (opt.bar !== undefined) ? opt.bar : false;
        opt.barSize = (opt.barSize !== undefined) ? opt.barSize : null;

        const winEl = scrBoxEl.querySelector('.scrollbox__window');
        let innerEl = scrBoxEl.querySelector('.scrollbox__inner');

        if (innerEl.parentElement !== winEl) {
            innerEl = null;
        }

        scrBoxEl.setAttribute('tabindex', '-1');

        this.scrBoxEl = scrBoxEl;
        this.winEl = winEl;
        this.winSize = 0;
        this.horizontal = opt.horizontal;
        this.bar = opt.bar;
        this.barSize = opt.barSize;
        this.nestedSbEls = [];
        this.parentEl = null;
        this.barSlEl = null;
        this.barSlElSize = 0;
        this.scrolled = 0;
        this.isScrolling = false;
        this.isBreak = false;
        this.delta = 0;
        this.initialized = false;
        this.ts = Date.now();
        this.params = null;
        this.innerSize = null;
        this.innerEl = innerEl || null;
        this.innerSize = null;
        this.endBreak = null;
        this.scrollStep = opt.scrollStep;
        this.cssTransition = opt.cssTransition;

        if (opt.parentScrollbox) {
            this.parentEl = scrBoxEl.closest(opt.parentScrollbox);
        }

        const init = () => {
            if (opt.horizontal) {
                scrBoxEl.classList.add('scrollbox_horizontal');

                setTimeout(() => {
                    if (this.innerEl) {
                        const innerW = winEl.scrollWidth,
                            winW = winEl.offsetWidth;

                        if (innerW > winW) {
                            scrBoxEl.classList.add('srollbox_scrollable');
                        }

                        this.winSize = winW;
                        this.innerSize = innerW;
                        this.endBreak = innerW - winW;
                    }

                    this.scrollBar();
                }, 21);

            } else {
                scrBoxEl.classList.add('scrollbox_vertical');

                setTimeout(() => {
                    if (this.innerEl) {
                        const innerH = winEl.scrollHeight,
                            winH = winEl.offsetHeight;

                        if (innerH > winH) {
                            scrBoxEl.classList.add('srollbox_scrollable');
                        }

                        this.winSize = winH;
                        this.innerSize = innerH;
                        this.endBreak = innerH - winH;
                    }

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

            setTimeout(() => {
                const actionEls = winEl.querySelectorAll('[data-action-points]');

                for (let i = 0; i < actionEls.length; i++) {
                    const pointEl = actionEls[i],
                        points = pointEl.getAttribute('data-action-points').split(';'),
                        // actionProp = actEl.hasAttribute('data-action-prop') ? actEl.getAttribute('data-action-prop').split(',') : null,
                        // actionRange = actEl.getAttribute('data-range').split(','),
                        reverse = pointEl.getAttribute('data-reverse');

                    const allPoints = [];

                    points.forEach(function (point) {
                        const pointArr = point.split(','),
                            brP = pointArr[0].split('-'),
                            action = pointArr[1].split('=>'),
                            property = pointArr[2],
                            actRegExp = /(\-?[\d.]+|visible|hidden)(px|%|vw|vh|rem|em)?/;

                        const actValues = [],
                            actUnits = [];

                        action.forEach(function (actItem) {
                            const match = actItem.match(actRegExp);

                            actValues.push(match[1]);
                            actUnits.push(match[2]);
                        });

                        allPoints.push({
                            elem: pointEl,
                            breakpoints: brP.map(p => +p),
                            actionValues: actValues.map(function (val) {
                                if (/\-?[\d.]+/.test(val)) {
                                    return +val;
                                } else {
                                    return val;
                                }
                            }),
                            actionUnit: actUnits[0] || actUnits[1] || '',
                            property
                        });
                    });

                    allPoints.forEach(pointItem => {
                        let existElemInd = false;

                        this.actionEls.forEach((actElItem, i) => {
                            if (
                                actElItem.elem === pointItem.elem &&
                                actElItem.property == pointItem.property
                            ) {
                                existElemInd = i;
                            }
                        });

                        if (existElemInd !== false) {
                            this.actionEls[existElemInd].breakpoints.push(pointItem.breakpoints);
                            this.actionEls[existElemInd].actionValues.push(pointItem.actionValues);
                            this.actionEls[existElemInd].actionUnits.push(pointItem.actionUnit);

                        } else {
                            this.actionEls.push({
                                elem: pointItem.elem,
                                breakpoints: [pointItem.breakpoints],
                                actionValues: [pointItem.actionValues],
                                actionUnits: [pointItem.actionUnit],
                                property: pointItem.property
                            });
                        }
                    });

                    this.actionEls.forEach(actElItem => {
                        actElItem.breakpointStart = actElItem.breakpoints[0][0];
                        actElItem.breakpointEnd = actElItem.breakpoints[actElItem.breakpoints.length - 1][1];

                        actElItem.actValStart = actElItem.actionValues[0][0];
                        actElItem.actValEnd = actElItem.actionValues[actElItem.actionValues.length - 1][1];

                        if (actElItem.breakpointEnd > this.endBreak) {
                            this.endBreak = actElItem.breakpointEnd;
                        }
                    });
                }

                this.initialized = true;

                this.scroll(0, true);
            }, 42);
        }

        init();

        // scroll animation
        const scrollAnim = (scrTo, ev, duration, delta) => {
            if (this.isScrolling) {
                return;
            }

            this.isScrolling = true;

            if (this.beforeScroll) {
                const beforeReturn = this.beforeScroll(scrBoxEl, delta, scrTo);

                if (beforeReturn) {
                    scrTo = beforeReturn.scrTo || scrTo;
                }
            }

            this.delta = delta;

            const scrolled = this.scrolled;

            duration = (duration !== undefined) ? duration : opt.duration;

            if (this.cssTransition) {
                this.scroll(scrTo, false, ev, duration);

                setTimeout(() => {
                    this.scroll(scrTo, true, ev, duration);
                    this.isScrolling = false;
                }, duration);

                return;
            }

            if (duration == 0) {
                this.scroll((scrTo - scrolled) * 1 + scrolled, true, ev, duration);
                this.isScrolling = false;
                return;
            }

            animate((progr) => {
                this.scroll((scrTo - scrolled) * progr + scrolled, false, ev, duration);
            }, duration, 'easeInOutQuad', () => {
                this.scroll((scrTo - scrolled) * 1 + scrolled, true, ev, duration);
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

            let scrTo, delta;

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

            if (this.scrollStep) {
                if (delta > 0) {
                    scrTo = this.scrolled + this.scrollStep;
                } else if (delta < 0) {
                    scrTo = this.scrolled - this.scrollStep;
                }

            } else if (opt.fullSizeStep) {
                if (delta > 0) {
                    scrTo = this.scrolled + this.winSize;
                } else if (delta < 0) {
                    scrTo = this.scrolled - this.winSize;
                }

            } else {
                if (Math.abs(delta) > this.winSize) {
                    if (delta > 0) {
                        delta = this.winSize;
                    } else if (delta < 0) {
                        delta = -this.winSize;
                    }
                }

                if (Math.abs(delta) < 150) {
                    if (delta > 0) {
                        delta = 150;
                    } else if (delta < 0) {
                        delta = -150;
                    }
                }

                scrTo = this.scrolled + delta;
            }

            scrollAnim(scrTo, e, undefined, delta);
        }

        scrBoxEl.addEventListener('wheel', wheelHandler);

        // touch events
        if (document.ontouchmove !== undefined) {
            let touchStartY = 0,
                delta = 0,
                scrTo = null;

            scrBoxEl.addEventListener('touchstart', (e) => {
                if (
                    this.isScrolling ||
                    (opt.childrenScrollbox && e.target.closest(opt.childrenScrollbox))
                ) return;

                if (scrBoxEl.getAttribute('data-scroll-able') == 'false') {
                    return false;
                }

                touchStartY = e.targetTouches[0].clientY;

                delta = 0;
                scrTo = null;
            });

            scrBoxEl.addEventListener('touchmove', (e) => {
                if (this.scrolled > 21) {
                    e.preventDefault();
                }

                if (
                    this.isScrolling ||
                    (opt.childrenScrollbox && e.target.closest(opt.childrenScrollbox))
                ) return;

                if (scrBoxEl.getAttribute('data-scroll-able') == 'false') {
                    return false;
                }

                delta = touchStartY - e.targetTouches[0].clientY;
            });

            scrBoxEl.addEventListener('touchend', (e) => {
                if (
                    this.isScrolling ||
                    (opt.childrenScrollbox && e.target.closest(opt.childrenScrollbox))
                ) return;

                if (scrBoxEl.getAttribute('data-scroll-able') == 'false') {
                    return false;
                }

                if (this.scrollStep) {
                    if (delta > 21) {
                        scrTo = this.scrolled + this.scrollStep;
                    } else if (delta < -21) {
                        scrTo = this.scrolled - this.scrollStep;
                    }

                } else {
                    if (Math.abs(delta) > this.winSize) {
                        if (delta > 0) {
                            delta = this.winSize;
                        } else if (delta < 0) {
                            delta = -this.winSize;
                        }
                    }

                    if (Math.abs(delta) < 150) {
                        if (delta > 0) {
                            delta = 150;
                        } else if (delta < 0) {
                            delta = -150;
                        }
                    }

                    scrTo = this.scrolled + delta;
                }

                if (scrTo !== null) {
                    scrollAnim(scrTo, e, undefined, delta);
                }
            });
        }

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

            if (opt.fullSizeStep) {
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

            scrollAnim(scrTo, 'scrollTo', dur, scrTo - this.scrolled);

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
            if (options.duration !== undefined) {
                opt.duration = options.duration;
            }
        }

        this.reInit = function () {
            init();
        }

        this.destroy = function () {
            this.scrolled = 0;
            this.initialized = false;

            scrBoxEl.removeEventListener('wheel', wheelHandler);

            const cssClass = ['scrollbox_vertical', 'srollbox_scrollable', 'srollbox_dragging'];

            cssClass.forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            innerEl.style.transform = '';

            this.actionEls.forEach(function (item) {
                item.el.style.transform = '';
            });

            this.scrollBar(true);
        }
    }

    Scrollbox.prototype.scroll = function (scrTo, aftScroll, ev, duration) {
        if (!this.isBreak && this.nestedSbEls.length && ev != 'scrollTo') {
            for (let i = 0; i < this.nestedSbEls.length; i++) {
                const nEl = this.nestedSbEls[i],
                    pos = nEl.getAttribute('data-position');

                if (this.horizontal) {

                    const left = +nEl.getAttribute('data-offset');

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

                } else {
                    
                    const top = +nEl.getAttribute('data-offset');

                    if (
                        top + nEl.offsetHeight > this.scrolled &&
                        top < this.scrolled + this.winEl.offsetHeight
                    ) {
                        if (
                            this.delta > 0 && scrTo >= top &&
                            !nEl.classList.contains('disabled')
                        ) {
                            if (pos != 'atEnd') {
                                this.isBreak = true;

                                scrTo = top;
                                this.scrTo = top;

                                nEl.setAttribute('data-scroll-able', 'true');

                            } else {
                                nEl.setAttribute('data-scroll-able', 'false');
                            }

                        } else if (
                            this.delta < 0 && scrTo <= top &&
                            !nEl.classList.contains('disabled')
                        ) {
                            if (pos != 'atStart') {
                                this.isBreak = true;

                                scrTo = top;
                                this.scrTo = top;

                                nEl.setAttribute('data-scroll-able', 'true');

                            } else {
                                nEl.setAttribute('data-scroll-able', 'false');
                            }

                        }
                    }

                }
            }
        } else if (this.isBreak) {
            scrTo = this.scrTo;
        }

        this.actionEls.forEach(actItem => {

            if (scrTo < actItem.breakpointStart) {

                if (actItem.property) {
                    actItem.elem.style[actItem.property] = actItem.actValStart + actItem.actionUnits[0];
                } else {
                    if (this.horizontal) {
                        actItem.elem.style.transform = 'translate(' + actItem.actValStart + actItem.actionUnits[0] + ', 0)';
                    } else {
                        actItem.elem.style.transform = 'translate(0, ' + actItem.actValStart + actItem.actionUnits[0] + ')';
                    }
                }

                actItem.elem.style.transition = '';

            } else if (scrTo > actItem.breakpointEnd) {

                if (actItem.property) {
                    actItem.elem.style[actItem.property] = actItem.actValEnd + actItem.actionUnits[0];
                } else {
                    if (this.horizontal) {
                        actItem.elem.style.transform = 'translate(' + actItem.actValEnd + actItem.actionUnits[0] + ', 0)';
                    } else {
                        actItem.elem.style.transform = 'translate(0, ' + actItem.actValEnd + actItem.actionUnits[0] + ')';
                    }
                }

                actItem.elem.style.transition = '';

            } else {
                actItem.breakpoints.forEach((bp, i) => {
                    if (scrTo >= bp[0] && scrTo <= bp[1]) {
                        let progress, moveTo, unit, trion = '0s 0s';

                        if (this.cssTransition) {
                            trion = duration + 'ms 0s';
                        }

                        actItem.elem.style.transition = trion;

                        if (typeof actItem.actionValues[i][1] === 'string') {
                            moveTo = actItem.actionValues[i][1];
                            unit = '';
                        } else {
                            progress = (scrTo - bp[0]) / (bp[1] - bp[0]),
                                moveTo = (actItem.actionValues[i][1] - actItem.actionValues[i][0]) * progress + actItem.actionValues[i][0],
                                unit = actItem.actionUnits[i];
                        }




                        if (actItem.property) {
                            actItem.elem.style[actItem.property] = moveTo + unit;
                        } else {
                            if (this.horizontal) {
                                actItem.elem.style.transform = 'translate(' + moveTo + unit + ', 0)';
                            } else {
                                actItem.elem.style.transform = 'translate(0, ' + moveTo + unit + ')';
                            }
                        }
                    }
                });
            }
        });

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

        if (this.barSlEl && ev != 'bar') {
            if (this.horizontal) {
                const barW = this.barSlEl.parentElement.offsetWidth;

                this.barSlEl.style.transform = 'translateX(' + ((barW - this.barSlElSize) / 100) * (scrTo / (this.endBreak / 100)) + 'px)';

            } else {
                const barH = this.barSlEl.parentElement.offsetHeight;

                this.barSlEl.style.transform = 'translateY(' + ((barH - this.barSlElSize) / 100) * (scrTo / (this.endBreak / 100)) + 'px)';
            }
        }

        this.scrolled = scrTo;

        // move
        if (this.innerEl) {
            if (this.horizontal) {
                this.innerEl.style.transform = 'translateX(' + (-scrTo) + 'px)';
            } else {
                this.innerEl.style.transform = 'translateY(' + (-scrTo) + 'px)';
            }
        }

        if (this.onScroll) {
            this.onScroll(this.scrBoxEl, pos, ev, scrTo, this.params, this.delta);
        }

        // after scroll
        if (aftScroll) {
            this.scrolled = scrTo;
            this.isBreak = false;

            if (this.afterScroll) {
                this.afterScroll(this.scrBoxEl, pos, ev, scrTo, this.params, this.delta);
            }

            this.params = null;
        }
    }

    Scrollbox.prototype.actPointStyles = function (actItem) {

    }

    Scrollbox.prototype.scrollBar = function (destroy) {
        if (!this.bar) return;

        if (this.horizontal) {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__horizontal-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized) {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.barSlEl = el;
                    }

                    if (this.innerSize > this.winEl.offsetWidth) {
                        if (this.barSize === null) {
                            this.barSlEl.style.width = (this.winSize / (this.innerSize / 100)) + '%';

                            setTimeout(() => {
                                this.barSlElSize = this.barSlEl.offsetWidth;
                            }, 21);

                        } else if (this.barSize === true) {
                            this.barSlElSize = this.barSlEl.offsetWidth;
                        } else {
                            this.barSlEl.style.width = this.barSize + 'px';
                            this.barSlElSize = this.barSize;
                        }

                        barEl.style.display = '';

                    } else {
                        barEl.style.display = 'none';
                    }
                }
            }

        } else {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__vertical-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized) {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.barSlEl = el;
                    }

                    if (this.endBreak) {
                        if (this.barSize === null) {
                            this.barSlEl.style.height = (this.winSize / (this.innerSize / 100)) + '%';

                            setTimeout(() => {
                                this.barSlElSize = this.barSlEl.offsetHeight;
                            }, 21);

                        } else if (this.barSize === true) {
                            this.barSlElSize = this.barSlEl.offsetHeight;
                        } else {
                            this.barSlEl.style.height = this.barSize + 'px';
                            this.barSlElSize = this.barSize;
                        }

                        barEl.style.display = '';

                    } else {
                        barEl.style.display = 'none';
                    }
                }
            }
        }

        const mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            bar = { X: 0, Y: 0, W: 0, H: 0 },
            barSlStart = { X: 0, Y: 0 };

        const mouseMove = (e) => {
            mouseDelta.X = e.clientX - mouseStart.X;
            mouseDelta.Y = e.clientY - mouseStart.Y;

            if (this.horizontal) {
                let shift = mouseDelta.X + barSlStart.X - bar.X;

                const limit = bar.W - this.barSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.barSlEl.style.transform = 'translateX(' + shift + 'px)';

                this.scroll((shift / (limit / 100)) * (this.endBreak / 100), null, 'bar');

            } else {
                let shift = mouseDelta.Y + barSlStart.Y - bar.Y;

                const limit = bar.H - this.barSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.barSlEl.style.transform = 'translateY(' + shift + 'px)';

                this.scroll((shift / (limit / 100)) * (this.endBreak / 100), null, 'bar');
            }
        }

        const mouseUp = () => {
            document.removeEventListener('mousemove', mouseMove);

            this.scrBoxEl.classList.remove('scrollbox_dragging');
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) return;

            const barSlEl = e.target.closest('div');

            if (barSlEl === this.barSlEl) {
                document.addEventListener('mousemove', mouseMove);

                mouseStart.X = e.clientX;
                mouseStart.Y = e.clientY;

                bar.X = barSlEl.parentElement.getBoundingClientRect().left;
                bar.Y = barSlEl.parentElement.getBoundingClientRect().top;
                bar.W = barSlEl.parentElement.offsetWidth;
                bar.H = barSlEl.parentElement.offsetHeight;

                barSlStart.X = barSlEl.getBoundingClientRect().left;
                barSlStart.Y = barSlEl.getBoundingClientRect().top;

                this.scrBoxEl.classList.add('scrollbox_dragging');
            }
        }

        if (!this.initialized && !destroy) {
            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('mouseup', mouseUp);

        } else if (destroy) {
            document.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('mouseup', mouseUp);
        }
    }
})();