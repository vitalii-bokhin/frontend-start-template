/*
new Alert({
	
});
*/

; var Alert;

(function() {
	'use strict';

	var alertIndex = 0;

	Alert = function (opt) {
		opt = opt || {};

		var alertId = 'alert-id-'+ alertIndex++;

		if (opt.showOnce && document.cookie) {
			var reg = new RegExp('lastTimestampValue-'+ options.elemId +'=(\\d+)', 'i'),
			matchArr = cookie.match(reg);

			return matchArr ? matchArr[1] : null;
		}

		//add alert to DOM
		var alertElem = document.createElement('div');

		alertElem.className = 'alert';

		alertElem.id = alertId;

		alertElem.innerHTML = '<div></div><button class="alert-close-btn"></button>';

		document.body.appendChild(alertElem);

		if (opt.position == 'top') {
			alertElem.classList.add('alert_top');
		}
		
		// set content
		this.setContent = function (content) {
			alertElem.querySelector('div').innerHTML = content;
		}

		if (opt.content) {
			this.setContent(opt.content);
		}

		// hide permanently
		function hidePermanently() {
			document.cookie = 'notShowAlert='+ alertId +'; expires='+ new Date(Date.now() + 86400).toUTCString();
		}

		// hide
		function hide() {
			alertElem.classList.add('alert_hidden');
			
			if (opt.showOnce) {
				hidePermanently();
			}
		}

		alertElem.querySelector('.alert-close-btn').addEventListener('click', hide);
	}
})();