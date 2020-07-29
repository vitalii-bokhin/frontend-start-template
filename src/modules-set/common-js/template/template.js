; var template;

(function () {
    'use strict';

    template = function (data, template) {
        let result = template;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<%' + key + '%>', 'g'), data[key]);
            }
        }

        return result;
    }
})();