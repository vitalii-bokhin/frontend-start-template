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
	curVal = [],
	pattern = [];
	
	$Elem.each(function(j) {
		var _$ = $(this),
		val = _$.html().replace(/[\s]/g, '');

		pattern[j] = function(val) {
			val = val.match(/[\.,]/);
			return val;
		}(val);

		console.log(pattern[j]);

		endVal[j] = +val.replace(/[\D]/g, '');
		curVal[j] = 0;
		_$.html(0);
	});

	this.start = function(thiselem) {
		var ind = (thiselem) ? $(elem).index(thiselem) : undefined;
		spin(ind);
	}

	function spin(ind) {

		var $el = $Elem;

		if (ind != undefined) {
			$el = $Elem.eq(ind);
		}

		var elCount = $el.length;

		interval = setInterval(function() {

			$el.each(function(j) {

				var _$ = $(this),
				j = (ind != undefined) ? ind : j;

				if (curVal[j] < endVal[j]) {

					if (options.animation == 1) {

						var d = endVal[j] - curVal[j];

						if (d > 4321321) {
							curVal[j] = curVal[j] + 4321321;
						} else if (d > 321321) {
							curVal[j] = curVal[j] + 321321;
						} else if (d > 32321) {
							curVal[j] = curVal[j] + 32321;
						} else if (d > 2321) {
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

					var output = String(curVal[j]);

					if (pattern[j]) {
						output = output.replace(new RegExp('(\\d{'+ pattern[j].index +'})'), '$1'+ pattern[j][0]);
						output = output.replace(new RegExp('(\\d)(?=(\\d{3})+\\'+ pattern[j][0] +')', 'g'), '$1 ');
					} else {
						output = output.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
					}
					
					_$.html(output);

					if (curVal[j] >= endVal[j]) {
						_$.html(endVal[j]);
						elCount--;
					}

				} else if (ind != undefined) {
					stop();
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



var output1 = String(123456789).replace(/(\d)(?=\d{2}$)/, function(m, p1, os) {
	//console.log(m,p1,os);
	return p1 +'.';
});

//console.log('out-'+ output1);

var output2 = String(123456789).replace(/(\d)(?=(\d{3})+(\d{2}$|$))/g, function(m, p1, p2, p3, os) {
	//console.log(m,p1,p2,p3,os);
	return p1 +' ';
});

//console.log('out-'+ output2);