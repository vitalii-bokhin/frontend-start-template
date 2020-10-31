var SPA;

(function () {
    'use strict';

    SPA = {
        opt: null,
        routeSubscribers: {},

        init: function (opt) {
            this.opt = opt || {};

            document.addEventListener('click', (e) => {
                const link = e.target.closest(this.opt.link);

                if (link) {
                    this.changeTemplate();
                }
            });
        },

        route: function (path, fun) {
            if (typeof fun === 'function') {
                const key = path.replace(/\W/g, '');
                this.routeSubscribers[key] = fun;
            }
        },

        changeTemplate: function () {
            const hash = window.location.hash.replace('#', ''),
                key = hash.replace(/\W/g, '');

            this.routeSubscribers[key]();
        },

        start: function () {
            const hash = window.location.hash.replace('#', '');

            if (document.querySelectorAll('[data-path^="' + hash + '"]')) {
                this.changeTemplate();
            }
        }


    };

})();