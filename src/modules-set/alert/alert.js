/*
new Alert({
	
});
*/

; var Alert;

(function() {
	"use strict";

	Alert = function (opt) {
		opt = opt || {};

		//add alert to DOM
		var alertDiv = document.createElement('div');

		alertDiv.className = 'alert';

		if (opt.content) {
			alertDiv.innerHTML = opt.content;
		}

		if (opt.position == 'top') {
			alertDiv.classList.add('alert_top');
		}

		document.body.appendChild(alertDiv);

		// set content
		this.setContent = function (content) {
			alertDiv.innerHTML = content;
		}

		// hide permanently
		function hidePermanently(params) {
			
		}
	}
})();