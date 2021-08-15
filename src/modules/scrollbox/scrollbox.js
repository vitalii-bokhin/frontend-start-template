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

        if (opt.horizontal && !opt.vertical) {
            opt.vertical = false;
        } else {
            opt.vertical = true;
        }

        opt.fullSizeStep = (opt.fullSizeStep !== undefined) ? opt.fullSizeStep : false;
        opt.nestedScrollbox = (opt.nestedScrollbox !== undefined) ? opt.nestedScrollbox : null;
        opt.parentScrollbox = (opt.parentScrollbox !== undefined) ? opt.parentScrollbox : null;
        opt.childrenScrollbox = (opt.childrenScrollbox !== undefined) ? opt.childrenScrollbox : null;
        opt.evListenerEl = (opt.evListenerEl !== undefined) ? opt.evListenerEl : null;
        opt.duration = (opt.duration !== undefined) ? opt.duration : 1000;
        opt.bar = (opt.bar !== undefined) ? opt.bar : false;
        opt.barSize = (opt.barSize !== undefined) ? opt.barSize : null;
        opt.drag = (opt.drag !== undefined) ? opt.drag : false;

        const winEl = scrBoxEl.querySelector('.scrollbox__window'),
            innerEl = scrBoxEl.querySelector('.scrollbox__inner');

        scrBoxEl.setAttribute('tabindex', '-1');

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
                    if (this.innerEl) {
                        const innerH = winEl.scrollHeight,
                            winH = winEl.offsetHeight;

                        if (innerH > winH) {
                            scrBoxEl.classList.add('srollbox_scrollable-vertical');
                        }

                        this.winSize.Y = winH;
                        this.innerSize.Y = innerH;
                        this.endBreak.Y = innerH - winH;
                    }

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

            duration = (duration !== undefined) ? duration : opt.duration;

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

            if (opt.fullSizeStep) {
                if (delta > 0) {
                    scrTo = this.scrolled.Y + this.winSize;
                } else if (delta < 0) {
                    scrTo = this.scrolled.Y - this.winSize;
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

                scrTo = this.scrolled.Y + delta;
            }

            scrollAnim({ Y: scrTo }, e, undefined, delta);
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

        }

        this.reInit = function () {
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

            innerEl.style.transform = '';

            this.actionEls.forEach(function (item) {
                item.el.style.transform = '';
            });

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

        let posX, posY;

        if (scrTo.X >= this.endBreak.X) {
            scrTo.X = this.endBreak.X;

            posX = 'atEnd';

        } else if (scrTo.X <= 0) {
            scrTo.X = 0;

            posX = 'atStart';
        }

        if (posX) {
            this.scrBoxEl.setAttribute('data-position-horizontal', posX);
        } else {
            this.scrBoxEl.removeAttribute('data-position-horizontal');
        }

        if (scrTo.Y >= this.endBreak.Y) {
            scrTo.Y = this.endBreak.Y;

            posY = 'atEnd';

        } else if (scrTo.Y <= 0) {
            scrTo.Y = 0;

            posY = 'atStart';
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

        this.scrolled = scrTo;

        // move
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

        if (this.onScroll) this.onScroll(this.scrBoxEl, pos, ev, scrTo, this.params);

        // after scroll
        if (aftScroll) {
            this.scrolled = scrTo;
            this.isBreak = false;

            if (this.afterScroll) this.afterScroll(this.scrBoxEl, pos, ev, scrTo, this.params);

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
            if (barSlEl === this.horizontalBarSlEl) {
                mouseDelta.X = e.clientX - mouseStart.X;

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
                mouseDelta.Y = e.clientY - mouseStart.Y;

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

            this.scrBoxEl.classList.remove('scrollbox_dragging');

            barSlEl = null;
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) return;

            barSlEl = e.target.closest('div');

            if (barSlEl === this.horizontalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);

                mouseStart.X = e.clientX;

                bar.X = barSlEl.parentElement.getBoundingClientRect().left;
                bar.W = barSlEl.parentElement.offsetWidth;

                barSlStart.X = barSlEl.getBoundingClientRect().left;

                this.scrBoxEl.classList.add('scrollbox_dragging');

            } else if (barSlEl === this.verticalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);

                mouseStart.Y = e.clientY;

                bar.Y = barSlEl.parentElement.getBoundingClientRect().top;
                bar.H = barSlEl.parentElement.offsetHeight;

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

    Scrollbox.prototype.drag = function (destroy) {
        const mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            lastScroll = { X: 0, Y: 0 };

        const mouseMove = (e) => {
            mouseDelta.X = e.clientX - mouseStart.X;
            mouseDelta.Y = e.clientY - mouseStart.Y;

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

            this.scrBoxEl.classList.remove('scrollbox_cursor-drag');
        }

        const mouseDown = (e) => {
            console.log(e);
            if (e.type == 'mousedown' && e.which != 1) return;

            const winEl = e.target.closest('.scrollbox__window');

            if (winEl) {
                document.addEventListener('mousemove', mouseMove);

                mouseStart.X = e.clientX;
                mouseStart.Y = e.clientY;

                lastScroll.X = this.scrolled.X;
                lastScroll.Y = this.scrolled.Y;

                this.scrBoxEl.classList.add('scrollbox_cursor-drag');
            }
        }

        if (!this.initialized && !destroy) {
            console.log('init drag');
            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('mouseup', mouseUp);

        } else if (destroy) {
            document.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('mouseup', mouseUp);
        }
    }
})();