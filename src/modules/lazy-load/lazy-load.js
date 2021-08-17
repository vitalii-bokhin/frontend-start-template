/* 
new LazyLoad({
   selector: @Str,
   event: false,
   flexible: true
});

const lazy = new LazyLoad().load;
lazy('.el-sel');
*/

; var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function (opt) {
        opt = opt || {};

        this.opt = opt;

        this.opt.flexible = this.opt.flexible || false;

        const elements = document.querySelectorAll(opt.selector);

        if (elements) {
            if (opt.event) {
                if (opt.event == 'scroll') {
                    window.addEventListener('scroll', function (e) {
                        for (let i = 0; i < elements.length; i++) {
                            const el = elements[i];
                        }
                    });
                }
            } else {
                setTimeout(() => {
                    this.doLoad(elements);
                }, 1000);
            }
        }

        return {
            load: (sel) => {
                this.doLoad(document.querySelectorAll(sel));
            }
        }
    }

    LazyLoad.prototype.doLoad = function (elems) {
        for (let i = 0; i < elems.length; i++) {
            const elem = elems[i];

            if (this.opt.flexible) {
                if (elem.hasAttribute('data-src')) {
                    const arr = elem.getAttribute('data-src').split(',');

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            elem.src = props[1];
                        }
                    });

                } else if (elem.hasAttribute('data-bg-url')) {
                    const arr = elem.getAttribute('data-bg-url').split(',');

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
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
        }
    }
})();