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

        result = result.replace(/<%if (\w+)%>(.*?)<%endif%>/gs, function (match, p1, p2, offset, input) {
            if (p1.indexOf('==') !== -1) {
                if (condition) {
                    
                } else {
                    
                }
            } else {
                if (data[p1] !== '' && data[p1] !== false && data[p1] !== undefined && data[p1] !== null) {
                    return p2;
                } else {
                    return '';
                }
            }

            
        });

        return result;
    }
})();