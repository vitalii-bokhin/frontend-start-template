/* 
new LazyLoad({
   selector: @Str,
   event: false
});

const lazy = new LazyLoad().load;
lazy('.el-sel');
*/

; var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function (opt) {
        opt = opt || {};

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
                const elements = document.querySelectorAll(sel);
                this.doLoad(elements);
            }
        }
    }

    LazyLoad.prototype.doLoad = function (elems) {
        for (let i = 0; i < elems.length; i++) {
            const elem = elems[i];

            if (elem.hasAttribute('data-src')) {
                elem.src = elem.getAttribute('data-src');
            } else if (elem.hasAttribute('data-bg-url')) {
                elem.style.backgroundImage = 'url(' + elem.getAttribute('data-bg-url') + ')';
            }
        }
    }
})();