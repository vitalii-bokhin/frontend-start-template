// new Scrollbox('#hor-scroll');

; var Scrollbox;

(function () {
    'use strict';

    Scrollbox = function (elem, options) {
        const scrBoxEl = (typeof elem === 'string') ? document.querySelector(elem) : elem;

        if (!scrBoxEl) {
            return;
        }

        // options
        const opt = options || {};

        opt.horizontal = (opt.horizontal !== undefined) ? opt.horizontal : false;

        if (opt.horizontal && !opt.vertical) {
            opt.vertical = false;
        } else {
            opt.vertical = true;
        }

        opt.scrollStep = (opt.scrollStep !== undefined) ? opt.scrollStep : false;
        opt.fullSizeStep = (opt.fullSizeStep !== undefined) ? opt.fullSizeStep : false;
        opt.nestedScrollbox = (opt.nestedScrollbox !== undefined) ? opt.nestedScrollbox : null;
        opt.parentScrollbox = (opt.parentScrollbox !== undefined) ? opt.parentScrollbox : null;
        opt.childrenScrollbox = (opt.childrenScrollbox !== undefined) ? opt.childrenScrollbox : null;
        opt.evListenerEl = (opt.evListenerEl !== undefined) ? opt.evListenerEl : null;
        opt.duration = (opt.duration !== undefined) ? opt.duration : 1000;
        opt.bar = (opt.bar !== undefined) ? opt.bar : false;
        opt.barSize = (opt.barSize !== undefined) ? opt.barSize : null;
        opt.drag = (opt.drag !== undefined) ? opt.drag : false;
        opt.mouseWheel = (opt.mouseWheel !== undefined) ? opt.mouseWheel : true;
        opt.actionPoints = (opt.actionPoints !== undefined) ? opt.actionPoints : null;
        opt.windowScrollEvent = (opt.windowScrollEvent !== undefined) ? opt.windowScrollEvent : false;

        const winEl = scrBoxEl.querySelector('.scrollbox__window');
        let innerEl = scrBoxEl.querySelector('.scrollbox__inner'),
            wheelHandler;

        if (innerEl && innerEl.parentElement !== winEl) {
            innerEl = null;
        }

        scrBoxEl.setAttribute('tabindex', '-1');

        const init = () => {
            this.scrBoxEl = scrBoxEl;
            this.winEl = winEl;
            this.winSize = { X: 0, Y: 0 };
            this.horizontal = opt.horizontal;
            this.vertical = opt.vertical;
            this.bar = opt.bar;
            this.barSize = opt.barSize;
            this.nestedSbEls = null;
            this.parentEl = null;
            this.verticalBarSlEl = null;
            this.horizontalBarSlEl = null;
            this.verticalBarSlElSize = 0;
            this.horizontalBarSlElSize = 0;
            this.scrolled = { X: 0, Y: 0 };
            this.isScrolling = false;
            this.isBreak = false;
            this.delta = 0;
            this.initialized = false;
            this.ts = Date.now();
            this.params = null;
            this.innerEl = innerEl || null;
            this.innerSize = { X: null, Y: null };
            this.endBreak = { X: null, Y: null };
            this.scrollStep = opt.scrollStep;
            this.actionElems = {};
            this.actionPoints = opt.actionPoints;
            this.windowScrollEvent = opt.windowScrollEvent;

            if (opt.parentScrollbox) {
                this.parentEl = scrBoxEl.closest(opt.parentScrollbox);
            }


            if (opt.horizontal) {
                scrBoxEl.classList.add('scrollbox_horizontal');

                setTimeout(() => {
                    if (this.innerEl) {
                        const innerW = winEl.scrollWidth,
                            winW = winEl.offsetWidth;

                        if (innerW > winW) {
                            scrBoxEl.classList.add('srollbox_scrollable-horizontal');
                        }

                        this.winSize.X = winW;
                        this.innerSize.X = innerW;
                        this.endBreak.X = innerW - winW;
                    }

                    this.scrollBar(false, 'horizontal');
                }, 21);

                scrBoxEl.setAttribute('data-position-horizontal', 'atStart');
            }

            if (opt.vertical) {
                scrBoxEl.classList.add('scrollbox_vertical');

                setTimeout(() => {
                    const winH = winEl.offsetHeight;

                    let innerH = 0;

                    if (this.innerEl) {
                        innerH = winEl.scrollHeight;
                    }

                    if (opt.actionPoints) {
                        opt.actionPoints.forEach(function (pointItem) {
                            if (pointItem.breakpoints[1] >= innerH) {
                                innerH = pointItem.breakpoints[1];
                            }
                        });
                    }

                    if (innerH > winH) {
                        scrBoxEl.classList.add('srollbox_scrollable-vertical');

                        if (opt.mouseWheel && !opt.windowScrollEvent) {
                            scrBoxEl.addEventListener('wheel', wheelHandler);
                        }
                    }

                    this.winSize.Y = winH;
                    this.innerSize.Y = innerH;
                    this.endBreak.Y = innerH - winH;

                    this.scrollBar(false, 'vertical');
                }, 21);

                scrBoxEl.setAttribute('data-position-vertical', 'atStart');
            }

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

            const actionEls = winEl.querySelectorAll('[data-action-element]');

            for (let i = 0; i < actionEls.length; i++) {
                const actEl = actionEls[i];

                this.actionElems[actEl.getAttribute('data-action-element')] = actEl;
            }

            if (opt.drag) {
                this.drag();
            }

            setTimeout(() => {
                this.initialized = true;
            }, 21);
        }

        init();

        // scroll animation
        const scrollAnim = (scrTo, ev, duration, delta) => {
            if (this.isScrolling) return;

            this.isScrolling = true;

            this.delta = delta;

            const scrolled = this.scrolled;

            duration = (duration !== undefined && duration !== null) ? duration : opt.duration;

            if (duration == 0) {
                this.scroll({ Y: (scrTo.Y - scrolled.Y) * 1 + scrolled.Y }, true, ev);
                this.isScrolling = false;
                return;
            }

            animate((progr) => {
                this.scroll({ Y: (scrTo.Y - scrolled.Y) * progr + scrolled.Y }, false, ev);
            }, duration, 'easeInOutQuad', () => {
                this.scroll({ Y: (scrTo.Y - scrolled.Y) * 1 + scrolled.Y }, true, ev);
                this.isScrolling = false;
            });
        }

        // wheel event handler
        wheelHandler = (e) => {
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
                    scrTo = this.scrolled.Y + this.scrollStep;
                } else if (delta < 0) {
                    scrTo = this.scrolled.Y - this.scrollStep;
                }

            } else if (opt.fullSizeStep) {
                if (delta > 0) {
                    scrTo = this.scrolled.Y + this.winSize.Y;
                } else if (delta < 0) {
                    scrTo = this.scrolled.Y - this.winSize.Y;
                }

            } else {
                if (Math.abs(delta) > this.winSize.Y) {
                    if (delta > 0) {
                        delta = this.winSize.Y;
                    } else if (delta < 0) {
                        delta = -this.winSize.Y;
                    }
                }

                if (Math.abs(delta) < 150) {
                    if (delta > 0) {
                        delta = 150;
                    } else if (delta < 0) {
                        delta = -150;
                    }
                }

                scrTo = this.scrolled.Y + delta;
            }

            scrollAnim({ Y: scrTo }, e, null, delta);
        }

        if (opt.windowScrollEvent) {
            let winScroll = 0;

            window.addEventListener('scroll', () => {
                this.delta = window.scrollY - winScroll;
                winScroll = window.scrollY;
                this.scroll({ Y: window.scrollY }, null);
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

            scrollAnim(scrTo, 'scrollTo', dur, scrTo - this.scrolled.Y);

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
            for (const key in options) {
                if (Object.hasOwnProperty.call(options, key)) {
                    const val = options[key];

                    opt[key] = val;
                }
            }
        }

        this.reInit = function () {
            if (this.innerEl) {
                this.innerEl.style = '';
            }

            if (this.bar) {
                this.scrollBar(true);
            }

            init();
        }

        this.destroy = function () {
            this.scrolled = { X: 0, Y: 0 };
            this.initialized = false;

            scrBoxEl.removeEventListener('wheel', wheelHandler);

            const cssClass = [
                'scrollbox_vertical',
                'srollbox_scrollable-vertical',
                'srollbox_scrollable-horizontal',
                'srollbox_dragging'
            ];

            cssClass.forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            if (this.innerEl) {
                this.innerEl.style = '';
            }

            for (const key in this.actionElems) {
                if (Object.hasOwnProperty.call(this.actionElems, key)) {
                    this.actionElems[key].removeAttribute('style');
                }
            }

            this.scrollBar(true);
            this.drag(true);
        }
    }

    Scrollbox.prototype.scroll = function (scrTo, aftScroll, ev) {
        if (scrTo.X === undefined) {
            scrTo.X = this.scrolled.X;
        }

        if (scrTo.Y === undefined) {
            scrTo.Y = this.scrolled.Y;
        }

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

        // break path
        let posX, posY;

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

        // move bars
        if ((this.horizontalBarSlEl || this.verticalBarSlEl) && ev != 'bar') {
            if (this.horizontal) {
                const barW = this.horizontalBarSlEl.parentElement.offsetWidth;

                this.horizontalBarSlEl.style.transform = 'translateX(' + ((barW - this.horizontalBarSlElSize) / 100) * (scrTo.X / (this.endBreak.X / 100)) + 'px)';
            }

            if (this.vertical) {
                const barH = this.verticalBarSlEl.parentElement.offsetHeight;

                this.verticalBarSlEl.style.transform = 'translateY(' + ((barH - this.verticalBarSlElSize) / 100) * (scrTo.Y / (this.endBreak.Y / 100)) + 'px)';
            }
        }

        // inner element
        if (this.innerEl) {
            if (this.horizontal && this.vertical) {
                this.innerEl.style.transform = 'translate(' + (-scrTo.X) + 'px, ' + (-scrTo.Y) + 'px)';
            } else {
                if (this.horizontal) {
                    this.innerEl.style.transform = 'translateX(' + (-scrTo.X) + 'px)';
                } else {
                    this.innerEl.style.transform = 'translateY(' + (-scrTo.Y) + 'px)';
                }
            }
        }

        // action points
        if (this.actionPoints) {
            let currentActionPoints = [],
                prevActionPoints = [],
                nextActionPoints = [],
                lastUsedElemsProps = [];

            this.actionPoints.forEach((pointItem) => {
                if (pointItem.breakpoints[0] < scrTo.Y && scrTo.Y < pointItem.breakpoints[1]) {
                    currentActionPoints.push(pointItem);
                } else if (this.delta > 0 && pointItem.breakpoints[1] <= scrTo.Y) {
                    prevActionPoints.push(pointItem);
                } else if (this.delta < 0 && scrTo.Y <= pointItem.breakpoints[0]) {
                    nextActionPoints.push(pointItem);
                }
            });

            currentActionPoints.forEach((pointItem) => {
                const progress = (scrTo.Y - pointItem.breakpoints[0]) / (pointItem.breakpoints[1] - pointItem.breakpoints[0]);

                for (const elKey in pointItem.elements) {
                    const elemProps = pointItem.elements[elKey];

                    for (const property in elemProps) {
                        if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                            continue;
                        }

                        lastUsedElemsProps.push(elKey + '_' + property);

                        const propsRange = elemProps[property],
                            goTo = (propsRange[1] - propsRange[0]) * progress + propsRange[0];

                        if (this.actionElems[elKey]) {
                            if (propsRange[2]) {
                                this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                            } else {
                                this.actionElems[elKey].style[property] = goTo;

                                if (property == 'opacity') {
                                    if (goTo > 0) {
                                        this.actionElems[elKey].style.visibility = 'visible';
                                    } else {
                                        this.actionElems[elKey].style.visibility = 'hidden';
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (this.delta > 0) {
                prevActionPoints.sort((a, b) => b.breakpoints[1] - a.breakpoints[1]);

                prevActionPoints.forEach((pointItem) => {
                    for (const elKey in pointItem.elements) {
                        const elemProps = pointItem.elements[elKey];

                        for (const property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            const propsRange = elemProps[property],
                                goTo = propsRange[1];

                            if (this.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    this.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            this.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            this.actionElems[elKey].style.visibility = 'hidden';
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            if (this.delta < 0) {
                nextActionPoints.sort((a, b) => a.breakpoints[0] - b.breakpoints[0]);

                nextActionPoints.forEach((pointItem) => {
                    for (const elKey in pointItem.elements) {
                        const elemProps = pointItem.elements[elKey];

                        for (const property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            const propsRange = elemProps[property],
                                goTo = propsRange[0];

                            if (this.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    this.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            this.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            this.actionElems[elKey].style.visibility = 'hidden';
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
            this.onScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
        }

        this.scrBoxEl.setAttribute('data-scr', scrTo.Y);

        // after scroll
        if (aftScroll) {
            this.scrBoxEl.setAttribute('data-scr', scrTo.Y);
            this.scrolled = scrTo;
            this.isBreak = false;

            if (this.onScroll) {
                this.onScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
            }

            if (this.afterScroll) {
                this.afterScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
            }

            this.params = null;
        }
    }

    Scrollbox.prototype.scrollBar = function (destroy, initDirection) {
        if (!this.bar) {
            return;
        }

        if (this.horizontal) {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__horizontal-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized && initDirection == 'horizontal') {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.horizontalBarSlEl = el;
                    }

                    if (this.endBreak.X) {
                        if (this.barSize === null) {
                            this.horizontalBarSlEl.style.width = (this.winSize.X / (this.innerSize.X / 100)) + '%';

                            setTimeout(() => {
                                this.horizontalBarSlElSize = this.horizontalBarSlEl.offsetWidth;
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
            const barEl = this.scrBoxEl.querySelector('.scrollbox__vertical-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized && initDirection == 'vertical') {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.verticalBarSlEl = el;
                    }

                    if (this.endBreak.Y) {
                        if (this.barSize === null) {
                            this.verticalBarSlEl.style.height = (this.winSize.Y / (this.innerSize.Y / 100)) + '%';

                            setTimeout(() => {
                                this.verticalBarSlElSize = this.verticalBarSlEl.offsetHeight;
                            }, 21);

                        } else if (this.barSize === true) {
                            this.verticalBarSlElSize = this.verticalBarSlEl.offsetHeight;
                        } else {
                            this.verticalBarSlEl.style.height = this.barSize + 'px';
                            this.verticalBarSlElSize = this.barSize;
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

        let barSlEl = null;

        const mouseMove = (e) => {
            e.preventDefault();

            if (barSlEl === this.horizontalBarSlEl) {
                const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX;

                mouseDelta.X = clientX - mouseStart.X;

                this.delta = mouseDelta.X;

                let shift = mouseDelta.X + barSlStart.X - bar.X;

                const limit = bar.W - this.horizontalBarSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.horizontalBarSlEl.style.transform = 'translateX(' + shift + 'px)';

                const X = (shift / (limit / 100)) * (this.endBreak.X / 100);

                this.scroll({ X }, null, 'bar');

            } else if (barSlEl === this.verticalBarSlEl) {
                const clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

                mouseDelta.Y = clientY - mouseStart.Y;

                this.delta = mouseDelta.Y;

                let shift = mouseDelta.Y + barSlStart.Y - bar.Y;

                const limit = bar.H - this.verticalBarSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.verticalBarSlEl.style.transform = 'translateY(' + shift + 'px)';

                const Y = (shift / (limit / 100)) * (this.endBreak.Y / 100);

                this.scroll({ Y }, null, 'bar');
            }
        }

        const mouseUp = () => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', mouseMove);

            this.scrBoxEl.classList.remove('scrollbox_dragging');

            barSlEl = null;
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            barSlEl = e.target.closest('div');

            if (barSlEl === this.horizontalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.X = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX;

                bar.X = barSlEl.parentElement.getBoundingClientRect().left;
                bar.W = barSlEl.parentElement.offsetWidth;

                barSlStart.X = barSlEl.getBoundingClientRect().left;

                this.scrBoxEl.classList.add('scrollbox_dragging');

            } else if (barSlEl === this.verticalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.Y = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

                bar.Y = barSlEl.parentElement.getBoundingClientRect().top;
                bar.H = barSlEl.parentElement.offsetHeight;

                barSlStart.Y = barSlEl.getBoundingClientRect().top;

                this.scrBoxEl.classList.add('scrollbox_dragging');
            }
        }

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
    }

    Scrollbox.prototype.drag = function (destroy) {
        const mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            lastScroll = { X: 0, Y: 0 };

        let dragTimeout = null;

        const mouseMove = (e) => {
            e.preventDefault();

            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

            mouseDelta.X = clientX - mouseStart.X;
            mouseDelta.Y = clientY - mouseStart.Y;

            const scrTo = {};

            if (this.horizontal) {
                scrTo.X = lastScroll.X - mouseDelta.X;
            }

            if (this.vertical) {
                scrTo.Y = lastScroll.Y - mouseDelta.Y;
            }

            this.scroll(scrTo, null);
        }

        const mouseUp = () => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', mouseMove);

            this.scrBoxEl.classList.remove('scrollbox_cursor-drag');

            window.clearTimeout(dragTimeout);
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) return;

            const winEl = e.target.closest('.scrollbox__window');

            if (winEl) {
                const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
                    clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

                mouseStart.X = clientX;
                mouseStart.Y = clientY;

                lastScroll.X = this.scrolled.X;
                lastScroll.Y = this.scrolled.Y;

                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                dragTimeout = setTimeout(() => {
                    this.scrBoxEl.classList.add('scrollbox_cursor-drag');
                }, 721);
            }
        }

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
    }
})();