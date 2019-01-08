/*
new Alert({
	content: 'We use coockie',
	position: 'top', // default - bottom
	showOnce: true // default - false
});
*/

; var Alert;

(function() {
	'use strict';

	var alertIndex = 0;

	Alert = function (opt) {
		opt = opt || {};

		var alertId = 'alert-id-'+ (alertIndex++);

		if (opt.showOnce) {
			let hiddenAlert = window.localStorage.getItem('notShowAlert='+ alertId);

			if (hiddenAlert !== null && hiddenAlert === 'true') {
				return false;
			}
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
			window.localStorage.setItem('notShowAlert='+ alertId, 'true');
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