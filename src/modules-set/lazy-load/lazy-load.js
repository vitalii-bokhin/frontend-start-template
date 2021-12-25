/* 
new LazyLoad({
   selector: @Str,
   event: true,  // def: false
   flexible: true, // def: false
   delay: 2000, // def: 1000
   onDemand: true // def: false
});
*/

; var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function (opt) {
        opt = opt || {};

        opt.event = opt.event || false;
        opt.flexible = opt.flexible || false;
        opt.onDemand = opt.onDemand || false;

        this.opt = opt;

        const elements = document.querySelectorAll(opt.selector);

        this.elements = elements;

        if (elements) {
            if (opt.event) {
                if (opt.event == 'scroll') {
                    window.addEventListener('scroll', function (e) {
                        for (let i = 0; i < elements.length; i++) {
                            const el = elements[i];
                        }
                    });
                }
            } else if (!opt.onDemand) {
                setTimeout(() => {
                    this.doLoad();
                }, opt.delay || 1000);
            }
        }
    }

    LazyLoad.prototype.doLoad = function () {
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];

            if (this.opt.flexible) {
                if (elem.hasAttribute('data-src')) {
                    const arr = elem.getAttribute('data-src').split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    elem.src = resultImg;

                } else if (elem.hasAttribute('data-bg-url')) {
                    const arr = elem.getAttribute('data-bg-url').split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    elem.style.backgroundImage = 'url(' + resultImg + ')';
                }

            } else {
                if (elem.hasAttribute('data-src')) {
                    elem.src = elem.getAttribute('data-src');
                } else if (elem.hasAttribute('data-bg-url')) {
                    elem.style.backgroundImage = 'url(' + elem.getAttribute('data-bg-url') + ')';
                }
            }
        }
    }

    LazyLoad.prototype.reInit = function () {
        this.doLoad(this.elements);
    }
})();