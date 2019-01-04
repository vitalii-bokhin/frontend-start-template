document.addEventListener('DOMContentLoaded', function() {
	(function initFun() {
		if (window.innerWidth < 1200) {
			var fsElem = document.querySelector('.first-screen');
			
			if (fsElem) {
				fsElem.style.height = window.innerHeight +'px';
			}
		}
		
		FlexImg('.flex-img');
		
		CoverImg.reInit('body');
		
		Tab.reInit();
		
		window.addEventListener('winResized', initFun);
	})();
	
	// init cover images
	CoverImg.init();
	
	// init toggle button
	Toggle.init('.js-toggle', '.js-document-toggle-off');
	
	Toggle.onChange = function(tgl, state) {
		
	}
	
	// ajax button
	/*Ajax.init('.js-ajax');
	
	Ajax.success = function(response) {
		//  code...
	}*/
	
	// popup init
	Popup.init('.js-open-popup');
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
		menuLinkSelector: '.menu a'
	});
	
	// bubble
	Bubble.init({
		element: '.js-bubble'
	});
	
	// alert
	new Alert({
		content: 'We use coockie top',
		position: 'top'
	});

	new Alert({
		content: 'We use coockie',
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
	
	// smooth scroll
	// ScrollSmooth.init();

	// drag line
	DragLine.init({
		lineClass: 'dragline'
	})
	
	// anchor
	Anchor.init('.js-anchor', 700, 100);
	
	// diagram
	var diagram = new Diagram({
		canvasId: 'diagram',
		charts: [
			{
				value: 37,
				color: 'green',
				width: 20,
				numContId: 'diagram-num-1'
			},
			{
				value: 45,
				color: '#d0295e',
				width: 10,
				offset: 2,
				numContId: 'diagram-num-2'
			}
		],
		maxValue: 100
	});
	
	
	// diagram 2
	var diagram_2 = new Diagram({
		canvasId: 'diagram-2',
		charts: [
			{
				value: 84,
				color: '#fd8d40',
				width: 30,
				numContId: 'diagram-2-num-1'
			},
			{
				value: 39,
				color: '#0000ff',
				width: 30,
				offset: 2,
				numContId: 'diagram-2-num-2'
			}
		],
		maxValue: 100,
		animate: true
	});
	
	diagram_2.animate(2700);
	
	// diagram 2
	var diagram_3 = new Diagram({
		canvasId: 'diagram-3',
		charts: [
			{
				value: 67,
				color: '#fd8d40',
				width: 15,
				numContId: 'diagram-3-num-1'
			},
			{
				value: 75,
				color: '#d0295e',
				width: 15,
				offset: 2,
				numContId: 'diagram-3-num-2'
			},
			{
				value: 83,
				color: 'green',
				width: 15,
				offset: 2,
				numContId: 'diagram-3-num-3'
			},
			{
				value: 91,
				color: '#0000ff',
				width: 15,
				offset: 2,
				numContId: 'diagram-3-num-4'
			}
		],
		maxValue: 100,
		animate: true
	});
	
	diagram_3.animate(4200);
	
	// numberspin
	var numberspin = new Numberspin('.numberspin');
	
	numberspin.animate(4200);
	
	// share
	Share.init('.js-share-btn');
	
	// timer
	var timer = new Timer({
		elemId: 'timer'
	});
	
	timer.onStop = function() {
		Popup.message('#message-popup', 'Timer Stopped');
	}
	
	timer.start(50);
	
	
	var timer2 = new Timer({
		elemId: 'timer-2',
		format: 'extended'
	});
	
	timer2.onStop = function() {
		Popup.message('#message-popup', 'Timer 2 Stopped');
	}
	
	timer2.start(130);
	
	
	var stopwatch = new Timer({
		elemId: 'stopwatch', 
		stopwatch: true
	});
	
	stopwatch.onStop = function() {
		Popup.message('#message-popup', 'Stopwatch Stopped');
	}
	
	stopwatch.start(0);
	
	
	var stopwatch2 = new Timer({
		elemId: 'stopwatch-1', 
		stopwatch: true,
		format: 'extended'
	});
	
	stopwatch2.onStop = function() {
		Popup.message('#message-popup', 'Stopwatch Stopped');
	}
	
	stopwatch2.start(0);
	
	// get content via Ajax
	var getCont = new GetContentAjax({
		eventBtn: '.js-get-content-ajax',
		event: 'click',
		outputDiv: '#output-ajax',
		sourceFile: '/get-content-ajax.php'
	});
	
	getCont.output = function(response) {
		var result = response.match(/\<div id\="source"\>([\s\S]*?)\<\/div\>/);
		
		return result[1];
	}
	
	// autocomplete data
	AutoComplete.setValuesData = function (val, fun) {
		fun([
			{val:"mc", value:"Mercury"},
			{val:"vn", value:"Venus"},
			{val:"eth", value:"Earth"},
			{val:"ms", value:"Mars"},
			{val:"mn", value:"Mandarin"},
			{val:"mk", value:"Marakuja"},
			{val:"mlk", value:"Milk"}
		]);
	}
	
	// submit form
	Form.init('.form');
	
	Form.onSubmit = function(form, callback) {
		switch (form.id) {
			case 'form-no-ajax':
			case 'search-form':
			return true;
			
			case 'custom-form-2':
			case 'custom-form-3':
			case 'custom-form-4':
			var files = CustomFile.files(form);
			
			console.log(files);
			return false;
			
			default:
			ajax({
				url: form.action,
				send: new FormData(form),
				success: function(response) {
					var response = JSON.parse(response);
					
					if (response.status == 'sent') {
						Popup.message('#message-popup', 'Форма отправлена');
						
						callback({clearForm: true, unlockSubmitButton: true});
					} else {
						console.log(response);
					}
				},
				error: function(response) {
					console.log(response);
				}
			});
			return false;
		}
	}
});

// GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function(c) {
		var contryObjArr = JSON.parse(c);
		
		Select.setOptions('.countries', contryObjArr, 'name', 'name', 'id');
	});
	
	Select.onSelect = function (inpElem, val, secVal) {
		if (inpElem.name == 'country') {
			dAirGet.region(secVal, function(c) {
				var regionObjArr = JSON.parse(c);
				
				Select.setOptions('.cities', regionObjArr, 'name', 'name');
			});
		}
	}
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


// jQuery plugins
$(document).ready(function(){
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
	$('input[data-type="tel"]').each(function() {
		new Maskinput(this, 'tel');
	});
	// $('input[data-type="date"]').mask('99.99.9999');
});