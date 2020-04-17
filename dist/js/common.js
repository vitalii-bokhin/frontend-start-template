document.addEventListener('DOMContentLoaded', function () {
	var fsElem = document.getElementById('js-first-screen');

	(function initFun() {
		if (fsElem) {
			var padTop = 100;

			if (window.innerWidth < 1200) {
				padTop = 60;
			}

			fsElem.style.height = window.innerHeight - padTop + 'px';
		}

		FlexImg('.flex-img');

		CoverImg.reInit('body');

		Tab.reInit();

		// resize events
		window.removeEventListener('winResized', initFun);
		window.removeEventListener('winWidthResized', initFun);

		if (window.innerWidth > 1200) {
			window.addEventListener('winResized', initFun);
		} else {
			window.addEventListener('winWidthResized', initFun);
		}
	})();

	// cover images
	CoverImg.init();

	// toggle button
	Toggle.init({
		button: '.js-toggle',
		onDocumenClickOff: '.js-document-toggle-off',
		offButton: '.js-tgl-off',
		toggledClass: 'toggled' // def: toggled
	});

	Toggle.onChange = function (toggleElem, targetElements, state) {}
	// code...


	// ajax button
	/*Ajax.init('.js-ajax');
 
 Ajax.success = function(response) {
 	//  code...
 }*/

	// popup
	;Popup.init('.js-open-popup');
	MediaPopup.init('.js-open-media-popup');

	// menu
	if (window.innerWidth < 1000) {
		Menu.init('.menu__item_has-children', '.menu__sub-menu');
	}

	// mobile nav
	MobNav.init({
		openBtn: '.js-open-menu',
		closeBtn: '.js-close-menu',
		headerId: 'header',
		closeLink: '.menu a.js-anchor'
	});

	// tooltip
	ToolTip.init({
		element: '.js-tooltip'
	});

	ToolTip.onShow = function (btnEl, tooltipDivEl) {};

	// alert
	new Alert({
		content: 'This content in top alert.',
		position: 'top',
		addClass: 'top-alert-block'
	});

	new Alert({
		content: '<div class="row alert__row row_col-middle row_sm-x-nw"><div class="col">На нашем веб-сайте используются файлы cookies, которые позволяют улучшить Ваше взаимодействие с сайтом. Когда вы посещаете данный веб-сайт, Вы даете согласие на использование файлов cookies.</div><div class="col"><button class="js-alert-close btn btn_be">Хорошо</button></div></div>',
		showOnce: true
	});

	// accord
	Accord.init('.accord__button');

	// more
	More.init('.more__btn');

	// tab
	Tab.init({
		container: '.tab',
		button: '.tab__button',
		item: '.tab__item'
	});

	// video
	Video.init('.video__btn-play');

	// fullscreen scroll
	FsScroll.init({
		container: '.fsscroll',
		screen: '.fsscroll__screen',
		duration: 700
	});

	// screens
	Screens.init({
		horisontal: true
	});

	// Screens2.init({
	// 	container: '.screen-wrap',
	// 	duration: 700, // default - 1000
	// 	menuCurrentClass: 'current' // default - 'menu__item_current'
	// });

	// smooth scroll
	// ScrollSmooth.init();

	// drag line
	DragLine.init({
		lineClass: 'dragline'
	});

	// anchor
	Anchor.init('.js-anchor', 700, 100);
	// Anchor.scroll('section-3');

	// diagram
	var diagram = new Diagram({
		canvasId: 'diagram',
		charts: [{
			value: 37,
			color: 'green',
			width: 20,
			numContId: 'diagram-num-1'
		}, {
			value: 45,
			color: '#d0295e',
			width: 10,
			offset: 2,
			numContId: 'diagram-num-2'
		}],
		maxValue: 100
	});

	// diagram 2
	var diagram_2 = new Diagram({
		canvasId: 'diagram-2',
		charts: [{
			value: 84,
			color: '#fd8d40',
			width: 30,
			numContId: 'diagram-2-num-1'
		}, {
			value: 39,
			color: '#0000ff',
			width: 30,
			offset: 2,
			numContId: 'diagram-2-num-2'
		}],
		maxValue: 100,
		animate: true
	});

	diagram_2.animate(2700);

	// diagram 2
	var diagram_3 = new Diagram({
		canvasId: 'diagram-3',
		charts: [{
			value: 67,
			color: '#fd8d40',
			width: 15,
			numContId: 'diagram-3-num-1'
		}, {
			value: 75,
			color: '#d0295e',
			width: 15,
			offset: 2,
			numContId: 'diagram-3-num-2'
		}, {
			value: 83,
			color: 'green',
			width: 15,
			offset: 2,
			numContId: 'diagram-3-num-3'
		}, {
			value: 91,
			color: '#0000ff',
			width: 15,
			offset: 2,
			numContId: 'diagram-3-num-4'
		}],
		maxValue: 100,
		animate: true
	});

	diagram_3.animate(4200);

	// numberspin
	var numberspin = new Numberspin({
		elemSel: '.numberspin',
		format: true
	});

	numberspin.animate(4200);

	// share
	Share.init('.js-share-btn');

	// timer
	var timer = new Timer({
		elemId: 'timer'
	});

	timer.onStop = function () {
		Popup.message('Timer Stopped');
	};

	timer.start(50);

	// timer 2
	var timer2 = new Timer({
		elemId: 'timer-2',
		format: 'extended'
	});

	timer2.onStop = function () {
		Popup.message('Timer 2 Stopped');
	};

	timer2.start(130);

	// stopwatch
	var stopwatch = new Timer({
		elemId: 'stopwatch',
		stopwatch: true
	});

	stopwatch.onStop = function () {
		Popup.message('Stopwatch Stopped');
	};

	stopwatch.start(0);

	// stopwatch 2
	var stopwatch2 = new Timer({
		elemId: 'stopwatch-1',
		stopwatch: true,
		format: 'extended'
	});

	stopwatch2.onStop = function () {
		Popup.message('Stopwatch Stopped');
	};

	stopwatch2.start(0);

	// get content via Ajax
	var getCont = new GetContentAjax({
		eventBtn: '.js-get-content-ajax',
		event: 'click',
		outputDiv: '#output-ajax',
		sourceFile: '/get-content-ajax.php'
	});

	getCont.output = function (response) {
		var result = response.match(/\<div id\="source"\>([\s\S]*?)\<\/div\>/);

		return result[1];
	};

	var contries;

	// autocomplete data
	AutoComplete.getValues = function (inpElem, returnFun) {
		switch (inpElem.name) {
			case 'fruits':
				returnFun([{ val: "mc", value: "Pinapple", id: 1 }, { val: "vn", value: "Apple", id: 2 }, { val: "eth", value: "Berry", id: 3 }, { val: "ms", value: "Cherry", id: 4 }, { val: "mn", value: "Mandarin", id: 5 }, { val: "mk", value: "Marakuja", id: 6 }], 'value', 'val', 'id');
				break;

			case 'country':
				if (contries) {
					returnFun(contries, 'name', 'name', 'id');
				} else {
					dAirGet.countries(function (c) {
						contries = JSON.parse(c);
						returnFun(contries, 'name', 'name', 'id');
					});
				}
				break;

			default:
				break;
		}
	};

	AutoComplete.onSelect = function (inpElem, val, secVal) {
		if (inpElem.name == 'country') {}
	};

	// submit form
	Form.init('.form');

	Form.onSubmit = function (form, callback) {
		switch (form.id) {
			case 'form-no-ajax':
			case 'search-form':
				return true;

			case 'custom-form-2':
			case 'custom-form-3':
			case 'custom-form-4':
				var files = CustomFile.getFiles(form);

				console.log(files);
				return false;

			default:
				ajax({
					url: form.action,
					send: new FormData(form),
					success: function success(response) {
						var response = JSON.parse(response);

						if (response.status == 'sent') {

							Popup.message('Форма отправлена');
							// ValidateForm.customErrorTip(input, errorTxt, isLockForm);
							// ValidateForm.customFormErrorTip(formElem, errorTxt);
							// Popup.message('Форма отправлена');
							// Popup.message('Форма отправлена', '#message-popup', function() {});

							callback({ clearForm: true, unlockSubmitButton: true });
						} else {
							console.log(response);
						}
					},
					error: function error(response) {
						console.log(response);
					}
				});
				return false;
		}
	};

	// slick slider
	/*$('#slider').on('init', function() {
 	CoverImg.reInit('#slider');
 });
 
 $('#slider').slick({
 	infinite: true,
 	slidesToShow: 1,
 	slidesToScroll: 1
 });*/

	// scroll pane
	// $('.scroll-pane').jScrollPane();

	// masked inputs
	// $('input[data-type="tel"]').mask('+7(999)999-99-99');
	$('input[data-type="tel"]').each(function () {
		new Maskinput(this, 'tel');
	});
	// $('input[data-type="date"]').mask('99.99.9999');

	if ($('.parallax-element').length) {
		new Mouseparallax('.parallax-element', {
			listener: '.section'
		});
	}
});

// GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function (c) {
		var contryObjArr = JSON.parse(c);

		Select.setOptions('.countries', contryObjArr, 'name', 'name', 'id');
	});

	Select.onSelect = function (inpElem, val, secVal) {
		if (inpElem.name == 'country') {
			dAirGet.region(secVal, function (c) {
				var regionObjArr = JSON.parse(c);
				Select.setOptions('.cities', regionObjArr, 'name', 'name');
			});
		}
	};
}

/*
ajax({
	url: 'test-ajax.php',
	send: 'data=return1',
	success: function(response) {
		console.log(response);
	}
});
*/