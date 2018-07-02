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

	//accord
	Accord.init('.accord__button');

	//more
	More.init('.more__btn');

	//tab
	Tab.init({
		container: '.tab',
		button: '.tab__button',
		item: '.tab__item'
	});

	//video
	Video.init('.video__btn-play');

	//submit forms
	var form = new Form('#form');

	if (form.element) {
		NextFieldset.init(form.element, '.form__button');

		ValidateForm.init(form.element);

		form.onSubmit = function(form, callback) {
			callback({clearForm: true});
		}
	}


	var ajaxForm = new Form('#form-ajax');

	if (ajaxForm.element) {
		ValidateForm.init(ajaxForm.element);

		ajaxForm.onSubmit = function(form, callback) {
			if (ValidateForm.submit(form)) {
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
				return true;
			}
		}
	}


	var noAjaxForm = new Form('#form-no-ajax');

	if (noAjaxForm.element) {
		ValidateForm.init(noAjaxForm.element);
	}
	

	var searchForm = new Form('#search-form');

	if (searchForm.element) {
		ValidateForm.init(searchForm.element);
	}

});

//GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function(c) {
		var contryObj = JSON.parse(c);
		CustomSelect.setOptions('.countries', contryObj, 'name', 'name');
	});
}