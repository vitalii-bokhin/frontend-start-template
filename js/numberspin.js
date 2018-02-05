function Numberspin(elem, opt) {
	var _ = this,
	def = {
		animation: 1
	},
	opt = opt || {},
	options = $.extend({}, def, opt),
	interval = null,
	$Elem = $(elem),
	endVal = [],
	curVal = [];
	
	$Elem.each(function(j) {
		var _$ = $(this);
		endVal[j] = +_$.html().replace(/[\D\s]/g, '');
		curVal[j] = 0;
		_$.html(0);
	});

	this.start = function(targelem) {
		//console.log($(elem).index(targelem));
		var ind = (targelem) ? $(elem).index(targelem) : undefined;
		spin(ind);
	}

	function spin(ind) {
		console.log('ind-'+ ind);

		var $el = $Elem;

		if (ind != undefined) {
			$el = $Elem.eq(ind);
			console.log($el);
		}

		var elCount = $el.length;

		console.log(elCount);

		interval = setInterval(function() {

			$el.each(function(j) {

				var _$ = $(this),
				j = (ind != undefined) ? ind : j;

				if (curVal[j] < endVal[j]) {

					if (options.animation == 1) {

						var d = endVal[j] - curVal[j];

						if (d > 2321) {
							curVal[j] = curVal[j] + 2321;
						} else if (d > 1321) {
							curVal[j] = curVal[j] + 1321;
						} else if (d > 321) {
							curVal[j] = curVal[j] + 321;
						} else if (d > 21) {
							curVal[j] = curVal[j] + 21;
						} else {
							curVal[j]++;
						}


					} else if (options.animation == 2) {

						var endValArr = String(endVal[j]).split(''),
						curValArr = String(curVal[j]).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						curVal[j] = curValArr.join('');

					}

					_$.html(curVal[j]);

					if (curVal[j] >= endVal[j]) {
						_$.html(endVal[j]);
						elCount--;
					}

				}

			});

			if (!elCount) {
				stop();
			}

			console.log('spin');

		}, 85);

	}

	function stop() {
		clearInterval(interval);
	}

}

var numberspinObject = [];
function numberspin(elem, opt) {
	if (!(numberspinObject[elem] instanceof Numberspin)) {
		numberspinObject[elem] = new Numberspin(elem, opt);
	}
	return numberspinObject[elem];
}