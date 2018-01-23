var Timer = {
	min: 0,
	sec: 0,
	timer: null,
	init: function(val) {
		this.min = val[0];
		this.sec = val[1];
		
		if (document.cookie) {
			console.log('c-'+ document.cookie);
		} else {
			console.log(Date.now());
			//document.cookie = 'lastTimer='+ Date.now();
			console.log('sc');
		}

		this.start();
	},
	walk: function() {
		var _ = this;
		_.timer = setInterval(function() {
			if (_.sec == 0) {
				_.sec = 59;
				_.min--;
			} else {
				_.sec--;
			}

			if (_.min == 0 && _.sec == 0) {
				_.stop();
			}

			_.output();
		}, 1000);
	},
	start: function() {
		this.walk();
	},
	stop: function() {
		this.timer = clearInterval();
	},
	output: function() {
		var _ = this, 
		minTxt  = 'минуты',
		secTxt = 'секунды',
		sec,
		output;

		if (_.min == 1) {
			minTxt = 'минуту';
		} else if (_.min < 5) {
			minTxt = 'минуты';
		}

		if (_.sec == 1 || _.sec == 21) {
			secTxt = 'секунду';
		} else if (_.sec < 5) {
			secTxt = 'секунды';
		} else if (_.sec < 21) {
			secTxt = 'секунд';
		}

		sec = (_.sec < 10) ? '0'+ _.sec : _.sec;
		
		output = [_.min, minTxt, sec, secTxt].join(' '); 
		
		$('#timer').html(output);
	}
};


$(document).ready(function() {
	Timer.init([5,0]);
});