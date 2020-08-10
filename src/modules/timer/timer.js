/* 
var timer = new Timer({
	elemId: 'timer', // Str element id,
	format: 'extended', // default - false
	stopwatch: true, // default - false
	continue: false // default - false
});

timer.onStop = function () {
	
}

timer.start(Int interval in seconds);
*/

; var Timer;

(function () {
	'use strict';

	Timer = function (options) {
		options = options || {};

		var elem = document.getElementById(options.elemId);

		let tickSubscribers = [];

		options.continue = (options.continue !== undefined) ? options.continue : false;

		function setCookie() {
			if (options.continue) {
				document.cookie = 'lastTimestampValue-' + options.elemId + '=' + Date.now() + '; expires=' + new Date(Date.now() + 259200000).toUTCString();
			}
		}

		function output(time) {
			let day = time > 86400 ? Math.floor(time / 86400) : 0,
				hour = time > 3600 ? Math.floor(time / 3600) : 0,
				min = time > 60 ? Math.floor(time / 60) : 0,
				sec = time > 60 ? Math.round(time % 60) : time;

			if (hour > 24) {
				hour = hour % 24;
			}

			if (min > 60) {
				min = min % 60;
			}

			let timerOut;

			if (options.format == 'extended') {
				function numToWord(num, wordsArr) {
					num %= 100;

					if (num > 20) {
						num %= 10;
					}

					switch (num) {
						case 1:
							return wordsArr[0];

						case 2:
						case 3:
						case 4:
							return wordsArr[1];

						default:
							return wordsArr[2];
					}
				}

				var minTxt = numToWord(min, ['минуту', 'минуты', 'минут']),
					secTxt = numToWord(sec, ['секунду', 'секунды', 'секунд']);

				var minOut = (min != 0) ? min + ' ' + minTxt : '',
					secNum = (sec < 10) ? '0' + sec : sec;

				timerOut = ((min) ? min + ' ' + minTxt + ' ' : '') + '' + sec + ' ' + secTxt;
			} else {
				var minNum = (min < 10) ? '0' + min : min,
					secNum = (sec < 10) ? '0' + sec : sec;

				timerOut = minNum + ':' + secNum;
			}

			if (elem) elem.innerHTML = timerOut;

			if (tickSubscribers.length) {
				tickSubscribers.forEach(function (item) {
					item(time, { day, hour, min, sec });
				});
			}
		}

		this.onTick = function (fun) {
			if (typeof fun === 'function') {
				tickSubscribers.push(fun);
			}
		}

		this.stop = function () {
			clearInterval(this.interval);

			if (this.onStop) {
				setTimeout(this.onStop);
			}
		}

		this.pause = function () {
			clearInterval(this.interval);
		}

		this.start = function (startTime) {
			this.time = +startTime || 0;

			var lastTimestampValue = (function (cookie) {
				if (cookie) {
					var reg = new RegExp('lastTimestampValue-' + options.elemId + '=(\\d+)', 'i'),
						matchArr = cookie.match(reg);

					return matchArr ? matchArr[1] : null;
				}
			})(document.cookie);

			if (lastTimestampValue) {
				var delta = Math.round((Date.now() - lastTimestampValue) / 1000);

				if (options.stopwatch) {
					this.time += delta;
				} else {
					if (this.time > delta) {
						this.time -= delta;
					} else {
						setCookie();
					}
				}
			} else {
				setCookie();
			}

			output(this.time);

			if (this.interval !== undefined) {
				clearInterval(this.interval);
			}

			this.interval = setInterval(() => {
				if (options.stopwatch) {
					this.time++;

					output(this.time);
				} else {
					this.time--;

					if (this.time <= 0) {
						this.stop();
					} else {
						output(this.time);
					}
				}
			}, 1000);
		}
	}
})();