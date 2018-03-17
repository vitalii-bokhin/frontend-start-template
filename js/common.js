$(document).ready(function(){

	$('.wrapper, .wrapper__full-height').css('padding-bottom', $('.footer').innerHeight());

	$('#slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.scroll-pane').jScrollPane();

	flexImage(winW);

	overfrowImg();

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

	//fixed block
	$('.fix-block').each(function() {
		var _$ = $(this),
		ofsT = _$.offset().top,
		ofsL = _$.offset().left,
		wd = _$.width();
		_$.css({width: wd, top: ofsT, left: ofsL}).addClass('fix-block_fixed');
	});

	//forms
	Form.submit('#form1', function(form, callback) {
		var $f = $(form);
		Popup.message('#message-popup', 'Форма отправлена', function() {
			callback(true, true);
		});
		/*$.ajax({
			url: $f.attr('action'),
			type:"POST",
			dataType:"json",
			data: $f.serialize(), //new FormData(form),
			success: function(response){
				if (response.status == 'sent') {
					Popup.message('#message-popup', 'Форма отправлена', function() {
						callback(true, true);
					});
				}
			},
			error: function() {
				alert('Error');
			}
		});*/
		
	});

	Form.submit('#form2', function(form, callback) {
		var $f = $(form);
		Popup.message('#message-popup', 'Форма отправлена', function() {
			callback(true, true);
		});
	});

	Form.submit('#form3');

	$(window).on('winResized', function() {
		console.log(winW, winH);
	});

});