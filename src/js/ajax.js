; var ajax;

(function() {
	"use strict";

	ajax = function(options) {
		var xhr = new XMLHttpRequest();

		xhr.open('POST', options.url);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				options.success(xhr.response);
			}
		}

		xhr.send(options.send);
	}
}());