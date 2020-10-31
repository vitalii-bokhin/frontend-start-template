var SPA;

(function () {
    'use strict';

    SPA = {
        opt: null,
        routeSubscribers: {},

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
                const key = path ? path.replace(/\W/g, '') : 'isFrontSpaPage';
                this.routeSubscribers[key] = fun;
            }

            return this;
        },

        changeTemplate: function () {
            const hash = window.location.hash.replace('#', ''),
                key = hash.length ? hash.replace(/\W/g, '') : 'isFrontSpaPage';

            if (!this.routeSubscribers[key]) return;

            this.routeSubscribers[key](function (data) {
                const contEl = document.getElementById(data.container),
                    tplEl = document.getElementById(data.template);

                if (!contEl || !tplEl) return;

                contEl.innerHTML = template(data, tplEl.innerHTML);
            });
        }
    };

})();