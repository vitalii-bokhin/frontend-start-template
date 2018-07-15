; var Timer;

(function() {
	"use strict";

	Timer = function(setTime, elemId) {
		this.time = setTime;
		this.interval = null;
		this.onStop = null;

		function setCookies() {
			document.cookie = 'lastTimer'+ elemId +'='+ Date.now() +'; expires='+ new Date(Date.now() + 86400000).toUTCString();
		}

		var timerCookieValue = (function() {
			if (document.cookie) {
				var cokArr = document.cookie.replace(/(\s)+/g, '').split(';');

				for (var i = 0; i < cokArr.length; i++) {
					var keyVal = cokArr[i].split('=');
					if (keyVal[0] == 'lastTimer'+ elemId) {
						return keyVal[1];
					}
				}
			}
		}());

		if (timerCookieValue) {
			var delta = Math.round((Date.now() - timerCookieValue) / 1000);
			if (delta < this.time) {
				this.time = this.time - delta;
			} else {
				setCookies();
			}
		} else {
			setCookies();
		}

		function output(time) {
			var min = (time > 60) ? Math.floor(time / 60) : 0,
			sec = (time > 60) ? Math.round(time % 60) : time,
			minOut  = '',
			secTxt = 'секунд';

			if (min != 0) {
				if (min == 1) {
					minOut = min +' минуту';
				} else if (min < 5) {
					minOut = min +' минуты';
				}
			}

			if (sec == 1 || sec == 21) {
				secTxt = 'секунду';
			} else if (sec < 5) {
				secTxt = 'секунды';
			} else if (sec < 21) {
				secTxt = 'секунд';
			}

			var secNum = (sec < 10) ? '0'+ sec : sec;

			var output = [minOut, secNum, secTxt].join(' ');

			console.log(sec);

			document.getElementById(elemId).innerHTML = output;
		}

		var stop = () => {
			clearInterval(this.interval);

			if (this.onStop) {
				setTimeout(this.onStop);
			}
		}

		this.start = function() {
			this.interval = setInterval(() => {
				this.time--;

				output(this.time);

				if (this.time == 0) {
					stop();
				}
			}, 1000);
		}
	}
}());