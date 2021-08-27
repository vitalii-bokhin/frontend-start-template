/*
ToolTip.init({
    btnSelector: '.js-tooltip',
    notHide: true, // def: false
    clickEvent: true, // def: false
    tipElClass: 'some-class', // def: null
    posCorrect: false, // def: true
});

ToolTip.beforeShow = function(btnEl, tooltipDivEl) {

}

ToolTip.onShow = function(btnEl, tooltipDivEl) {

}

ToolTip.onHide = function() {

}
*/

var ToolTip;

(function () {
    'use strict';

    ToolTip = function (options) {
        this.opt = options || {};

        this.tooltipDiv = null;
        this.tooltipClass = null;
        this.canBeHidden = false;
        this.position = {};
        this.onShow = null;
        this.mO = null;
        
        this.opt.notHide = (this.opt.notHide !== undefined) ? this.opt.notHide : false;
        this.opt.evClick = (this.opt.clickEvent !== undefined) ? this.opt.clickEvent : false;
        this.opt.tipElClass = (this.opt.tipElClass !== undefined) ? this.opt.tipElClass : null;
        this.opt.posCorrect = (this.opt.posCorrect !== undefined) ? this.opt.posCorrect : true;

        let mouseOver = (e) => {
            if (this.canBeHidden) {
                if (!e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
                    this.hide();

                    this.canBeHidden = false;
                }
            } else {
                const elem = e.target.closest(this.opt.btnSelector);

                if (elem) {
                    this.show(elem);
                }
            }
        }

        let mouseClick = (e) => {
            const elem = e.target.closest(this.opt.btnSelector);

            if (elem) {
                e.preventDefault();

                this.hide();

                this.canBeHidden = false;

                this.show(elem);
            }
        }

        if (document.ontouchstart !== undefined || this.opt.evClick) {
            document.addEventListener('click', mouseClick);

        } else {
            document.addEventListener('mouseover', mouseOver);

            document.addEventListener('click', (e) => {
                if (e.target.closest(this.opt.btnSelector)) e.preventDefault();
            });
        }

        this.tooltipDiv = document.createElement('div');
        this.tooltipDiv.className = 'tooltip' + (this.opt.tipElClass ? ' ' + this.opt.tipElClass : '');

        document.body.appendChild(this.tooltipDiv);

        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.tooltip__close');

            if (closeBtn || (this.canBeHidden && !e.target.closest('.tooltip'))) {
                this.hide();
            }
        });
    }

    ToolTip.prototype.show = function (elem) {
        clearTimeout(this.hideTimeout);

        let html = elem.hasAttribute('data-tooltip') ? elem.getAttribute('data-tooltip').replace(/\[(\/?\w+)\]/gi, '<$1>') : '';

        if (this.opt.evClick) html += '<button type="button" class="tooltip__close"></button>';

        this.tooltipDiv.innerHTML = html;

        if (this.beforeShow) {
            this.beforeShow(elem, this.tooltipDiv);
        }

        this.tooltipClass = elem.getAttribute('data-tooltip-class');

        if (window.innerWidth < 750) {
            this.position.X = 'center';
        } else if (elem.hasAttribute('data-tooltip-pos-x')) {
            this.position.X = elem.getAttribute('data-tooltip-pos-x');
        } else {
            this.position.X = 'rout';
        }

        this.position.X = 'center';

        if (elem.hasAttribute('data-tooltip-pos-y')) {
            this.position.Y = elem.getAttribute('data-tooltip-pos-y');
        }

        if (!this.position.Y) this.position.Y = 'topOut';

        if (window.innerWidth < 750 && window.innerHeight > 550) {
            this.position.Y = 'bottomOut';
        }

        if (this.tooltipClass) this.tooltipDiv.classList.add(this.tooltipClass);

        let bubleStyle = this.tooltipDiv.style,
            elemRect = elem.getBoundingClientRect(),
            winW = window.innerWidth,
            coordX,
            coordY;

        switch (this.position.X) {
            case 'center':
                coordX = (elemRect.left + ((elemRect.right - elemRect.left) / 2)) - (this.tooltipDiv.offsetWidth / 2);

                if (coordX < 10) {
                    coordX = 10;
                }

                bubleStyle.left = coordX + 'px';
                bubleStyle.marginLeft = '0';
                bubleStyle.marginRight = '0';
                break;

            case 'leftIn':
                coordX = elemRect.left;
                bubleStyle.left = coordX + 'px';
                break;

            case 'rightIn':
                coordX = window.innerWidth - elemRect.right;
                bubleStyle.right = coordX + 'px';
                break;

            default:
                coordX = elemRect.right;
                bubleStyle.left = coordX + 'px';
                break;
        }

        if ((this.tooltipDiv.offsetWidth + coordX) > winW) {
            bubleStyle.width = (winW - coordX - 10) + 'px';
        }

        // if (tooltipPotentWidth < tooltipMinWidth) {
        // 	tooltipPotentWidth = tooltipMinWidth;

        // 	coordX = window.innerWidth - tooltipMinWidth - 10;
        // }

        switch (this.position.Y) {
            case 'bottomIn':
                coordY = elemRect.bottom + window.pageYOffset - this.tooltipDiv.offsetHeight;
                break;

            case 'bottomOut':
                coordY = elemRect.bottom + window.pageYOffset;
                break;

            default: // topOut
                coordY = elemRect.top + window.pageYOffset - this.tooltipDiv.offsetHeight;
                break;
        }

        if (this.posCorrect && coordY < window.pageYOffset) {
            coordY = window.pageYOffset;
            bubleStyle.marginTop = '0';
        }

        bubleStyle.top = coordY + 'px';

        if (this.onShow) {
            this.onShow(elem, this.tooltipDiv);
        }

        this.tooltipDiv.classList.add('tooltip_visible');

        setTimeout(() => {
            this.canBeHidden = true;
        }, 21);

        this.mO = this.mouseOut.bind(this);

        if (document.ontouchstart !== undefined) {
            document.addEventListener('touchstart', this.mO);

        } else if (this.opt.evClick) {
            document.addEventListener('wheel', this.mO);
        }
    }

    ToolTip.prototype.hide = function () {
        if (this.opt.notHide) return;

        this.tooltipDiv.classList.remove('tooltip_visible');

        this.hideTimeout = setTimeout(() => {
            this.tooltipDiv.removeAttribute('style');
            this.tooltipDiv.innerHTML = '';
            this.position = {};

            if (this.tooltipClass) {
                this.tooltipDiv.classList.remove(this.tooltipClass);

                this.tooltipClass = null;
            }

            if (this.onHide) {
                this.onHide();
            }
        }, 550);
    }

    ToolTip.prototype.mouseOut = function (e) {
        if (this.canBeHidden && !e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
            this.hide();

            this.canBeHidden = false;

            document.removeEventListener('touchstart', this.mO);
            document.removeEventListener('wheel', this.mO);
        }
    }

    return false;

    ToolTip = {
        tooltipDiv: null,
        tooltipClass: null,
        canBeHidden: false,
        position: {},
        onShow: null,
        opt: null,

        init: function (opt) {
            this.opt = opt || {};

            this.opt.notHide = (opt.notHide !== undefined) ? opt.notHide : false;
            this.opt.evClick = (opt.evClick !== undefined) ? opt.evClick : false;

            let mouseOver = (e) => {
                if (this.canBeHidden) {
                    if (!e.target.closest(opt.element) && !e.target.closest('.tooltip')) {
                        this.hide();

                        this.canBeHidden = false;
                    }
                } else {
                    const elem = e.target.closest(opt.element);

                    if (elem) {
                        this.show(elem);
                    }
                }
            }

            let mouseClick = (e) => {
                const elem = e.target.closest(opt.element);

                if (elem) {
                    e.preventDefault();

                    this.hide();
                    this.show(elem);
                }
            }

            if (document.ontouchstart !== undefined || this.opt.evClick) {
                document.addEventListener('click', mouseClick);

            } else {
                document.addEventListener('mouseover', mouseOver);

                document.addEventListener('click', function (e) {
                    if (e.target.closest(opt.element)) e.preventDefault();
                });
            }

            document.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('.tooltip__close');

                if (closeBtn) this.hide();
            });

            //add tooltip to DOM
            this.tooltipDiv = document.createElement('div');
            this.tooltipDiv.className = 'tooltip';

            document.body.appendChild(this.tooltipDiv);
        },

        show: function (elem) {
            clearTimeout(this.hideTimeout);

            let html = elem.hasAttribute('data-tooltip') ? elem.getAttribute('data-tooltip').replace(/\[(\/?\w+)\]/gi, '<$1>') : '';

            if (this.opt.evClick) html += '<button type="button" class="tooltip__close"></button>';

            this.tooltipDiv.innerHTML = html;

            if (this.beforeShow) {
                this.onShow(elem, this.tooltipDiv);
            }

            this.tooltipClass = elem.getAttribute('data-tooltip-class');

            if (window.innerWidth < 750) {
                this.position.X = 'center';
            } else if (elem.hasAttribute('data-tooltip-pos-x')) {
                this.position.X = elem.getAttribute('data-tooltip-pos-x');
            } else {
                this.position.X = 'rout';
            }

            this.position.X = 'center';

            if (elem.hasAttribute('data-tooltip-pos-y')) {
                this.position.Y = elem.getAttribute('data-tooltip-pos-y');
            }

            if (!this.position.Y) this.position.Y = 'topOut';

            if (window.matchMedia('(max-width: 750px) and (min-height: 550px)').matches) {
                this.position.Y = 'bottomOut';
            }

            if (this.tooltipClass) this.tooltipDiv.classList.add(this.tooltipClass);

            let bubleStyle = this.tooltipDiv.style,
                elemRect = elem.getBoundingClientRect(),
                winW = window.innerWidth,
                coordX,
                coordY;

            switch (this.position.X) {
                case 'center':
                    coordX = (elemRect.left + ((elemRect.right - elemRect.left) / 2)) - (this.tooltipDiv.offsetWidth / 2);

                    if (coordX < 10) {
                        coordX = 10;
                    }

                    bubleStyle.left = coordX + 'px';
                    bubleStyle.marginLeft = '0';
                    bubleStyle.marginRight = '0';
                    break;

                case 'leftIn':
                    coordX = elemRect.left;
                    bubleStyle.left = coordX + 'px';
                    break;

                case 'rightIn':
                    coordX = window.innerWidth - elemRect.right;
                    bubleStyle.right = coordX + 'px';
                    break;

                default:
                    coordX = elemRect.right;
                    bubleStyle.left = coordX + 'px';
                    break;
            }

            if ((this.tooltipDiv.offsetWidth + coordX) > winW) {
                bubleStyle.width = (winW - coordX - 10) + 'px';
            }

            // if (tooltipPotentWidth < tooltipMinWidth) {
            // 	tooltipPotentWidth = tooltipMinWidth;

            // 	coordX = window.innerWidth - tooltipMinWidth - 10;
            // }

            switch (this.position.Y) {
                case 'bottomIn':
                    coordY = elemRect.bottom + window.pageYOffset - this.tooltipDiv.offsetHeight;
                    break;

                case 'bottomOut':
                    coordY = elemRect.bottom + window.pageYOffset;
                    break;

                default: // topOut
                    coordY = elemRect.top + window.pageYOffset - this.tooltipDiv.offsetHeight;
                    break;
            }

            if (coordY < window.pageYOffset) {
                coordY = window.pageYOffset;
                bubleStyle.marginTop = '0';
            }

            bubleStyle.top = coordY + 'px';

            if (this.onShow) {
                this.onShow(elem, this.tooltipDiv);
            }

            this.tooltipDiv.classList.add('tooltip_visible');

            this.canBeHidden = true;

            if (document.ontouchstart !== undefined) {
                document.addEventListener('touchstart', this.mouseOut.bind(this));

            } else if (this.opt.evClick) {
                document.addEventListener('wheel', this.mouseOut.bind(this));
            }
        },

        hide: function () {
            if (this.opt.notHide) return;

            this.tooltipDiv.classList.remove('tooltip_visible');

            this.hideTimeout = setTimeout(() => {
                this.tooltipDiv.removeAttribute('style');
                this.tooltipDiv.innerHTML = '';
                this.position = {};

                if (this.tooltipClass) {
                    this.tooltipDiv.classList.remove(this.tooltipClass);

                    this.tooltipClass = null;
                }

                if (this.onHide) {
                    this.onHide();
                }
            }, 550);

        },

        mouseOut: function (e) {
            if (this.canBeHidden && !e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
                this.hide();

                this.canBeHidden = false;

                document.removeEventListener('touchstart', this.mouseOut);
                document.removeEventListener('wheel', this.mouseOut);
            }
        }
    };
})();