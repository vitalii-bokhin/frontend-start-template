; var template;

(function () {
    'use strict';

    template = function (data, template, sign) {
        const s = sign || '%';

        let result = template;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            if (data[p1] !== '' && data[p1] !== false && data[p1] !== undefined && data[p1] !== null) {
                return p2;
            } else {
                return '';
            }
        });

        result = result.replace(new RegExp('<' + s + 'forEach (\\w+)' + s + '>(.*?)<' + s + 'end' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            console.log(match);
            console.log(p1);
            console.log(p2);
            return data[p1].map(function(item) {
                for (const key in item) {
                    if (data.hasOwnProperty(key)) {
                        return p2.replace(new RegExp('<' + s + key + s + '>', 'g'), item[key]);
                    }
                }
            }).join('');
        });

        return result;
    }
})();