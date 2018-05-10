function Mouseparallax(elem, options) {
	var _ = this,
	defaultOpt = {
		listener: document,
		deltaX: 21,
		deltaY: 21,
		rangeX: [],
		rangeY: [],
	},
	options = options || {},
	opt = $.extend({}, defaultOpt, options),
	$elem = $(elem),
	startMousePos = {X: 0, Y: 0},
	listenerW = $(opt.listener).innerWidth(),
	listenerH = $(opt.listener).innerHeight(),
	cursorPos = {X: 0, Y: 0},
	direct = {};

	_.translateElement = {X: 0, Y: 0};
	_.startElementPos = {X: 0, Y: 0};

	if ($elem.attr('data-delta-x') != undefined) {
		opt.deltaX = +$elem.attr('data-delta-x');
	}

	if ($elem.attr('data-delta-y') != undefined) {
		opt.deltaY = +$elem.attr('data-delta-y');
	}

	if ($elem.attr('data-range-x') != undefined) {
		opt.rangeX = $elem.attr('data-range-x').split(',');
	}

	if ($elem.attr('data-range-y') != undefined) {
		opt.rangeY = $elem.attr('data-range-y').split(',');
	}
	
	$(document).on('mouseenter', opt.listener, function(e) {
		startMousePos.X = e.clientX;
		startMousePos.Y = e.clientY;
	});

	$(document).on('mousemove', opt.listener, function(e) {

		if (e.clientX > cursorPos.X) {
			direct.X = 'right';
		} else {
			direct.X = 'left';
		}
		cursorPos.X = e.clientX;

		if (e.clientY > cursorPos.Y) {
			direct.Y = 'up';
		} else {
			direct.Y = 'down';
		}
		cursorPos.Y = e.clientY;

		var deltaMouse = {
			X: e.clientX - startMousePos.X,
			Y: e.clientY - startMousePos.Y
		};

		_.translateElement = {
			X: deltaMouse.X * (opt.deltaX / listenerW) + _.startElementPos.X,
			Y: deltaMouse.Y * (opt.deltaY / listenerH) + _.startElementPos.Y
		};

		var translateX = _.translateElement.X,
		translateY = _.translateElement.Y;

		if (opt.rangeX) {
			if (_.translateElement.X >= opt.rangeX[0]) {
				if (direct.X == 'left') {
					startMousePos.X = e.clientX;
					_.startElementPos.X = +opt.rangeX[0];
				}
				translateX = opt.rangeX[0];
			} else if (_.translateElement.X <= opt.rangeX[1]) {
				if (direct.X == 'right') {
					startMousePos.X = e.clientX;
					_.startElementPos.X = +opt.rangeX[1];
				}
				translateX = opt.rangeX[1];
			}
		}

		if (opt.rangeY) {
			if (_.translateElement.Y >= opt.rangeY[0]) {
				if (direct.Y == 'down') {
					startMousePos.Y = e.clientY;
					_.startElementPos.Y = +opt.rangeY[0];
				}
				translateY = opt.rangeY[0];
			} else if (_.translateElement.Y <= opt.rangeY[1]) {
				if (direct.Y == 'up') {
					startMousePos.Y = e.clientY;
					_.startElementPos.Y = +opt.rangeY[1];
				}
				translateY = opt.rangeY[1];
			}
		}

		$elem.css('transform', 'translate('+ translateX +'px, '+ translateY +'px)');

	});

	$(document).on('mouseleave', opt.listener, function(e) {
		_.startElementPos.X = _.translateElement.X;
		_.startElementPos.Y = _.translateElement.Y;
	});

}

var mousePlxObj = [], i = 0, ind;
function mouseparallax(elem, options) {

	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	i++;

	if (!(mousePlxObj[elem+ind] instanceof Mouseparallax)) {
		mousePlxObj[elem+ind] = new Mouseparallax(elem, options);
	}

	return mousePlxObj[elem+ind];
}