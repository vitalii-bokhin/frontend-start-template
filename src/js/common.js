$(document).ready(function(){ 

	(function initFun() {
		//fixed block
		$('.fix-block').each(function() {
			var _$ = $(this);
			_$.css({width: 'auto', top: 'auto', left: 'auto'}).removeClass('fix-block_fixed');
			var ofsT = _$.offset().top,
			ofsL = _$.offset().left,
			wd = _$.innerWidth();
			_$.css({width: wd, top: ofsT, left: ofsL}).addClass('fix-block_fixed');
		});

		flexImg();
		coverImg();

		$(window).on('winResized', initFun);
	})();

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
		if (!$('body').hasClass('is-popup-opened')) {
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

	//submit forms
	ValidateForm.init('#form');

	ValidateForm.init('#form-ajax', function(form, callback) {
		var $form = $(form);

		Popup.message('#message-popup', 'Форма отправлена', function() {
			callback({unlockButton: true, clearForm: true});
		});

		/*$.ajax({
			url: $form.attr('action'),
			type:"POST",
			dataType:"json",
			data: $form.serialize(), //new FormData(form),
			success: function(response){
				if (response.status == 'sent') {
					Popup.message('#message-popup', 'Форма отправлена');
					callback({unlockButton: true, clearForm: true});
				}
			},
			error: function() {
				alert('Error');
			}
		});*/

	});

	ValidateForm.init('#form-no-ajax');

	ValidateForm.init('#search-form');

});


//GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function(c) {
		var contryObj = $.parseJSON(c);
		CustomSelect.setOptions('.countries', contryObj, 'name', 'name');
	});
}