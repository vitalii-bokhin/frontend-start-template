$(document).ready(function(){

	var winW = $(window).width(),
	winH = $(window).height();

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

});