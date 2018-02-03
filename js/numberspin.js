function Numberspin(elem, opt) {
	var _ = this;

	var def = {
		animation: 1
	},
	opt = opt || {};
	_.options = $.extend({}, def, opt);

	_.$Elem = $(elem);
	_.endVal = [];
	_.curVal = [];

	_.interval = null;
	
	_.init = function() {

		_.$Elem.each(function(j) {
			var _$ = $(this);
			_.endVal[j] = +_$.html().replace(/[\D\s]/g, '');
			_.curVal[j] = 0;
			_$.html(0);
		});

	}

	_.spin = function() {
		var elCount = $(_.$Elem).length;

		_.interval = setInterval(function() {

			_.$Elem.each(function(j) {

				var _$ = $(this);

				if (_.curVal[j] < _.endVal[j]) {

					if (_.options.animation == 1) {

						var d = _.endVal[j] - _.curVal[j];

						if (d > 2321) {
							_.curVal[j] = _.curVal[j] + 2321;
						} else if (d > 1321) {
							_.curVal[j] = _.curVal[j] + 1321;
						} else if (d > 321) {
							_.curVal[j] = _.curVal[j] + 321;
						} else if (d > 21) {
							_.curVal[j] = _.curVal[j] + 21;
						} else {
							_.curVal[j]++;
						}


					} else if (_.options.animation == 2) {

						var endValArr = String(_.endVal[j]).split(''),
						curValArr = String(_.curVal[j]).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						_.curVal[j] = curValArr.join('');

					}

					_$.html(_.curVal[j]);

					if (_.curVal[j] >= _.endVal[j]) {
						_$.html(_.endVal[j]);
						elCount--;
					}

				}

			});

			if (!elCount) {
				_.stop();
			}

			console.log('spin');

		}, 85);

	}

	_.start = function() {
		_.spin();
	}

	_.stop = function() {
		clearInterval(_.interval);
	}

	_.init();

}

var numberspinObject = [];
function numberspin(elem, opt) {
	if (!(numberspinObject[elem] instanceof Numberspin)) {
		numberspinObject[elem] = new Numberspin(elem, opt);
	}
	return numberspinObject[elem];
}