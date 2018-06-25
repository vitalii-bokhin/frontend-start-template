/*
* In common.js use only ECMAScript 5.1
*/

/*$(document).ready(function(){

	//fixed block
	$('.fix-block').each(function() {
		var _$ = $(this);
		_$.css({width: 'auto', top: 'auto', left: 'auto'}).removeClass('fix-block_fixed');
		var ofsT = _$.offset().top,
		ofsL = _$.offset().left,
		wd = _$.innerWidth();
		_$.css({width: wd, top: ofsT, left: ofsL}).addClass('fix-block_fixed');
	});

	$('#slider').on('init', function() {
		coverImg('#slider');
	});

	$('#slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.scroll-pane').jScrollPane();

	//headerFix
	$(window).scroll(function () {
		if (!$('body').hasClass('popup-is-opened')) {
			var winScrTop = $(window).scrollTop();
			if (winScrTop > 21) {
				$('.header').addClass('header_fixed');
			} else {
				$('.header').removeClass('header_fixed');
			}
		}
	});

	//masked inputs
	$('input[data-type="tel"]').mask('+7(999)999-99-99');
	$('input[data-type="date"]').mask('99.99.9999');

});*/


//document is ready
document.addEventListener('DOMContentLoaded', function() {

	(function initFun() {
		flexImg('.flex-img');

		CoverImg.reInit();

		window.addEventListener('winResized', initFun);
	}());

	//init cover images
	CoverImg.init();
     
	//init toggle button
	Toggle.init('.js-toggle');
 
	//popup init
	Popup.init('.js-open-popup');
	MediaPopup.init('.js-open-media-popup');
 
	//submit forms
	var form = new Form('#form');

	form.onSubmit = function(form) {
		callback({clearForm: true});
	}


	var ajaxForm = new Form('#form-ajax');

	ajaxForm.onSubmit = function(form, callback) {

		setTimeout(function() {
			callback({clearForm: true, unlockSubmitButton: true});
		}, 1000);

		
		/*
		var xhr = new XMLHttpRequest();
		xhr.open('POST', form.action);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {

				var response = JSON.parse(xhr.response);  //response json

				if (response.status == 'sent') {

					Popup.message('#message-popup', 'Форма отправлена');
					callback({clearForm: true, unlockSubmitButton: true});

				} else {
					console.log(response);
				}

			}
		}
		xhr.send(new FormData(form));
		*/

		
	}

	new Form('#form-no-ajax');

	new Form('#search-form');

});

//GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function(c) {
		var contryObj = JSON.parse(c);
		CustomSelect.setOptions('.countries', contryObj, 'name', 'name');
	});
}