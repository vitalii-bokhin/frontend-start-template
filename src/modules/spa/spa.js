var SPA;

(function () {
    'use strict';

    SPA = {
        opt: null,
        routeSubscribers: [],

        init: function (opt) {
            this.opt = opt || {};

            // let link;

            // document.addEventListener('click', (e) => {
            //     link = e.target.closest(this.opt.link);

            //     if (link) {
            //         setTimeout(() => {
            //             this.changeTemplate();
            //             link = null;
            //         }, 121);
            //     }
            // });

            window.addEventListener('popstate', () => {
                // if (link) return;

                setTimeout(() => {
                    this.changeTemplate();
                }, 121);
            });

            this.changeTemplate();
        },

        route: function (path, fun) {
            if (typeof fun === 'function') {
                this.routeSubscribers.push({ path, fun });
            }

            return this;
        },

        changeTemplate: function () {
            const hash = window.location.hash;

            let fun, matches;

            for (const item of this.routeSubscribers) {
                if (!hash && !item.path) {
                    fun = item.fun;
                    break;

                } else if (hash && item.path) {
                    matches = hash.match(new RegExp(item.path));

                    if (matches) {
                        fun = item.fun;

                        break;
                    }
                }
            }

            if (!fun) return;

            fun(matches, (data) => {
                const contEl = document.getElementById(data.container),
                    tplEl = document.getElementById(data.template);

                if (!contEl || !tplEl) return;

                contEl.innerHTML = template(data, tplEl.innerHTML, this.opt.tplSign);
            });
        }
    };

})();