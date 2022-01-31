// global variables
; var browser, elemIsHidden, ajax, LocStor;

(function () {
    'use strict';

    // Get useragent
    document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());

    // Browser identify
    browser = (function (userAgent) {
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
        window.CustomEvent = function (event, params) {
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

    window.addEventListener('resize', function () {
        if (rsz) {
            rsz = false;

            setTimeout(function () {
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
    elemIsHidden = function (elem, exclude) {
        exclude = exclude || [];

        while (elem) {
            if (!elem) break;

            const compStyle = getComputedStyle(elem);

            if (
                compStyle.display == 'none' ||
                compStyle.visibility == 'hidden' ||
                (!exclude.includes('opacity') && compStyle.opacity == '0')
            ) return true;

            elem = elem.parentElement;
        }

        return false;
    }

    // Ajax
    ajax = function (options) {
        const xhr = new XMLHttpRequest();

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
        }

        xhr.send(options.send);
    }



    // Local Storage
    LocStor = {
        set: function (prop, val) {
            window.localStorage.setItem(prop, val);
        },

        get: function (prop) {
            const val = window.localStorage.getItem(prop);

            return (val !== null) ? val : false;
        }
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

; var MobNav;

(function () {
    'use strict';

    // fix header
    document.addEventListener('DOMContentLoaded', function () {
        const headerElem = document.getElementById('header');

        let scrTop = 0,
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

                } else if (
                    !document.body.classList.contains('popup-is-opened') &&
                    !document.body.classList.contains('mob-nav-is-opened')
                ) {
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

(function () {
    'use strict';

    Menu = {
        toggle: function (elem, elementStr, subMenuStr) {
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

        init: function (elementStr, subMenuStr, viewport) {
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (!elem || window.innerWidth > viewport) return;

                if (e.target.getAttribute('href') == '#') e.preventDefault();

                this.toggle(elem, elementStr, subMenuStr);
            });
        }
    };
})();
//# sourceMappingURL=script.head.js.map
