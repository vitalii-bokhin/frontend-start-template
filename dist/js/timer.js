var Timer = {
	min: 0,
	sec: 0,
	Interval: null,
	onStop: null,
	init: function(initVal, onStop) {

		this.onStop = onStop || null;
		
		function setCookies() {
			var date = new Date(Date.now() + 86400000);
			document.cookie = 'lastTimer='+ Date.now() +'; expires='+ date.toUTCString();
		}

		function getCookies() {
			var val;
			if (document.cookie) {
				var cokArr = document.cookie.replace(/(\s)+/g, '').split(';');
				for (var i = 0; i < cokArr.length; i++) {
					var keyVal = cokArr[i].split('=');
					if (keyVal[0] == 'lastTimer') {
						val = keyVal[1];
					}
				}
			}
			return val || undefined;
		}

		var cokValue = getCookies();

		if (cokValue) {
			var delta = Math.round((Date.now()-cokValue)/1000);
			if (delta < initVal) {
				initVal = initVal-delta;
			} else {
				setCookies();
			}
		} else {
			setCookies();
		}

		this.min = (initVal > 60) ? Math.floor(initVal/60) : 0;
		this.sec = (initVal > 60) ? Math.round(initVal%60) : initVal;

		this.start();
	},
	counter: function() {
		var _ = this;
		_.Interval = setInterval(function() {
			if (_.sec == 0) {
				if (_.min == 0) {
					_.stop();
				} else {
					_.sec = 59;
					_.min--;
				}
			} else {
				_.sec--;
			}
			_.output();
		}, 1000);
	},
	start: function() {
		this.counter();
	},
	stop: function() {
		clearInterval(this.Interval);
		if (this.onStop) {
			this.onStop();
		}
	},
	output: function() {
		var _ = this, 
		minO  = '',
		secTxt = 'секунд',
		sec,
		output;

		if (_.min != 0) {
			if (_.min == 1) {
				minO = _.min +' минуту';
			} else if (_.min < 5) {
				minO = _.min +' минуты';
			}
		}

		if (_.sec == 1 || _.sec == 21) {
			secTxt = 'секунду';
		} else if (_.sec < 5) {
			secTxt = 'секунды';
		} else if (_.sec < 21) {
			secTxt = 'секунд';
		}

		sec = (_.sec < 10) ? '0'+ _.sec : _.sec;
		
		output = [minO, sec, secTxt].join(' '); 
		
		var el = document.getElementById('timer');
		el.innerHTML = output;
	}
};