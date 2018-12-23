; var Timer;

(function() {
	'use strict';

	Timer = function(options) {
		var elem = document.getElementById(options.elemId);

		function setCookie() {
			document.cookie = 'lastTimestampValue-'+ options.elemId +'='+ Date.now() +'; expires='+ new Date(Date.now() + 259200000).toUTCString();
		}

		function output(time) {
			var min = (time > 60) ? Math.floor(time / 60) : 0,
			sec = (time > 60) ? Math.round(time % 60) : time,
			timerOut;

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

				var minOut = (min != 0) ? min +' '+ minTxt : '',
				secNum = (sec < 10) ? '0'+ sec : sec;

				timerOut = ((min) ? min +' '+ minTxt +' ' : '')+''+ sec +' '+ secTxt;
			} else {
				var minNum =  (min < 10) ? '0'+ min : min,
				secNum = (sec < 10) ? '0'+ sec : sec;

				timerOut = minNum +':'+ secNum;
			}

			elem.innerHTML = timerOut;
		}

		this.stop = function() {
			clearInterval(this.interval);

			if (this.onStop) {
				setTimeout(this.onStop);
			}
		}

		this.start = function(startTime) {
			if (!elem) return;
			
			this.time = startTime;

			var lastTimestampValue = (function(cookie) {
				if (cookie) {
					var reg = new RegExp('lastTimestampValue-'+ options.elemId +'=(\\d+)', 'i'),
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
			
			this.interval = setInterval(() => {
				if (options.stopwatch) {
					this.time++;

					output(this.time);
				} else {
					this.time--;

					output(this.time);

					if (this.time == 0) {
						this.stop();
					}
				}
			}, 1000);
		}
	}
})();